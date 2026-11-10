import { ContactSettingsForm } from "@/components/desk-forms";
import { requireContactAccess } from "@/lib/access";
import { getProfile } from "@/lib/profile";
import { parseExtra } from "@/lib/site";

export default async function ContactSettingsPage() {
  await requireContactAccess();
  const profile = await getProfile();
  return (
    <div>
      <h1 className="font-serif text-5xl">Page settings</h1>
      <p className="mt-2 mb-6 max-w-xl text-sm text-muted">These fields are the homepage headline, the Who We Are copy, the contact details, and the social links.</p>
      <ContactSettingsForm
        extra={parseExtra(profile.extraJson)}
        profile={{
          companyName: profile.companyName,
          tagline: profile.tagline,
          heroLead: profile.heroLead,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          whatsapp: profile.whatsapp,
          hours: profile.hours,
          instagram: profile.instagram,
          facebook: profile.facebook,
          tiktok: profile.tiktok,
          twitter: profile.twitter,
          heroHeadline: profile.heroHeadline,
          heroSubline: profile.heroSubline,
          aboutHeadline: profile.aboutHeadline,
          aboutBody: profile.aboutBody,
        }}
      />
    </div>
  );
}
