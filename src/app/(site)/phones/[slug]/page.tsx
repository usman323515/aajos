import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppLink, easyBuyInquiryMessage, priceInquiryMessage } from "@/lib/whatsapp";

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, visible: true },
    include: { brand: true, images: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Phone not found" };
  const label = `${product.brand.name} ${product.model}`;
  return {
    title: label,
    description: product.shortDesc,
    alternates: { canonical: `/phones/${product.slug}` },
    openGraph: {
      title: label,
      description: product.shortDesc,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, settings] = await Promise.all([getProduct(params.slug), getSettings()]);
  if (!product) notFound();

  const label = `${product.brand.name} ${product.model}`;
  const priceLink = buildWhatsAppLink(settings.whatsapp, priceInquiryMessage(settings.ceoPublicName, label));
  const easyBuyLink = buildWhatsAppLink(settings.whatsapp, easyBuyInquiryMessage(settings.ceoPublicName, label));
  const specLines = (product.specs || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="container-page py-10 md:py-16">
      <Link href="/phones" className="text-sm text-ink/50 hover:text-brass">
        ← Back to phones
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden bg-bone">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || label}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink/40">Image coming soon</div>
            )}
            {!product.available && (
              <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs text-paper">
                Out of stock
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-bone">
                  <Image src={img.url} alt={img.alt || label} fill sizes="20vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">{product.brand.name}</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">{product.model}</h1>
          <p className="mt-3 text-ink/70">{product.shortDesc}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${product.available ? "bg-signal" : "bg-ink/30"}`} />
            {product.available ? "In stock" : "Out of stock"}
          </div>

          {(product.ram || product.storage || product.color) && (
            <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-line py-4 text-sm">
              {product.ram && (
                <div>
                  <dt className="text-ink/50">RAM</dt>
                  <dd className="mt-1">{product.ram}</dd>
                </div>
              )}
              {product.storage && (
                <div>
                  <dt className="text-ink/50">Storage</dt>
                  <dd className="mt-1">{product.storage}</dd>
                </div>
              )}
              {product.color && (
                <div>
                  <dt className="text-ink/50">Color</dt>
                  <dd className="mt-1">{product.color}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-6 space-y-2 text-sm leading-relaxed text-ink/70">
            {product.fullDesc.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {specLines.length > 0 && (
            <ul className="mt-6 space-y-1.5 text-sm text-ink/70">
              {specLines.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-brass">—</span>
                  {line}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={priceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              Get current price
            </a>
            {product.easyBuy && (
              <a
                href={easyBuyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full border border-brass px-6 py-3 text-center text-sm font-medium text-brass transition-colors hover:bg-brass hover:text-ink"
              >
                Ask about EasyBuy
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
