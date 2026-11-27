"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";

export function TestimonialStarRating({ name = "rating" }: { name?: string }) {
  const [value, setValue] = useState(5);
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-[#16181d]">Rating</span>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onClick={() => setValue(star)}
            className="rounded p-0.5 text-2xl text-[#f5b301] transition hover:scale-105"
          >
            <FaStar className={star <= value ? "opacity-100" : "opacity-35"} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}