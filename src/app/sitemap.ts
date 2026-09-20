import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aajoscomm.netlify.app";

  const staticRoutes = ["", "/phones", "/easybuy", "/about", "/gallery", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const products = await prisma.product.findMany({
    where: { visible: true },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/phones/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...productRoutes];
}
