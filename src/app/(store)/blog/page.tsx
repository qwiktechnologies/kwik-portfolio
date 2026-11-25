import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { BlogCategoryFilters } from "@/components/blog-category-filters";
import { BlogFeatured } from "@/components/blog-featured";
import { EmptyState } from "@/components/ui";
import { isBlogCategory, type BlogCategory } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Latest notes from Qwik Technologies on websites, ecommerce, branding, and how to buy from the catalog.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: requested } = await searchParams;
  const category = requested && isBlogCategory(requested) ? requested : undefined;
  const categoryFilter = category ? { category } : {};

  const featured = await prisma.blogPost.findFirst({
    where: { published: true, ...categoryFilter },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  const [rest, grouped] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        ...categoryFilter,
        ...(featured ? { id: { not: featured.id } } : {}),
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.blogPost.groupBy({ by: ["category"], where: { published: true }, _count: { _all: true } }),
    prisma.blogPost.count({ where: { published: true, ...categoryFilter } }),
  ]);

  const counts = new Map<string, number>(grouped.map((row) => [row.category, row._count._all]));
  const allTotal = await prisma.blogPost.count({ where: { published: true } });
  counts.set("__all", allTotal);

  const sectionBlurb = category
    ? `The most recent post in ${category.toLowerCase()} is featured above. Older posts in this category follow below.`
    : "The newest published article is featured above. Earlier posts are listed below, newest first.";

  return (
    <>
      {featured ? <BlogFeatured post={featured} /> : null}

      <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:py-14">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl text-[#16181d] sm:text-5xl">Latest blogs</h1>
          <p className="mt-3 text-base leading-7 text-[#5e584e]">{sectionBlurb}</p>
        </header>

        <BlogCategoryFilters active={category as BlogCategory | undefined} counts={counts} />

        {rest.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
            {rest.map((post) => (
              <BlogCard key={post.id} layout="grid" post={post} />
            ))}
          </div>
        ) : featured ? null : (
          <div className="mt-10">
            <EmptyState
              title="Nothing in this category yet"
              body="The studio has not published an article here yet. Browse all blogs or pick another category."
              href="/blog"
              action="All blogs"
            />
          </div>
        )}
      </div>
    </>
  );
}