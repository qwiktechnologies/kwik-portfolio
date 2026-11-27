import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { faqs } from "@/lib/faq";
import { getProfile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Qwik Technologies services, pricing, templates, and how to get started.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  await getProfile();

  return (
  <>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
    <section className="border-b border-[#ece8df] bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[800px] px-4 text-center sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#fde8e4] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#c43d28]">
          <span aria-hidden>?</span> Helping businesses grow
        </p>
        <h1 className="mt-5 font-serif text-4xl font-bold text-[#16181d] sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#5e584e] sm:text-base">
          Everything you need to know about our services, templates, pricing, and how we work with your business.
        </p>
      </div>
    </section>
    <section className="bg-[#faf9f7] py-12 sm:py-16">
      <ul className="mx-auto w-full max-w-[800px] space-y-4 px-4 sm:px-6">
        {faqs.map((faq) => (
          <li key={faq.question} className="rounded-xl border border-[#e8e4dc] bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
            <h2 className="text-base font-bold text-[#1d4e9e] sm:text-lg">{faq.question}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5e584e]">{faq.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  </>
  );
}