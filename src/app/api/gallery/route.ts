import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { dbUnavailable } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getPrisma();
  if (!db) return dbUnavailable({ images: [] });

  const images = await db.galleryImage.findMany({
    where: { visible: true },
    orderBy: { position: "asc" },
  });
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPrisma();
  if (!db) return dbUnavailable();

  const body = await req.json().catch(() => null);
  if (!body?.url) {
    return NextResponse.json({ error: "An image URL is required." }, { status: 400 });
  }

  const image = await db.galleryImage.create({
    data: {
      url: body.url,
      caption: body.caption || null,
      category: body.category || null,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}
