import Link from "next/link";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { formatDate, orderCode } from "@/lib/site";

export default async function PaymentsPage() {
  await requireStudio();
  const payments = await prisma.payment.findMany({
    include: { order: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="font-serif text-5xl">Payments</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">Card payments recorded after Stripe confirms them. Credentials are not on this page.</p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">When</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Stripe</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-line">
                <td className="py-3">{formatDate(payment.createdAt)}</td>
                <td><Link className="underline" href={`/admin/purchases/${payment.orderId}`}>{orderCode(payment.orderId)}</Link></td>
                <td>{payment.order.user.email}</td>
                <td>{formatMoney(payment.amountMinor / 100, payment.currency.toUpperCase())}</td>
                <td>{payment.status}</td>
                <td className="max-w-40 truncate text-xs text-muted">{payment.stripePaymentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 ? <p className="mt-6 text-sm text-muted">No card payments yet.</p> : null}
      </div>
    </div>
  );
}
