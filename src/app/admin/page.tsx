import Link from "next/link";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { formatDate, orderCode } from "@/lib/site";

export default async function AdminHome() {
  await requireStudio();
  const [formats, paid, pending, users, unread, recent] = await Promise.all([
    prisma.portfolioItem.count(),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalNgn: true }, _count: true }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "Paid catalog value", value: formatMoney(paid._sum.totalNgn || 0, "NGN") },
    { label: "Paid orders", value: String(paid._count) },
    { label: "Waiting on payment", value: String(pending) },
    { label: "People", value: String(users) },
    { label: "Formats", value: String(formats) },
    { label: "Unread messages", value: String(unread) },
  ];

  return (
    <div>
      <h1 className="font-serif text-5xl">Overview</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">Catalog, people, and money. Stripe keys stay on the owner’s page.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-line bg-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{stat.label}</p>
            <p className="mt-2 font-serif text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-serif text-3xl">Recent purchases</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => (
              <tr key={order.id} className="border-t border-line">
                <td className="py-3"><Link className="underline" href={`/admin/purchases/${order.id}`}>{orderCode(order.id)}</Link></td>
                <td>{order.user.email}</td>
                <td>{order.status}</td>
                <td>{formatMoney(order.totalNgn, "NGN")}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
