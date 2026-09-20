import { PrismaClient } from "@prisma/client";

/**
 * The database is optional at runtime.
 *
 * The Prisma client is created lazily and only when DATABASE_URL is set, so
 * the app can build, start and serve its public pages without a database.
 *
 * - `withDb()`     — reads that have a sensible fallback (public pages).
 * - `getPrisma()`  — returns null when there is no database, for callers
 *                    that want to respond themselves (API routes).
 * - `requirePrisma()` — for code that is only reachable with a database.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbWarningShown?: boolean;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPrisma(): PrismaClient | null {
  if (!isDatabaseConfigured()) {
    if (!globalForPrisma.dbWarningShown) {
      globalForPrisma.dbWarningShown = true;
      console.warn("[db] DATABASE_URL is not set. Database-backed features are disabled.");
    }
    return null;
  }

  // Cached on globalThis so hot reloads and duplicated bundles reuse one
  // client instead of exhausting database connections.
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

export function requirePrisma(): PrismaClient {
  const db = getPrisma();
  if (!db) throw new Error("DATABASE_URL is not set.");
  return db;
}

/**
 * Runs a database read and returns `fallback` if there is no database or the
 * query fails, so a database problem never takes a public page down.
 */
export async function withDb<T>(query: (db: PrismaClient) => Promise<T>, fallback: T): Promise<T> {
  const db = getPrisma();
  if (!db) return fallback;

  try {
    return await query(db);
  } catch (err) {
    console.error("[db] Query failed, using fallback:", err instanceof Error ? err.message : err);
    return fallback;
  }
}
