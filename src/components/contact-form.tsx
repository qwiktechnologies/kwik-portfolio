"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions/public";
import { buttonClass, Field, Notice, TextArea } from "./ui";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, { error: "", ok: false });
  if (state.ok) {
    return <p className="rounded-3xl bg-[#e8f5ee] px-5 py-6 text-pine">Message received. The studio will reply to the email you entered.</p>;
  }
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      <Field label="Name" name="name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field label="Phone" name="phone" autoComplete="tel" />
      <Field label="Subject" name="subject" required />
      <TextArea label="Message" name="message" required rows={6} />
      <button className={buttonClass.solid} disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
