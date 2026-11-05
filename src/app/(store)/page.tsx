import { BlogCard } from "@/components/blog-card";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { JsonLd } from "@/components/json-ld";
import { RateLine } from "@/components/money";
import { buttonClass } from "@/components/ui";
import { WorkCard } from "@/components/work-card";
import { prisma } from "@/lib/db";
import { faqs } from "@/lib/faq";
import { getProfile } from "@/lib/profile";
import { siteUrl } from "@/lib/site";

const steps = [
  { n: "01", title: "Choose a format", body: "Open a piece and read what is included. The price beside it is the price." },
  { n: "02", title: "Add it to the cart", body: "One format, or several. A logo can travel with the website that will use it." },
  { n: "03", title: "See the card amount, then pay", body: "Your currency is on the screen. The Stripe charge is shown before you leave this site." },
  { n: "04", title: "Send the brief", body: "Business name, what you do, logo, email, phone, and socials. The build starts from that, not from a guess." },
];

const signals = [
  { title: "Scope before payment", body: "Every format lists its pages, its timeline, and what you need to send." },
  { title: "Naira, then your currency", body: "The catalog price is set in naira and converted for the country you are visiting from." },
  { title: "Card amount in the open", body: "Checkout shows the Stripe currency before you pay. The receipt stays on your account." },
  { title: "Keys stay with the owner", body: "Staff can run orders. Only the studio owner can see or change the Stripe credentials." },
];

