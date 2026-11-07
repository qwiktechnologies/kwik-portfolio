import type { Metadata } from "next";
import Link from "next/link";
import { BriefForm } from "@/components/brief-form";
import { ClearCart } from "@/components/clear-cart";
import { buttonClass } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { fulfillPaystackReference, getReadyPaystack } from "@/lib/payments";
import { orderCode } from "@/lib/site";

export const metadata: Metadata = { title: "Payment received", robots: { index: false, follow: false } };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string; order?: string }>;
}) {
  const { reference, trxref, order: orderId } = await searchParams;
  const paidReference = reference || trxref || "";
  const session = await getSession();
  if (!session) {
    const next = paidReference ? `/payment/success?reference=${encodeURIComponent(paidReference)}` : "/account";
    return (
      <div className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-serif text-4xl">Sign in to see this payment.</h1>
        <Link href={`/login?next=${encodeURIComponent(next)}`} className={`${buttonClass.solid} mt-6`}>Sign in</Link>
      </div>
    );
  }

  let order = null;
  if (paidReference) {
    const { secret } = await getReadyPaystack();
    if (!secret) {
      return <div className="mx-auto max-w-xl px-5 py-20"><h1 className="font-serif text-4xl">Paystack is not connected.</h1></div>;
    }
    const owned = await prisma.order.findFirst({ where: { stripeSessionId: paidReference, userId: session.id } });
    if (!owned) {
      return <div className="mx-auto max-w-xl px-5 py-20"><h1 className="font-serif text-4xl">This payment is not on your account.</h1></div>;
    }
    try {
      order = await fulfillPaystackReference(paidReference, secret);
    } catch {
      order = null;
    }
    if (!order) {
      order = await prisma.order.findFirst({
        where: { id: owned.id },
        include: { items: true, brief: true, user: true, payment: true },
      });
    }
  } else if (orderId) {
    order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.id, status: "PAID" },
      include: { items: true, brief: true, user: true, payment: true },
    });
  }

  if (!order || order.userId !== session.id) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-serif text-4xl">No paid order on this page.</h1>
        <Link href="/account" className={`${buttonClass.line} mt-6`}>Your purchases</Link>
      </div>
    );
  }

  if (order.status !== "PAID") {
    return (
      <div className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-serif text-4xl">We are still confirming the payment.</h1>
        <p className="mt-3 text-muted">If you just paid, refresh in a moment. The order is {orderCode(order.id)}.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
      {paidReference ? <ClearCart /> : null}
      <p className="text-[11px] uppercase tracking-[0.18em] text-pine">Payment received</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight">You are paid. {orderCode(order.id)} is yours.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Paid {formatMoney(order.totalNgn, "NGN")}. The formats: {order.items.map((item) => item.title).join(", ")}.
      </p>
      <div className="mt-10">
        {order.brief ? (
          <div className="rounded-3xl bg-[#e8f5ee] p-6">
            <p className="font-serif text-3xl">Brief already sent for {order.brief.businessName}.</p>
            <Link href={`/account/orders/${order.id}`} className={`${buttonClass.solid} mt-5`}>Open the purchase</Link>
          </div>
        ) : (
          <BriefForm orderId={order.id} email={session.email} />
        )}
      </div>
    </div>
  );
}
