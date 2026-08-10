import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "How it works",
  description:
    "How Doomsday Watch Path tracks work: Recommended, Crash, Complete, More, Custom, progress, and share links.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <ContentPage
      title="How it works"
      description="Pick a path, track what you finish, share where you are."
    >
      <h2>1. Choose a journey</h2>
      <p>
        <strong>Recommended</strong> balances context and length.{" "}
        <strong>Crash</strong> is the short list when time is tight.{" "}
        <strong>Complete</strong> is the full release-order catalog.{" "}
        <strong>More</strong> opens character arcs and the Fox X-Men branch.{" "}
        <strong>Custom</strong> lets you search and stack your own titles.
      </p>
      <h2>2. Watch in release order</h2>
      <p>
        Titles appear in sequence with posters, why-watch notes, priority, and
        region-aware watch links (India / US).
      </p>
      <h2>3. Mark progress</h2>
      <p>
        Tap watched or skipped as you go. Remaining time and daily pace update
        against the Doomsday countdown.
      </p>
      <h2>4. Share or schedule</h2>
      <p>
        Share opens the system sheet with a short link. Add to Calendar builds
        an .ics plan for Apple, Google, or Outlook.
      </p>
      <p>
        Try the <Link href="/path/crash">Crash path</Link> or{" "}
        <Link href="/custom">build a custom roadmap</Link>.
      </p>
    </ContentPage>
  );
}
