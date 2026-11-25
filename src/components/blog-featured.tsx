import Link from "next/link";
import type { BlogCardPost } from "@/components/blog-card";
import { BlogCoverImage } from "@/components/blog-cover-image";
import { formatDate } from "@/lib/site";

export function BlogFeatured({ post }: { post: BlogCardPost }) {
  return (
    <section className="bg-[#eceae6]" aria-labelledby="blog-featured-heading">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-14">
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#d8d4ce] shadow-sm lg:aspect-[4/3]">
          <BlogCoverImage
            coverImage={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5e584e]">
            Latest post · <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
          </p>
          <h2 id="blog-featured-heading" className="mt-2 font-serif text-3xl leading-tight text-[#16181d] sm:text-4xl lg:text-[2.35rem]">
            <Link href={`/blog/${post.slug}`} className="hover:text-[#1d4e9e]">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#5e584e]">{post.excerpt}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
            <li>
              <span className="inline-flex rounded-md border border-[#cfc9bf] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#3d3a33]">
                {post.category}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}