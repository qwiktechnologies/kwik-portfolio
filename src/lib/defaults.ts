import { COMPANY_ADDRESS, COMPANY_PHONE } from "@/lib/company-contact";

export const defaultProfile = {
  id: "main",
  companyName: "Qwik Technologies",
  tagline:
    "Creating templates and experiences that drives remarkable change. Reliable digital services, priced in naira and shown in your currency.",
  heroLead:
    "Creating templates and experiences that drives remarkable change. Pick a format, see the price for your country, pay, and send your brand details.",
  heroHeadline: "We Build Digital Experiences That\nMove Businesses Forward.",
  heroSubline:
    "From exceptional websites and digital products to strategic branding and digital marketing, we help businesses build, grow and compete in the digital world.",
  email: "hello@quicktech.studio",
  phone: COMPANY_PHONE,
  address: COMPANY_ADDRESS,
  whatsapp: COMPANY_PHONE,
  hours: "Monday to Friday, 9:00–17:00 WAT",
  instagram: "https://instagram.com/quicktech.studio",
  facebook: "https://facebook.com",
  tiktok: "https://www.tiktok.com",
  twitter: "https://x.com",
  aboutHeadline: "Reliable digital services.",
  aboutBody: `Qwik Technologies sells website and brand formats at a fixed price.

We design a structure once: an online store, a service site, a landing page, a company portfolio, a logo, or a flyer. That structure goes on the catalog. When you buy it, we adapt it to your name, your offer, your pictures, and the words you send us.

Each format has a price for the countries we serve. A visitor in Nigeria sees the naira price. A visitor in Ghana, South Africa, Europe, the USA, Canada, the UK, Australia, or Dubai sees the price entered for that place. Anywhere else sees the US dollar price. Paystack collects the Nigeria price.

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
