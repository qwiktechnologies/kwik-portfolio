import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { EmptyState } from "@/components/ui";
import { BLOG_CATEGORIES, isBlogCategory } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on landing pages, ecommerce, service websites, logos, and what to send after you pay for a Qwik Technologies format.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: requested } = await searchParams;
  const category = requested && isBlogCategory(requested) ? requested : undefined;
  const [posts, grouped] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogPost.groupBy({ by: ["category"], where: { published: true }, _count: { _all: true } }),
  ]);
  const counts = new Map(grouped.map((row) => [row.category, row._count._all]));

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Blog</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Notes from the studio</h1>
      <p className="mt-4 max-w-2xl text-muted">Every category the studio writes in. Pick one, or read them all.</p>
      <div className="chip-row mt-8" aria-label="Blog categories">
        <Link href="/blog" className={`${chip(!category)} shrink-0`}>All</Link>
        {BLOG_CATEGORIES.map((item) => (
          <Link key={item} href={`/blog?category=${encodeURIComponent(item)}`} className={`${chip(category === item)} shrink-0`}>
            {item}
            <span className={category === item ? "text-paper/70" : "text-muted"}>{counts.get(item) || 0}</span>
          </Link>
        ))}
      </div>
      {posts.length ? (
        <div className="mt-10 grid gap-10">
          {posts.map((post) => (
            <BlogCard key={post.id} layout="row" post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState title="Nothing in this category yet" body="The studio has not published an article here. The other categories are still open." href="/blog" action="See every article" />
        </div>
      )}
    </div>
  );
}

function chip(active: boolean) {
  return `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${active ? "border-night bg-night text-paper" : "border-line bg-card"}`;
}
