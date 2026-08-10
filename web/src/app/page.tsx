import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import titlesJson from "@/data/titles.json";
import tracksJson from "@/data/tracks.json";
import type { Title, Track } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Roadmap for Avengers: Doomsday",
  },
  description:
    "Your watch roadmap to Avengers: Doomsday. Pick a path, catch the movies and shows you need first, and walk into Doomsday ready to understand it.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Roadmap for Avengers: Doomsday",
    description:
      "Your watch roadmap to Avengers: Doomsday. Pick a path, catch the movies and shows you need first, and walk into Doomsday ready to understand it.",
  },
  twitter: {
    title: "Roadmap for Avengers: Doomsday",
    description:
      "Your watch roadmap to Avengers: Doomsday. Pick a path, catch the movies and shows you need first, and walk into Doomsday ready to understand it.",
  },
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
