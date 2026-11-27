import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { pageCopy, paragraphs } from "@/lib/page-copy";
import { getProfile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Who we are",
  description: "Qwik Technologies is a team of digital innovators building websites, brands, and marketing that help businesses grow.",
  alternates: { canonical: "/about" },
};

const reasons = [
  ["Tailored Solutions", "We understand that every business is unique, which is why we offer customized services that fit your specific needs and goals."],
  ["Proven Results", "With a track record of successful projects, our solutions are designed to deliver tangible results and long-term value."],
  ["Expert Team", "Our diverse team of experts brings a wealth of experience in web development, design, marketing, and technology, ensuring you get the best solutions."],
  ["Client-Centric Approach", "We put your needs first, working closely with you to ensure that our services not only meet but exceed your expectations."],
];

export default async function AboutPage() {
  const profile = await getProfile();
  const copy = pageCopy(profile);
  return (
    <article>
      <section className="hero-surface relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Who we are</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-[#93c5fd] sm:text-5xl lg:text-6xl">{copy.aboutHeadline}</h1>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-4 text-sm leading-7 text-[#16181d]">
          <h2 className="font-serif text-3xl text-[#1d4e9e] sm:text-4xl">Who we are</h2>
          {paragraphs(copy.aboutBody).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <dl className="grid gap-4 pt-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-[#6b655c]">Studio</dt>
              <dd className="mt-2 text-sm text-[#1c1915]">{profile.address}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-[#6b655c]">Hours</dt>
              <dd className="mt-2 text-sm text-[#1c1915]">{profile.hours || "By appointment"}</dd>
            </div>
          </dl>
          <Link href="/contact" className={`${buttonClass.orange} mt-2`}>Get in touch</Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#e7e3da]">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80" alt="The team working together" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" priority />
        </div>
      </div>
      <section className="border-t border-[#ece8df] bg-[#f7f6f3]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
          <h2 className="font-serif text-3xl text-[#1d4e9e] sm:text-4xl">Why choose us</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {reasons.map(([title, body]) => (
              <article key={title} className="rounded-xl border border-[#e3daca] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#16181d]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5e584e]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}