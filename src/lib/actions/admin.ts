"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";
import { encryptSecret } from "@/lib/crypto";
import { getStripeConfig } from "@/lib/profile";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/site";
import { canEditContact, canManagePeople, canManageStripe, canManageStudio, CHARGE_CURRENCIES, isBlogCategory } from "@/lib/constants";
import { plainText, sanitizeRichHtml } from "@/lib/rich-html";

async function allowStudio() {
  const session = await getSession();
  if (!session || !canManageStudio(session.role)) return null;
  return session;
}

function galleryValue(raw: string) {
  const urls = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^https?:\/\//.test(line) || line.startsWith("/"));
  return JSON.stringify(urls.slice(0, 8));
}

const portfolioSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug with hyphens."),
  category: z.string().min(2).max(60),
  summary: z.string().min(20).max(320),
  description: z.string().min(40).max(8000),
  includes: z.string().min(4).max(4000),
  timeline: z.string().min(2).max(120),
  priceNgn: z.coerce.number().int().positive().max(100_000_000),
  coverImage: z.string().max(2000),
  gallery: z.string().max(8000),
});

export async function savePortfolio(_prev: { error: string }, formData: FormData) {
  const session = await allowStudio();
  if (!session) return { error: "You cannot edit the catalog." };

  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const parsed = portfolioSchema.safeParse({
    title,
    slug: slugify(slugInput || title),
    category: String(formData.get("category") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    includes: String(formData.get("includes") || "").trim(),
    timeline: String(formData.get("timeline") || "").trim(),
    priceNgn: formData.get("priceNgn"),
    coverImage: String(formData.get("coverImage") || "").trim(),
    gallery: String(formData.get("gallery") || ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the catalog form." };

  let cover = parsed.data.coverImage;
  const file = formData.get("coverFile");
  if (file instanceof File && file.size > 0) {
    try {
      cover = await saveUpload(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The cover image failed." };
    }
  }
  if (!cover) return { error: "Add a cover image URL or upload a file." };

  const data = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    category: parsed.data.category,
    summary: parsed.data.summary,
    description: parsed.data.description,
    includes: parsed.data.includes,
    timeline: parsed.data.timeline,
    priceNgn: parsed.data.priceNgn,
    coverImage: cover,
    gallery: galleryValue(parsed.data.gallery),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };

  const id = String(formData.get("id") || "");
  try {
    if (id) {
      await prisma.portfolioItem.update({ where: { id }, data });
    } else {
      await prisma.portfolioItem.create({ data });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "That slug is already used. Choose another." };
    }
    throw error;
  }

  revalidatePath("/work");
  revalidatePath("/");
  redirect("/admin/portfolio");
}

export async function deletePortfolio(formData: FormData) {
  const session = await allowStudio();
  if (!session) redirect("/login?next=/admin");
  const id = String(formData.get("id") || "");
  const used = await prisma.orderItem.count({ where: { portfolioItemId: id } });
  if (used) {
    await prisma.portfolioItem.update({ where: { id }, data: { published: false } });
  } else {
    await prisma.portfolioItem.delete({ where: { id } });
  }
  revalidatePath("/work");
  redirect("/admin/portfolio");
}

const postSchema = z.object({
  title: z.string().min(4).max(160),
  slug: z.string().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().refine(isBlogCategory, "Choose one of the blog categories."),
  excerpt: z.string().min(20).max(320),
  content: z.string().min(1).max(20000),
  coverImage: z.string().max(2000),
});

export async function savePost(_prev: { error: string }, formData: FormData) {
  const session = await allowStudio();
  if (!session) return { error: "You cannot edit the journal." };
  const title = String(formData.get("title") || "").trim();
  const content = sanitizeRichHtml(String(formData.get("content") || ""));
  if (plainText(content).length < 80) return { error: "Write a longer article. The body needs at least a short paragraph." };
  const parsed = postSchema.safeParse({
    title,
    slug: slugify(String(formData.get("slug") || title)),
    category: String(formData.get("category") || ""),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content,
    coverImage: String(formData.get("coverImage") || "").trim(),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the blog form." };

  let cover = parsed.data.coverImage;
  const file = formData.get("coverFile");
  if (file instanceof File && file.size > 0) {
    try {
      cover = await saveUpload(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The cover image failed." };
    }
  }
  if (!cover) return { error: "Add a cover image." };

  const data = {
    ...parsed.data,
    coverImage: cover,
    published: formData.get("published") === "on",
    authorId: session.id,
  };
  const id = String(formData.get("id") || "");
  try {
    if (id) await prisma.blogPost.update({ where: { id }, data });
    else await prisma.blogPost.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "That slug is already used." };
    }
    throw error;
  }
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const session = await allowStudio();
  if (!session) redirect("/login?next=/admin");
  const id = String(formData.get("id") || "");
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function saveContact(_prev: { error: string; ok: boolean }, formData: FormData) {
  const session = await getSession();
  if (!session || !canEditContact(session.role)) return { error: "Only an admin can update contact details.", ok: false };

  const parsed = z
    .object({
      companyName: z.string().min(2).max(80),
      tagline: z.string().min(10).max(240),
      heroLead: z.string().min(20).max(500),
      email: z.string().email(),
      phone: z.string().min(6).max(40),
      address: z.string().min(6).max(240),
      whatsapp: z.string().max(40),
      hours: z.string().max(120),
      instagram: z.string().max(200),
      aboutHeadline: z.string().min(8).max(180),
      aboutBody: z.string().min(40).max(8000),
      extraJson: z.string().max(8000),
    })
    .safeParse({
      companyName: String(formData.get("companyName") || "").trim(),
      tagline: String(formData.get("tagline") || "").trim(),
      heroLead: String(formData.get("heroLead") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      whatsapp: String(formData.get("whatsapp") || "").trim(),
      hours: String(formData.get("hours") || "").trim(),
      instagram: String(formData.get("instagram") || "").trim(),
      aboutHeadline: String(formData.get("aboutHeadline") || "").trim(),
      aboutBody: String(formData.get("aboutBody") || "").trim(),
      extraJson: String(formData.get("extraJson") || "[]"),
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the contact form.", ok: false };

  let extra = "[]";
  try {
    const rows = JSON.parse(parsed.data.extraJson) as { label?: string; value?: string }[];
    extra = JSON.stringify(
      (Array.isArray(rows) ? rows : [])
        .map((row) => ({ label: String(row.label || "").trim(), value: String(row.value || "").trim() }))
        .filter((row) => row.label && row.value)
        .slice(0, 12),
    );
  } catch {
    return { error: "The extra contact rows could not be read.", ok: false };
  }

  await prisma.siteProfile.upsert({
    where: { id: "main" },
    update: { ...parsed.data, extraJson: extra },
    create: { id: "main", ...parsed.data, extraJson: extra },
  });
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
  return { error: "", ok: true };
}

export async function createPerson(_prev: { error: string; ok: boolean }, formData: FormData) {
  const session = await getSession();
  if (!session || !canManagePeople(session.role)) return { error: "You cannot create accounts.", ok: false };

  const requested = String(formData.get("role") || "CUSTOMER");
  const allowed = session.role === "SUPER_ADMIN" ? ["CUSTOMER", "STAFF", "ADMIN"] : ["CUSTOMER", "STAFF"];
  if (!allowed.includes(requested)) return { error: "You cannot assign that role.", ok: false };

  const parsed = z
    .object({
      name: z.string().min(2).max(80),
      email: z.string().email(),
      password: z.string().min(8, "Temporary password must be at least 8 characters."),
      phone: z.string().max(40).optional(),
    })
    .safeParse({
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").toLowerCase().trim(),
      password: String(formData.get("password") || ""),
      phone: String(formData.get("phone") || "").trim(),
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the person form.", ok: false };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "That email already has an account.", ok: false };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || "",
      passwordHash: await hashPassword(parsed.data.password),
      role: requested,
    },
  });
  revalidatePath("/admin/people");
  return { error: "", ok: true };
}

export async function saveStripe(_prev: { error: string; ok: boolean }, formData: FormData) {
  const session = await getSession();
  if (!session || !canManageStripe(session.role)) return { error: "Only the owner can change Stripe.", ok: false };

  const publishable = String(formData.get("publishableKey") || "").trim();
  const secret = String(formData.get("secretKey") || "").trim();
  const webhook = String(formData.get("webhookSecret") || "").trim();
  const chargeCurrency = String(formData.get("chargeCurrency") || "usd").toLowerCase();
  const enabled = formData.get("enabled") === "on";

  if (publishable && !publishable.startsWith("pk_")) return { error: "The publishable key should start with pk_.", ok: false };
  if (secret && !secret.startsWith("sk_")) return { error: "The secret key should start with sk_.", ok: false };
  if (webhook && !webhook.startsWith("whsec_")) return { error: "The webhook secret should start with whsec_.", ok: false };
  if (!CHARGE_CURRENCIES.includes(chargeCurrency as (typeof CHARGE_CURRENCIES)[number])) {
    return { error: "Choose a supported card currency.", ok: false };
  }

  const current = await getStripeConfig();
  const secretKeyEnc = secret ? encryptSecret(secret) : current.secretKeyEnc;
  const webhookSecretEnc = webhook ? encryptSecret(webhook) : current.webhookSecretEnc;
  if (enabled && (!publishable || !secretKeyEnc)) {
    return { error: "Add a publishable key and a secret key before turning payments on.", ok: false };
  }

  await prisma.stripeConfig.update({
    where: { id: "default" },
    data: {
      publishableKey: publishable,
      secretKeyEnc,
      webhookSecretEnc,
      chargeCurrency,
      enabled,
    },
  });
  revalidatePath("/admin/stripe");
  return { error: "", ok: true };
}

export async function markMessage(formData: FormData) {
  const session = await allowStudio();
  if (!session) redirect("/login?next=/admin");
  const id = String(formData.get("id") || "");
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
}
