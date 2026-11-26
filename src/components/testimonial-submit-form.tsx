"use client";

import { useActionState } from "react";
import { submitTestimonial } from "@/lib/actions/public";
import { buttonClass, Field, Notice, TextArea } from "./ui";

export function TestimonialSubmitForm() {
  const [state, action, pending] = useActionState(submitTestimonial, { error: "", ok: false });

  if (state.ok) {
    return (
      <p className="rounded-xl bg-[#e8f0fa] px-4 py-5 text-center text-sm text-[#1d4e9e]">
        Thank you. We received your testimonial and will review it before publishing.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="Role or title" name="role" required hint="e.g. Business Owner" />
      <TextArea label="Your testimonial" name="quote" required rows={5} hint="Share your experience working with Qwik Technologies." />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#16181d]" htmlFor="testimonial-photo">
          Photo (optional)
        </label>
        <input
          id="testimonial-photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-[#5e584e] file:mr-3 file:rounded-md file:border-0 file:bg-[#1d4e9e] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#163d7a]"
        />
        <p className="mt-1 text-xs text-[#6b655c]">JPG, PNG, or WebP, up to 5 MB.</p>
      </div>
      <button className={`${buttonClass.orange} w-full sm:w-auto`} disabled={pending}>
        {pending ? "Sending…" : "Submit testimonial"}
      </button>
    </form>
  );
}