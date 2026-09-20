import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    where: { visible: true },
    orderBy: { position: "asc" },
  });
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.url) {
    return NextResponse.json({ error: "An image URL is required." }, { status: 400 });
  }

  const image = await prisma.galleryImage.create({
    data: {
      url: body.url,
      caption: body.caption || null,
      category: body.category || null,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}
