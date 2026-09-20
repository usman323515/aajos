import { Suspense } from "react";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import SectionHeading from "@/components/SectionHeading";
import ProductBrowser from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "Phones",
  description: "Browse smartphones and power banks from A,A JOS COMM. Search by brand and model, check availability, and get the current price on WhatsApp.",
};

export default async function PhonesPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading
        title="Explore our phones"
        intro="Prices aren't listed publicly — tap Get current price on any phone to ask on WhatsApp."
      />
      <div className="mt-10">
        <Suspense fallback={<p className="text-sm text-ink/50">Loading…</p>}>
          <ProductBrowser whatsapp={settings.whatsapp} businessPublicName={settings.ceoPublicName} />
        </Suspense>
      </div>
    </div>
  );
}
