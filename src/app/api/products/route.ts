import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { buildProductSlug } from "@/lib/slug";
import type { Prisma, ProductCategory } from "@prisma/client";

// GET /api/products?search=&brand=&category=&availability=&easyBuy=
// Public endpoint backing the phone showroom, search box, and filters.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const availability = searchParams.get("availability"); // "available" | "out"
  const easyBuy = searchParams.get("easyBuy"); // "true"
  const featured = searchParams.get("featured"); // "true"

  const where: Prisma.ProductWhereInput = { visible: true };

  if (brand) where.brand = { slug: brand };
  if (category) where.category = category as ProductCategory;
  if (availability === "available") where.available = true;
  if (availability === "out") where.available = false;
  if (easyBuy === "true") where.easyBuy = true;
  if (featured === "true") where.featured = true;

  if (search) {
    where.OR = [
      { model: { contains: search, mode: "insensitive" } },
      { shortDesc: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { brand: true, images: { orderBy: { position: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ products });
}

// POST /api/products — admin only. Creates a product with a generated slug.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const brand = await prisma.brand.findUnique({ where: { id: parsed.data.brandId } });
  if (!brand) {
    return NextResponse.json({ error: "Selected brand does not exist." }, { status: 400 });
  }

  const baseSlug = buildProductSlug(brand.name, parsed.data.model);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const imageUrls: string[] = Array.isArray(body?.imageUrls) ? body.imageUrls : [];

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug,
      images: {
        create: imageUrls.map((url, index) => ({ url, position: index })),
      },
    },
    include: { brand: true, images: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
