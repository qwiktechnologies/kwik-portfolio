import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false, follow: false } };

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  const session = await getSession();
  if (session && order) {
    await prisma.order.updateMany({
      where: { id: order, userId: session.id, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
  }
  return (
    <div className="mx-auto max-w-xl px-5 py-20">
      <h1 className="font-serif text-5xl">The payment was not completed.</h1>
      <p className="mt-4 text-muted">Nothing was charged. The formats are still in the cart if you did not clear it. You can return to checkout when you are ready.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/checkout" className={buttonClass.solid}>Back to checkout</Link>
        <Link href="/cart" className={buttonClass.line}>Cart</Link>
      </div>
    </div>
  );
}
