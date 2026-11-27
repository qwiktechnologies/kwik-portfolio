import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { TestimonialsSection } from "@/components/testimonials-section";
import { JsonLd } from "@/components/json-ld";
import { WorkCard } from "@/components/work-card";
import { prisma } from "@/lib/db";
import { pageCopy } from "@/lib/page-copy";
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

      <TestimonialsSection />
    </>
  );
}
