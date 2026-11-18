import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCustomer } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { formatDate, orderCode } from "@/lib/site";

export const metadata: Metadata = { title: "Purchase", robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireCustomer();
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.id },
    include: { items: true, brief: true, payment: true },
  });
  if (!order) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link href="/account" className="text-sm text-muted">All purchases</Link>
      <h1 className="mt-3 font-serif text-5xl">{orderCode(order.id)}</h1>
      <p className="mt-2 text-sm text-muted">{formatDate(order.createdAt)} · {order.status}</p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-4 text-sm">
            <span>{item.title} × {item.quantity}</span>
            <span>{formatMoney(item.priceNgn * item.quantity, "NGN")}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">Paid {formatMoney(order.totalNgn, "NGN")}</p>
      {order.brief ? (
        <section className="mt-8 rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-3xl">Brief</h2>
          <p className="mt-3 font-medium">{order.brief.businessName}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{order.brief.businessDetails}</p>
          <p className="mt-3 text-sm">{order.brief.email} · {order.brief.phone}</p>
          {order.brief.socials ? <p className="text-sm">{order.brief.socials}</p> : null}
          {order.brief.notes ? <p className="mt-2 whitespace-pre-wrap text-sm">{order.brief.notes}</p> : null}
          {order.brief.logoData ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={order.brief.logoData} alt={`Logo for ${order.brief.businessName}`} className="mt-4 h-24 w-auto rounded-xl border border-line bg-white p-2" />
          ) : null}
        </section>
      ) : order.status === "PAID" ? (
        <p className="mt-8 text-sm">The brief has not been sent. <Link className="underline" href={`/payment/success?order=${order.id}`}>Send it now</Link>.</p>
      ) : null}
    </article>
  );
}
