"use client";

import { useActionState } from "react";
import { deletePortfolio, savePortfolio } from "@/lib/actions/admin";
import { CATEGORIES } from "@/lib/constants";
import { buttonClass, Field, Notice, TextArea } from "./ui";

type Item = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  includes: string;
  coverImage: string;
  gallery: string;
  priceNgn: number;
  timeline: string;
  featured: boolean;
  published: boolean;
};

export function PortfolioForm({ item }: { item?: Item }) {
  const [state, action, pending] = useActionState(savePortfolio, { error: "" });
  const categories = item && !CATEGORIES.includes(item.category as (typeof CATEGORIES)[number]) ? [item.category, ...CATEGORIES] : [...CATEGORIES];
  return (
    <form action={action} className="grid gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      {state.error ? <Notice>{state.error}</Notice> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" required defaultValue={item?.title} />
        <Field label="Slug" name="slug" defaultValue={item?.slug} hint="Leave blank to build it from the title." />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Category</span>
        <select className="field" name="category" defaultValue={item?.category || categories[0]}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <TextArea label="Summary" name="summary" required defaultValue={item?.summary} rows={3} />
      <TextArea label="Description" name="description" required defaultValue={item?.description} rows={8} />
      <TextArea label="What is included" name="includes" required defaultValue={item?.includes} rows={6} hint="One line per item." />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Price in naira" name="priceNgn" type="number" min={1} required defaultValue={item?.priceNgn} />
        <Field label="Timeline" name="timeline" required defaultValue={item?.timeline} />
      </div>
      <Field label="Cover image URL" name="coverImage" defaultValue={item?.coverImage} hint="Paste an image URL, or upload a file below. Upload wins." />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Upload cover</span>
        <input className="field" type="file" name="coverFile" accept="image/*" />
      </label>
      <TextArea label="Gallery image URLs" name="gallery" defaultValue={item?.gallery} rows={4} hint="One URL per line." />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} />
        Feature on the homepage
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} />
        Published
      </label>
      <button className={buttonClass.solid} disabled={pending}>
        {pending ? "Saving…" : "Save format"}
      </button>
    </form>
  );
}

export function DeleteFormat({ id }: { id: string }) {
  return (
    <form action={deletePortfolio}>
      <input type="hidden" name="id" value={id} />
      <button className="text-xs text-muted underline" onClick={(event) => { if (!confirm("Remove this format?")) event.preventDefault(); }}>
        Delete
      </button>
    </form>
  );
}
