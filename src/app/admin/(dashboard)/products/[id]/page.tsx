import { notFound } from "next/navigation";
import { requirePrisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const db = requirePrisma();
  const [product, brands] = await Promise.all([
    db.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Edit product</h1>
      <ProductForm brands={brands} product={product} />
    </div>
  );
}
