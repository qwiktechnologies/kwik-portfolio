"use client";

import { useActionState } from "react";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { deletePost, savePost } from "@/lib/actions/admin";
import { RichEditor } from "./rich-editor";
import { buttonClass, Field, Notice, TextArea } from "./ui";

export function BlogForm({
  item,
}: {
  item?: { id: string; title: string; slug: string; category: string; excerpt: string; content: string; coverImage: string; published: boolean };
}) {
  const [state, action, pending] = useActionState(savePost, { error: "" });
  return (
    <form action={action} className="grid gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      {state.error ? <Notice>{state.error}</Notice> : null}
      <Field label="Title" name="title" required defaultValue={item?.title} />
      <Field label="Slug" name="slug" defaultValue={item?.slug} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Category</span>
        <select className="field" name="category" defaultValue={item?.category || BLOG_CATEGORIES[0]} required>
          {BLOG_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <span className="mt-1.5 block text-xs leading-5 text-muted">Every category: {BLOG_CATEGORIES.join(" · ")}</span>
      </label>
      <TextArea label="Excerpt" name="excerpt" required defaultValue={item?.excerpt} rows={3} />
      <RichEditor name="content" defaultValue={item?.content} />
      <Field label="Cover image URL" name="coverImage" defaultValue={item?.coverImage} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Upload cover</span>
        <input className="field" type="file" name="coverFile" accept="image/*" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} />
        Published
      </label>
      <button className={buttonClass.solid} disabled={pending}>
        {pending ? "Saving…" : "Save article"}
      </button>
    </form>
  );
}

export function DeletePost({ id }: { id: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="id" value={id} />
      <button className="text-xs text-muted underline" onClick={(event) => { if (!confirm("Delete this article?")) event.preventDefault(); }}>
        Delete
      </button>
    </form>
  );
}
