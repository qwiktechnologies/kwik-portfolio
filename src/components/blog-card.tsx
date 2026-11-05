import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/site";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: Date;
};

export function BlogCard({ post, layout }: { post: BlogCardPost; layout: "row" | "stack" }) {
  const media = (
    <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-night">
      <Image src={post.coverImage} alt="" fill className="object-cover" sizes={layout === "row" ? "280px" : "30vw"} />
    </Link>
  );
  const copy = (
    <div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="rounded-full border border-line bg-card px-2.5 py-1 uppercase tracking-[0.14em]">{post.category}</span>
        <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
      </p>
      <h2 className={`mt-2 font-serif leading-tight ${layout === "row" ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{post.excerpt}</p>
    </div>
  );

  if (layout === "stack") {
    return (
      <article>
        {media}
        <div className="mt-3">{copy}</div>
      </article>
    );
  }

  return <article className="grid items-center gap-6 border-t border-line pt-8 md:grid-cols-[280px_1fr]">{media}{copy}</article>;
}
