"use client";

import { useActionState } from "react";
import { createPerson, saveContact, saveStripe } from "@/lib/actions/admin";
import { HERO_HEADLINE, HERO_SUBLINE, pageCopy } from "@/lib/page-copy";
import { buttonClass, Field, Notice, TextArea } from "./ui";
import { ExtraFields } from "./extra-fields";
import { logoutAction } from "@/lib/actions/auth";

export function PeopleForm({ allowAdmin }: { allowAdmin: boolean }) {
  const [state, action, pending] = useActionState(createPerson, { error: "", ok: false });
  return (
    <form action={action} className="space-y-4 rounded-3xl border border-line bg-card p-5">
      <h2 className="font-serif text-3xl">Create a person</h2>
      {state.error ? <Notice>{state.error}</Notice> : null}
      {state.ok ? <p className="rounded-2xl bg-[#e8f5ee] px-4 py-3 text-sm text-pine">Account created. They sign in with the email and password you set. A role change applies the next time they sign in.</p> : null}
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" />
      <Field label="Temporary password" name="password" type="text" required hint="Share this with them. At least 8 characters." />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Role</span>
        <select className="field" name="role" defaultValue="STAFF">
          <option value="CUSTOMER">Customer</option>
          <option value="STAFF">Staff</option>
          {allowAdmin ? <option value="ADMIN">Admin</option> : null}
        </select>
      </label>
      <button className={buttonClass.solid} disabled={pending}>
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

export function StripeForm({
  publishableKey,
  enabled,
  hasSecret,
}: {
  publishableKey: string;
  enabled: boolean;
  hasSecret: boolean;
}) {
  const [state, action, pending] = useActionState(saveStripe, { error: "", ok: false });
  return (
    <form action={action} className="max-w-2xl space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      {state.ok ? <p className="rounded-2xl bg-[#e8f5ee] px-4 py-3 text-sm text-pine">Paystack settings saved. The secret key stays encrypted.</p> : null}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="enabled" defaultChecked={enabled} />
        Accept payments
      </label>
      <Field label="Public key" name="publishableKey" defaultValue={publishableKey} hint="Starts with pk_test_ or pk_live_." />
      <Field label="Secret key" name="secretKey" type="password" autoComplete="off" hint={hasSecret ? "A secret key is already saved. Leave blank to keep it." : "Starts with sk_test_ or sk_live_."} />
      <p className="text-xs leading-5 text-muted">Paystack charges the naira catalog total. Checkout shows that total in the visitor’s selected currency.</p>
      <button className={buttonClass.solid} disabled={pending}>
        {pending ? "Saving…" : "Save Paystack"}
      </button>
    </form>
  );
}

export function ContactSettingsForm({
  profile,
  extra,
}: {
  profile: {
    companyName: string;
    tagline: string;
    heroLead: string;
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
    hours: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    twitter: string;
    heroHeadline: string;
    heroSubline: string;
    aboutHeadline: string;
    aboutBody: string;
  };
  extra: { label: string; value: string }[];
}) {
  const [state, action, pending] = useActionState(saveContact, { error: "", ok: false });
  const copy = pageCopy(profile);
  return (
    <form action={action} className="max-w-3xl space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      {state.ok ? <p className="rounded-2xl bg-[#e8f5ee] px-4 py-3 text-sm text-pine">Page settings updated on the public site.</p> : null}
      <Field label="Company name" name="companyName" required defaultValue={profile.companyName} />
      <TextArea label="Short description" name="tagline" required defaultValue={profile.tagline} rows={3} />
      <TextArea label="Homepage headline" name="heroHeadline" defaultValue={copy.heroHeadline} rows={2} hint={`Shown on the landing page. Use a new line for the second line. Default: ${HERO_HEADLINE.replace("\n", " / ")}`} />
      <Field label="Homepage line" name="heroSubline" defaultValue={copy.heroSubline} hint={HERO_SUBLINE} />
      <TextArea label="Homepage note" name="heroLead" required defaultValue={profile.heroLead} rows={4} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email" name="email" type="email" required defaultValue={profile.email} />
        <Field label="Phone" name="phone" required defaultValue={profile.phone} />
      </div>
      <Field label="Address" name="address" required defaultValue={profile.address} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="WhatsApp" name="whatsapp" defaultValue={profile.whatsapp} />
        <Field label="Hours" name="hours" defaultValue={profile.hours} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Facebook URL" name="facebook" defaultValue={profile.facebook} />
        <Field label="Instagram URL" name="instagram" defaultValue={profile.instagram} />
        <Field label="TikTok URL" name="tiktok" defaultValue={profile.tiktok} />
        <Field label="Twitter URL" name="twitter" defaultValue={profile.twitter} />
      </div>
      <Field label="About headline" name="aboutHeadline" required defaultValue={copy.aboutHeadline} />
      <TextArea label="About page" name="aboutBody" required defaultValue={copy.aboutBody} rows={10} hint="Blank line between paragraphs. This text is the Who We Are section on the homepage and the about page." />
      <ExtraFields initial={extra} />
      <button className={buttonClass.solid} disabled={pending}>
        {pending ? "Saving…" : "Save contact details"}
      </button>
    </form>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="text-sm underline underline-offset-4">Sign out</button>
    </form>
  );
}
