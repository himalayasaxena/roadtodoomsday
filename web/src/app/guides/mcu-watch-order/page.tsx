import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "MCU watch order for Doomsday",
  description:
    "How to pick an MCU watch order before Avengers: Doomsday using Recommended, Crash, or Complete paths.",
  path: "/guides/mcu-watch-order",
});

export default function WatchOrderGuidePage() {
  return (
    <ContentPage
      title="MCU watch order for Doomsday"
      description="Release-order paths sized for how much time you have left."
    >
      <p>
        If you are preparing for Avengers: Doomsday, release order is the
        safest default. This site packages that idea into three main lengths.
      </p>
      <h2>Recommended</h2>
      <p>
        Best starting point for most people: enough Multiverse and recent-phase
        context without committing to every title ever released.
      </p>
      <h2>Crash</h2>
      <p>
        Use when opening night is close. Must-sees only, still ordered so
        callbacks land.
      </p>
      <h2>Complete</h2>
      <p>
        Everything in the catalog in release order, including broader
        Multiverse branches that feed Doomsday conversations.
      </p>
      <p>
        Open <Link href="/path/prep">Recommended</Link>,{" "}
        <Link href="/path/crash">Crash</Link>, or{" "}
        <Link href="/path/complete">Complete</Link> to start.
      </p>
    </ContentPage>
  );
}
