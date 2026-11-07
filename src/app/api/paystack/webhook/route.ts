import { NextResponse } from "next/server";
import { fulfillPaystackReference, getReadyPaystack, paystackSignature, signaturesMatch } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { secret } = await getReadyPaystack();
  if (!secret) return NextResponse.json({ error: "Paystack is not configured" }, { status: 400 });

  const signature = request.headers.get("x-paystack-signature") || "";
  const body = await request.text();
  const expected = paystackSignature(secret, body);
  if (!signature || !signaturesMatch(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(body) as { event?: string; data?: { reference?: string } };
    if (event.event === "charge.success" && event.data?.reference) {
      await fulfillPaystackReference(event.data.reference, secret);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
