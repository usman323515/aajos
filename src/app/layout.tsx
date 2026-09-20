import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aajoscomm.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "A,A JOS COMM — Mobile Technology, Trusted Service",
    template: "%s — A,A JOS COMM",
  },
  description:
    "A,A JOS COMM is a mobile phone and technology retail business in Pantami, Gombe, Nigeria, led by Abdul Jos. Genuine smartphones, power banks, and EasyBuy.",
  openGraph: {
    title: "A,A JOS COMM — Mobile Technology, Trusted Service",
    description:
      "Mobile phone and technology retail business in Pantami, Gombe, Nigeria. Genuine smartphones, power banks, and EasyBuy.",
    url: siteUrl,
    siteName: "A,A JOS COMM",
    images: ["/images/og/cover.jpg"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A,A JOS COMM — Mobile Technology, Trusted Service",
    description: "Mobile phone and technology retail business in Pantami, Gombe, Nigeria.",
    images: ["/images/og/cover.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
