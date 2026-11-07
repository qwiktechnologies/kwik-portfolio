"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartDetails } from "@/lib/actions/checkout";
import { formatMoney } from "@/lib/money";
import { useCart } from "./cart-provider";
import { Money } from "./money";
import { useCurrency } from "./currency-provider";
import { buttonClass, EmptyState } from "./ui";

type Item = {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  priceNgn: number;
  timeline: string;
};

export function CartView() {
  const { lines, ready, setQuantity, remove } = useCart();
  const [items, setItems] = useState<Item[]>([]);
  const ids = lines.map((line) => line.id).join(",");

  useEffect(() => {
    const idList = ids ? ids.split(",") : [];
    if (!idList.length) {
      setItems([]);
      return;
    }
    void getCartDetails(idList).then(setItems);
  }, [ids]);

  if (!ready) return <p className="text-sm text-muted">Loading the cart…</p>;
  if (!lines.length) {
    return <EmptyState title="The cart is empty." body="The catalog is a shelf of formats. Open one, read the scope, and add it when the price makes sense." href="/work" action="Browse the catalog" />;
  }

  const byId = new Map(items.map((item) => [item.id, item]));
  const total = lines.reduce((sum, line) => sum + (byId.get(line.id)?.priceNgn || 0) * line.quantity, 0);
  const missing = lines.filter((line) => items.length && !byId.get(line.id));

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
      <ul className="space-y-4">
        {lines.map((line) => {
          const item = byId.get(line.id);
          if (!item) {
            return (
              <li key={line.id} className="rounded-3xl border border-line bg-card p-5">
                <p>This format is no longer on the shelf.</p>
                <button className={`${buttonClass.small} mt-3`} onClick={() => remove(line.id)} type="button">
                  Remove
                </button>
              </li>
            );
          }
          return (
            <li key={line.id} className="grid gap-4 rounded-3xl border border-line bg-card p-4 sm:grid-cols-[120px_1fr]">
              <Link href={`/work/${item.slug}`} className="block h-32 overflow-hidden rounded-2xl bg-night sm:h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverImage} alt="" className="h-full w-full object-cover" />
              </Link>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{item.category}</p>
                <Link href={`/work/${item.slug}`} className="font-serif text-3xl">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-muted">{item.timeline}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    Qty
                    <input
                      className="field !w-16 !py-2"
                      type="number"
                      min={1}
                      max={5}
                      value={line.quantity}
                      onChange={(event) => setQuantity(line.id, Number(event.target.value))}
                    />
                  </label>
                  <Money ngn={item.priceNgn * line.quantity} className="text-sm font-medium" />
                </div>
                <button className="mt-3 text-xs text-muted underline" type="button" onClick={() => remove(line.id)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
        {missing.length ? null : null}
      </ul>
      <CartTotal totalNgn={total} />
    </div>
  );
}

function CartTotal({ totalNgn }: { totalNgn: number }) {
  return (
    <aside className="h-fit rounded-3xl border border-line bg-card p-6 lg:sticky lg:top-24">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Cart total</p>
      <Money ngn={totalNgn} base className="mt-3 block font-serif text-4xl" />
      <p className="mt-4 text-sm leading-6 text-muted">Checkout shows this total in your currency. Paystack collects the naira price.</p>
      <Link href="/checkout" className={`${buttonClass.solid} mt-6 w-full`}>
        Checkout
      </Link>
      <p className="mt-3 text-center text-xs text-muted">{formatMoney(totalNgn, "NGN")} catalog</p>
    </aside>
  );
}
