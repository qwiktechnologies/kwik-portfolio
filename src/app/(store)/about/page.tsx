import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui";
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
  return (
    <article>
      <section className="bg-[linear-gradient(105deg,#d7e3f8_0%,#8ea6e0_100%)]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6">
          <h1 className="max-w-3xl font-serif text-5xl leading-tight text-[#f7f4ee] sm:text-6xl">Who We Are</h1>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-4 text-sm leading-7 text-[#5c5648]">
          <p>
            At Qwiktechnologies, we are a team of passionate digital innovators dedicated to helping businesses thrive in the ever-evolving digital landscape. Our goal is to transform your vision into reality by providing a full suite of customized digital solutions that drive results and deliver lasting value.
          </p>
          <p>
            Whether you need a stunning website, seamless user experiences, or strategies to grow your brand, we are here to guide you every step of the way.
          </p>
          <p>Our team of seasoned designers and strategists bring a wealth of experience and a creative edge to every project.</p>
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
      <section className="bg-[#16181d] text-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
          {reasons.map(([title, body]) => (
            <article key={title}>
              <h2 className="text-xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
