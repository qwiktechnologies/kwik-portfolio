import Image from "next/image";
import Link from "next/link";
import { Money } from "./money";

export function WorkCard({
  item,
}: {
  item: { slug: string; title: string; category: string; summary: string; coverImage: string; priceNgn: number };
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-[#ece8df] bg-white">
      <Link href={`/work/${item.slug}`} className="relative block aspect-[16/10] bg-[#10243a]">
        <Image
          src={item.coverImage}
          alt={`${item.title}, a ${item.category.toLowerCase()} format`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col px-4 py-4">
        <p className="text-xs text-[#6b655c]">{item.category}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug">
          <Link href={`/work/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5c5648]">{item.summary}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Money ngn={item.priceNgn} className="text-sm font-semibold text-[#1d4e9e]" />
          <Link href={`/work/${item.slug}`} className="rounded-md bg-[#f15a22] px-3 py-2 text-xs font-medium text-white hover:bg-[#d94e1c]">
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}
