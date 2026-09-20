import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import SectionHeading from "@/components/SectionHeading";
import { buildWhatsAppLink, easyBuyInquiryMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "EasyBuy",
  description: "Get your phone with EasyBuy from A,A JOS COMM — collect your phone and pay small small.",
};

export default async function EasyBuyPage() {
  const settings = await getSettings();
  const whatsappLink = buildWhatsAppLink(settings.whatsapp, easyBuyInquiryMessage(settings.ceoPublicName));

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading title="Get your phone with EasyBuy" />
      <p className="mt-6 max-w-xl text-lg text-ink/70">
        {settings.easyBuyDescription ||
          "Collect your phone and pay small small. Choose your preferred phone, complete the required EasyBuy process, collect your device, and pay gradually according to the applicable EasyBuy arrangement."}
      </p>

      <ol className="mt-10 max-w-xl space-y-5 border-l border-line pl-6">
        {[
          "Choose your preferred phone from the catalogue.",
          "Message us on WhatsApp to start the EasyBuy process.",
          "Complete the requirements shared with you by the shop.",
          "Collect your device and pay gradually as arranged.",
        ].map((step, i) => (
          <li key={step} className="relative text-ink/70">
            <span className="absolute -left-[29px] top-0 font-display text-sm text-brass">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
      >
        Ask about EasyBuy
      </a>

      <p className="mt-6 max-w-xl text-xs text-ink/40">
        Deposit amount, repayment duration, and eligibility are confirmed directly with the shop on WhatsApp.
      </p>
    </div>
  );
}
