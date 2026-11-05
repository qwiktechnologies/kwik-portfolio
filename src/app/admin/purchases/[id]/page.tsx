import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { formatDate, orderCode } from "@/lib/site";

export default async function PurchaseDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireStudio();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true, brief: true, payment: true },
  });
  if (!order) notFound();
  return (
    <article className="max-w-3xl">
      <Link href="/admin/purchases" className="text-sm text-muted">All purchases</Link>
      <h1 className="mt-3 font-serif text-5xl">{orderCode(order.id)}</h1>
      <p className="mt-2 text-sm text-muted">{order.status} · {formatDate(order.createdAt)} · {order.user.name} · {order.user.email}</p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between py-3 text-sm">
            <span>{item.title} × {item.quantity}</span>
            <span>{formatMoney(item.priceNgn * item.quantity, "NGN")}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">Customer saw {formatMoney(order.totalLocal, order.currency)} at rate {order.fxRate.toFixed(6)}.</p>
      <p className="text-sm">Card {formatMoney(order.chargeAmount / 100, order.chargeCurrency.toUpperCase())} · {order.payment?.status || "no payment record"} {order.payment?.stripePaymentId}</p>
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
            <img src={order.brief.logoData} alt={`Logo sent for ${order.brief.businessName}`} className="mt-4 max-h-40 rounded-xl border border-line bg-white p-2" />
          ) : (
            <p className="mt-3 text-sm text-muted">No logo image was sent.</p>
          )}
        </section>
      ) : (
        <p className="mt-6 text-sm text-muted">No brief yet.</p>
      )}
    </article>
  );
}
