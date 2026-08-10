import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import tracksJson from "@/data/tracks.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const tracks = tracksJson.tracks as { id: string }[];
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tracks.map((t) => ({
      url: `${siteUrl}/path/${t.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: t.id === "prep" ? 0.9 : 0.7,
    })),
  ];
}
