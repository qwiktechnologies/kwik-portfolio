import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getProfile } from "@/lib/profile";
import { parseExtra } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact the studio",
  description: "Write to Qwik Technologies about a format that is not on the shelf, or ask a question before you buy. Address, phone, and email are on this page.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();
  const extra = parseExtra(profile.extraJson);
  return (
    <div className="mx-auto grid w-full gap-12 px-5 py-14 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Get in touch</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight">Tell us what the business does.</h1>
        <p className="mt-4 text-muted">If a catalog format fits, we will point you at it. If it does not, we will say so before any payment.</p>
        <address className="mt-8 space-y-3 text-sm not-italic leading-6">
          <p>{profile.address}</p>
          <p><a className="underline underline-offset-4" href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>{profile.phone}</a></p>
          <p><a className="underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a></p>
          {profile.whatsapp ? <p>WhatsApp {profile.whatsapp}</p> : null}
          {profile.hours ? <p>{profile.hours}</p> : null}
          {profile.instagram ? <p><a className="underline underline-offset-4" href={profile.instagram}>Instagram</a></p> : null}
          {extra.map((row) => (
            <p key={row.label}><span className="text-muted">{row.label}: </span>{row.value}</p>
          ))}
        </address>
      </div>
      <div className="lg:col-span-7">
        <ContactForm />
      </div>
    </div>
  );
}
