import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "MCU watch order for Avengers: Doomsday",
  description:
    "How to choose an MCU watch order before Avengers: Doomsday: Recommended, Crash, and Complete release-order paths explained for real schedules.",
  path: "/guides/mcu-watch-order",
});

export default function WatchOrderGuidePage() {
  return (
    <ContentPage
      title="MCU watch order for Doomsday"
      description="Release-order paths sized for how much time you actually have before December 18, 2026."
    >
      <p>
        Searching for an MCU watch order before Avengers: Doomsday usually
        dumps you into two extremes: a ten-title &quot;essentials&quot; list
        that skips too much context, or an eighty-title monster that nobody
        finishes. Doomsday Watch Path splits the problem by time budget. You
        still watch in release order, which is the clearest structure for
        first-time or returning viewers, but you choose how wide the net is.
      </p>

      <h2>Why release order for Doomsday prep</h2>
      <p>
        In-universe chronological charts are fun for rewatches. They are a
        poor default when the goal is theatrical readiness. Doomsday pulls on
        years of Multiverse setup, legacy characters, and recent Phase
        entries. Release order preserves how audiences met those ideas the
        first time. It also matches how most streaming rows and physical
        collections are labeled, so you spend less time hunting for where a
        title sits on someone&apos;s custom timeline.
      </p>
      <p>
        That does not mean every title matters equally. Priority labels on
        cards help you see what is essential versus optional inside a long
        path. If you are on Complete and falling behind, you can skip without
        losing the spine of the order.
      </p>

      <h2>Recommended: the default Doomsday path</h2>
      <p>
        <Link href="/path/prep">Recommended</Link> is the path most people
        should open first. It aims for strong Doomsday context without the
        full catalog. You get key Infinity Saga anchors, Multiverse setup, and
        recent titles that feed the film&apos;s conversations, while leaving
        out stretches that burn weeks for little payoff if your deadline is
        hard.
      </p>
      <p>
        Use Recommended if you have watched some MCU before, disappeared for a
        few years, and now want a serious but finishable plan. Check the
        remaining hours on the sticky rail after you mark what you already
        know. If the daily pace looks gentle, stay. If it looks brutal, move
        to Crash or trim with Custom later.
      </p>

      <h2>Crash: when opening night is close</h2>
      <p>
        <Link href="/path/crash">Crash</Link> is the late-game list. It keeps
        must-sees and drops everything that is nice-to-have. The order remains
        release-based so callbacks still land, but the total runtime is meant
        for people who only have nights and weekends left.
      </p>
      <p>
        Crash is not a flex. It is triage. If you finish Crash early, you can
        always graduate into Recommended leftovers or character arcs under
        More. Starting on Complete when you have three weeks left is how
        people quit entirely. Better a finished short list than an abandoned
        long one.
      </p>

      <h2>Complete: the full release-order catalog</h2>
      <p>
        <Link href="/path/complete">Complete</Link> is for viewers who want
        the long road: MCU entries plus broader Multiverse and related
        branches that sit in this site&apos;s catalog. Expect a large title
        count and a long total runtime. The value is coverage. The risk is
        burnout.
      </p>
      <p>
        Complete works best when you start months out, or when you already
        cleared a chunk of the list and only need a structured remainder.
        Mark watched titles aggressively on day one so the rail shows true
        remaining work, not vanity math.
      </p>

      <h2>Where X-Men and character arcs fit</h2>
      <p>
        Doomsday talk often includes mutants and legacy heroes. The{" "}
        <strong>More</strong> panel holds the Fox X-Men branch and lead-focused
        character tracks such as Spider-Man, Loki, or Wanda &amp; Vision. Those
        tracks are not replacements for Recommended. They are specialty lanes
        when you care about one corner of the map.
      </p>
      <p>
        If your group only argues about Deadpool and Logan, open the relevant
        track. If your group has never seen a post-Endgame show, start on
        Recommended instead of cherry-picking.
      </p>

      <h2>Rewatches versus first watches</h2>
      <p>
        If you are rewatching, mark aggressively. The site is happiest when the
        open queue is true work. Rewatching Endgame for the twelfth time feels
        great and does nothing to shrink a Doomsday deficit. If you are
        watching first time with kids, Crash plus a couple of character picks
        often beats a Complete march that burns patience.
      </p>
      <p>
        Spoiler-light blurbs exist so you can choose without reading full
        synopses. They will not replace criticism or recap podcasts. They exist
        to answer &quot;why is this on my list tonight?&quot;
      </p>

      <h2>How to decide in five minutes</h2>
      <p>
        Look at the countdown on the <Link href="/">home page</Link>. Be
        honest about nights you will actually watch. Open Recommended and note
        remaining hours after marking prior watches. If the implied daily pace
        feels sustainable, stay. If not, switch to Crash. If you have months
        and want the whole catalog, take Complete. If none of those match,
        build a <Link href="/custom">custom path</Link>.
      </p>
      <p>
        A good MCU watch order for Doomsday is not the longest list you can
        paste into Notes. It is the list you will finish, in an order that
        still makes the movie land.
      </p>

      <h2>What people usually overcount</h2>
      <p>
        The most common planning mistake is counting titles you already know as
        if they were still open work. The second is assuming every Disney+
        series needs a full season before a movie night with friends. Priority
        cues and why-watch notes exist so you can keep a bridge title without
        pretending every episode is equally required for theatrical prep.
      </p>
      <p>
        Another trap is mixing release-order prep with random rewatch favorites.
        If you want comfort viewing, do it outside the remaining pile. Keep the
        Doomsday queue for titles that still teach you something about the
        conversation around the film. That is how Recommended stays useful and
        Crash stays short.
      </p>

      <h2>After you pick a path</h2>
      <p>
        Mark progress the same day you choose. Then either stick with the rail
        math or move to calendar export so nights become concrete. If the plan
        breaks after two weeks, change the path length. Switching from Complete
        to Recommended is not failure. It is course correction before the
        deadline does it for you.
      </p>
      <p>
        For UI details, see <Link href="/how-it-works">How it works</Link>. For
        turning the remainder into sittings, read the{" "}
        <Link href="/guides/calendar-plan">calendar planning guide</Link>. For
        building a personal stack, see the{" "}
        <Link href="/guides/custom-path">custom path guide</Link>.
      </p>
    </ContentPage>
  );
}
