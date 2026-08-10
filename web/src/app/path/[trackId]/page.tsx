import { PathExplorer } from "@/components/path/PathExplorer";
import titlesJson from "@/data/titles.json";
import tracksJson from "@/data/tracks.json";
import watchLinksJson from "@/data/watch-links.json";
import providersJson from "@/data/providers.json";
import type { Provider, Title, Track, WatchOffer } from "@/lib/types";
import { catalogIdsInOrder, encodeCustomPathParam, parseCustomPathParam } from "@/lib/customPath";
import { resolvePathTitles } from "@/lib/path";
import { parseProgressQuery } from "@/lib/progress";
import { itemListJsonLd, pathMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ trackId: string }>;
  searchParams: Promise<{ ids?: string; p?: string; w?: string; s?: string }>;
};

function customSharePath(customIds: string[], catalogIds: string[]) {
  const code = encodeCustomPathParam(customIds, catalogIds);
  return code ? `/path/custom?p=${code}` : "/path/custom";
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { trackId } = await params;
  const { ids, p } = await searchParams;
  const allTitles = titlesJson.titles as Title[];
  const tracks = tracksJson.tracks as Track[];
  const titlesById = Object.fromEntries(allTitles.map((t) => [t.id, t]));
  const catalogIds = catalogIdsInOrder(allTitles);
  const customIds = parseCustomPathParam(p, ids, catalogIds);
  const resolved = resolvePathTitles(trackId, tracks, titlesById, customIds);
  const path =
    trackId === "custom" && customIds.length
      ? customSharePath(customIds, catalogIds)
      : `/path/${trackId}`;
  return pathMetadata({
    trackName: resolved.trackName,
    description: resolved.description,
    path,
    count: resolved.titles.length,
  });
}

export default async function PathPage({ params, searchParams }: Props) {
  const { trackId } = await params;
  const { ids, p, w, s } = await searchParams;

  const allTitles = titlesJson.titles as Title[];
  const tracks = tracksJson.tracks as Track[];
  const titlesById = Object.fromEntries(allTitles.map((t) => [t.id, t]));
  const catalogIds = catalogIdsInOrder(allTitles);

  const known = trackId === "custom" || tracks.some((t) => t.id === trackId);
  if (!known) notFound();

  const customIds = parseCustomPathParam(p, ids, catalogIds);
  const resolved = resolvePathTitles(trackId, tracks, titlesById, customIds);
  const missingCustomIds =
    trackId === "custom" ? customIds.filter((id) => !titlesById[id]) : [];

  if (trackId === "custom" && customIds.length === 0) {
    redirect("/custom");
  }

  const watchLinks = (watchLinksJson.titles || {}) as Record<
    string,
    { regions?: Record<string, WatchOffer[]> }
  >;
  const providers = (providersJson.providers || []) as Provider[];
  const pathTitleIds = resolved.titles
    .filter((t) => t.id !== "avengers-secret-wars")
    .map((t) => t.id);
  const initialProgress = parseProgressQuery(w, s, pathTitleIds);
  const sharePath =
    trackId === "custom" && customIds.length
      ? customSharePath(customIds, catalogIds)
      : `/path/${trackId}`;

  const jsonLd = itemListJsonLd({
    name: resolved.trackName,
    description: resolved.description,
    path: sharePath,
    items: resolved.titles.map((t, i) => ({
      id: t.id,
      title: t.title,
      position: i + 1,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PathExplorer
        trackId={trackId}
        trackName={resolved.trackName}
        description={resolved.description}
        titles={resolved.titles}
        customIds={trackId === "custom" ? customIds : undefined}
        catalogIds={catalogIds}
        missingCustomIds={missingCustomIds}
        initialProgress={initialProgress}
        watchLinks={watchLinks}
        providers={providers}
      />
    </>
  );
}
