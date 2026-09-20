import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import SectionHeading from "@/components/SectionHeading";
import { buildWhatsAppLink, generalInquiryMessage, toTelNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact A,A JOS COMM — call, WhatsApp, or visit the shop in Pantami, Gombe, Nigeria.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsappLink = buildWhatsAppLink(settings.whatsapp, generalInquiryMessage(settings.ceoPublicName));
  const telLink = `tel:${toTelNumber(settings.phone)}`;
  const directionsHref =
    settings.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${settings.addressLine1}, ${settings.addressLine2}, ${settings.city}`
    )}`;

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading title="Let's talk" />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex flex-wrap gap-4">
            <a
              href={telLink}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              Call now
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
          </div>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="text-ink/50">Phone</dt>
              <dd className="mt-1 text-lg">{settings.phone}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Shop hours</dt>
              <dd className="mt-1 text-lg">{settings.openingTime} – {settings.closingTime}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Online orders &amp; WhatsApp</dt>
              <dd className="mt-1 text-lg text-brass">Available anytime</dd>
            </div>
            <div>
              <dt className="text-ink/50">Follow</dt>
              <dd className="mt-1 space-x-3 text-lg">
                {settings.tiktokUrl && (
                  <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                    TikTok
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                    Facebook
                  </a>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="text-ink/50">Location</p>
          <p className="mt-2 text-lg">
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
            className="mt-6 inline-flex rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
