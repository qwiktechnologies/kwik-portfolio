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
    <div className="mx-auto w-[90%] py-14">
      <h1 className="font-serif text-5xl">Checkout</h1>
      <p className="mt-3 max-w-2xl text-muted">One total, the price set for your country. Paystack collects the Nigeria price.</p>
      <div className="mt-8">
        <CheckoutPanel
          email={session?.email || ""}
          paymentsOpen={Boolean(config.enabled && config.secretKeyEnc && config.publishableKey)}
        />
      </div>
    </div>
  );
}
