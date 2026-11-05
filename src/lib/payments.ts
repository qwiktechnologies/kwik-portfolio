import Stripe from "stripe";
import { prisma } from "./db";
import { decryptSecret } from "./crypto";
import { getStripeConfig } from "./profile";

export function stripeClient(secret: string) {
  return new Stripe(secret);
}

export async function getReadyStripe() {
  const config = await getStripeConfig();
  if (!config.enabled || !config.secretKeyEnc) return { config, stripe: null as Stripe | null, secret: "" };
  try {
    const secret = decryptSecret(config.secretKeyEnc);
    return { config, stripe: stripeClient(secret), secret };
  } catch {
    return { config, stripe: null as Stripe | null, secret: "" };
  }
}

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId || session.payment_status !== "paid") return null;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return null;

  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || "";

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: order.paidAt ?? new Date(),
        stripeSessionId: session.id,
        chargeAmount: session.amount_total ?? order.chargeAmount,
        chargeCurrency: session.currency ?? order.chargeCurrency,
      },
    }),
    prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        amountMinor: session.amount_total ?? order.chargeAmount,
        currency: (session.currency ?? order.chargeCurrency).toLowerCase(),
        status: "PAID",
        stripePaymentId: paymentIntent,
      },
      update: {
        amountMinor: session.amount_total ?? order.chargeAmount,
        currency: (session.currency ?? order.chargeCurrency).toLowerCase(),
        status: "PAID",
        stripePaymentId: paymentIntent,
      },
    }),
  ]);

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, brief: true, user: true, payment: true },
  });
}
