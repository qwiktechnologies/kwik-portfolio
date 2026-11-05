import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import { AddToCart } from "@/components/add-to-cart";
import { JsonLd } from "@/components/json-ld";
import { Money, RateLine } from "@/components/money";
import { RichText } from "@/components/rich-text";
import { WorkCard } from "@/components/work-card";
import { prisma } from "@/lib/db";
import { linesOf, parseGallery, siteUrl } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.portfolioItem.findFirst({ where: { slug, published: true } });
  if (!item) return { title: "Format" };
  return {
    title: `${item.title} ${item.category.toLowerCase()}`,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: { title: item.title, description: item.summary, images: [item.coverImage] },
  };
}

export default async function WorkDetail({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = await prisma.portfolioItem.findFirst({ where: { slug, published: true } });
  if (!item) notFound();
  const related = await prisma.portfolioItem.findMany({
    where: { published: true, category: item.category, id: { not: item.id } },
    take: 3,
  });
  const gallery = parseGallery(item.gallery);
  const includes = linesOf(item.includes);
  const url = `${siteUrl()}/work/${item.slug}`;

  return (
    <article className="mx-auto w-full px-5 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: item.title,
          description: item.summary,
          image: [item.coverImage, ...gallery],
          category: item.category,
          brand: { "@type": "Brand", name: "Qwik Technologies" },
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: item.priceNgn,
            availability: "https://schema.org/InStock",
            url,
          },
        }}
      />
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/work">Catalog</Link>
        <span aria-hidden> / </span>
        <span>{item.title}</span>
      </nav>
      <div className="mt-6 grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{item.category}</p>
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl">{item.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{item.summary}</p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-night">
            <Image src={item.coverImage} alt={`${item.title}, showing the ${item.category.toLowerCase()} trade this format is built for`} fill priority className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
          <div className="mt-8">
            <RichText text={item.description} />
          </div>
          {gallery.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {gallery.map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-night">
                  <Image src={src} alt="" fill className="object-cover" sizes="40vw" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="h-fit rounded-[1.6rem] border border-line bg-card p-6 lg:sticky lg:top-24 lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Catalog price</p>
          <Money ngn={item.priceNgn} base className="mt-2 block font-serif text-5xl" />
          <RateLine className="mt-3 text-sm text-muted" />
          <p className="mt-4 text-sm">Timeline: {item.timeline}</p>
          <div className="mt-6">
            <AddToCart id={item.id} />
          </div>
          <h2 className="mt-8 font-serif text-2xl">Included</h2>
          <ul className="mt-3 space-y-2">
            {includes.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-6">
                <FiCheck className="mt-1 shrink-0 text-pine" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-5 text-muted">The photograph is the trade this format is for. Your version uses the name, words, and logo you send after payment.</p>
        </aside>
      </div>
      {related.length ? (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-serif text-4xl">More in {item.category}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((piece) => (
              <WorkCard key={piece.id} item={piece} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
