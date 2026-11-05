"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { fileToDataUrl } from "@/lib/uploads";

export async function submitBrief(_prev: { error: string; ok: boolean }, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Sign in again to send the brief.", ok: false };

  const parsed = z
    .object({
      orderId: z.string().min(4),
      businessName: z.string().min(2, "Enter the business name.").max(120),
      businessDetails: z.string().min(20, "Tell us what the business does, in a few sentences.").max(5000),
      email: z.string().email("Enter the public email for the site."),
      phone: z.string().min(6, "Enter the phone number that should appear.").max(40),
      socials: z.string().max(500).optional(),
      notes: z.string().max(2000).optional(),
    })
    .safeParse({
      orderId: String(formData.get("orderId") || ""),
      businessName: String(formData.get("businessName") || "").trim(),
      businessDetails: String(formData.get("businessDetails") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      socials: String(formData.get("socials") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
    });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the brief.", ok: false };

  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, userId: session.id, status: "PAID" },
    include: { brief: true },
  });
  if (!order) return { error: "We could not find a paid purchase for this brief.", ok: false };
  if (order.brief) return { error: "", ok: true };

  let logoData = "";
  const file = formData.get("logo");
  if (file instanceof File && file.size > 0) {
    try {
      logoData = await fileToDataUrl(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The logo could not be read.", ok: false };
    }
  }

  await prisma.projectBrief.create({
    data: {
      orderId: order.id,
      businessName: parsed.data.businessName,
      businessDetails: parsed.data.businessDetails,
      logoData,
      email: parsed.data.email,
      phone: parsed.data.phone,
      socials: parsed.data.socials || "",
      notes: parsed.data.notes || "",
    },
  });

  revalidatePath("/account");
  revalidatePath(`/account/orders/${order.id}`);
  revalidatePath("/admin/purchases");
  return { error: "", ok: true };
}

export async function sendMessage(_prev: { error: string; ok: boolean }, formData: FormData) {
  const parsed = z
    .object({
      name: z.string().min(2, "Enter your name.").max(80),
      email: z.string().email("Enter a valid email."),
      phone: z.string().max(40).optional(),
      subject: z.string().min(3, "Add a subject.").max(140),
      message: z.string().min(10, "Write a short message.").max(5000),
    })
    .safeParse({
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the form.", ok: false };

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || "",
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  return { error: "", ok: true };
}
