"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Provider, Title, WatchOffer } from "@/lib/types";
import { daysUntilDoomsday, formatRuntime, pathMinutes } from "@/lib/path";
import { TimelineCard } from "./TimelineCard";
import { ShareBar } from "./ShareBar";
import { PathBackdrop } from "./PathBackdrop";
import { StickyPathRail } from "./StickyPathRail";
import {
  encodeProgressQuery,
  loadProgress,
  mergeProgress,
  saveProgress,
  setTitleStatus,
  trackStorageKey,
  type ProgressMap,
} from "@/lib/progress";
import { encodeCustomPathParam } from "@/lib/customPath";

type Props = {
  trackId: string;
  trackName: string;
  description: string;
  titles: Title[];
  customIds?: string[];
  /** Full catalog ids (sequence order) for compact custom `p=` shares */
  catalogIds?: string[];
  initialProgress?: ProgressMap;
  missingCustomIds?: string[];
  watchLinks: Record<string, { regions?: Record<string, WatchOffer[]> }>;
  providers: Provider[];
  /** Hide back link / simplify header when nested under custom builder chrome */
  embedded?: boolean;
};

export function PathExplorer({
  trackId,
  trackName,
  description,
  titles,
  customIds,
  catalogIds,
  initialProgress,
  missingCustomIds,
  watchLinks,
  providers,
  embedded = false,
}: Props) {
  const [region, setRegion] = useState<"IN" | "US">("IN");
  const [progress, setProgress] = useState<ProgressMap>({});
  const [activeTitleId, setActiveTitleId] = useState(titles[0]?.id || "");
  const [blend, setBlend] = useState({ from: "", to: "", progress: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  // Stable draft key while building - avoids reloading progress on every add.
  const storageKey = embedded
    ? "custom:builder-draft"
    : trackStorageKey(trackId, customIds);

  const backdropFor = (t?: Title) =>
    t?.backdropPublic ||
    t?.posterPublic ||
    "/media/backdrops/avengers-doomsday.jpg";

  useEffect(() => {
    const local = loadProgress(storageKey);
    const merged = mergeProgress(local, initialProgress || {});
    setProgress(merged);
    if (initialProgress && Object.keys(initialProgress).length) {
      saveProgress(storageKey, merged);
    }
  }, [storageKey, initialProgress]);

  // Keep active card valid when titles are added/removed without remounting.
  useEffect(() => {
    if (!titles.length) {
      setActiveTitleId("");
      return;
    }
    if (!titles.some((t) => t.id === activeTitleId)) {
      setActiveTitleId(titles[0].id);
    }
  }, [titles, activeTitleId]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scroll-linked backdrop blend + active card
  useEffect(() => {
    if (!titles.length) return;

    let raf = 0;
    const first = backdropFor(titles[0]);
    setBlend({ from: first, to: first, progress: 0 });

    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.42;
      const points: { id: string; center: number; src: string }[] = [];

      for (const t of titles) {
        const el = document.getElementById(`title-${t.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        points.push({
          id: t.id,
          center: rect.top + rect.height / 2,
          src: backdropFor(t),
        });
      }
      if (!points.length) return;

      // Find segment where viewport mid sits between card centers
      let i = 0;
      while (i < points.length - 1 && points[i + 1].center < mid) i += 1;

      const a = points[i];
      const b = points[Math.min(i + 1, points.length - 1)];
      let t = 0;
      if (a.id !== b.id) {
        const span = b.center - a.center;
        t = span === 0 ? 0 : (mid - a.center) / span;
        t = Math.min(1, Math.max(0, t));
        // smoothstep for softer ease
        t = t * t * (3 - 2 * t);
      }

      setActiveTitleId(t < 0.5 ? a.id : b.id);
      setBlend({ from: a.src, to: b.src, progress: t });
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [titles]);

  const providerMap = useMemo(
    () => Object.fromEntries(providers.map((p) => [p.id, p])),
    [providers],
  );

  const countable = titles.filter((t) => t.id !== "avengers-secret-wars");
  const watchedIds = countable.filter((t) => progress[t.id] === "watched");
  const skippedIds = countable.filter((t) => progress[t.id] === "skipped");
  const remainingTitles = countable.filter(
    (t) => progress[t.id] !== "watched" && progress[t.id] !== "skipped",
  );
  const remainingMins = pathMinutes(remainingTitles, false);
  const next = remainingTitles[0];

  function onStatus(id: string, status: "watched" | "skipped" | null) {
    setProgress((prev) => setTitleStatus(storageKey, prev, id, status));
  }

  function getSharePath() {
    const params = new URLSearchParams();
    if (trackId === "custom" && customIds?.length) {
      if (catalogIds?.length) {
        params.set("p", encodeCustomPathParam(customIds, catalogIds));
      } else {
        params.set("ids", customIds.join(","));
      }
    }
    const prog = encodeProgressQuery(progress, countable.map((t) => t.id));
    if (prog) {
      const extra = new URLSearchParams(prog);
      extra.forEach((v, k) => params.set(k, v));
    }
    const q = params.toString();
    return q ? `/path/${trackId}?${q}` : `/path/${trackId}`;
  }

  function offersFor(titleId: string) {
    const regions = watchLinks[titleId]?.regions || {};
    const primary = regions[region] || [];
    if (primary.length) return primary;
    const fallback = region === "IN" ? regions.US || [] : regions.IN || [];
    return fallback;
  }

  const watchUrls = useMemo(() => {
    const TYPE_RANK: Record<string, number> = {
      flatrate: 0,
      ads: 1,
      free: 2,
      cinema: 3,
      rent: 4,
      buy: 5,
    };
    const map: Record<string, string> = {};
    for (const t of titles) {
      const offers = offersFor(t.id);
      let best: { url: string; rank: number } | null = null;
      for (const o of offers) {
        if (!o.url) continue;
        const rank = TYPE_RANK[o.type] ?? 9;
        if (!best || rank < best.rank) best = { url: o.url, rank };
      }
      if (best) map[t.id] = best.url;
    }
    return map;
  }, [titles, region, watchLinks]);

  return (
    <div className="path-explorer">
      <PathBackdrop
        fromSrc={blend.from || backdropFor(titles[0])}
        toSrc={blend.to || blend.from || backdropFor(titles[0])}
        progress={blend.progress}
        reduceMotion={reduceMotion}
      />

      <main>
      <header className={`path-top ${embedded ? "is-embedded" : ""}`}>
        {embedded ? null : (
          <Link className="back-link" href="/">
            <span className="chevron chevron-left" aria-hidden />
            Journeys
          </Link>
        )}

        {embedded ? null : (
          <div className="path-top-copy">
            <h1 className="brand-title path-heading">{trackName}</h1>
            <p className="brand-sub path-lede">{description}</p>
            {missingCustomIds && missingCustomIds.length > 0 ? (
              <p className="path-warn">
                {missingCustomIds.length} title id(s) not found in catalog
              </p>
            ) : null}
          </div>
        )}

        {next ? (
          <a className="action-btn path-continue" href={`#title-${next.id}`}>
            <span className="path-continue-label">
              Continue
              <span className="chevron chevron-right" aria-hidden />
            </span>
            <span className="path-continue-title">{next.title}</span>
          </a>
        ) : (
          <span className="path-done">Path complete</span>
        )}

        <div className="path-controls">
          <div className="path-controls-secondary">
            <div className="region-toggle" role="group" aria-label="Watch on region">
              <span className="region-toggle-label">Region</span>
              <button
                type="button"
                className={`chip-btn quiet ${region === "IN" ? "on" : ""}`}
                onClick={() => setRegion("IN")}
              >
                India
              </button>
              <button
                type="button"
                className={`chip-btn quiet ${region === "US" ? "on" : ""}`}
                onClick={() => setRegion("US")}
              >
                US
              </button>
            </div>
            <ShareBar
              trackName={trackName}
              trackId={trackId}
              watched={watchedIds.length}
              skipped={skippedIds.length}
              total={countable.length}
              remainingLabel={formatRuntime(remainingMins)}
              daysLeft={daysUntilDoomsday()}
              getSharePath={getSharePath}
            />
          </div>
        </div>
      </header>

      <StickyPathRail
        titles={titles}
        activeTitleId={activeTitleId}
        progress={progress}
        trackId={trackId}
        trackName={trackName}
        watchUrls={watchUrls}
      />

      <section className="timeline" aria-label={`${trackName} watch timeline`}>
        <ol className="timeline-flow">
          {titles.map((t, i) => (
            <TimelineCard
              key={t.id}
              title={t}
              index={i + 1}
              total={titles.length}
              side={i % 2 === 0 ? "left" : "right"}
              active={t.id === activeTitleId}
              status={progress[t.id]}
              offers={offersFor(t.id)}
              providers={providerMap}
              onStatus={onStatus}
            />
          ))}
        </ol>
      </section>
      </main>
    </div>
  );
}
