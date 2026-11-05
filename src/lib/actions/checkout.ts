"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getNgnRates } from "@/lib/currency";
import { getReadyStripe } from "@/lib/payments";
import { siteUrl } from "@/lib/site";

const lineSchema = z.object({
  id: z.string().min(4),
  quantity: z.number().int().min(1).max(5),
});

export async function getCartDetails(ids: string[]) {
  const unique = [...new Set(ids)].slice(0, 30);
  if (!unique.length) return [];
  const items = await prisma.portfolioItem.findMany({
    where: { id: { in: unique }, published: true },
    select: { id: true, title: true, slug: true, category: true, coverImage: true, priceNgn: true, timeline: true },
  });
  return items;
}

export async function startCheckout(lines: { id: string; quantity: number }[], displayCurrency: string) {
  const session = await getSession();
  if (!session) return { error: "Sign in before you pay." };

  const parsed = z.array(lineSchema).min(1).max(12).safeParse(lines);
  if (!parsed.success) return { error: "The cart is empty or invalid." };

  const ids = parsed.data.map((line) => line.id);
  const items = await prisma.portfolioItem.findMany({ where: { id: { in: ids }, published: true } });
  const byId = new Map(items.map((item) => [item.id, item]));
  const priced = parsed.data
    .map((line) => {
      const item = byId.get(line.id);
      if (!item) return null;
      return { item, quantity: line.quantity };
    })
    .filter((row): row is { item: (typeof items)[number]; quantity: number } => Boolean(row));

  if (!priced.length) return { error: "Those formats are no longer available." };

  const { rates } = await getNgnRates();
  const { config, stripe } = await getReadyStripe();
  if (!config.enabled || !stripe) {
    return { error: "Card payments are not open yet. The studio owner still needs to connect Stripe." };
  }

  const chargeCurrency = config.chargeCurrency.toUpperCase();
  const chargeRate = rates[chargeCurrency];
  if (!chargeRate) return { error: "We could not price the card currency. Try again in a moment." };

  const requested = (displayCurrency || "NGN").toUpperCase();
  const currency = requested !== "NGN" && rates[requested] ? requested : "NGN";
  const fxRate = currency === "NGN" ? 1 : rates[currency];
  const totalNgn = priced.reduce((sum, row) => sum + row.item.priceNgn * row.quantity, 0);
  const lineItems = priced.map((row) => ({
    quantity: row.quantity,
    price_data: {
      currency: chargeCurrency.toLowerCase(),
      unit_amount: Math.max(1, Math.round(row.item.priceNgn * chargeRate * 100)),
      product_data: {
        name: row.item.title,
        description: `${row.item.category} · catalog price ₦${row.item.priceNgn.toLocaleString("en-NG")}`,
      },
    },
  }));
  const chargeAmount = lineItems.reduce((sum, line) => sum + line.price_data.unit_amount * line.quantity, 0);
  if (chargeAmount < 50) return { error: "This total is below the card minimum." };

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      status: "PENDING",
      currency,
      fxRate,
      chargeCurrency: chargeCurrency.toLowerCase(),
      chargeAmount,
      totalNgn,
      totalLocal: totalNgn * fxRate,
      items: {
        create: priced.map((row) => ({
          portfolioItemId: row.item.id,
          title: row.item.title,
          coverImage: row.item.coverImage,
          priceNgn: row.item.priceNgn,
          quantity: row.quantity,
        })),
      },
    },
  });

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.email,
      success_url: `${siteUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/payment/cancel?order=${order.id}`,
      metadata: { orderId: order.id },
      line_items: lineItems,
    });

    if (!checkout.url) throw new Error("Stripe did not return a checkout URL.");

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.id, chargeAmount: checkout.amount_total ?? chargeAmount },
    });

    return { url: checkout.url };
  } catch (error) {
    console.error(error);
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return { error: "Stripe did not start the payment. The studio owner should check the keys." };
  }
}
