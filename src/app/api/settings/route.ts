import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { dbUnavailable } from "@/lib/api";
import { settingsSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getPrisma();
  if (!db) return dbUnavailable();

  const settings = await db.businessSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPrisma();
  if (!db) return dbUnavailable();

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await db.businessSettings.update({
    where: { id: "main" },
    data: parsed.data,
  });

  return NextResponse.json({ settings });
}
