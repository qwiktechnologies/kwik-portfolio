import { prisma } from "./db";
import { defaultProfile } from "./defaults";

export async function getProfile() {
  return prisma.siteProfile.upsert({
    where: { id: "main" },
    update: {},
    create: defaultProfile,
  });
}

export async function getStripeConfig() {
  return prisma.stripeConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}
