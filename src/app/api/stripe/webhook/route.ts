import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({ error: "Payments now use Paystack." }, { status: 410 });
}
