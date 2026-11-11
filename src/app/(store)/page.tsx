import Image from "next/image";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { FeaturedSlider } from "@/components/featured-slider";
import { HeroDevices } from "@/components/hero-devices";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { buttonClass } from "@/components/ui";
import { prisma } from "@/lib/db";
import { faqs } from "@/lib/faq";
import { pageCopy, paragraphs } from "@/lib/page-copy";
import { getProfile } from "@/lib/profile";
import { siteUrl } from "@/lib/site";

const services = [
  {
    title: "Web Development Solutions",
    body: "Websites should not only look great but also deliver measurable results. Our team ensures that your website performs optimally, turning visitors into local customers.",
    image: "/brand/service-web.jpg",
    alt: "Laptop with a website layout on the screen",
  },
  {
    title: "UI/UX Design for Seamless User Experience",
    body: "Great design goes beyond aesthetics. We craft intuitive, user-friendly interfaces that engage your audience and provide them with a seamless experience, keeping them coming back for more.",
    image: "/brand/service-ux.jpg",
    alt: "Designer reviewing an interface on a laptop",
  },
  {
    title: "Graphics and Branding",
    body: "Your brand's visual identity is key to making a strong first impression. Our expert designers create eye-catching logos, branding materials, and graphics that resonate with your audience and distinguish your business.",
    image: "/brand/service-brand.jpg",
    alt: "Color swatches and branding materials on a desk",
  },
  {
    title: "Digital Marketing Strategies",
    body: "With data-driven digital marketing campaigns, we help you reach the right audience at the right time. From SEO to social media advertising, our tailored strategies drive traffic, increase conversions, and grow your brand.",
    image: "/brand/service-marketing.jpg",
    alt: "Team planning a campaign at a whiteboard",
  },
  {
    title: "Expert Consultation to Guide Your Digital Journey",
    body: "Whether you're just starting out or looking to scale, our team provides expert consultation to help you navigate the digital space. We offer insights and strategies that empower you to make informed decisions and achieve your business goals.",
    image: "/brand/service-consult.jpg",
    alt: "Two people in a consultation meeting",
  },
  {
    title: "Tech Gadgets at Your Fingertips",
    body: "From the latest gadgets to essential tech tools, we offer a curated selection for your business or personal setup.",
    image: "/brand/service-gadgets.jpg",
    alt: "Phone, earbuds, and other tech gadgets on a desk",
  },
];

const testimonials = [
  {
    quote: "They took the freight site from a brief to something our shippers actually trust. The pages are clear, and the enquiry form started working the same week.",
    name: "Chinedu Adeyemi",
    role: "Operations lead, Lagos",
  },
  {
    quote: "We needed a shop that did not look like a template. The product pages feel like the brand, and checkout was simple for our customers.",
    name: "Ama Boateng",
    role: "Founder, Accra",
  },
  {
    quote: "The clinic site is calm, fast, and easy for patients to book. We stopped explaining the same three things on the phone.",
    name: "Dr. Lindiwe Nkosi",
    role: "Practice owner, Johannesburg",
  },
];

const reasons = [
  {
    title: "Tailored Solutions:",
    body: "We understand that every business is unique, which is why we offer customized services that fit your specific needs and goals.",
  },
  {
    title: "Proven Results",
    body: "With a track record of successful projects, our solutions are designed to deliver tangible results and long-term value.",
  },
  {
    title: "Expert Team",
    body: "Our diverse team of experts brings a wealth of experience in web development, design, marketing, and technology, ensuring you get the best solutions.",
  },
  {
    title: "Client-Centric Approach",
    body: "We put your needs first, working closely with you to ensure that our services not only meet but exceed your expectations.",
  },
];

