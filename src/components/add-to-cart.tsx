"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useCart } from "./cart-provider";
import { buttonClass } from "./ui";

export function AddToCart({ id }: { id: string }) {
  const { add, lines } = useCart();
  const [note, setNote] = useState("");
  const inCart = lines.some((line) => line.id === id);

  return (
    <div className="space-y-3">
      <button
        type="button"
        className={`${buttonClass.orange} w-full rounded-md`}
        onClick={() => {
          add(id);
          setNote("Added to the cart.");
        }}
      >
        {inCart ? "Add another" : "Add to cart"}
        <FiArrowRight />
      </button>
      {note ? (
        <p className="text-sm text-pine">
          {note}{" "}
          <Link href="/cart" className="underline underline-offset-4">
            View cart
          </Link>
        </p>
      ) : null}
    </div>
  );
}
