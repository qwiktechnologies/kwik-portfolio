import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { catalog, journal } from "./catalog";
import { SUPER_ADMIN, defaultProfile } from "../src/lib/defaults";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: SUPER_ADMIN.email } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: SUPER_ADMIN.name,
        email: SUPER_ADMIN.email,
        passwordHash: await bcrypt.hash(SUPER_ADMIN.password, 12),
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Owner account created: ${SUPER_ADMIN.email} / ${SUPER_ADMIN.password}`);
  } else {
    console.log(`Owner account already exists: ${SUPER_ADMIN.email}`);
  }

  await prisma.siteProfile.upsert({
    where: { id: "main" },
    update: {},
    create: defaultProfile,
  });

  await prisma.stripeConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  for (const item of catalog) {
    const found = await prisma.portfolioItem.findUnique({ where: { slug: item.slug } });
    if (found) continue;
    await prisma.portfolioItem.create({
      data: {
        ...item,
        gallery: JSON.stringify(item.gallery),
      },
    });
  }

  for (const post of journal) {
    const found = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!found) {
      await prisma.blogPost.create({ data: post });
      continue;
    }
    if (found.category !== post.category) {
      await prisma.blogPost.update({ where: { id: found.id }, data: { category: post.category } });
    }
  }

  console.log("Catalog and journal are seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
