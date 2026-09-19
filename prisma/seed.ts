/**
 * Seeds the database with the brand list and a default BusinessSettings
 * row. Deliberately does NOT create any sample products — every phone
 * in the catalogue must be added by the shop owner from /admin so that
 * nothing invented ever appears on the live site.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BRANDS = [
  "Samsung",
  "Tecno",
  "Infinix",
  "Redmi",
  "Xiaomi",
  "OPPO",
  "vivo",
  "HONOR",
  "itel",
  "Motorola",
  "Google Pixel",
  "OnePlus",
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  for (const name of BRANDS) {
    await prisma.brand.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }
  console.log(`Seeded ${BRANDS.length} brands.`);

  await prisma.businessSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  console.log("Ensured BusinessSettings row exists.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
