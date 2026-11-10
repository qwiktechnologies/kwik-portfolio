"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartDetails, startCheckout } from "@/lib/actions/checkout";
import { sumQuotes } from "@/lib/markets";
import { formatMoney } from "@/lib/money";
import { useCart } from "./cart-provider";
import { Money, RateLine } from "./money";
import { useCurrency } from "./currency-provider";
import { buttonClass, EmptyState, Notice } from "./ui";

type Item = { id: string; title: string; priceNgn: number; pricesJson?: string | null; quantity: number };

export function CheckoutPanel({
  email,
  paymentsOpen,
}: {
  email: string;
  paymentsOpen: boolean;
}) {
  const router = useRouter();
  const { lines, ready } = useCart();
  const { currency } = useCurrency();
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const ids = lines.map((line) => line.id).join(",");

  useEffect(() => {
    const idList = ids ? ids.split(",") : [];
    if (!idList.length) return;
    void getCartDetails(idList).then((rows) => {
      setItems(
        rows
          .map((row) => ({ ...row, quantity: lines.find((line) => line.id === row.id)?.quantity || 1 }))
          .filter((row) => row.quantity > 0),
      );
    });
  }, [ids, lines]);

  if (!ready) return <p className="text-sm text-muted">Loading checkout…</p>;
  if (!lines.length) {
    return <EmptyState title="Nothing to pay for yet." body="Add a format from the catalog, then come back to checkout." href="/work" action="Browse the catalog" />;
  }

  const shown = sumQuotes(items, currency);

  async function pay() {
    setPending(true);
    setError("");
    const result = await startCheckout(
      lines.map((line) => ({ id: line.id, quantity: line.quantity })),
      currency,
    );
    if (result.url) {
      window.location.href = result.url;
      return;
    }
    if (result.error === "Sign in before you pay.") {
      router.push("/login?next=/checkout");
      return;
    }
    setError(result.error || "Payment could not start.");
    setPending(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-line bg-card p-6">
        <h2 className="font-serif text-3xl">Your formats</h2>
        <ul className="mt-5 divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 py-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted">Qty {item.quantity}</p>
              </div>
              <Money prices={item.pricesJson} ngn={item.priceNgn} quantity={item.quantity} className="text-sm" />
            </li>
          ))}
        </ul>
      </section>
      <section className="h-fit rounded-3xl border border-line bg-card p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Pay as {email}</p>
        <RateLine className="mt-4 text-sm text-muted" />
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Total</p>
          <p className="mt-1 font-serif text-4xl">{formatMoney(shown.amount, shown.currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted">This is the price for your country. Paystack collects the Nigeria price.</p>
        </div>
        {error ? <div className="mt-4"><Notice>{error}</Notice></div> : null}
        {!paymentsOpen ? <p className="mt-4 text-sm text-muted">Payments are not open yet. The studio owner still needs to connect Paystack.</p> : null}
        <button type="button" className={`${buttonClass.solid} mt-6 w-full`} disabled={pending || !paymentsOpen || !items.length} onClick={() => void pay()}>
          {pending ? "Opening Paystack…" : "Pay now"}
        </button>
      </section>
    </div>
  );
}
