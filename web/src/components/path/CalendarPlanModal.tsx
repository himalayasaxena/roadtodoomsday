"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { trackEvent } from "@/lib/analytics";
import {
  buildWatchSchedule,
  downloadIcs,
  eventsToIcs,
  type ScheduleResult,
} from "@/lib/calendar";
import { formatRuntime } from "@/lib/path";
import type { Title } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  titles: Title[];
  allTitles: Title[];
  trackId: string;
  trackName: string;
  watchUrls: Record<string, string>;
};

function formatFinish(d: Date | null): string {
  if (!d) return "-";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CalendarPlanModal({
  open,
  onClose,
  titles,
  allTitles,
  trackId,
  trackName,
  watchUrls,
}: Props) {
  const titleId = useId();
  const [time, setTime] = useState("21:00");
  const [includeWeekends, setIncludeWeekends] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [hour, minute] = useMemo(() => {
    const [h, m] = time.split(":").map((x) => Number(x));
    return [Number.isFinite(h) ? h : 21, Number.isFinite(m) ? m : 0] as const;
  }, [time]);

  const preview: ScheduleResult = useMemo(
    () =>
      buildWatchSchedule(titles, {
        trackName,
        startHour: hour,
        startMinute: minute,
        includeWeekends,
        watchUrls,
        allTitles,
      }),
    [titles, trackName, hour, minute, includeWeekends, watchUrls, allTitles],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  async function onDownload() {
    if (!titles.length) return;
    trackEvent("calendar_export", {
      track_id: trackId,
      title_count: titles.length,
      sitting_days: preview.sittingDays,
      include_weekends: includeWeekends,
      tight: preview.tight,
    });
    await downloadIcs(
      `doomsday-watch-${trackId}.ics`,
      eventsToIcs(preview.events, trackName),
    );
  }

  if (!open || !mounted) return null;

  const withWatchLink = titles.filter((t) => watchUrls[t.id]).length;

  return createPortal(
    <div
      className="calendar-modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="calendar-modal-backdrop"
        aria-label="Close calendar planner"
        onClick={onClose}
      />
      <div className="calendar-modal-panel glass-panel">
        <header className="calendar-modal-header">
          <div>
            <p className="calendar-modal-kicker">Import plan</p>
            <h2 id={titleId} className="calendar-modal-title">
              Add to Calendar
            </h2>
          </div>
          <button
            type="button"
            className="modal-back-btn"
            onClick={onClose}
            aria-label="Close calendar planner"
          >
            <span className="chevron chevron-left" aria-hidden />
            Back
          </button>
        </header>

        <div className="calendar-modal-body">
          <label className="calendar-field">
            <span className="calendar-field-label">Preferred start time</span>
            <input
              type="time"
              className="calendar-time-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>

          <label className="calendar-toggle">
            <input
              type="checkbox"
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
            />
            <span>
              <strong>Include weekends</strong>
              <span className="calendar-toggle-hint">
                {includeWeekends
                  ? "Sitings can land on Sat & Sun"
                  : "Weekdays only (Mon-Fri)"}
              </span>
            </span>
          </label>

          <section className="calendar-preview" aria-live="polite">
            <h3 className="calendar-preview-heading">Your plan</h3>
            <dl className="calendar-preview-grid">
              <div>
                <dt>Movies</dt>
                <dd>{preview.movieCount}</dd>
              </div>
              <div>
                <dt>Total watch time</dt>
                <dd>{formatRuntime(preview.totalMinutes)}</dd>
              </div>
              <div>
                <dt>Sitting days</dt>
                <dd>{preview.sittingDays}</dd>
              </div>
              <div>
                <dt>Finish by</dt>
                <dd>{formatFinish(preview.finishDate)}</dd>
              </div>
              <div>
                <dt>Watch links</dt>
                <dd>
                  {withWatchLink}/{preview.movieCount} titles
                </dd>
              </div>
            </dl>
            {preview.tight ? (
              <p className="calendar-preview-warn">
                Tight schedule. Some nights will have more than one title to
                finish before Doomsday.
              </p>
            ) : (
              <p className="calendar-preview-ok">
                One title per sitting day through Doomsday.
              </p>
            )}
            <p className="calendar-preview-note">
              Each event includes a <strong>Watch here</strong> link to the
              streamer for your region (when available), plus a 30‑minute
              reminder. Add to Calendar saves a plan you can open in Apple,
              Google, or Outlook.
            </p>
          </section>
        </div>

        <footer className="calendar-modal-footer">
          <button type="button" className="chip-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="action-btn calendar-confirm"
            onClick={() => void onDownload()}
            disabled={!titles.length}
          >
            Add to Calendar
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
