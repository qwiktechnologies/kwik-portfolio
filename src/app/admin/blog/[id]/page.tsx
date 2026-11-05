import { notFound } from "next/navigation";
import { BlogForm } from "@/components/blog-form";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStudio();
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-5xl">Edit article</h1>
      <div className="mt-6"><BlogForm item={post} /></div>
    </div>
  );
}
