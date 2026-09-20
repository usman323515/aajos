import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { dbUnavailable } from "@/lib/api";
import { productSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getPrisma();
  if (!db) return dbUnavailable();

  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { brand: true, images: { orderBy: { position: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPrisma();
  if (!db) return dbUnavailable();

  const body = await req.json().catch(() => null);
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.product.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const product = await db.product.update({
    where: { id: params.id },
    data: parsed.data,
    include: { brand: true, images: true },
  });

  // Optional: replace image set if a fresh list of URLs is supplied.
  if (Array.isArray(body?.imageUrls)) {
    await db.productImage.deleteMany({ where: { productId: params.id } });
    await db.productImage.createMany({
      data: (body.imageUrls as string[]).map((url, index) => ({
        productId: params.id,
        url,
        position: index,
      })),
    });
  }

  const refreshed = await db.product.findUnique({
    where: { id: params.id },
    include: { brand: true, images: { orderBy: { position: "asc" } } },
  });

  return NextResponse.json({ product: refreshed ?? product });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPrisma();
  if (!db) return dbUnavailable();

  const existing = await db.product.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
