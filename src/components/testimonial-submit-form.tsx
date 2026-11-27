"use client";

import { useActionState } from "react";
import { FiSend } from "react-icons/fi";
import { submitTestimonial } from "@/lib/actions/public";
import { Notice } from "./ui";
import { TestimonialStarRating } from "./testimonial-star-rating";

const fieldClass =
  "h-12 w-full rounded-lg border border-transparent bg-[#f4f4f5] px-4 text-sm text-[#16181d] outline-none placeholder:text-[#9ca3af] focus:border-[#1d4e9e] focus:bg-white";

export function TestimonialSubmitForm() {
  const [state, action, pending] = useActionState(submitTestimonial, { error: "", ok: false });

  if (state.ok) {
    return (
      <p className="rounded-xl bg-[#e8f0fa] px-4 py-5 text-center text-sm text-[#1d4e9e]">
        Thank you. We received your review and will approve it before it appears on the site.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      <div>
        <label htmlFor="testimonial-name" className="mb-1.5 block text-sm font-medium text-[#16181d]">
          Your name
        </label>
        <input id="testimonial-name" className={fieldClass} name="name" required autoComplete="name" placeholder="e.g. Daniel Okafor" />
      </div>
      <div>
        <label htmlFor="testimonial-role" className="mb-1.5 block text-sm font-medium text-[#16181d]">
          Business / location <span className="font-normal text-[#6b7280]">(optional)</span>
        </label>
        <input id="testimonial-role" className={fieldClass} name="role" autoComplete="organization" placeholder="e.g. Business Owner, Lagos" />
      </div>
      <input type="hidden" name="email" value="visitor@testimonial.local" />
      <TestimonialStarRating />
      <div>
        <label htmlFor="testimonial-quote" className="mb-1.5 block text-sm font-medium text-[#16181d]">
          Your review
        </label>
        <textarea
          id="testimonial-quote"
          className={`${fieldClass} min-h-[140px] resize-y py-3`}
          name="quote"
          required
          rows={5}
          placeholder="Tell others about your experience…"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#16181d] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2b2926] disabled:opacity-60"
      >
        <FiSend aria-hidden />
        {pending ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}