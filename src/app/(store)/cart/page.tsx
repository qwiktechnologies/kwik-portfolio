import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-serif text-5xl">Cart</h1>
      <p className="mt-3 max-w-xl text-muted">Review the formats, then checkout. Prices follow the currency in the header. The card charge is confirmed on the next step.</p>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
