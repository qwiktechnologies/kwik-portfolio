import Image from "next/image";
import Link from "next/link";
import { BlogCoverImage } from "@/components/blog-cover-image";
import { blogCoverUrl } from "@/lib/blog-cover";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: Date;
};

export function BlogCard({ post, layout }: { post: BlogCardPost; layout: "row" | "stack" | "grid" }) {
  const cover = blogCoverUrl(post.coverImage);

  if (layout === "grid") {
    return (
      <article className="flex h-full flex-col">
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#e8e4de]">
          <BlogCoverImage coverImage={post.coverImage} alt={post.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        </Link>
        <h2 className="mt-4 line-clamp-2 font-serif text-xl leading-snug text-[#16181d] sm:text-[1.35rem]">
          <Link href={`/blog/${post.slug}`} className="hover:text-[#1d4e9e]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#5e584e]">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md border border-[#e3daca] bg-[#faf8f4] px-2.5 py-1 text-[11px] font-medium text-[#5e584e]">
            {post.category}
          </span>
        </div>
      </article>
    );
  }

  const media = (
    <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-night">
      <Image src={cover} alt={post.title} fill className="object-cover" sizes={layout === "row" ? "280px" : "30vw"} />
    </Link>
  );
  const copy = (
    <div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="rounded-full border border-line bg-card px-2.5 py-1 uppercase tracking-[0.14em]">{post.category}</span>
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