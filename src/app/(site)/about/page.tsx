import Image from "next/image";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: "About Abdul Jos and A,A JOS COMM, a mobile phone and technology retail business in Pantami, Gombe, Nigeria.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading title={`About ${settings.ceoPublicName}`} />

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm">
          <Image
            src="/images/ceo/abdul-jos-portrait.jpg"
            alt={settings.ceoPublicName}
            fill
            sizes="(min-width: 768px) 30vw, 80vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-display text-2xl">{settings.ceoPublicName}</p>
          <p className="mt-1 text-sm text-ink/60">
            {settings.ceoName} · MD / CEO, {settings.businessName}
          </p>
          <p className="mt-6 max-w-xl text-ink/70">
            {settings.ceoPublicName} leads {settings.businessName}, a mobile phone and technology retail
            business based in {settings.city}, {settings.country}. The shop sells smartphones and power
            banks and offers EasyBuy on selected devices.
          </p>
          <p className="mt-4 max-w-xl text-ink/70">
            Customers can visit the shop in person during opening hours, or reach the business on WhatsApp
            at any time to ask about a phone or EasyBuy.
          </p>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <SectionHeading title="Why A,A JOS COMM" />
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
