import Image from "next/image";
import type { Metadata } from "next";
import { withDb } from "@/lib/prisma";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of A,A JOS COMM — the shop, the team, and the business.",
};

// Real client photographs supplied at project start, shown until the
// owner adds more from /admin/gallery.
const STARTER_IMAGES = [
  { url: "/images/shop/shop-team.jpg", caption: "At the A,A JOS COMM shop", category: "Shop" },
  { url: "/images/ceo/abdul-jos-portrait.jpg", caption: "Abdul Jos, MD/CEO", category: "Abdul Jos" },
  { url: "/images/ceo/abdul-jos-candid.jpg", caption: "Abdul Jos", category: "Abdul Jos" },
];

export default async function GalleryPage() {
  const uploaded = await withDb(
    (db) =>
      db.galleryImage.findMany({
        where: { visible: true },
        orderBy: { position: "asc" },
      }),
    []
  );

  const images =
    uploaded.length > 0
      ? uploaded.map((img) => ({ url: img.url, caption: img.caption, category: img.category }))
      : STARTER_IMAGES;

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading title="Gallery" intro="A look at A,A JOS COMM — the shop, the team, and the phones we carry." />

      <div className="mt-10 columns-2 gap-4 sm:columns-3">
        {images.map((img, i) => (
          <div key={`${img.url}-${i}`} className="mb-4 break-inside-avoid">
            <div className="relative w-full overflow-hidden bg-bone" style={{ aspectRatio: "4 / 5" }}>
              <Image src={img.url} alt={img.caption || "A,A JOS COMM"} fill sizes="33vw" className="object-cover" />
            </div>
            {img.caption && <p className="mt-2 text-xs text-ink/50">{img.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
