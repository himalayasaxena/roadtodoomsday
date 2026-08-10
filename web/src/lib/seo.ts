import type { Metadata } from "next";

const SITE_NAME = "Doomsday Watch Path";
const SITE_DESCRIPTION =
  "MCU watch order to Avengers: Doomsday. Recommended, Crash, Complete, character arcs, and custom journeys with runtimes, scores, and where to watch.";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Avengers Doomsday",
    "MCU watch order",
    "Doomsday watch path",
    "Marvel timeline",
    "X-Men MCU",
    "Fantastic Four First Steps",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/media/backdrops/avengers-doomsday.jpg", width: 1280, height: 720, alt: "Avengers: Doomsday" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/media/backdrops/avengers-doomsday.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export function pathMetadata(opts: {
  trackName: string;
  description: string;
  path: string;
  count: number;
}): Metadata {
  const title = `${opts.trackName} watch order`;
  const description =
    opts.description ||
    `${opts.trackName}: ${opts.count} titles in release order to prepare for Avengers: Doomsday.`;
  return {
    title,
    description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: opts.path,
      type: "website",
      images: [{ url: "/media/backdrops/avengers-doomsday.jpg", alt: opts.trackName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE_NAME}`,
      description,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function itemListJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  items: { id: string; title: string; position: number; url?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    description: opts.description,
    url: `${siteUrl}${opts.path}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.title,
      url: item.url || `${siteUrl}${opts.path}#title-${item.id}`,
    })),
  };
}
