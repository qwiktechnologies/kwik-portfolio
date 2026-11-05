import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { decryptSecret } from "@/lib/crypto";
import { fulfillCheckoutSession, stripeClient } from "@/lib/payments";
import { getStripeConfig } from "@/lib/profile";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = await getStripeConfig();
  if (!config.secretKeyEnc || !config.webhookSecretEnc) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await request.text();
  try {
    const stripe = stripeClient(decryptSecret(config.secretKeyEnc));
    const event = stripe.webhooks.constructEvent(body, signature, decryptSecret(config.webhookSecretEnc));
    if (event.type === "checkout.session.completed") {
      await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
