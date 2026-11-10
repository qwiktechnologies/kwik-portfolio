import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isMarketCurrency } from "@/lib/markets";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { currency?: string };
  const currency = String(body.currency || "").toUpperCase();
  if (!isMarketCurrency(currency)) {
    return NextResponse.json({ error: "Unknown country" }, { status: 400 });
  }
  const jar = await cookies();
  jar.set("qt_currency", currency, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  return NextResponse.json({ currency });
}
