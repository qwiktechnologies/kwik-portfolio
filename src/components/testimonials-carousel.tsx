"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Testimonial } from "@/lib/testimonials";

const cardGap = 20;

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);

  const syncButtons = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    syncButtons();
  }, [syncButtons, items.length]);

  function scrollBy(direction: -1 | 1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const step = (card?.offsetWidth ?? 320) + cardGap;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative mt-10">
      {items.length > 1 ? (
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Previous testimonials"
            disabled={!canPrev}
            onClick={() => scrollBy(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#d4cfc4] bg-white text-[#16181d] transition hover:border-[#1d4e9e] hover:text-[#1d4e9e] disabled:opacity-35"
          >
            <FiChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            disabled={!canNext}
            onClick={() => scrollBy(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#1d4e9e] bg-[#1d4e9e] text-white transition hover:bg-[#163d7a] disabled:opacity-35"
          >
            <FiChevronRight aria-hidden />
          </button>
        </div>
      ) : null}
      <div
        ref={track}
        onScroll={syncButtons}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <figure
            key={item.name}
            data-testimonial-card
            className="flex w-[min(100%,340px)] shrink-0 snap-start flex-col rounded-2xl border border-[#e3daca] bg-white p-6 shadow-sm sm:w-[380px] sm:p-8"
          >
            <blockquote className="flex-1 text-base font-medium leading-7 text-[#16181d] sm:text-lg">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 border-t border-[#ece8df] pt-4">
              <p className="text-base font-bold text-[#1d4e9e]">{item.name}</p>
              <p className="text-sm text-[#5e584e]">{item.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}