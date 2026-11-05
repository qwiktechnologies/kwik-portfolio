export const defaultProfile = {
  id: "main",
  companyName: "Qwik Technologies",
  tagline:
    "Creating templates and experiences that drives remarkable change. Reliable digital services, priced in naira and shown in your currency.",
  heroLead:
    "Creating templates and experiences that drives remarkable change. Pick a format, see the price in your currency, pay, and send your brand details.",
  email: "hello@quicktech.studio",
  phone: "+234 809 442 1180",
  address: "18 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  whatsapp: "+234 809 442 1180",
  hours: "Monday to Friday, 9:00–17:00 WAT",
  instagram: "https://instagram.com/quicktech.studio",
  aboutHeadline: "Reliable digital services.",
  aboutBody: `Qwik Technologies sells website and brand formats at a fixed price.

We design a structure once: an online store, a service site, a landing page, a company portfolio, a logo, or a flyer. That structure goes on the catalog. When you buy it, we adapt it to your name, your offer, your pictures, and the words you send us.

The number on each piece is set in Nigerian naira. Visitors see that number in their own currency, using a live exchange rate. The card payment is taken by Stripe in the currency the studio owner configures, and checkout shows that card amount before you leave this site.

You can look through the catalog without an account. Paying, keeping the receipt, and sending the project brief require one, so the order stays yours. After payment we ask for the business name, what the business does, a logo, an email, a phone number, and the social profiles the site should mention.

If nothing on the shelf fits, write to us. We would rather say so than sell you the wrong format.`,
  extraJson: JSON.stringify([
    { label: "Studio visits", value: "By appointment" },
    { label: "Response time", value: "Within one working day" },
  ]),
};

export const SUPER_ADMIN = {
  name: "QuickTech Owner",
  email: "superadmin@quicktech.studio",
  password: "QuickTech#Super1",
};
