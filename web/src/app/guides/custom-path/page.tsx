import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Build a custom MCU watch path for Doomsday",
  description:
    "How to build, sort, share, and schedule a custom MCU watch list for Avengers: Doomsday using Doomsday Watch Path.",
  path: "/guides/custom-path",
});

export default function CustomPathGuidePage() {
  return (
    <ContentPage
      title="Custom watch path guide"
      description="Search the catalog, stack your own list, and share a short link that still opens in release order."
    >
      <p>
        Preset paths cover most viewers, but some people need a sharper cut.
        Maybe you already finished the Infinity Saga and only want Multiverse
        titles. Maybe your friends refuse X-Men but insist on every Spider-Man
        film. Custom mode exists for those cases. You search the catalog, add
        what matters, and Doomsday Watch Path sorts the pile into release
        order automatically.
      </p>

      <h2>How the builder works</h2>
      <p>
        Open <Link href="/custom">Custom</Link> from the home page. The search
        box filters movies and shows in the catalog. Tap a result to add it.
        Chips under the search row show your current set. Tap a chip to remove
        a title. As the set changes, the timeline beneath updates so you can
        see the real watch order, not the order you clicked.
      </p>
      <p>
        That automatic sort is intentional. Custom is not a playlist you
        shuffle for vibes. It is still a Doomsday prep tool, and release order
        keeps continuity readable for anyone you share with.
      </p>

      <h2>Short links instead of endless ids</h2>
      <p>
        Older watch-order sites stuffed every slug into the URL until the
        address bar looked broken. This project encodes your selection into a
        compact path parameter. Sharing stays practical on Instagram DMs and
        WhatsApp. When you share from the path view, progress markers can ride
        along so a friend continues from the same watched and skipped state.
      </p>
      <p>
        Because the selection lives in the link, treat shared URLs like public
        notes. Do not encode a private joke list if you are about to post the
        URL broadly.
      </p>

      <h2>When Custom beats Recommended</h2>
      <p>
        Use Custom after you understand the presets. If Recommended is almost
        right but two shows annoy you, clone the idea manually: add the
        Recommended-like titles you want, leave the rest out. If Crash is too
        thin and Complete is too heavy, Custom is the middle you design
        yourself.
      </p>
      <p>
        Custom is also useful for group watches. Build one list, share it, and
        let everyone open the same order on their phones. Region toggles still
        apply per viewer for watch logos, because India and US catalogs differ.
      </p>

      <h2>Progress, pace, and calendar</h2>
      <p>
        Once titles are selected, the path tools match other tracks. Mark
        watched or skipped. Watch the sticky rail for remaining hours and
        required daily pace against the Doomsday countdown. Use Add to Calendar
        to schedule only what is left. If the pace looks impossible, remove
        chips before you export. Scheduling a fantasy list helps nobody.
      </p>

      <h2>Quality checks before you commit</h2>
      <p>
        Scan the timeline for surprise double features on the same night once
        you calendarize. Check that you did not accidentally omit a bridge
        title your group considers mandatory. Confirm posters and runtimes look
        right. If a watch link is missing, the card still belongs on the path;
        you may simply need to search your local streamer.
      </p>
      <p>
        Remember the editorial limits of the catalog. Custom can only add
        titles the site knows. If something is absent, it is outside this
        dataset for now, not a dare to paste random URLs into the builder.
      </p>

      <h2>Examples that work well</h2>
      <p>
        Multiverse-only after Endgame: add the Multiverse-heavy films and shows
        you still lack, skip early Phase one-shots you already know cold.
        Spider-Man night with friends: pull the Spider-Man track titles plus any
        Avengers bridges your group demands. Mutant curiosity: start from the
        X-Men branch in More, then add Doomsday-adjacent MCU titles that your
        friends have not seen.
      </p>
      <p>
        Bad Custom patterns look like random favorites with no connective
        tissue, or Complete-sized lists built on a Crash timeline. If remaining
        hours scare you, cut before you share. Pride is not a scheduling
        strategy.
      </p>

      <h2>A simple recipe</h2>
      <p>
        Start from Crash or Recommended on paper. Note the titles you refuse to
        skip. Enter Custom and add those first. Add one or two context titles
        if the gaps feel weird. Stop when remaining hours fit your real weeks.
        Share the link with anyone watching along. Export the calendar after
        progress marks are honest.
      </p>
      <p>
        For preset comparisons, read the{" "}
        <Link href="/guides/mcu-watch-order">MCU watch order guide</Link>. For
        scheduling, see the{" "}
        <Link href="/guides/calendar-plan">calendar planning guide</Link>. For
        the overall product loop, open{" "}
        <Link href="/how-it-works">How it works</Link>. When you are ready to
        build, go straight to <Link href="/custom">the custom roadmap</Link>.
      </p>
    </ContentPage>
  );
}
