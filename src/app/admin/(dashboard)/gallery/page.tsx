import { requirePrisma } from "@/lib/prisma";
import GalleryManager from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const db = requirePrisma();
  const images = await db.galleryImage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl">Gallery</h1>
      <p className="mt-1 text-sm text-ink/60">
        Upload real photos of the shop, Abdul Jos, and the business. Hidden images stay off the public site.
      </p>
      <div className="mt-8">
        <GalleryManager images={images} />
      </div>
    </div>
  );
}
