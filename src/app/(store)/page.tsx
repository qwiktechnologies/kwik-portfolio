import Image from "next/image";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { HomeHero } from "@/components/home-hero";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { WorkCard } from "@/components/work-card";
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
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    alt: "Laptop with a website layout on the screen",
  },
  {
    title: "UI/UX Design for Seamless User Experience",
    body: "Great design goes beyond aesthetics. We craft intuitive, user-friendly interfaces that engage your audience and provide them with a seamless experience, keeping them coming back for more.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=85",
    alt: "Designer reviewing an interface on a laptop",
  },
  {
    title: "Graphics and Branding",
    body: "Your brand's visual identity is key to making a strong first impression. Our expert designers create eye-catching logos, branding materials, and graphics that resonate with your audience and distinguish your business.",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=85",
    alt: "Color swatches and branding materials on a desk",
  },
  {
    title: "Digital Marketing Strategies",
    body: "With data-driven digital marketing campaigns, we help you reach the right audience at the right time. From SEO to social media advertising, our tailored strategies drive traffic, increase conversions, and grow your brand.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
    alt: "Team planning a campaign at a whiteboard",
  },
  {
    title: "Expert Consultation to Guide Your Digital Journey",
    body: "Whether you're just starting out or looking to scale, our team provides expert consultation to help you navigate the digital space. We offer insights and strategies that empower you to make informed decisions and achieve your business goals.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
    alt: "Two people in a consultation meeting",
  },
  {
    title: "Tech Gadgets at Your Fingertips",
    body: "From the latest gadgets to essential tech tools, we offer a curated selection for your business or personal setup.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85",
    alt: "Phone, earbuds, and other tech gadgets on a desk",
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
  let featured = await prisma.portfolioItem.findMany({
    where: { published: true, featured: true },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });
  if (!featured.length) {
    featured = await prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
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

      <HomeHero
        headline={heroLines}
        subline={copy.heroSubline}
        phone={profile.phone}
        phoneHref={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
      />

      {featured.length ? (
        <section className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="font-serif text-4xl text-[#1d4e9e]">Featured website templates</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6" aria-labelledby="who-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="who-heading" className="font-serif text-4xl text-[#1d4e9e]">Who We Are</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[#16181d]">
              {paragraphs(copy.aboutBody).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about" className={`${buttonClass.orange} mt-6`}>See More</Link>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#e7e3da]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85"
              alt="The Qwik Technologies team collaborating in a modern workspace"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
        <dl className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="font-serif text-4xl text-[#1d4e9e]">5+</dt>
            <dd className="text-lg text-[#1d4e9e]">Years of Experience</dd>
          </div>
          <div>
            <dt className="font-serif text-4xl text-[#1d4e9e]">13k</dt>
            <dd className="text-lg text-[#1d4e9e]">Customer Satisfaction</dd>
          </div>
        </dl>
      </section>

      <section className="bg-[#f7f6f3] py-16" aria-labelledby="do-heading">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
          <h2 id="do-heading" className="text-center font-serif text-4xl text-[#16181d]">What We Do</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="flex flex-col bg-[#f3f0e8]">
                <div className="relative aspect-[16/10]">
                  <Image src={service.image} alt={service.alt} fill className="object-cover" sizes="(min-width: 1024px) 30vw, 100vw" />
                </div>
                <div className="flex flex-1 flex-col px-5 py-6 text-center">
                  <h3 className="text-base font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5c5648]">{service.body}</p>
                  <Link href="/contact" className="mx-auto mt-5 inline-flex rounded-md border border-[#2b2926] px-4 py-2 text-sm hover:bg-[#2b2926] hover:text-white">
                    Get In Touch
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-14 text-center sm:px-6">
        <h2 className="font-serif text-3xl text-[#1d4e9e] sm:text-4xl">Ready to Elevate Your Digital Presence?</h2>
        <p className="mt-2 text-[#1d4e9e]">Let&apos;s work together to build something extraordinary.</p>
        <Link href="/contact" className="mt-5 inline-flex rounded-md border border-[#f15a22] px-5 py-2.5 text-sm text-[#f15a22] hover:bg-[#f15a22] hover:text-white">
          Get Started Today
        </Link>
      </section>

      <section aria-labelledby="why-heading">
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-6 pt-4 text-left sm:px-6 lg:text-right">
          <h2 id="why-heading" className="font-serif text-4xl">Why Choose Us</h2>
          <p className="mt-2 text-sm text-[#c4beb4]">Empowering your business with technology, innovation, and a customer-first approach.</p>
        </div>
        <div className="relative min-h-[560px] overflow-hidden bg-[#10131a]">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85"
            alt="Analyst reviewing business dashboards and growth metrics"
            fill
            className="object-cover object-right"
            sizes="100vw"
          />
          <div className="relative mx-auto grid w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:grid-cols-2">
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

      <section className="mx-auto grid w-full max-w-[1200px] items-center gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <h2 className="max-w-sm font-serif text-3xl leading-snug text-[#1d4e9e] sm:text-4xl">
          Subribe to our newsletter to get free brand Guide
        </h2>
        <NewsletterForm />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 pb-16 text-center sm:px-6" aria-labelledby="stories-heading">
        <h2 id="stories-heading" className="text-sm text-[#6b655c]">Client Testimonial</h2>
      </section>

      <section id="faq" className="border-t border-[#ece8df] bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
          <h2 className="font-serif text-4xl">FAQ</h2>
          <div className="mt-6 divide-y divide-[#ece8df] border-y border-[#ece8df]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none font-medium">{faq.question}</summary>
                <p className="max-w-3xl pt-3 text-sm leading-6 text-[#5c5648]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
