import Link from "next/link";
import { DeletePost } from "@/components/blog-form";
import { buttonClass } from "@/components/ui";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/site";

export default async function AdminBlogPage() {
  await requireStudio();
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-5xl">Blog</h1>
        <Link href="/admin/blog/new" className={buttonClass.solid}>New article</Link>
      </div>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-muted">{post.published ? "Published" : "Draft"} · {post.category} · {formatDate(post.updatedAt)}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link className="text-sm underline" href={`/admin/blog/${post.id}`}>Edit</Link>
              <DeletePost id={post.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
