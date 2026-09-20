/**
 * Creates (or updates the password of) an admin user.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts "Full Name" "email@example.com" "a-strong-password"
 *
 * Run this locally or from Netlify's CLI (`netlify dev`) with DATABASE_URL
 * pointed at your production database. Never commit real credentials.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [name, email, password] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.error(
      'Usage: npx tsx scripts/create-admin.ts "Full Name" "email@example.com" "a-strong-password"'
    );
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { name, email, passwordHash, role: "OWNER" },
  });

  console.log(`Admin user ready: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
