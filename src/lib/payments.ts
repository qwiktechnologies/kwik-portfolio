import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "./db";
import { decryptSecret } from "./crypto";
import { getStripeConfig } from "./profile";

const PAYSTACK = "https://api.paystack.co";

type PaystackInit = {
  status: boolean;
  message: string;
  data?: { authorization_url: string; reference: string };
};

type PaystackVerify = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    id: number;
    metadata?: { orderId?: string } | null;
  };
};

export async function getReadyPaystack() {
  const config = await getStripeConfig();
  if (!config.enabled || !config.secretKeyEnc) return { config, secret: "" };
  try {
    return { config, secret: decryptSecret(config.secretKeyEnc) };
  } catch {
    return { config, secret: "" };
  }
}

export async function initializePaystack(secret: string, body: { email: string; amount: number; reference: string; callback_url: string; metadata: { orderId: string } }) {
  const response = await fetch(`${PAYSTACK}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, currency: "NGN" }),
  });
  const payload = (await response.json()) as PaystackInit;
  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message || "Paystack did not start the payment.");
  }
  return payload.data;
}

export function paystackSignature(secret: string, rawBody: string) {
  return createHmac("sha512", secret).update(rawBody).digest("hex");
}

export function signaturesMatch(expected: string, received: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function fulfillPaystackReference(reference: string, secret: string) {
  const response = await fetch(`${PAYSTACK}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const payload = (await response.json()) as PaystackVerify;
  const data = payload.data;
  if (!response.ok || !payload.status || !data || data.status !== "success") return null;

  const order = await prisma.order.findFirst({ where: { stripeSessionId: data.reference } });
  if (!order) return null;
  const expected = order.totalNgn * 100;
  const currency = (data.currency || "").toUpperCase();
  const metadataOrder = data.metadata?.orderId;
  if (data.amount !== expected || currency !== "NGN" || (metadataOrder && metadataOrder !== order.id)) return null;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: order.paidAt ?? new Date(), chargeAmount: data.amount, chargeCurrency: "ngn" },
    }),
    prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amountMinor: data.amount,
        currency: "ngn",
        status: "PAID",
        stripePaymentId: String(data.id || data.reference),
      },
      update: {
        amountMinor: data.amount,
        currency: "ngn",
        status: "PAID",
        stripePaymentId: String(data.id || data.reference),
      },
    }),
  ]);

  return prisma.order.findUnique({
    where: { id: order.id },
    include: { items: true, brief: true, user: true, payment: true },
  });
}
