import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getNgnRates } from "@/lib/currency";
import { isRealCurrency } from "@/lib/money";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { currency?: string };
  const currency = String(body.currency || "").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency) || !isRealCurrency(currency)) {
    return NextResponse.json({ error: "Unknown currency" }, { status: 400 });
  }
  const { rates } = await getNgnRates();
  if (currency !== "NGN" && !rates[currency]) {
    return NextResponse.json({ error: "No rate for that currency" }, { status: 400 });
  }
  const jar = await cookies();
  jar.set("qt_currency", currency, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  return NextResponse.json({ currency });
}
