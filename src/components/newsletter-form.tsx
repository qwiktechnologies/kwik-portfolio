"use client";

import { useActionState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { sendMessage } from "@/lib/actions/public";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(sendMessage, { error: "", ok: false });

  if (state.ok) {
    return <p className="text-sm text-[#1d4e9e]">You are on the list. The brand guide will come to that email.</p>;
  }

  return (
    <form action={action} className="flex w-full max-w-md flex-wrap items-center gap-2">
      <input type="hidden" name="name" value="Subscriber" />
      <input type="hidden" name="subject" value="Free brand guide" />
      <input type="hidden" name="message" value="Please send the free brand guide." />
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input id="newsletter-email" name="email" type="email" required placeholder="Enter your email address" className="h-12 min-w-0 flex-1 rounded-md border border-[#e7e3da] bg-[#f4f2ee] px-4 text-sm outline-none focus:border-[#1d4e9e]" />
      <button type="submit" aria-label="Subscribe" disabled={pending} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#d9d4ca] text-[#1c1915] hover:bg-[#f6f3ec] disabled:opacity-60">
        <FiArrowRight />
      </button>
      {state.error ? <p className="w-full text-sm text-[#9a3412]">{state.error}</p> : null}
    </form>
  );
}
