import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductRowActions from "@/components/admin/ProductRowActions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 border border-dashed border-line p-10 text-center">
          <p className="font-display text-lg">No products yet</p>
          <p className="mt-2 text-sm text-ink/60">Add your first phone to start populating the showroom.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-4 border border-line bg-white p-4 sm:flex-row sm:items-center">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-bone">
                {product.images[0] && (
                  <Image src={product.images[0].url} alt={product.model} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="min-w-[160px] flex-shrink-0">
                <p className="text-xs uppercase tracking-wide text-ink/50">{product.brand.name}</p>
                <p className="font-display">{product.model}</p>
              </div>
              <div className="flex-1">
                <ProductRowActions product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
