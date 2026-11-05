import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@/components/rich-text";
import { buttonClass } from "@/components/ui";
import { getProfile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About the studio",
  description: "Qwik Technologies builds templates and digital experiences. Fixed-price websites, stores, logos, and flyers, with the naira price shown in your currency.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const profile = await getProfile();
  return (
    <article className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">About</p>
      <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-tight sm:text-6xl">{profile.aboutHeadline}</h1>
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-night lg:col-span-5">
          <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80" alt="People working together around a table" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" priority />
        </div>
        <div className="lg:col-span-7">
          <RichText text={profile.aboutBody} />
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Studio</dt>
              <dd className="mt-2 text-sm">{profile.address}</dd>
            </div>
            <div className="rounded-2xl border border-line p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Hours</dt>
              <dd className="mt-2 text-sm">{profile.hours || "By appointment"}</dd>
            </div>
          </dl>
          <Link href="/contact" className={`${buttonClass.solid} mt-8`}>
            Get in touch
          </Link>
        </div>
      </div>
    </article>
  );
}
