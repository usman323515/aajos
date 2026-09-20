"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Settings } from "@/lib/settings";
import { buildWhatsAppLink, generalInquiryMessage } from "@/lib/whatsapp";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/phones", label: "Phones" },
  { href: "/easybuy", label: "EasyBuy" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const whatsappLink = buildWhatsAppLink(settings.whatsapp, generalInquiryMessage(settings.ceoPublicName));

  return (
    <header className="sticky top-0 z-50 border-b border-lineDark bg-ink text-paper">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative block h-9 w-9 overflow-hidden rounded-full bg-paper">
            <Image
              src="/images/logo/aajoscomm-logo.jpg"
              alt="A,A JOS COMM logo"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="font-display text-lg leading-none">A,A JOS COMM</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-brass ${
                pathname === link.href ? "text-brass" : "text-paper/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-lineDark md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <div className="flex h-4 w-5 flex-col justify-between">
            <span className={`h-px w-full bg-paper transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-full bg-paper transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-lineDark bg-ink px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col divide-y divide-lineDark">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-paper/90"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