export default async function HomePage() {
  const [profile, featuredRaw, posts, pieces] = await Promise.all([
    getProfile(),
    prisma.portfolioItem.findMany({ where: { published: true, featured: true }, orderBy: { priceNgn: "desc" }, take: 6 }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: { createdAt: "asc" },
      select: { category: true, coverImage: true },
    }),
  ]);

  const featured = featuredRaw.length
    ? featuredRaw
    : await prisma.portfolioItem.findMany({ where: { published: true }, take: 6, orderBy: { createdAt: "desc" } });

  const categories = new Map<string, { cover: string; count: number }>();
  for (const piece of pieces) {
    const current = categories.get(piece.category);
    if (!current) categories.set(piece.category, { cover: piece.coverImage, count: 1 });
    else current.count += 1;
  }

  const shots = featured.slice(0, 4);
  const url = siteUrl();

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: profile.companyName,
            url,
            email: profile.email,
            telephone: profile.phone,
            address: { "@type": "PostalAddress", streetAddress: profile.address },
            description: profile.tagline,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: profile.companyName,
            url,
            description: profile.tagline,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]}
      />

      <section className="border-b border-line bg-card">
        <div className="grid w-full items-start gap-6 px-4 py-8 sm:gap-8 sm:px-5 sm:py-12 lg:grid-cols-12 lg:py-14">
          <div className="lg:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Catalog studio</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:mt-5 sm:text-6xl sm:leading-[0.95] lg:text-7xl">
              Creating templates and experiences that drives remarkable <em>change.</em>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">{profile.heroLead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link href="/work" className={`${buttonClass.solid} w-full justify-center sm:w-auto`}>
                Browse the catalog
              </Link>
              <a href="#how" className={`${buttonClass.line} w-full justify-center sm:w-auto`}>
                See how buying works
              </a>
            </div>
            <RateLine className="mt-5 text-sm text-muted sm:mt-6" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3 lg:col-span-5">
            {shots.map((shot, index) => (
              <Link key={shot.id} href={`/work/${shot.slug}`} className={`group relative overflow-hidden rounded-2xl ${index === 0 ? "col-span-3 aspect-[16/9] sm:col-span-2 sm:aspect-[16/10]" : "aspect-[4/3] sm:aspect-square"}`}>
                <Image src={shot.coverImage} alt={`${shot.title}, ${shot.category}`} fill priority={index < 2} className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 30vw, 50vw" />
                <span className="absolute bottom-2 left-2 rounded-full bg-night/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] sm:bottom-3 sm:left-3 sm:px-3 sm:text-[11px]">{shot.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full px-4 py-12 sm:px-5 sm:py-16" aria-labelledby="formats-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">What you can order</p>
            <h2 id="formats-heading" className="mt-2 font-serif text-4xl sm:text-5xl">Formats with a price on them.</h2>
          </div>
          <Link href="/work" className="inline-flex items-center gap-2 text-sm">
            Full catalog <FiArrowUpRight />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...categories.entries()].map(([category, info]) => (
            <Link key={category} href={`/work?category=${encodeURIComponent(category)}`} className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-night sm:min-h-44 sm:aspect-auto">
              <Image src={info.cover} alt="" fill className="object-cover opacity-70 transition duration-700 group-hover:scale-105" sizes="30vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
              <div className="absolute bottom-0 p-5 text-paper">
                <h3 className="font-serif text-2xl sm:text-3xl">{category}</h3>
                <p className="text-sm text-paper/70">{info.count} in the catalog</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full px-5 pb-8" aria-labelledby="selected-heading">
        <h2 id="selected-heading" className="font-serif text-4xl sm:text-5xl">Selected from the shelf</h2>
        <p className="mt-3 max-w-2xl text-muted">Past trades we have shaped into formats you can buy: shops, logistics, a barbershop, a laundry, a clinic, a firm, a logo, a flyer.</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto mt-16 w-full px-5" aria-labelledby="how-heading">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Steps to buy</p>
        <h2 id="how-heading" className="mt-2 max-w-2xl font-serif text-4xl sm:text-5xl">Four steps. No pitch meeting to find the price.</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="rounded-3xl border border-line bg-card p-5">
              <p className="font-serif text-3xl text-ember">{step.n}</p>
              <h3 className="mt-4 font-serif text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-16 grid w-full gap-8 px-5 lg:grid-cols-2" aria-labelledby="brief-heading">
        <div className="rounded-[2rem] border border-line bg-card p-8 sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ember">After you pay</p>
          <h2 id="brief-heading" className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">The build starts when we can see the business.</h2>
          <p className="mt-5 text-muted">The success page asks you to send the materials. They stay on the purchase, so nobody is hunting through an inbox.</p>
        </div>
        <ul className="grid content-center gap-3">
          {["Business name", "What you do, who it is for, and what the site must do", "Logo, sent as an image", "Public email and phone", "Social handles", "Hours, address, prices, and anything we should not guess"].map((item) => (
            <li key={item} className="rounded-2xl border border-line bg-card px-4 py-3 text-sm">{item}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 w-full px-5" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="font-serif text-4xl sm:text-5xl">What you can check before you pay.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {signals.map((signal) => (
            <article key={signal.title} className="rounded-3xl border border-line p-6">
              <h3 className="font-serif text-3xl">{signal.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{signal.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full px-5" aria-labelledby="fit-heading">
        <div className="rounded-[2rem] border border-line bg-card px-6 py-10 sm:px-10">
          <h2 id="fit-heading" className="max-w-3xl font-serif text-4xl sm:text-5xl">For a business that already knows what it sells.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <p className="text-sm leading-6 text-muted">A shop with products. A clinic with services. A freight company with lanes. A room with chairs, tables, or washing machines.</p>
            <p className="text-sm leading-6 text-muted">You want the public face to look finished, and you want the number before a sales call. The catalog is that number.</p>
            <p className="text-sm leading-6 text-muted">If the shelf does not have your shape, the contact page is the honest door. We would rather say so than sell the wrong format.</p>
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="mx-auto mt-16 w-full px-5" aria-labelledby="journal-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="journal-heading" className="font-serif text-4xl">From the blog</h2>
            <Link href="/blog" className="text-sm">All notes <FiArrowUpRight className="inline" /></Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} layout="stack" post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-16 w-full px-5" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-serif text-4xl">Plain answers</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none font-medium">{faq.question}</summary>
              <p className="max-w-3xl pt-3 text-sm leading-6 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full px-5" aria-labelledby="touch-heading">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-line bg-card px-6 py-10 sm:px-10 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-ember">Get in touch</p>
            <h2 id="touch-heading" className="mt-2 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">If the shelf does not have it, tell us what the business does.</h2>
          </div>
          <Link href="/contact" className={buttonClass.solid}>
            Contact the studio
          </Link>
        </div>
      </section>
    </>
  );
}
