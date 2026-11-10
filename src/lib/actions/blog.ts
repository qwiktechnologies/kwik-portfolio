"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { canManageStudio, type Role } from "@/lib/constants";

async function accountFor(nextPath: string) {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: session.id }, { email: session.email }] },
  });
  if (!user) {
    await destroySession();
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (user.id !== session.id) {
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role as Role });
  }
  return user;
}

async function publishedPost(postId: string) {
  return prisma.blogPost.findFirst({ where: { id: postId, published: true }, select: { id: true, slug: true } });
}

export async function addComment(_prev: { error: string; ok: boolean }, formData: FormData) {
  const postId = String(formData.get("postId") || "");
  const post = await publishedPost(postId);
  if (!post) return { error: "This article is not available.", ok: false };
  const user = await accountFor(`/blog/${post.slug}`);

  const parsed = z.string().trim().min(2).max(2000).safeParse(String(formData.get("body") || ""));
  if (!parsed.success) return { error: "Write a comment between 2 and 2000 characters.", ok: false };

  await prisma.blogComment.create({
    data: { postId: post.id, userId: user.id, body: parsed.data },
  });
  revalidatePath(`/blog/${post.slug}`);
  return { error: "", ok: true };
}

export async function toggleLike(formData: FormData) {
  const postId = String(formData.get("postId") || "");
  const post = await publishedPost(postId);
  if (!post) redirect("/blog");
  const user = await accountFor(`/blog/${post.slug}`);

  const existing = await prisma.blogLike.findUnique({
    where: { postId_userId: { postId: post.id, userId: user.id } },
  });
  if (existing) await prisma.blogLike.delete({ where: { id: existing.id } });
  else await prisma.blogLike.create({ data: { postId: post.id, userId: user.id } });
  revalidatePath(`/blog/${post.slug}`);
}

export async function deleteComment(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/blog");
  const id = String(formData.get("id") || "");
  const comment = await prisma.blogComment.findUnique({
    where: { id },
    include: { post: { select: { slug: true } } },
  });
  if (!comment) return;
  if (comment.userId !== session.id && !canManageStudio(session.role)) return;
  await prisma.blogComment.delete({ where: { id } });
  revalidatePath(`/blog/${comment.post.slug}`);
}
