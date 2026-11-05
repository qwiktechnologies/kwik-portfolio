import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/desk-forms";
import { buttonClass, EmptyState } from "@/components/ui";
import { requireCustomer } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { formatDate, orderCode } from "@/lib/site";

export const metadata: Metadata = { title: "Your purchases", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await requireCustomer();
  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: { items: true, brief: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Account</p>
          <h1 className="mt-2 font-serif text-5xl">Your purchases</h1>
          <p className="mt-2 text-sm text-muted">{session.email}</p>
        </div>
        <LogoutButton />
      </div>
      {orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No purchases yet." body="When you pay for a format, the receipt and the brief live here." href="/work" action="Browse the catalog" />
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-3xl border border-line bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">{orderCode(order.id)} · {formatDate(order.createdAt)}</p>
                  <p className="mt-1 font-medium">{order.items.map((item) => item.title).join(", ")}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${order.status === "PAID" ? "bg-[#e8f5ee] text-pine" : "bg-paper text-muted"}`}>{order.status}</span>
              </div>
              <p className="mt-3 text-sm">{formatMoney(order.totalLocal, order.currency)} <span className="text-muted">· catalog {formatMoney(order.totalNgn, "NGN")}</span></p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/account/orders/${order.id}`} className={buttonClass.small}>View</Link>
                {order.status === "PAID" && !order.brief ? <Link href={`/payment/success?order=${order.id}`} className={buttonClass.small}>Send the brief</Link> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
