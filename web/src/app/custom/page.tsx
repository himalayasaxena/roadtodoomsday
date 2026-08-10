import { CustomBuilder } from "@/components/custom/CustomBuilder";
import titlesJson from "@/data/titles.json";
import watchLinksJson from "@/data/watch-links.json";
import providersJson from "@/data/providers.json";
import type { Provider, Title, WatchOffer } from "@/lib/types";
import { catalogIdsInOrder, parseCustomPathParam } from "@/lib/customPath";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build a custom roadmap",
  description:
    "Search and add MCU titles to build your own Doomsday watch timeline.",
  alternates: { canonical: "/custom" },
};

type Props = {
  searchParams: Promise<{ ids?: string; p?: string }>;
};

export default async function CustomPage({ searchParams }: Props) {
  const { ids, p } = await searchParams;
  const titles = titlesJson.titles as Title[];
  const catalogIds = catalogIdsInOrder(titles);
  const initialIds = parseCustomPathParam(p, ids, catalogIds);

  const watchLinks = (watchLinksJson.titles || {}) as Record<
    string,
    { regions?: Record<string, WatchOffer[]> }
  >;
  const providers = (providersJson.providers || []) as Provider[];

  return (
    <main>
      <CustomBuilder
        titles={titles}
        initialIds={initialIds}
        catalogIds={catalogIds}
        watchLinks={watchLinks}
        providers={providers}
      />
    </main>
  );
}
