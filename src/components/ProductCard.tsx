import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink, easyBuyInquiryMessage, priceInquiryMessage } from "@/lib/whatsapp";

type ProductCardProduct = {
  slug: string;
  model: string;
  shortDesc: string;
  available: boolean;
  easyBuy: boolean;
  brand: { name: string };
  images: { url: string; alt: string | null }[];
};

export default function ProductCard({
  product,
  whatsapp,
  businessPublicName,
}: {
  product: ProductCardProduct;
  whatsapp: string;
  businessPublicName: string;
}) {
  const label = `${product.brand.name} ${product.model}`;
  const priceLink = buildWhatsAppLink(whatsapp, priceInquiryMessage(businessPublicName, label));
  const easyBuyLink = buildWhatsAppLink(whatsapp, easyBuyInquiryMessage(businessPublicName, label));
  const image = product.images[0];

  return (
    <div className="group flex flex-col border border-line bg-white">
      <Link href={`/phones/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-bone">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || label}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/40">Image coming soon</div>
        )}
        {!product.available && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs text-paper">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">{product.brand.name}</p>
          <Link href={`/phones/${product.slug}`} className="mt-0.5 block font-display text-lg leading-snug hover:text-brass">
            {product.model}
          </Link>
          <p className="mt-1 text-sm text-ink/60">{product.shortDesc}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <a
            href={priceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-ink px-4 py-2 text-center text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Get current price
          </a>
          {product.easyBuy && (
            <a
              href={easyBuyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-brass px-4 py-2 text-center text-sm font-medium text-brass transition-colors hover:bg-brass hover:text-ink"
            >
              Ask about EasyBuy
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
