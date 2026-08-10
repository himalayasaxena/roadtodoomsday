import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "About Doomsday Watch Path",
  description:
    "About Doomsday Watch Path, a fan-made MCU watch order and roadmap tool for Avengers: Doomsday with paths, progress tracking, and calendar planning.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      title="About"
      description="A practical MCU roadmap for people who want to arrive at Avengers: Doomsday prepared, not panicked."
    >
      <p>
        Doomsday Watch Path is a free, fan-made website that helps you decide
        what to watch before Avengers: Doomsday lands on December 18, 2026. If
        you have fallen behind on the Marvel Cinematic Universe, dipped in and
        out of Disney+ shows, or only remember the big Avengers films, this
        site gives you a clear watch order instead of an endless argument in
        the group chat.
      </p>
      <p>
        The idea is simple. You pick a path that matches how much time you
        have. You see runtimes, remaining hours, and a live countdown to
        opening night. You mark titles watched or skipped as you go. When you
        want accountability, you share a link or drop a sitting plan into your
        calendar. No account is required. Progress lives in your browser so you
        can reopen the same path on the same device and keep moving.
      </p>

      <h2>Why this exists</h2>
      <p>
        MCU watch order posts online are often either too short to be useful or
        so long that nobody finishes them. Doomsday raises the stakes again:
        mutants, Fantastic Four energy, and years of Multiverse setup all feed
        into one theatrical event. People ask the same questions every week.
        Do I need every Phase 4 show? Is Crash enough? What about X-Men? Where
        do I put Deadpool &amp; Wolverine?
      </p>
      <p>
        This project answers those questions with curated tracks rather than a
        single bloated list. Recommended is the default for most viewers.
        Crash is for late starters. Complete is for people who want the full
        release-order catalog. More opens character arcs and the Fox X-Men
        branch. Custom lets you assemble your own stack when none of the
        presets fit.
      </p>

      <h2>What you get on every path</h2>
      <p>
        Each title card includes poster art, year, runtime, a short spoiler-light
        reason to watch, and a priority sense so you know what is essential
        versus optional. Watch links are region-aware for India and the United
        States, because the same movie is not always on the same service in
        both places. Trailers are available when we have a clean YouTube
        source. The sticky rail at the top of a path keeps left time, required
        pace, and done count visible while you scroll.
      </p>
      <p>
        Calendar export turns remaining titles into an .ics file you can open
        in Apple Calendar, Google Calendar, or Outlook. It is a personal plan,
        not a theater schedule. Streaming windows change. Runtimes are
        estimates. The point is to make the remaining work visible so you can
        adjust before December sneaks up.
      </p>

      <h2>Editorial approach</h2>
      <p>
        Paths are curated. That means Complete is not a random dump of every
        Marvel property ever made, and Crash is not marketing clickbait. Titles
        are ordered by release for newcomers, because chronological MCU charts
        confuse more people than they help when the goal is theatrical prep.
        Character tracks stay lead-focused so you can catch up on Spider-Man,
        Loki, or Wanda without pretending you watched everything else.
      </p>
      <p>
        Metadata and posters lean on TMDB. Watch availability is informed by
        public listings such as JustWatch and can lag or disagree with your
        local app. When a link is wrong or missing, treat the card as a
        reminder to search your own storefront. The roadmap is the product.
        Deep links are a convenience layer on top.
      </p>

      <h2>Who built it</h2>
      <p>
        Doomsday Watch Path was built by{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          Himalaya Saxena
        </a>
        . It is unofficial and not affiliated with Marvel Studios, Disney, or
        any streamer. You can find more of Himalaya&apos;s work at{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        , on{" "}
        <a
          href="https://instagram.com/himalayasaxena"
          rel="noopener noreferrer"
        >
          Instagram @himalayasaxena
        </a>
        , and on{" "}
        <a
          href="https://www.linkedin.com/in/himalayasaxena"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        .
      </p>

      <h2>Who this is for</h2>
      <p>
        Casual fans who saw the Avengers films and stopped. Parents planning a
        family catch-up before a holiday release. Friends who want one shared
        list instead of five conflicting Twitter screenshots. Completionists
        who need a structured Complete run with a clock attached. If you already
        live inside MCU discord lore every day, you may only need Crash or a
        custom trim. If you are starting cold in late 2026, start honest about
        time and pick the shortest path you will finish.
      </p>
      <p>
        The site is also useful when you have already watched plenty but cannot
        remember what remains. Mark known titles watched on day one. The
        remaining hours become the real project, not the fantasy of rewatching
        everything &quot;just in case.&quot;
      </p>

      <h2>What we will not pretend</h2>
      <p>
        Doomsday Watch Path will not replace critical reviews, spoiler deep
        dives, or ticket apps. It will not sync your Disney+ continue watching
        row. It will not promise that every watch logo is perfect in every city.
        It will give you an order, a runtime budget, and tools to stay honest
        with the deadline.
      </p>

      <h2>Start here</h2>
      <p>
        If you are unsure which path to take, open the{" "}
        <Link href="/">home page</Link>, check the countdown, and begin with{" "}
        <Link href="/path/prep">Recommended</Link>. If you only have a couple of
        weekends left, try <Link href="/path/crash">Crash</Link>. If you want
        the long haul, go <Link href="/path/complete">Complete</Link>. For a
        walkthrough of the UI itself, read{" "}
        <Link href="/how-it-works">How it works</Link>. Guides on{" "}
        <Link href="/guides/mcu-watch-order">watch order</Link>,{" "}
        <Link href="/guides/calendar-plan">calendar planning</Link>, and{" "}
        <Link href="/guides/custom-path">custom paths</Link> go deeper when you
        need them.
      </p>
      <p>
        The best MCU watch order is the one you will actually finish. This site
        exists to make finishing realistic before Doomsday.
      </p>
    </ContentPage>
  );
}
