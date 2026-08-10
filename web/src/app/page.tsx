import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import titlesJson from "@/data/titles.json";
import tracksJson from "@/data/tracks.json";
import type { Title, Track } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Path to Doomsday",
  description:
    "Pick a path, browse character arcs, build custom, or add your plan to Calendar before Avengers: Doomsday.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const titles = (titlesJson.titles as Title[]).map((t) => ({
    id: t.id,
    title: t.title,
    year: t.year,
    sequenceOrder: t.sequenceOrder,
    runtimeMinutes: t.runtimeMinutes,
    posterPublic: t.posterPublic,
    backdropPublic: t.backdropPublic,
    type: t.type,
  }));

  const tracks = tracksJson.tracks as Track[];

  return (
    <main>
      <OnboardingShell titles={titles} tracks={tracks} />
    </main>
  );
}
