import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "What Doomsday Watch Path is: a fan-made MCU roadmap to Avengers: Doomsday with paths, progress, and calendar planning.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      title="About"
      description="A focused watch roadmap for Avengers: Doomsday."
    >
      <p>
        Doomsday Watch Path helps you choose how much MCU to watch before
        Avengers: Doomsday (December 18, 2026). Pick a ready-made path, browse
        character arcs, or build a custom list in release order.
      </p>
      <h2>Built for finishing on time</h2>
      <p>
        Every path shows runtimes, remaining hours, and a live countdown so you
        can see whether your pace fits the calendar. Mark titles watched or
        skipped, share progress, and export a sitting plan to your calendar.
      </p>
      <h2>Who made this</h2>
      <p>
        Created by{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          Himalaya Saxena
        </a>
        . Unofficial and fan-made.
      </p>
      <p>
        Start on the <Link href="/">home page</Link>, or jump into the{" "}
        <Link href="/path/prep">Recommended path</Link>.
      </p>
    </ContentPage>
  );
}