export default async function HomePage() {
  const profile = await getProfile();
  const copy = pageCopy(profile);
  const url = siteUrl();
  const featuredSelect = { id: true, slug: true, title: true, category: true, summary: true, coverImage: true, priceNgn: true, pricesJson: true } as const;
  let featured = await prisma.portfolioItem.findMany({
    where: { published: true, featured: true },
    orderBy: { updatedAt: "desc" },
    take: 12,
    select: featuredSelect,
  });
  if (featured.length < 8) {
    const more = await prisma.portfolioItem.findMany({
      where: { published: true, id: { notIn: featured.map((item) => item.id) } },
      orderBy: { createdAt: "desc" },
      take: 12 - featured.length,
      select: featuredSelect,
    });
    featured = [...featured, ...more];
  }
  const heroLines = copy.heroHeadline.split(/\n+/).map((line) => line.trim()).filter(Boolean);

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

      <section className="relative overflow-hidden bg-[#071428]">
        <div className="pointer-events-none absolute -right-16 top-[-20%] h-[140%] w-[min(720px,70%)] bg-[radial-gradient(circle_at_center,#1d4e9e_0%,transparent_68%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#f15a22]/80 to-transparent" />
        <div className="relative mx-auto grid w-[90%] items-center gap-6 py-8 md:grid-cols-[1.05fr_0.95fr] md:py-12">
          <div className="max-w-xl">
            <h1 className="font-serif text-[2.15rem] leading-[1.05] sm:text-5xl lg:text-[3.35rem]">
              {heroLines.map((line, index) => (
                <span key={`${line}-${index}`} className={index > 0 ? "block text-[#f15a22]" : "block text-white"}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-md text-base text-[#d5deee] sm:text-lg">{copy.heroSubline}</p>
            <Link href="/work" className="mt-6 inline-flex rounded-md bg-[#f15a22] px-5 py-2.5 text-sm font-semibold text-[#0c1220] transition hover:bg-[#ff7a45]">
              Explore Now
            </Link>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <HeroDevices />
          </div>
        </div>
      </section>

      {featured.length ? (
        <section className="mx-auto w-[90%] py-14" aria-labelledby="featured-heading">
          <FeaturedSlider items={featured} />
        </section>
      ) : null}

      <section className="mx-auto w-[90%] py-16" aria-labelledby="who-heading">
        <div className="grid items-stretch gap-8 md:grid-cols-[0.92fr_1.08fr] md:gap-10">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f15a22]">The studio</p>
            <h2 id="who-heading" className="mt-3 font-serif text-4xl text-white sm:text-5xl">Who We Are</h2>
            <div className="mt-5 max-w-xl space-y-4 text-sm leading-7 text-[#d5deee]">
              {paragraphs(copy.aboutBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about" className={`${buttonClass.orange} mt-6 w-fit`}>See More</Link>
            <dl className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#1d4e9e] bg-[#0c1220] px-4 py-5 sm:px-5">
                <dt className="font-serif text-4xl text-[#f15a22]">5+</dt>
                <dd className="mt-1 text-sm text-[#9ec0ff]">Years of Experience</dd>
              </div>
              <div className="rounded-2xl border border-[#1d4e9e] bg-[#0c1220] px-4 py-5 sm:px-5">
                <dt className="font-serif text-4xl text-[#f15a22]">13k</dt>
                <dd className="mt-1 text-sm text-[#9ec0ff]">Customer Satisfaction</dd>
              </div>
            </dl>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-[#1d4e9e]/50 bg-[#0c1220] md:min-h-full">
            <Image src="/brand/who-we-are.png" alt="The Qwik Technologies team in a client meeting" fill className="object-cover" sizes="(min-width: 768px) 48vw, 90vw" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-[90%] py-16" aria-labelledby="do-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f15a22]">Services</p>
            <h2 id="do-heading" className="mt-3 font-serif text-4xl text-white sm:text-5xl">What We Do</h2>
          </div>
          <Link href="/contact" className={`${buttonClass.orange} w-fit`}>Start a project</Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.title} className={`group relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-[#1d4e9e]/50 bg-[#0c1220] ${index === 0 ? "md:col-span-2 md:min-h-[360px]" : ""}`}>
              <Image src={service.image} alt={service.alt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes={index === 0 ? "(min-width: 768px) 60vw, 90vw" : "(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 90vw"} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-[#071018]/75 to-[#071018]/15" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-xs font-semibold tracking-[0.18em] text-[#f15a22]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 max-w-md text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[#d5deee]">{service.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[90%] py-14 text-center">
        <h2 className="font-serif text-3xl text-[#f15a22] sm:text-4xl">Ready to Elevate Your Digital Presence?</h2>
        <p className="mt-2 text-[#9ec0ff]">Let&apos;s work together to build something extraordinary.</p>
        <Link href="/contact" className="mt-5 inline-flex rounded-md border border-[#f15a22] px-5 py-2.5 text-sm text-[#f15a22] hover:bg-[#f15a22] hover:text-white">
          Get Started Today
        </Link>
      </section>

      <section aria-labelledby="why-heading">
        <div className="mx-auto w-[90%] pb-6 pt-4 text-left lg:text-right">
          <h2 id="why-heading" className="font-serif text-4xl text-[#f15a22]">Why Choose Us</h2>
          <p className="mt-2 text-sm text-[#c4beb4]">Empowering your business with technology, innovation, and a customer-first approach.</p>
        </div>
        <div className="relative min-h-[560px] overflow-hidden bg-[#10131a]">
          <Image src="/brand/why-choose.png" alt="Analyst reviewing business dashboards" fill className="object-cover object-right" sizes="100vw" />
          <div className="relative mx-auto grid w-[90%] py-16 lg:grid-cols-2">
            <div className="max-w-md bg-[#16181d]/92 p-8 text-white sm:p-10">
              <ul className="space-y-7">
                {reasons.map((reason) => (
                  <li key={reason.title}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <FiCheck aria-hidden /> {reason.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">{reason.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[90%] items-center gap-6 py-16 lg:grid-cols-2">
        <h2 className="max-w-sm font-serif text-3xl leading-snug text-[#f15a22] sm:text-4xl">
          Subribe to our newsletter to get free brand Guide
        </h2>
        <NewsletterForm />
      </section>

      <section className="mx-auto w-[90%] py-16" aria-labelledby="stories-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f15a22]">From the work</p>
        <h2 id="stories-heading" className="mt-3 font-serif text-4xl text-white sm:text-5xl">Client Testimonial</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <figure className="flex flex-col justify-between rounded-[1.75rem] border border-[#1d4e9e]/50 bg-[#0c1220] p-7 sm:p-10">
            <span className="font-serif text-6xl leading-none text-[#f15a22]" aria-hidden>&ldquo;</span>
            <blockquote className="mt-4 text-lg leading-8 text-white sm:text-xl">{testimonials[0].quote}</blockquote>
            <figcaption className="mt-8">
              <p className="font-medium text-white">{testimonials[0].name}</p>
              <p className="mt-1 text-sm text-[#9ec0ff]">{testimonials[0].role}</p>
            </figcaption>
          </figure>
          <div className="grid gap-4">
            {testimonials.slice(1).map((item) => (
              <figure key={item.name} className="rounded-[1.75rem] border border-[#1d4e9e]/50 bg-[#122033] p-6">
                <blockquote className="text-sm leading-7 text-[#d5deee]">{item.quote}</blockquote>
                <figcaption className="mt-5">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-[#9ec0ff]">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-[#1d4e9e] bg-[#0c1220]">
        <div className="mx-auto w-[90%] py-14">
          <h2 className="font-serif text-4xl text-[#f15a22]">FAQ</h2>
          <div className="mt-6 divide-y divide-[#1d4e9e] border-y border-[#1d4e9e]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-white">{faq.question}</summary>
                <p className="max-w-3xl pt-3 text-sm leading-6 text-[#d5deee]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
