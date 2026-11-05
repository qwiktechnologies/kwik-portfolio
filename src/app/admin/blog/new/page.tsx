import { BlogForm } from "@/components/blog-form";
import { requireStudio } from "@/lib/access";

export default async function NewPostPage() {
  await requireStudio();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-5xl">New article</h1>
      <div className="mt-6"><BlogForm /></div>
    </div>
  );
}
