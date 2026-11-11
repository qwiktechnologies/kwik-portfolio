"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { WorkCard } from "./work-card";

export type FeaturedItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  coverImage: string;
  priceNgn: number;
  pricesJson?: string | null;
};

const gap = 16;

function cardsAcross(width: number) {
  if (width >= 1100) return 4.5;
  if (width >= 720) return 2.5;
  return 1.5;
}

export function FeaturedSlider({ items }: { items: FeaturedItem[] }) {
  const frame = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => {
      const count = cardsAcross(el.clientWidth);
      const gaps = Math.floor(count);
      setFrameWidth(el.clientWidth);
      setCardWidth((el.clientWidth - gaps * gap) / count);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const step = cardWidth + gap;
  const trackWidth = items.length * cardWidth + Math.max(0, items.length - 1) * gap;
  const maxOffset = Math.max(0, trackWidth - frameWidth);
  const maxIndex = step > 0 ? Math.ceil(maxOffset / step) : 0;
  const position = Math.min(index, maxIndex);
  const offset = position >= maxIndex ? maxOffset : position * step;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 id="featured-heading" className="font-serif text-4xl text-[#f15a22]">Featured website templates</h2>
        {maxIndex > 0 ? (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous templates"
              disabled={position === 0}
              onClick={() => setIndex((value) => Math.max(0, Math.min(value, position) - 1))}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#1d4e9e] text-white transition hover:border-[#f15a22] hover:text-[#f15a22] disabled:opacity-30"
            >
              <FiChevronLeft aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next templates"
              disabled={position >= maxIndex}
              onClick={() => setIndex((value) => Math.min(maxIndex, Math.min(value, position) + 1))}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f15a22] text-[#0c1220] transition hover:bg-[#ff7a45] disabled:opacity-30"
            >
              <FiChevronRight aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
      <div ref={frame} className="mt-8 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ gap, transform: cardWidth ? `translateX(-${offset}px)` : undefined }}
        >
          {items.map((item) => (
            <div key={item.id} className="shrink-0" style={{ width: cardWidth || "100%" }}>
              <WorkCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
