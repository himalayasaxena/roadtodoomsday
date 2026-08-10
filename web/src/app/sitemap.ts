import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import tracksJson from "@/data/tracks.json";

const STATIC_PATHS: { path: string; priority: number; freq: "monthly" | "weekly" }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/about", priority: 0.8, freq: "monthly" },
  { path: "/how-it-works", priority: 0.8, freq: "monthly" },
  { path: "/guides/mcu-watch-order", priority: 0.85, freq: "monthly" },
  { path: "/guides/calendar-plan", priority: 0.7, freq: "monthly" },
  { path: "/guides/custom-path", priority: 0.7, freq: "monthly" },
  { path: "/custom", priority: 0.75, freq: "weekly" },
  { path: "/privacy", priority: 0.3, freq: "monthly" },
  { path: "/terms", priority: 0.3, freq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const tracks = tracksJson.tracks as { id: string }[];
  const now = new Date();
  return [
    ...STATIC_PATHS.map((p) => ({
      url: `${siteUrl}${p.path === "/" ? "" : p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...tracks.map((t) => ({
      url: `${siteUrl}/path/${t.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: t.id === "prep" ? 0.9 : 0.7,
    })),
  ];
}
