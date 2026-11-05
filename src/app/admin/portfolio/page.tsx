import Link from "next/link";
import { DeleteFormat } from "@/components/portfolio-form";
import { buttonClass } from "@/components/ui";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export default async function AdminPortfolioPage() {
  await requireStudio();
  const items = await prisma.portfolioItem.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">Portfolio</h1>
          <p className="mt-2 text-sm text-muted">These are the formats customers buy. Prices are stored in naira.</p>
        </div>
        <Link href="/admin/portfolio/new" className={buttonClass.solid}>New format</Link>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="py-2">Format</th>
              <th>Category</th>
              <th>Price</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="py-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted">{item.slug}</p>
                </td>
                <td>{item.category}</td>
                <td>{formatMoney(item.priceNgn, "NGN")}</td>
                <td>{item.published ? "Published" : "Hidden"}{item.featured ? " · Featured" : ""}</td>
                <td className="space-x-3 text-right">
                  <Link className="underline" href={`/admin/portfolio/${item.id}`}>Edit</Link>
                  <span className="inline-block"><DeleteFormat id={item.id} /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
