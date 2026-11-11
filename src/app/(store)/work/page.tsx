import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RateLine } from "@/components/money";
import { WorkCard } from "@/components/work-card";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Browse Qwik Technologies templates. Each country has its own price, and anywhere else sees US dollars.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;
  const active = category && CATEGORIES.includes(category as (typeof CATEGORIES)[number]) ? category : "";
  const query = (q || "").trim();
  const items = await prisma.portfolioItem.findMany({
    where: {
      published: true,
      ...(active ? { category: active } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { summary: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { priceNgn: "desc" }],
  });
  const covers = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    select: { category: true, coverImage: true },
  });
  const categories = new Map<string, string>();
  for (const piece of covers) {
    if (!categories.has(piece.category)) categories.set(piece.category, piece.coverImage);
  }

  const sellers = items.filter((item) => item.featured);

  return (
    <>
    <section className="relative min-h-[280px] overflow-hidden bg-[#10243a]">
      <Image src="/brand/catalog-banner.jpg" alt="" fill className="object-cover opacity-45" sizes="100vw" priority />
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-start px-4 py-16 text-white sm:px-6">
        <h1 className="max-w-xl font-serif text-3xl leading-tight sm:text-5xl">Have a Project in mind?</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">We can help you bring your ideas to life. Let&apos;s talk about what we can build and raise together.</p>
        <Link href="/contact" className="mt-6 inline-flex rounded-md bg-[#f15a22] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#d94e1c]">Get in touch</Link>
      </div>
    </section>
    <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl text-[#f15a22] sm:text-5xl">Our Work</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#f4f7fb]">The formats already on the shelf. You see the price set for your country.</p>
        </div>
        <RateLine className="text-sm text-[#9ec0ff]" />
      </div>
      <form action="/work" className="mt-6">
        <label className="sr-only" htmlFor="template-search">Search category</label>
        <input id="template-search" name="q" defaultValue={query} placeholder="Search category" className="h-11 w-full max-w-md rounded-md border border-[#1d4e9e] bg-[#122033] px-4 text-sm text-white outline-none placeholder:text-[#9aa8c0] focus:border-[#f15a22]" />
      </form>
      <div className="mt-6">
        <p className="text-sm font-medium">All Categories</p>
        <div className="chip-row mt-3">
          <Link href="/work" className={`shrink-0 rounded-md px-4 py-2 text-sm ${active === "" ? "bg-[#f15a22] text-[#0c1220]" : "border border-[#1d4e9e] bg-[#122033] text-white"}`}>
            All
          </Link>
          {CATEGORIES.map((item) => (
            <Link key={item} href={`/work?category=${encodeURIComponent(item)}`} className={`shrink-0 rounded-md px-4 py-2 text-sm ${active === item ? "bg-[#f15a22] text-[#0c1220]" : "border border-[#1d4e9e] bg-[#122033] text-white"}`}>
              {item}
            </Link>
          ))}
        </div>
      </div>
      {!query && !active && sellers.length ? (
        <section className="mt-10" aria-labelledby="best-sellers">
          <h2 id="best-sellers" className="font-serif text-3xl">Best Sellers</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sellers.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
      <h2 className="mt-12 font-serif text-3xl text-[#9ec0ff]">All work</h2>
      {items.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-[#d5deee]">Nothing in this category yet.</p>
      )}
      {!query && !active ? (
        <section className="mt-16" aria-labelledby="top-categories">
          <h2 id="top-categories" className="font-serif text-3xl">Top categories</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...categories.entries()].map(([name, cover]) => (
              <Link key={name} href={`/work?category=${encodeURIComponent(name)}`} className="group relative aspect-[16/9] overflow-hidden rounded-md bg-[#10243a]">
                <Image src={cover} alt="" fill className="object-cover opacity-80 transition duration-500 group-hover:scale-105" sizes="30vw" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c1220] to-transparent p-4 text-lg text-white">{name}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="mt-16 rounded-md bg-[#0c1220] px-6 py-10 text-white sm:px-10">
        <h2 className="font-serif text-3xl text-[#f15a22] sm:text-4xl">Explain to us what you want and we deliver</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">Tell us the business, the pages, and the result you need. We will build it.</p>
        <Link href="/contact" className="mt-6 inline-flex rounded-md bg-[#f15a22] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#d94e1c]">Contact us</Link>
      </section>
    </div>
    </>
  );
}
