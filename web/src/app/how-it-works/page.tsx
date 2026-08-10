import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "How Doomsday Watch Path works",
  description:
    "Step-by-step guide to Recommended, Crash, Complete, More, Custom paths, progress tracking, share links, and Add to Calendar on Doomsday Watch Path.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <ContentPage
      title="How it works"
      description="From picking a path to sharing progress and scheduling sittings."
    >
      <p>
        Doomsday Watch Path is built around one loop: choose a watch order,
        work through it in release sequence, track what is done, and keep an
        eye on the hours left before Avengers: Doomsday. This page explains
        each step so you can use the site without guessing.
      </p>

      <h2>Step 1: Choose a journey on the home page</h2>
      <p>
        The home screen shows Ready-made options.{" "}
        <strong>Recommended</strong> is the balanced prep path for most people.
        It covers strong Doomsday context without forcing every title in the
        catalog. <strong>Crash</strong> is the short list when opening night is
        close and you need must-sees only. <strong>Complete</strong> is the
        full release-order catalog for viewers who want zero gaps.
      </p>
      <p>
        <strong>More</strong> opens character arcs and the Fox X-Men branch,
        useful if you care about one lead or mutant history more than a
        general MCU sweep. <strong>Custom</strong> sends you to a builder where
        you search and add titles yourself. The live countdown near the top
        keeps the deadline visible while you decide.
      </p>

      <h2>Step 2: Read the path timeline</h2>
      <p>
        Inside a path, titles appear in release order. Each card shows poster
        art, runtime, a short why-watch note, and priority cues so essential
        films stand apart from optional ones. You can switch region between
        India and the United States to refresh watch logos and deep links.
        Trailer buttons open YouTube when a trailer URL is available.
      </p>
      <p>
        Scroll to move through the list. The sticky rail stays with you and
        shows remaining runtime, the average hours per day you still need, and
        how many titles you have cleared. That math updates when you mark
        progress, so the rail is more than decoration. It is the honesty check
        against December 18, 2026.
      </p>

      <h2>Step 3: Mark watched or skipped</h2>
      <p>
        On each card, mark a title watched when you finish it, or skipped when
        you intentionally leave it out. Skipped titles leave the remaining
        pile just like watched ones, which keeps pace calculations honest. If
        you change your mind, clear the status and the title returns to the
        open queue.
      </p>
      <p>
        Progress is stored locally in your browser. There is no login wall.
        The tradeoff is that clearing site data resets your marks, and another
        device will not see the same local state unless you share a link that
        includes progress.
      </p>

      <h2>Step 4: Share a journey</h2>
      <p>
        Share opens your phone or desktop system sheet with a caption and URL.
        Copy link puts only the URL on the clipboard. Custom paths use a
        compact code in the query string instead of a long list of title ids,
        which keeps shared URLs readable. Progress can travel with the link so
        a friend can continue from the same point.
      </p>
      <p>
        Only share what you are comfortable making public. Anyone with the URL
        can reconstruct the encoded selection. If you only need accountability
        without exposing marks, copy a clean path link and keep progress local
        on your own device.
      </p>

      <h2>Step 5: Add remaining titles to your calendar</h2>
      <p>
        The Add to Calendar control opens a planner for titles you have not
        finished. You choose a preferred start time and whether weekends count.
        The site spreads remaining runtime across nights until Doomsday and
        warns when the plan is tight. Download or share the .ics file into
        Apple Calendar, Google Calendar, or Outlook.
      </p>
      <p>
        Treat the export as a personal study plan for movies, not a guarantee
        that every night will go perfectly. Life interrupts. The calendar is
        there so interruptions are visible early enough to fix.
      </p>

      <h2>Custom builder specifics</h2>
      <p>
        On <Link href="/custom">Custom</Link>, search adds titles and chips
        remove them. The live timeline below the search box resorts into
        release order as the set changes. When the list looks right, open the
        path view to mark progress, share, or schedule like any other track.
        A longer walkthrough lives on the{" "}
        <Link href="/guides/custom-path">custom path guide</Link>.
      </p>

      <h2>Mobile and desktop notes</h2>
      <p>
        On phones, Share uses the native sheet when the browser supports it.
        Copy link is there when you only need the URL. The calendar button sits
        as a floating control so it stays reachable while you scroll a long
        Complete list. On desktop, the same features work through the path
        header and rail. If a clipboard action fails on plain HTTP during local
        testing, that is a browser security limit, not a missing button.
      </p>
      <p>
        Large art and backdrop blends can feel heavy on older phones. If motion
        bothers you, system reduced-motion preferences are respected where the
        UI animates. The path still works with posters and text alone.
      </p>

      <h2>Common sticking points</h2>
      <p>
        If remaining hours look wrong, confirm you marked prior watches. If a
        provider logo is missing, switch region once, then search the title in
        your app. If a shared custom link opens empty, the code may be damaged
        by a messenger that truncated the URL. Paste into the browser address
        bar directly when that happens.
      </p>

      <h2>A simple weekly habit</h2>
      <p>
        The product works best when you treat it like a checklist, not a one-time
        inspiration dump. Pick a path once. Mark anything you already know on
        the first night. Export a calendar when the remaining hours look real.
        Midweek, open the path again and clear what you finished. If life steals
        two sittings, regenerate the plan instead of pretending the old events
        still match your week.
      </p>
      <p>
        That loop keeps the sticky rail honest. Friends who share the same link
        can compare notes without arguing about which Reddit list is correct.
        You still watch inside your own streaming apps. The site only owns the
        order, the marks, and the deadline math.
      </p>

      <h2>Where to go next</h2>
      <p>
        New to the site? Start with <Link href="/path/prep">Recommended</Link>.
        Short on time? Open <Link href="/path/crash">Crash</Link>. Want the
        philosophy behind path lengths? Read the{" "}
        <Link href="/guides/mcu-watch-order">MCU watch order guide</Link>. For
        scheduling detail, see the{" "}
        <Link href="/guides/calendar-plan">calendar planning guide</Link>. To
        assemble your own stack, use the{" "}
        <Link href="/guides/custom-path">custom path guide</Link>.
      </p>
      <p>
        The site does not replace your streaming apps. It replaces the sticky
        note that says &quot;catch up somehow before Doomsday&quot; with a
        concrete order and a clock.
      </p>
    </ContentPage>
  );
}
