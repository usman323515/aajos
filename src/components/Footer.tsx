import Link from "next/link";
import type { Settings } from "@/lib/settings";
import { toTelNumber, buildWhatsAppLink, generalInquiryMessage } from "@/lib/whatsapp";

export default function Footer({ settings }: { settings: Settings }) {
  const whatsappLink = buildWhatsAppLink(settings.whatsapp, generalInquiryMessage(settings.ceoPublicName));

  return (
    <footer className="border-t border-line bg-bone">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg">{settings.businessName}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            {settings.addressLine1}
            <br />
            {settings.addressLine2}
            <br />
            {settings.city}, {settings.country}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-ink/50">Hours</p>
          <p className="mt-3 text-sm text-ink/70">
            Shop: {settings.openingTime} – {settings.closingTime}
          </p>
          <p className="mt-1 text-sm text-ink/70">Online orders: anytime</p>
        </div>

        <div>
          <p className="text-sm font-medium text-ink/50">Contact</p>
          <p className="mt-3 text-sm text-ink/70">
            <a href={toTelNumber(settings.phone) ? `tel:${toTelNumber(settings.phone)}` : "#"} className="hover:text-brass">
              {settings.phone}
            </a>
          </p>
          <p className="mt-1 text-sm text-ink/70">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
              WhatsApp
            </a>
            {settings.tiktokUrl && (
              <>
                {" · "}
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                  TikTok
                </a>
              </>
            )}
            {settings.facebookUrl && (
              <>
                {" · "}
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                  Facebook
                </a>
              </>
            )}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-ink/50">Explore</p>
          <ul className="mt-3 space-y-1 text-sm text-ink/70">
            <li><Link href="/" className="hover:text-brass">Home</Link></li>
            <li><Link href="/phones" className="hover:text-brass">Phones</Link></li>
            <li><Link href="/easybuy" className="hover:text-brass">EasyBuy</Link></li>
            <li><Link href="/about" className="hover:text-brass">About</Link></li>
            <li><Link href="/contact" className="hover:text-brass">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <p className="container-page text-xs text-ink/50">
          © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
