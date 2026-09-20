import { prisma } from "@/lib/prisma";

/**
 * Fetches (and lazily creates) the single BusinessSettings row.
 * Called from server components directly — no network round trip.
 */
export async function getSettings() {
  return prisma.businessSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;
