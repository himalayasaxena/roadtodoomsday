"use client";

import { useMemo, useState } from "react";
import type { Title, Track } from "@/lib/types";
import { CARD_BLURBS, CARD_HERO } from "@/lib/catalog";
import { BackdropStage } from "./BackdropStage";
import { DoomsdayCountdown } from "./DoomsdayCountdown";
import { HomeShare } from "./HomeShare";
import { PathCard } from "./PathCard";
import { MorePanel } from "./MorePanel";

type Props = {
  titles: Title[];
  tracks: Track[];
};

export function OnboardingShell({ titles, tracks }: Props) {
  const [activeCard, setActiveCard] = useState("prep");
  const [moreOpen, setMoreOpen] = useState(false);

  const byId = useMemo(
    () => Object.fromEntries(tracks.map((t) => [t.id, t])),
    [tracks],
  );
  const prep = byId.prep;
  const crash = byId.crash;
  const complete = byId.complete;
  const characters = tracks.filter((t) => t.kind === "character");

  return (
    <div className="onboarding">
      <BackdropStage activeCard={activeCard} />

      <div className="onboarding-stage">
        <header className="onboarding-top">
          <div className="brand-block">
            <p className="brand-kicker">Doomsday Watch Path</p>
            <h1 className="brand-title">Path to Doomsday</h1>
            <p className="brand-sub">
              Pick a path, browse character arcs, build custom, or add your plan
              to Calendar.
            </p>
          </div>
          <DoomsdayCountdown />
          <HomeShare />
        </header>

        <p className="path-section-label">Watch paths</p>
        <section className="path-grid" aria-label="Path selection">
          <PathCard
            id="prep"
            badge="Recommended"
            title="Recommended"
            subtitle={CARD_BLURBS.prep}
            meta={`${prep?.titleIds.length ?? 0} titles · ${prep?.runtime?.toDoomsday.label ?? "-"}`}
            href="/path/prep"
            banner={CARD_HERO.prep}
            featured
            active={activeCard === "prep"}
            onFocusCard={setActiveCard}
          />
          <PathCard
            id="crash"
            title="Crash"
            subtitle={CARD_BLURBS.crash}
            meta={`${crash?.titleIds.length ?? 0} titles · ${crash?.runtime?.toDoomsday.label ?? "-"}`}
            href="/path/crash"
            banner={CARD_HERO.crash}
            active={activeCard === "crash"}
            onFocusCard={setActiveCard}
          />
          <PathCard
            id="complete"
            title="Complete"
            subtitle={CARD_BLURBS.complete}
            meta={`${complete?.titleIds.length ?? 0} titles · ${complete?.runtime?.toDoomsday.label ?? "-"}`}
            href="/path/complete"
            banner={CARD_HERO.complete}
            active={activeCard === "complete"}
            onFocusCard={setActiveCard}
          />
          <PathCard
            id="more"
            title="More"
            subtitle={CARD_BLURBS.more}
            meta={`${characters.length} character tracks · X-Men`}
            banner={CARD_HERO.more}
            cta="Browse more"
            active={activeCard === "more"}
            onFocusCard={setActiveCard}
            onOpen={() => {
              setActiveCard("more");
              setMoreOpen(true);
            }}
          />
          <PathCard
            id="custom"
            title="Custom"
            subtitle={CARD_BLURBS.custom}
            meta="Build your own · search & add"
            href="/custom"
            banner={CARD_HERO.custom}
            cta="Custom build"
            active={activeCard === "custom"}
            onFocusCard={setActiveCard}
          />
        </section>
      </div>

      <MorePanel
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        characterTracks={characters}
        xmenTrack={byId.xmen}
        titles={titles}
        onFocusCard={setActiveCard}
      />
    </div>
  );
}
