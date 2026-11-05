import { StripeForm } from "@/components/desk-forms";
import { requireStripeAccess } from "@/lib/access";
import { getStripeConfig } from "@/lib/profile";
import { siteUrl } from "@/lib/site";

export default async function StripePage() {
  await requireStripeAccess();
  const config = await getStripeConfig();
  return (
    <div>
      <h1 className="font-serif text-5xl">Stripe</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Only the owner can open this page. Paste the publishable key, the secret key, and the webhook signing secret from Stripe. Visitors pay with these keys. The secret values are encrypted before they are stored.
      </p>
      <p className="mt-4 max-w-2xl rounded-2xl bg-card px-4 py-3 text-sm">
        Webhook endpoint: <span className="font-medium">{siteUrl()}/api/stripe/webhook</span>
        <span className="mt-1 block text-muted">Listen for checkout.session.completed.</span>
      </p>
      <div className="mt-6">
        <StripeForm
          publishableKey={config.publishableKey}
          chargeCurrency={config.chargeCurrency}
          enabled={config.enabled}
          hasSecret={Boolean(config.secretKeyEnc)}
          hasWebhook={Boolean(config.webhookSecretEnc)}
        />
      </div>
    </div>
  );
}
