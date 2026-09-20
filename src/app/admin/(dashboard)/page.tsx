import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [total, available, featured, easyBuy, hidden, galleryCount] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { available: true } }),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.count({ where: { easyBuy: true } }),
    prisma.product.count({ where: { visible: false } }),
    prisma.galleryImage.count(),
  ]);

  const stats = [
    { label: "Total products", value: total },
    { label: "In stock", value: available },
    { label: "Featured", value: featured },
    { label: "EasyBuy enabled", value: easyBuy },
    { label: "Hidden from site", value: hidden },
    { label: "Gallery images", value: galleryCount },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl">Overview</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line bg-white p-4">
            <p className="text-2xl font-display">{stat.value}</p>
            <p className="mt-1 text-xs text-ink/50">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90"
        >
          Add a new phone
        </Link>
        <Link
          href="/admin/products"
          className="rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
        >
          Manage products
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-full border border-line px-5 py-2.5 text-sm text-ink/70 hover:border-brass hover:text-brass"
        >
          Business settings
        </Link>
      </div>
    </div>
  );
}
