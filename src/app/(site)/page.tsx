import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import CopyButton from "@/components/CopyButton";
import VideoEmbed from "@/components/VideoEmbed";
import {
  buildWhatsAppLink,
  easyBuyInquiryMessage,
  generalInquiryMessage,
  toTelNumber,
} from "@/lib/whatsapp";

export default async function HomePage() {
  const settings = await getSettings();
  const [featured, brands] = await Promise.all([
    prisma.product.findMany({
      where: { visible: true, featured: true },
      include: { brand: true, images: { orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const whatsappGeneral = buildWhatsAppLink(settings.whatsapp, generalInquiryMessage(settings.ceoPublicName));
  const whatsappEasyBuy = buildWhatsAppLink(settings.whatsapp, easyBuyInquiryMessage(settings.ceoPublicName));
  const telLink = `tel:${toTelNumber(settings.phone)}`;
  const directionsHref =
    settings.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${settings.addressLine1}, ${settings.addressLine2}, ${settings.city}`
    )}`;

  return (
    <>
      {/* 1 — HERO */}
      <section className="border-b border-lineDark bg-ink text-paper">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-brass">
              {settings.ceoPublicName} · MD / CEO, {settings.businessName}
            </p>
            <h1 className="mt-5 max-w-lg font-display text-4xl leading-[1.1] sm:text-5xl">
              Mobile technology. Trusted service.
            </h1>
            <p className="mt-6 max-w-md text-paper/75">
              Genuine smartphones and power banks from {settings.businessName}, in {settings.city}.
              Visit the shop or reach us on WhatsApp any time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/phones"
                className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
              >
                Explore phones
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-paper/40 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-paper"
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm md:max-w-none">
            <Image
              src="/images/ceo/abdul-jos-portrait.jpg"
              alt={`${settings.ceoPublicName}, MD/CEO of ${settings.businessName}`}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2 — BUSINESS INTRODUCTION */}
      <section className="border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page">
          <SectionHeading
            title="A business built around trust"
            intro={`${settings.businessName} is a mobile phone and technology retail business based in ${settings.city}, ${settings.country}, led by ${settings.ceoPublicName}. We sell genuine smartphones and power banks, with the option to pay gradually through EasyBuy, and we're reachable on WhatsApp at any hour of the day.`}
          />
        </div>
      </section>

      {/* 3 — PHONE SHOWROOM (brand strip + link to full catalogue) */}
      <section className="border-b border-line bg-bone py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              title="Explore our phones"
              intro="Browse by brand, check availability, and get the current price directly on WhatsApp."
            />
            <Link
              href="/phones"
              className="whitespace-nowrap rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              View full catalogue
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/phones?brand=${brand.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink/80 transition-colors hover:border-brass hover:text-brass"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — FEATURED / LATEST PHONES */}
      {featured.length > 0 && (
        <section className="border-b border-line bg-paper py-16 md:py-24">
          <div className="container-page">
            <SectionHeading title="Latest arrivals" intro="Hand-picked by the shop — updated as new stock comes in." />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsapp={settings.whatsapp}
                  businessPublicName={settings.ceoPublicName}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5 — EASYBUY */}
      <section className="border-b border-lineDark bg-ink py-16 text-paper md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl">Get your phone with EasyBuy</h2>
            <p className="mt-5 max-w-md text-paper/75">
              {settings.easyBuyDescription ||
                "Collect your phone and pay small small. Choose your preferred phone, complete the required EasyBuy process, collect your device, and pay gradually according to the applicable EasyBuy arrangement."}
            </p>
            <a
              href={whatsappEasyBuy}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Ask about EasyBuy
            </a>
          </div>
          <ol className="space-y-4 border-l border-lineDark pl-6">
            {[
              "Choose your preferred phone from the catalogue.",
              "Message us on WhatsApp to start the EasyBuy process.",
              "Complete the requirements shared with you by the shop.",
              "Collect your device and pay gradually as arranged.",
            ].map((step, i) => (
              <li key={step} className="relative text-sm text-paper/80">
                <span className="absolute -left-[29px] top-0 font-display text-xs text-brass">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — ABOUT ABDUL JOS */}
      <section className="border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-center">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm">
            <Image
              src="/images/ceo/abdul-jos-candid.jpg"
              alt={settings.ceoPublicName}
              fill
              sizes="(min-width: 768px) 30vw, 80vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50">About</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{settings.ceoPublicName}</h2>
            <p className="mt-2 text-sm text-ink/60">{settings.ceoName} · MD / CEO, {settings.businessName}</p>
            <p className="mt-6 max-w-xl text-ink/70">
              {settings.ceoPublicName} leads {settings.businessName} in {settings.city}, overseeing the
              shop's day-to-day sales, customer service, and the EasyBuy arrangement offered to customers.
            </p>
          </div>
        </div>
      </section>

      {/* SHOP VIDEO */}
      {settings.shopVideoUrl && (
        <section className="border-b border-line bg-bone py-16 md:py-24">
          <div className="container-page">
            <SectionHeading title="Inside the shop" align="center" />
            <div className="mt-10">
              <VideoEmbed url={settings.shopVideoUrl} title={`${settings.businessName} shop video`} />
            </div>
          </div>
        </section>
      )}

      {/* 7 — WHY A,A JOS COMM */}
      <section className="border-b border-line bg-paper py-16 md:py-24">
        <div className="container-page">
          <SectionHeading title="Why A,A JOS COMM" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Genuine devices", body: "Smartphones and power banks sold as described, with clear availability." },
              { title: "Direct WhatsApp support", body: "Ask about any phone or EasyBuy and get a direct reply from the shop." },
              { title: "EasyBuy available", body: "Selected phones can be collected and paid for gradually." },
              { title: "Physical store", body: `Visit us in person at ${settings.city}, ${settings.addressLine2}.` },
              { title: "Online, anytime", body: "The shop keeps its hours, but WhatsApp inquiries are open around the clock." },
              { title: "Personal service", body: `Speak directly with ${settings.ceoPublicName} and the team.` },
            ].map((item) => (
              <div key={item.title} className="border-t border-line pt-4">
                <p className="font-display text-lg">{item.title}</p>
                <p className="mt-2 text-sm text-ink/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10 — LOCATION + HOURS */}
      <section className="border-b border-lineDark bg-ink py-16 text-paper md:py-24">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-paper/50">Location</p>
            <h2 className="mt-2 text-3xl">{settings.businessName}</h2>
            <p className="mt-4 text-paper/75">
              {settings.addressLine1}
              <br />
              {settings.addressLine2}
              <br />
              {settings.city}, {settings.country}
            </p>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-paper/40 px-6 py-3 text-sm font-medium transition-colors hover:border-paper"
            >
              Get directions
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-paper/50">Shop hours</p>
            <p className="mt-2 text-2xl font-display">
              {settings.openingTime} – {settings.closingTime}
            </p>
            <p className="mt-6 text-xs uppercase tracking-wide text-paper/50">Online orders &amp; WhatsApp inquiries</p>
            <p className="mt-2 text-2xl font-display text-brass">Available anytime</p>
          </div>
        </div>
      </section>

      {/* 13 — OFFICIAL PAYMENT ACCOUNTS */}
      {(settings.moniepointAccountNumber || settings.opayAccountNumber) && (
        <section className="border-b border-line bg-paper py-16 md:py-24">
          <div className="container-page">
            <SectionHeading
              title="Official payment accounts"
              intro="Please confirm payment details before making any transfer."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:max-w-2xl">
              {settings.moniepointAccountNumber && (
                <div className="border border-line bg-white p-6">
                  <p className="text-xs uppercase tracking-wide text-ink/50">Moniepoint</p>
                  <p className="mt-2 font-display text-lg">{settings.moniepointAccountName}</p>
                  <p className="mt-1 text-2xl tracking-wide">{settings.moniepointAccountNumber}</p>
                  <div className="mt-4">
                    <CopyButton value={settings.moniepointAccountNumber} label="Copy account number" />
                  </div>
                </div>
              )}
              {settings.opayAccountNumber && (
                <div className="border border-line bg-white p-6">
                  <p className="text-xs uppercase tracking-wide text-ink/50">OPay</p>
                  <p className="mt-2 font-display text-lg">{settings.opayAccountName}</p>
                  <p className="mt-1 text-2xl tracking-wide">{settings.opayAccountNumber}</p>
                  <div className="mt-4">
                    <CopyButton value={settings.opayAccountNumber} label="Copy account number" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 12 — CONTACT */}
      <section className="bg-bone py-16 md:py-24">
        <div className="container-page">
          <SectionHeading title="Let's talk" />
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={telLink}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              Call now
            </a>
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
