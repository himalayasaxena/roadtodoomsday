import type { Metadata } from "next";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "Terms for using Doomsday Watch Path, a fan-made MCU watch roadmap.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="Simple rules for using this fan-made watch roadmap."
      updated="August 11, 2026"
    >
      <h2>Fan-made project</h2>
      <p>
        Doomsday Watch Path is an unofficial fan project created by Himalaya
        Saxena. It is not affiliated with, endorsed by, or connected to Marvel
        Studios, Disney, or any other studio, streamer, or rights holder.
      </p>

      <h2>Personal use</h2>
      <p>
        The site is provided for personal, non-commercial entertainment
        planning. You may use the paths, share links, and export calendar plans
        for your own viewing schedule.
      </p>

      <h2>No guarantees</h2>
      <p>
        Runtimes, release dates, scores, and &quot;where to watch&quot; links
        can change. Streaming availability differs by region and over time.
        Calendar exports are planning aids, not promises that you will finish
        before Doomsday.
      </p>

      <h2>Content sources</h2>
      <p>
        Posters and some metadata are sourced from TMDB. Watch offers are
        informed by JustWatch and similar public listings. Title selection and
        path curation are editorial and may omit or reorder titles.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not abuse the site, attempt to disrupt the service, scrape at
        abusive rates, or misrepresent the project as an official Marvel or
        Disney product.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, visit{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        .
      </p>
    </ContentPage>
  );
}
