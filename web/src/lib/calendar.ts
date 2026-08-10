import { formatRuntime } from "./path";
import { countableTitles } from "./remaining";
import type { Title } from "./types";

export type CalendarEvent = {
  titleId: string;
  summary: string;
  description: string;
  start: Date;
  end: Date;
};

export type ScheduleOptions = {
  trackName: string;
  now?: Date;
  allTitles?: Title[];
  /** Local hour to start each sitting (default 21) */
  startHour?: number;
  /** Local minute (default 0) */
  startMinute?: number;
  /** When false, skip Saturday/Sunday (default true) */
  includeWeekends?: boolean;
  /** Preferred stream URL per title id */
  watchUrls?: Record<string, string>;
};

export type ScheduleResult = {
  events: CalendarEvent[];
  tight: boolean;
  movieCount: number;
  totalMinutes: number;
  sittingDays: number;
  finishDate: Date | null;
};

const LAST_NIGHT = new Date(2026, 11, 17); // Dec 17, 2026 local

function localMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/** Sitting calendar days from start through lastNight (inclusive). */
export function collectSittingDays(
  startDay: Date,
  lastNight: Date,
  includeWeekends: boolean,
): Date[] {
  const days: Date[] = [];
  let cursor = localMidnight(startDay);
  const end = localMidnight(lastNight);
  while (cursor.getTime() <= end.getTime()) {
    if (includeWeekends || !isWeekend(cursor)) {
      days.push(new Date(cursor));
    }
    cursor = addDays(cursor, 1);
  }
  return days;
}

function sittingAt(day: Date, hour: number, minute: number): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hour,
    minute,
    0,
    0,
  );
}

function buildDescription(title: Title, watchUrl?: string): string {
  const parts: string[] = [];
  if (title.whyWatch) parts.push(title.whyWatch);
  if (watchUrl) parts.push(`Watch here: ${watchUrl}`);
  parts.push(
    "Fan plan. Not affiliated with Marvel/Disney. Availability may change.",
  );
  return parts.join("\n\n");
}

function buildSummary(index: number, title: Title): string {
  const mins = title.runtimeMinutes ?? 0;
  return `#${index + 1} ${title.title} (${formatRuntime(mins)})`;
}

function pathIndexForTitle(t: Title, allTitles: Title[]): number {
  const idx = countableTitles(allTitles).findIndex((x) => x.id === t.id);
  return idx >= 0 ? idx : 0;
}

export function buildWatchSchedule(
  titles: Title[],
  opts: ScheduleOptions,
): ScheduleResult {
  const now = opts.now ?? new Date();
  const filtered = titles.filter((t) => t.id !== "avengers-secret-wars");
  const pathList = opts.allTitles ?? titles;
  const pathIndex = (t: Title) => pathIndexForTitle(t, pathList);
  const hour = opts.startHour ?? 21;
  const minute = opts.startMinute ?? 0;
  const includeWeekends = opts.includeWeekends ?? true;
  const watchUrls = opts.watchUrls ?? {};

  const startDay = addDays(localMidnight(now), 1);
  const pastDeadline = startDay.getTime() > localMidnight(LAST_NIGHT).getTime();
  let sittingDays = collectSittingDays(startDay, LAST_NIGHT, includeWeekends);

  // Past deadline or no valid days → still schedule from tomorrow onward
  if (sittingDays.length === 0 || pastDeadline) {
    sittingDays = [];
    let d = startDay;
    // Generate enough weekdays/weekends from tomorrow
    while (sittingDays.length < Math.max(1, filtered.length)) {
      if (includeWeekends || !isWeekend(d)) sittingDays.push(new Date(d));
      d = addDays(d, 1);
      if (sittingDays.length > 400) break;
    }
  }

  const nightsAvailable = Math.max(1, sittingDays.length);

  const events: CalendarEvent[] = [];
  const totalMinutes = filtered.reduce(
    (sum, t) => sum + (t.runtimeMinutes ?? 0),
    0,
  );

  if (filtered.length <= nightsAvailable && !pastDeadline) {
    for (let i = 0; i < filtered.length; i++) {
      const title = filtered[i];
      const day = sittingDays[i];
      const start = sittingAt(day, hour, minute);
      const mins = title.runtimeMinutes ?? 0;
      const end = new Date(start.getTime() + mins * 60 * 1000);
      events.push({
        titleId: title.id,
        summary: buildSummary(pathIndex(title), title),
        description: buildDescription(title, watchUrls[title.id]),
        start,
        end,
      });
    }
  } else {
    const titlesPerNight = Math.ceil(filtered.length / nightsAvailable);
    let titleIndex = 0;
    for (
      let night = 0;
      night < nightsAvailable && titleIndex < filtered.length;
      night++
    ) {
      let cursor = sittingAt(sittingDays[night], hour, minute);
      const remaining = filtered.length - titleIndex;
      const count = Math.min(titlesPerNight, remaining);
      for (let j = 0; j < count; j++) {
        const title = filtered[titleIndex];
        const mins = title.runtimeMinutes ?? 0;
        const end = new Date(cursor.getTime() + mins * 60 * 1000);
        events.push({
          titleId: title.id,
          summary: buildSummary(pathIndex(title), title),
          description: buildDescription(title, watchUrls[title.id]),
          start: new Date(cursor),
          end,
        });
        cursor = end;
        titleIndex++;
      }
    }
  }

  const finishDate =
    events.length > 0 ? events[events.length - 1].start : null;
  const usedDays = new Set(
    events.map((e) => localMidnight(e.start).getTime()),
  ).size;

  return {
    events,
    tight: pastDeadline || filtered.length > nightsAvailable,
    movieCount: filtered.length,
    totalMinutes,
    sittingDays: usedDays || Math.min(filtered.length, nightsAvailable),
    finishDate,
  };
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcsLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function formatIcsUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

export function eventsToIcs(events: CalendarEvent[], calendarName: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Doomsday Watch Path//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
  ];

  const dtstamp = formatIcsUtc(new Date());

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.titleId}-${event.start.getTime()}@doomsday-watch`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${formatIcsLocal(event.start)}`,
      `DTEND:${formatIcsLocal(event.end)}`,
      `SUMMARY:${escapeIcsText(event.summary)}`,
      `DESCRIPTION:${escapeIcsText(event.description)}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT30M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(event.summary)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

function isAppleTouchDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** Save / open an .ics - share sheet on mobile when available; download elsewhere. */
export async function downloadIcs(
  filename: string,
  ics: string,
): Promise<void> {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const file = new File([blob], filename, { type: "text/calendar" });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (err) {
      // User dismissed the sheet - stop. Other errors fall through.
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
  }

  const url = URL.createObjectURL(blob);

  // iOS Safari ignores <a download> for blob URLs; open the file instead
  // so the system offers “Add to Calendar”.
  if (isAppleTouchDevice()) {
    const opened = window.open(url, "_blank");
    if (!opened) window.location.assign(url);
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}
