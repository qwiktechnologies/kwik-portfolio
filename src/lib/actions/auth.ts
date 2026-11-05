"use server";

import { redirect } from "next/navigation";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { canManageStudio } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

const credentials = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value || "");
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/account";
}

export async function loginAction(_prev: { error: string }, formData: FormData) {
  const parsed = credentials.safeParse({
    email: String(formData.get("email") || "").toLowerCase().trim(),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the form." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Email or password is wrong." };
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role as "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER" });
  const next = safeNext(formData.get("next"));
  if (canManageStudio(user.role)) redirect(next.startsWith("/admin") ? next : "/admin");
  redirect(next);
}

export async function registerAction(_prev: { error: string }, formData: FormData) {
  const parsed = z
    .object({
      name: z.string().min(2, "Enter your name.").max(80),
      email: z.string().email("Enter a valid email."),
      password: z.string().min(8, "Use at least 8 characters."),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, { message: "Passwords do not match.", path: ["confirm"] })
    .safeParse({
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").toLowerCase().trim(),
      password: String(formData.get("password") || ""),
      confirm: String(formData.get("confirm") || ""),
    });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the form." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account with that email already exists." };

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER",
    },
  });

  await createSession({ id: user.id, name: user.name, email: user.email, role: "CUSTOMER" });
  redirect("/account");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function forgotAction(_prev: { error: string; devLink: string; ok: boolean }, formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  if (!z.string().email().safeParse(email).success) return { error: "Enter a valid email.", devLink: "", ok: false };

  const user = await prisma.user.findUnique({ where: { email } });
  let devLink = "";
  if (user) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await prisma.passwordReset.deleteMany({ where: { userId: user.id } });
    await prisma.passwordReset.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
    });
    const link = `${siteUrl()}/reset-password?token=${token}`;
    if (process.env.NODE_ENV !== "production") devLink = link;
    console.info(`Password reset link for ${email}: ${link}`);
  }

  return {
    error: "",
    ok: true,
    devLink,
  };
}

export async function resetAction(_prev: { error: string; ok: boolean }, formData: FormData) {
  const parsed = z
    .object({
      token: z.string().min(20),
      password: z.string().min(8, "Use at least 8 characters."),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, { message: "Passwords do not match." })
    .safeParse({
      token: String(formData.get("token") || ""),
      password: String(formData.get("password") || ""),
      confirm: String(formData.get("confirm") || ""),
    });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the form.", ok: false };

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const row = await prisma.passwordReset.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!row || row.expiresAt.getTime() < Date.now()) {
    return { error: "This reset link is invalid or has expired.", ok: false };
  }

  await prisma.user.update({
    where: { id: row.userId },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });
  await prisma.passwordReset.delete({ where: { id: row.id } });
  await createSession({
    id: row.user.id,
    name: row.user.name,
    email: row.user.email,
    role: row.user.role as "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER",
  });
  redirect("/account");
}
