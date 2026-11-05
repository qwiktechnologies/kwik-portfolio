"use client";

import { useActionState } from "react";
import { FiCheck } from "react-icons/fi";
import { submitBrief } from "@/lib/actions/public";
import { buttonClass, Field, Notice, TextArea } from "./ui";

const asks = [
  "Business name, written the way it should appear",
  "What the business does, who it serves, and what the site must make easy",
  "Logo, as an image",
  "Public email and phone",
  "Social handles the site should link",
  "Hours, address, offers, and anything we should not guess",
];

export function BriefForm({ orderId, email }: { orderId: string; email: string }) {
  const [state, action, pending] = useActionState(submitBrief, { error: "", ok: false });
  if (state.ok) {
    return (
      <div className="rounded-3xl bg-[#e8f5ee] p-6 text-pine">
        <p className="font-serif text-3xl text-ink">Brief received.</p>
        <p className="mt-2 text-sm leading-6">It is attached to this purchase. The studio can see the same note, including the logo.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-ember">You are paid</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight">The build starts when we can see the business.</h2>
        <p className="mt-4 text-sm leading-6 text-muted">Send the following. The more specific you are, the less we have to invent.</p>
        <ul className="mt-5 space-y-3">
          {asks.map((ask) => (
            <li key={ask} className="flex gap-3 text-sm leading-6">
              <FiCheck className="mt-1 shrink-0 text-pine" aria-hidden />
              <span>{ask}</span>
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="space-y-4 rounded-3xl border border-line bg-card p-5">
        <input type="hidden" name="orderId" value={orderId} />
        {state.error ? <Notice>{state.error}</Notice> : null}
        <Field label="Business name" name="businessName" required />
        <TextArea label="Business details" name="businessDetails" required hint="What you sell, who it is for, and what a visitor should do." />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Logo image</span>
          <input className="field" type="file" name="logo" accept="image/*" />
          <span className="mt-1.5 block text-xs text-muted">Stored with the order as an image string. Under 1.5MB. Optional if you do not have one yet.</span>
        </label>
        <Field label="Email" name="email" type="email" required defaultValue={email} />
        <Field label="Phone" name="phone" required />
        <Field label="Social handles" name="socials" hint="Instagram, X, Facebook, TikTok, or a website." />
        <TextArea label="Anything else" name="notes" rows={4} hint="Hours, address, colours, offers, words you want used." />
        <button className={buttonClass.solid} disabled={pending}>
          {pending ? "Sending…" : "Send the brief"}
        </button>
      </form>
    </div>
  );
}
