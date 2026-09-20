import type { Settings } from "@/lib/settings";
import { buildWhatsAppLink, generalInquiryMessage, toTelNumber } from "@/lib/whatsapp";

export default function MobileActionBar({ settings }: { settings: Settings }) {
  const whatsappLink = buildWhatsAppLink(settings.whatsapp, generalInquiryMessage(settings.ceoPublicName));
  const telLink = `tel:${toTelNumber(settings.phone)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-lineDark bg-ink md:hidden">
      <a
        href={telLink}
        className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-paper"
      >
        Call
      </a>
      <div className="w-px bg-lineDark" />
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 bg-brass py-3 text-sm font-medium text-ink"
      >
        WhatsApp
      </a>
    </div>
  );
}
