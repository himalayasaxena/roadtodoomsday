import type { Metadata } from "next";

const SITE_NAME = "Doomsday Watch Path";
const SITE_DESCRIPTION =
  "MCU watch order to Avengers: Doomsday. Recommended, Crash, Complete, character arcs, and custom journeys with runtimes, scores, and where to watch.";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://doomsdayroadmap.com";

/** Absolute OG/Twitter image — absolute URLs are most reliable for WhatsApp, LinkedIn, Facebook, X. */
export const shareImage = {
  url: `${siteUrl}/media/backdrops/avengers-doomsday.jpg`,
  width: 1280,
  height: 720,
  alt: "Avengers: Doomsday",
  type: "image/jpeg",
} as const;

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
    "Doomsday roadmap",
  ],
  authors: [
    { name: "Himalaya Saxena", url: "https://himalayasaxena.com" },
    { name: SITE_NAME },
  ],
  creator: "Himalaya Saxena",
  publisher: "Himalaya Saxena",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: {
      url: shareImage.url,
      alt: shareImage.alt,
      width: shareImage.width,
      height: shareImage.height,
    },
    creator: "@himalayasaxena",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = opts.path.startsWith("http") ? opts.path : `${siteUrl}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: {
        url: shareImage.url,
        alt: shareImage.alt,
        width: shareImage.width,
        height: shareImage.height,
      },
    },
  };
}

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
  const fullTitle = `${title} · ${SITE_NAME}`;
  const image = { ...shareImage, alt: opts.trackName };
  return {
    title,
    description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: fullTitle,
      description,
      url: opts.path,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: {
        url: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height,
      },
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
    creator: {
      "@type": "Person",
      name: "Himalaya Saxena",
      url: "https://himalayasaxena.com",
      sameAs: [
        "https://himalayasaxena.com",
        "https://instagram.com/himalayasaxena",
        "https://www.linkedin.com/in/himalayasaxena",
        "https://github.com/himalayasaxena",
      ],
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
