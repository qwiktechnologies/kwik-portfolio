import type { Metadata } from "next";
import { CheckoutPanel } from "@/components/checkout-panel";
import { getSession } from "@/lib/auth";
import { getStripeConfig } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [session, config] = await Promise.all([getSession(), getStripeConfig()]);
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6">
      <h1 className="font-serif text-5xl">Checkout</h1>
      <p className="mt-3 max-w-2xl text-muted">One total, in the currency you have selected. Paystack collects the naira catalog price.</p>
      <div className="mt-8">
        <CheckoutPanel
          email={session?.email || ""}
          paymentsOpen={Boolean(config.enabled && config.secretKeyEnc && config.publishableKey)}
        />
      </div>
    </div>
  );
}
