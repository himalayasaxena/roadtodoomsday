import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Calendar plan for your MCU Doomsday watch list",
  description:
    "How to use Add to Calendar on Doomsday Watch Path to schedule remaining MCU titles before Avengers: Doomsday with an .ics plan.",
  path: "/guides/calendar-plan",
});

export default function CalendarGuidePage() {
  return (
    <ContentPage
      title="Calendar planning guide"
      description="Turn leftover runtime into nights on your calendar before Avengers: Doomsday."
    >
      <p>
        Knowing your MCU watch order is only half the problem. The other half
        is finding nights to sit down. Doomsday Watch Path includes an Add to
        Calendar flow that turns remaining titles into an .ics plan you can
        open in Apple Calendar, Google Calendar, or Outlook. This guide
        explains what the planner does, what it does not do, and how to get a
        schedule you might actually keep.
      </p>

      <h2>What Add to Calendar uses</h2>
      <p>
        The planner looks at titles still open on your current path: anything
        not marked watched or skipped. That means you should update progress
        before you export. If you leave old titles unmarked, the calendar will
        overstuff your weeks with movies you already finished years ago.
      </p>
      <p>
        Secret Wars style placeholders that sit after Doomsday are kept out of
        the to-Doomsday math where the product treats them as post-deadline.
        The export is aimed at prep for Avengers: Doomsday, not infinite
        backlog forever.
      </p>

      <h2>Settings that change the shape of the plan</h2>
      <p>
        You pick a preferred start time for sittings. That becomes the default
        evening slot on each planned night. You also choose whether weekends
        count. Weekday-only plans protect Saturday for life admin. Including
        weekends shortens the calendar span when runtime is heavy.
      </p>
      <p>
        The algorithm spreads remaining minutes across available nights until
        the Doomsday deadline. When the remaining pile is large and nights are
        few, the preview warns that some evenings will carry more than one
        title. That warning is the point. It is better to see a stacked Friday
        now than to discover it on December 10.
      </p>

      <h2>How to import the file</h2>
      <p>
        On many phones, saving or sharing the .ics file surfaces an Add to
        Calendar action from the system sheet. On desktop, download the file
        and open it with your calendar app, or use the app&apos;s import
        calendar flow. Google Calendar, Apple Calendar, and Outlook all speak
        .ics. After import, skim the first week. If the start time fights your
        real routine, regenerate with a different time instead of editing
        twenty events by hand.
      </p>
      <p>
        If your calendar app asks which calendar to place events on, pick a
        personal calendar you check daily. Putting MCU sittings on a work
        calendar you ignore at night is a quiet way to miss them. Rename or
        color-code the imported series if your app supports it, so movie nights
        do not disappear into a wall of meetings.
      </p>

      <h2>What the calendar is not</h2>
      <p>
        This is not a theater showtimes feed. It is not a Disney+ release
        calendar. It will not pause when you get sick, travel, or fall into a
        new show. Streaming rights move. A title that was one tap away in
        October might be missing in November. The event description is a
        reminder to watch, not a ticket.
      </p>
      <p>
        Doomsday Watch Path is also unofficial. Calendar entries are a fan
        plan created by you for yourself. They are not affiliated with Marvel
        or Disney.
      </p>

      <h2>A practical workflow</h2>
      <p>
        Open your path, mark everything you have already seen, confirm the
        remaining hours on the sticky rail, then open Add to Calendar. If the
        preview looks impossible, shorten the path first. Switch from Complete
        to Recommended, or Recommended to Crash, or drop titles in Custom.
        Export again only after the remaining runtime fits a life you
        recognize.
      </p>
      <p>
        Re-export when you skip a week. Old events can stay as history or be
        deleted in your calendar app. The site does not sync back into Google
        over OAuth in this version. The .ics file is the handoff.
      </p>

      <h2>Group plans and shared accountability</h2>
      <p>
        If two people share a path link, they still keep separate calendars
        unless they import the same .ics. That is fine. One person can own the
        schedule while the other owns snacks. When someone falls behind, update
        progress on the site first, then regenerate. Editing dozens of calendar
        events by hand is how plans die.
      </p>
      <p>
        Time zones matter if you travel. The planner uses your chosen start
        time as a local sitting preference. After import, confirm the first
        event in your calendar app before trusting the whole series.
      </p>

      <h2>Tips that keep plans alive</h2>
      <p>
        Put sittings at a time you already protect, like after dinner, not at
        11:40 p.m. unless that is truly when you watch. Keep weekends out if
        family logistics always win those days. Use Share on the path when you
        want a friend to hold you to the same list, then keep calendar events
        private if you prefer. If a week collapses, skip guilt and rebuild. The
        countdown does not care about perfect streaks. It cares about remaining
        hours.
      </p>

      <h2>When stacked nights are a warning, not a challenge</h2>
      <p>
        A preview that packs two long films into one evening is telling you the
        remaining runtime does not fit your available nights. You can accept a
        rare double feature if that is how you already watch. More often, the
        better move is to shorten the path, mark more skips, or start earlier
        in the day on weekends only. Calendar planning should reveal pressure,
        not invent a heroic schedule you abandon after three days.
      </p>
      <p>
        If you keep regenerating the same overloaded plan and deleting events
        later, stop exporting until the sticky rail looks human. The .ics file
        is only as smart as the open queue you feed it.
      </p>

      <h2>Where this fits in the product loop</h2>
      <p>
        Pair this guide with the{" "}
        <Link href="/guides/mcu-watch-order">MCU watch order guide</Link> so
        you are not scheduling a list you never meant to finish. For button
        locations and progress marks, see{" "}
        <Link href="/how-it-works">How it works</Link>. If your list needs a
        personal cut first, read the{" "}
        <Link href="/guides/custom-path">custom path guide</Link>, then export.
        When you are ready, pick a path from the <Link href="/">home page</Link>{" "}
        and open Add to Calendar from there.
      </p>
    </ContentPage>
  );
}
