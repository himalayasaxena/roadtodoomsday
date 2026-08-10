import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Calendar planning guide",
  description:
    "How to use Add to Calendar on Doomsday Watch Path to schedule remaining titles before Avengers: Doomsday.",
  path: "/guides/calendar-plan",
});

export default function CalendarGuidePage() {
  return (
    <ContentPage
      title="Calendar planning guide"
      description="Turn remaining titles into sittings you can open in Apple, Google, or Outlook."
    >
      <p>
        On any path, use <strong>Add to Calendar</strong> to build a personal
        plan from titles you have not marked watched or skipped.
      </p>
      <h2>What you choose</h2>
      <p>
        Set a preferred start time and whether weekends count. The planner
        spreads remaining runtime across nights until Doomsday and warns when
        the schedule is tight.
      </p>
      <h2>What you get</h2>
      <p>
        A downloadable .ics file. On phones, the system share sheet can offer
        Add to Calendar directly. Events are a fan plan, not studio showtimes.
      </p>
      <p>
        Pick a path from the <Link href="/">home page</Link>, mark what you
        already finished, then export the rest.
      </p>
    </ContentPage>
  );
}
