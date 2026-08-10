import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Custom watch path guide",
  description:
    "Build and share a custom MCU watch list for Avengers: Doomsday with compact share links.",
  path: "/guides/custom-path",
});

export default function CustomPathGuidePage() {
  return (
    <ContentPage
      title="Custom watch path guide"
      description="Search, add titles, and share a short link to your own roadmap."
    >
      <p>
        Custom mode is for when none of the preset paths match what you still
        need. Search the catalog, add titles, and the timeline sorts them into
        release order automatically.
      </p>
      <h2>Short share links</h2>
      <p>
        Your selection is encoded into a compact URL parameter so friends can
        open the same list without a long comma-separated id string. Progress
        can ride along in the same link when you share from the path view.
      </p>
      <h2>Tips</h2>
      <p>
        Start from titles you care about, then check remaining hours against the
        countdown. If the pace looks harsh, drop optional picks or switch to
        Crash.
      </p>
      <p>
        <Link href="/custom">Open the custom builder</Link>.
      </p>
    </ContentPage>
  );
}
