import type { MetadataRoute } from "next";
import { withDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aajoscomm.netlify.app";

  const staticRoutes = ["", "/phones", "/easybuy", "/about", "/gallery", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const products = await withDb(
    (db) =>
      db.product.findMany({
        where: { visible: true },
        select: { slug: true, updatedAt: true },
      }),
    []
  );

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/phones/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...productRoutes];
}
