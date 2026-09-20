import { cache } from "react";
import type { BusinessSettings, PrismaClient } from "@prisma/client";
import { requirePrisma, withDb } from "@/lib/prisma";

/**
 * Shown when the database is unavailable. Mirrors the non-financial defaults
 * in prisma/schema.prisma (keep them in sync) so the public site looks the
 * same as on a fresh install. Payment account details are deliberately left
 * empty: they should only ever be displayed from the database, never from a
 * copy that could be out of date.
 */
export const FALLBACK_SETTINGS: BusinessSettings = {
  id: "main",
  businessName: "A,A JOS COMM",
  ceoName: "Abdurrahman Muhammad Al Amin",
  ceoPublicName: "Abdul Jos",
  phone: "07036854747",
  whatsapp: "07036854747",
  addressLine1: "A,A JOS COMM Shop",
  addressLine2: "Opposite Sangami",
  city: "Pantami, Gombe",
  country: "Nigeria",
  mapUrl: null,
  openingTime: "8:00 AM",
  closingTime: "8:00 PM",
  tiktokUrl: "https://www.tiktok.com/@abduljos48?_r=1&_t=ZS-99rq6Hhgbqf",
  facebookUrl: "https://www.facebook.com/abdul.jos.37",
  shopVideoUrl: "https://youtube.com/shorts/jAYhDnpf-ms?si=_CI4i9aB3kmoX0J7",
  moniepointAccountNumber: null,
  moniepointAccountName: null,
  opayAccountNumber: null,
  opayAccountName: null,
  easyBuyDescription: null,
  updatedAt: new Date(0),
};

function upsertSettings(db: PrismaClient) {
  return db.businessSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
}

/**
 * Fetches (and lazily creates) the single BusinessSettings row, or the
 * fallback above when the database is unavailable. Called from server
 * components directly — no network round trip. Cached per request so the
 * layout and page don't each hit the database.
 */
export const getSettings = cache(
  async (): Promise<BusinessSettings> => withDb(upsertSettings, FALLBACK_SETTINGS)
);

/**
 * Strict version for the admin editor: throws instead of falling back, so
 * fallback values are never shown (and saved back) as if they were the real
 * settings.
 */
export async function getStoredSettings(): Promise<BusinessSettings> {
  return upsertSettings(requirePrisma());
}

export type Settings = BusinessSettings;
