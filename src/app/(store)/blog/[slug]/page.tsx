import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm, CommentList, LikeButton, ShareBar, SignInPrompt } from "@/components/blog-engage";
import { JsonLd } from "@/components/json-ld";
import { ArticleBody } from "@/components/rich-text";
import { getSession } from "@/lib/auth";
import { canManageStudio } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import { formatDate, siteUrl } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, published: true } });
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const session = await getSession();
  const [post, profile] = await Promise.all([
    prisma.blogPost.findFirst({
      where: { slug, published: true },
      include: {
        comments: { orderBy: { createdAt: "asc" }, include: { user: { select: { id: true, name: true } } } },
        _count: { select: { likes: true } },
      },
    }),
    getProfile(),
  ]);
  if (!post) notFound();
  const liked = session
    ? Boolean(await prisma.blogLike.findUnique({ where: { postId_userId: { postId: post.id, userId: session.id } } }))
    : false;
  const url = `${siteUrl()}/blog/${post.slug}`;

  return (
    <article className="w-full px-5 py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          articleSection: post.category,
          image: post.coverImage,
          datePublished: post.createdAt.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          commentCount: post.comments.length,
          author: { "@type": "Organization", name: profile.companyName },
          publisher: { "@type": "Organization", name: profile.companyName },
          mainEntityOfPage: url,
        }}
      />
      <nav className="text-sm text-muted">
        <Link href="/blog">Blog</Link>
        <span> / </span>
        <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>
      </nav>
      <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="rounded-full border border-line bg-card px-2.5 py-1 uppercase tracking-[0.14em]">{post.category}</span>
        <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-tight">{post.title}</h1>
      <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <LikeButton postId={post.id} liked={liked} count={post._count.likes} />
        <ShareBar url={url} title={post.title} />
      </div>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.4rem] bg-night">
        <Image src={post.coverImage} alt="" fill priority className="object-cover" sizes="(min-width: 768px) 720px, 100vw" />
      </div>
      <div className="mt-8">
        <ArticleBody text={post.content} />
      </div>
      <section className="mt-14" aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="font-serif text-4xl">Comments</h2>
        <p className="mt-2 text-sm text-muted">{post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}</p>
        <CommentList
          comments={post.comments.map((comment) => ({
            id: comment.id,
            body: comment.body,
            createdAt: comment.createdAt.toISOString(),
            userId: comment.user.id,
            userName: comment.user.name,
          }))}
          currentUserId={session?.id ?? null}
          canModerate={session ? canManageStudio(session.role) : false}
        />
        {session ? <CommentForm postId={post.id} /> : <SignInPrompt next={`/blog/${post.slug}`} />}
      </section>
    </article>
  );
}
