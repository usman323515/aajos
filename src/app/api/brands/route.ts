import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/api";

// Always query at request time (a GET handler with no request usage would otherwise be cached at build).
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getPrisma();
  if (!db) return dbUnavailable({ brands: [] });

  const brands = await db.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ brands });
}
