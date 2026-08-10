import type { Metadata } from "next";
import { Barlow, Oswald } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { rootMetadata, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

/** Condensed caps - MCU / Marvel marketing poster energy */
const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

/** Clean geometric sans used across modern Marvel digital */
const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = websiteJsonLd();
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
