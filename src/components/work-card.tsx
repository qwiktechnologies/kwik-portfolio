import Image from "next/image";
import Link from "next/link";
import { Money } from "./money";

export function WorkCard({
  item,
}: {
  item: { slug: string; title: string; category: string; summary: string; coverImage: string; priceNgn: number };
}) {
  return (
    <article className="group">
      <Link href={`/work/${item.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[1.4rem] bg-night sm:aspect-[4/5]">
          <Image
            src={item.coverImage}
            alt={`${item.title}, a ${item.category.toLowerCase()} format`}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted">{item.category}</p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl leading-tight sm:text-3xl">{item.title}</h3>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.summary}</p>
        <Money ngn={item.priceNgn} className="mt-3 block text-sm font-medium" />
      </Link>
    </article>
  );
}
