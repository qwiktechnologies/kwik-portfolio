"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getNgnRates } from "@/lib/currency";
import { getReadyPaystack, initializePaystack } from "@/lib/payments";
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
  const { config, secret } = await getReadyPaystack();
  if (!config.enabled || !secret) {
    return { error: "Payments are not open yet. The studio owner still needs to connect Paystack." };
  }

  const requested = (displayCurrency || "NGN").toUpperCase();
  const currency = requested !== "NGN" && rates[requested] ? requested : "NGN";
  const fxRate = currency === "NGN" ? 1 : rates[currency];
  const totalNgn = priced.reduce((sum, row) => sum + row.item.priceNgn * row.quantity, 0);
  const chargeAmount = totalNgn * 100;
  if (chargeAmount < 10000) return { error: "This total is below Paystack's minimum." };

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      status: "PENDING",
      currency,
      fxRate,
      chargeCurrency: "ngn",
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
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: order.id } });
    const checkout = await initializePaystack(secret, {
      email: session.email,
      amount: chargeAmount,
      reference: order.id,
      callback_url: `${siteUrl()}/payment/success`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.reference, chargeAmount },
    });

    return { url: checkout.authorization_url };
  } catch (error) {
    console.error(error);
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return { error: "Paystack did not start the payment. The studio owner should check the keys." };
  }
}
