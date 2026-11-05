import type { Metadata } from "next";
import Link from "next/link";
import { RateLine } from "@/components/money";
import { WorkCard } from "@/components/work-card";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Catalog of websites, stores, and brands",
  description: "Buy a fixed-price ecommerce site, service website, landing page, company portfolio, logo, or flyer. Prices set in naira and shown in your currency.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const active = category && CATEGORIES.includes(category as (typeof CATEGORIES)[number]) ? category : "";
  const items = await prisma.portfolioItem.findMany({
    where: { published: true, ...(active ? { category: active } : {}) },
    orderBy: [{ featured: "desc" }, { priceNgn: "desc" }],
  });

  return (
    <div className="mx-auto w-full px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Catalog</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">Formats you can buy.</h1>
      <p className="mt-4 max-w-2xl text-muted">Each card is a past kind of work, shaped into a scope with a naira price. The photograph is the trade. The list on the next page is what you actually buy.</p>
      <RateLine className="mt-3 text-sm text-muted" />
      <div className="chip-row mt-8">
        <Link href="/work" className={`shrink-0 rounded-full px-4 py-2 text-sm ${active === "" ? "bg-night text-paper" : "border border-line bg-card"}`}>
          All
        </Link>
        {CATEGORIES.map((item) => (
          <Link key={item} href={`/work?category=${encodeURIComponent(item)}`} className={`shrink-0 rounded-full px-4 py-2 text-sm ${active === item ? "bg-night text-paper" : "border border-line bg-card"}`}>
            {item}
          </Link>
        ))}
      </div>
      {items.length ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted">Nothing in this category yet.</p>
      )}
    </div>
  );
}
