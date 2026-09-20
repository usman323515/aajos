import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const image = await prisma.galleryImage.update({
    where: { id: params.id },
    data: {
      caption: body?.caption ?? undefined,
      category: body?.category ?? undefined,
      visible: typeof body?.visible === "boolean" ? body.visible : undefined,
      position: typeof body?.position === "number" ? body.position : undefined,
    },
  });

  return NextResponse.json({ image });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.galleryImage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
