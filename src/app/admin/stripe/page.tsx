import { StripeForm } from "@/components/desk-forms";
import { requireStripeAccess } from "@/lib/access";
import { getStripeConfig } from "@/lib/profile";
import { siteUrl } from "@/lib/site";

export default async function StripePage() {
  await requireStripeAccess();
  const config = await getStripeConfig();
  return (
    <div>
      <h1 className="font-serif text-5xl">Paystack</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Only the owner can open this page. Paste the public key and the secret key from Paystack. Visitors pay with these keys. The secret key is encrypted before it is stored, and payments are started on the server.
      </p>
      <p className="mt-4 max-w-2xl rounded-2xl bg-card px-4 py-3 text-sm">
        Webhook endpoint: <span className="font-medium">{siteUrl()}/api/paystack/webhook</span>
        <span className="mt-1 block text-muted">Paystack signs each event with your secret key. Listen for charge.success.</span>
      </p>
      <div className="mt-6">
        <StripeForm
          publishableKey={config.publishableKey}
          enabled={config.enabled}
          hasSecret={Boolean(config.secretKeyEnc)}
        />
      </div>
    </div>
  );
}
