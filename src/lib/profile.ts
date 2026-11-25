import { COMPANY_ADDRESS, COMPANY_PHONE } from "./company-contact";
import { prisma } from "./db";
import { defaultProfile } from "./defaults";

export async function getProfile() {
  const profile = await prisma.siteProfile.upsert({
    where: { id: "main" },
    update: {},
    create: defaultProfile,
  });
  const staleAddress = profile.address.includes("Lekki") || profile.address.includes("Admiralty");
  const stalePhone = profile.phone.includes("809 442") || profile.phone.startsWith("079");
  return {
    ...profile,
    address: staleAddress ? COMPANY_ADDRESS : profile.address,
    phone: stalePhone ? COMPANY_PHONE : profile.phone,
    whatsapp: stalePhone ? COMPANY_PHONE : profile.whatsapp,
    heroHeadline: profile.heroHeadline?.includes("Your Digital Partner")
      ? defaultProfile.heroHeadline
      : profile.heroHeadline,
    heroSubline:
      profile.heroSubline === "Think. Design. Develop. Thrive" ? defaultProfile.heroSubline : profile.heroSubline,
  };
}

export async function getStripeConfig() {
  return prisma.stripeConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}
