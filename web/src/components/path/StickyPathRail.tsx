"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { daysUntilDoomsday, formatRuntime } from "@/lib/path";
import type { ProgressMap } from "@/lib/progress";
import {
  paceHoursPerDay,
  progressPercent,
  progressRemainingTitles,
  remainingLiveMinutes,
  countableTitles,
} from "@/lib/remaining";
import type { Title } from "@/lib/types";
import { CalendarPlanModal } from "./CalendarPlanModal";

type StatusTone = "good" | "warn" | "danger";

function toneClass(tone: StatusTone) {
  return `status-${tone}`;
}

function progressTone(pct: number): StatusTone {
  if (pct >= 67) return "good";
  if (pct >= 34) return "warn";
  return "danger";
}

function paceTone(pace: number | null): StatusTone {
  if (pace === null || pace <= 1) return "good";
  if (pace <= 2.5) return "warn";
  return "danger";
}

function remainingTone(
  remainingMins: number,
  totalMins: number,
  pace: number | null,
): StatusTone {
  if (remainingMins <= 0 || totalMins <= 0) return "good";
  const cleared = 1 - remainingMins / totalMins;
  if (cleared >= 0.67 && (pace === null || pace <= 2.5)) return "good";
  if (cleared >= 0.33 || (pace !== null && pace <= 2.5)) return "warn";
  return "danger";
}

type Props = {
  titles: Title[];
  activeTitleId: string;
  progress: ProgressMap;
  trackId: string;
  trackName: string;
  watchUrls: Record<string, string>;
};

export function StickyPathRail({
  titles,
  activeTitleId,
  progress,
  trackId,
  trackName,
  watchUrls,
}: Props) {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const remainingMins = useMemo(
    () => remainingLiveMinutes(titles, activeTitleId, progress),
    [titles, activeTitleId, progress],
  );
  const totalMins = useMemo(
    () =>
      countableTitles(titles).reduce((sum, t) => sum + (t.runtimeMinutes || 0), 0),
    [titles],
  );
  const calendarTitles = useMemo(
    () => progressRemainingTitles(titles, progress),
    [titles, progress],
  );
  const daysLeft = daysUntilDoomsday();
  const pace = paceHoursPerDay(remainingMins, daysLeft);
  const pct = progressPercent(titles, progress);
  const countable = useMemo(() => countableTitles(titles), [titles]);
  const doneCount = useMemo(
    () =>
      countable.filter(
        (t) => progress[t.id] === "watched" || progress[t.id] === "skipped",
      ).length,
    [countable, progress],
  );
  const totalCount = countable.length;
  const calendarEmpty = calendarTitles.length === 0;

  const tones = {
    remaining: remainingTone(remainingMins, totalMins, pace),
    pace: paceTone(pace),
    progress: progressTone(pct),
  };

  return (
    <>
      <div
        className={`sticky-path-rail ${scrolled ? "is-scrolled" : ""}`}
        role="region"
        aria-label="Path progress"
      >
        <Link
          href="/"
          className="sticky-rail-back is-visible"
          aria-label="Back to journeys"
          title="Back to journeys"
        >
          <span className="chevron chevron-left" aria-hidden />
        </Link>
        <div className="sticky-rail-stats">
          <div className={`sticky-rail-stat ${toneClass(tones.remaining)}`}>
            <span className="label">Left</span>
            <span className="value">{formatRuntime(remainingMins)}</span>
          </div>
          <div className={`sticky-rail-stat ${toneClass(tones.pace)}`}>
            <span className="label">Pace</span>
            <span className="value">
              {pace === null ? "Clear" : `${pace.toFixed(1)}h/d`}
            </span>
          </div>
          <div className={`sticky-rail-stat ${toneClass(tones.progress)}`}>
            <span className="label">Done</span>
            <span
              className="value"
              aria-label={`${doneCount} of ${totalCount} titles, ${pct} percent`}
            >
              {doneCount}/{totalCount}
              <span className="sticky-rail-pct">{pct}%</span>
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="calendar-fab"
        onClick={() => setPlannerOpen(true)}
        disabled={calendarEmpty}
        title={calendarEmpty ? "Nothing left to schedule" : "Add to Calendar"}
        aria-label="Add to Calendar"
      >
        <svg
          className="calendar-fab-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M3 10h18M8 3v4M16 3v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Add to Calendar</span>
      </button>

      <CalendarPlanModal
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        titles={calendarTitles}
        allTitles={titles}
        trackId={trackId}
        trackName={trackName}
        watchUrls={watchUrls}
      />
    </>
  );
}
