import Link from "next/link";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { formatDate, orderCode } from "@/lib/site";

export default async function PurchasesPage() {
  await requireStudio();
  const orders = await prisma.order.findMany({
    include: { user: true, items: true, brief: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="font-serif text-5xl">Purchases</h1>
      <p className="mt-2 text-sm text-muted">Every cart that reached checkout, paid or not.</p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Formats</th>
              <th>Status</th>
              <th>Naira</th>
              <th>Brief</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-line">
                <td className="py-3"><Link className="underline" href={`/admin/purchases/${order.id}`}>{orderCode(order.id)}</Link></td>
                <td>{order.user.email}</td>
                <td>{order.items.map((item) => item.title).join(", ")}</td>
                <td>{order.status}</td>
                <td>{formatMoney(order.totalNgn, "NGN")}</td>
                <td>{order.brief ? "Sent" : "—"}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
