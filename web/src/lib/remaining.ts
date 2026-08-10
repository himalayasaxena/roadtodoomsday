import type { Title } from "./types";

const SECRET = "avengers-secret-wars";

export function countableTitles(titles: Title[]) {
  return titles.filter((t) => t.id !== SECRET);
}

export function progressRemainingTitles(
  titles: Title[],
  progress: Record<string, string | undefined>,
): Title[] {
  return countableTitles(titles).filter((t) => {
    const st = progress[t.id];
    return st !== "watched" && st !== "skipped";
  });
}

export function remainingTitles(
  titles: Title[],
  activeTitleId: string,
  progress: Record<string, string | undefined>,
): Title[] {
  const list = countableTitles(titles);
  let activeIdx = list.findIndex((t) => t.id === activeTitleId);
  if (activeIdx < 0) activeIdx = 0;
  const result: Title[] = [];
  for (let i = activeIdx; i < list.length; i++) {
    const t = list[i];
    const st = progress[t.id];
    if (st === "watched" || st === "skipped") continue;
    result.push(t);
  }
  return result;
}

export function remainingLiveMinutes(
  titles: Title[],
  activeTitleId: string,
  progress: Record<string, string | undefined>,
): number {
  return remainingTitles(titles, activeTitleId, progress).reduce(
    (sum, t) => sum + (t.runtimeMinutes || 0),
    0,
  );
}

export function progressPercent(
  titles: Title[],
  progress: Record<string, string | undefined>,
): number {
  const list = countableTitles(titles);
  if (!list.length) return 0;
  const done = list.filter(
    (t) => progress[t.id] === "watched" || progress[t.id] === "skipped",
  ).length;
  return Math.round((done / list.length) * 100);
}

export function paceHoursPerDay(
  remainingMins: number,
  daysLeft: number,
): number | null {
  if (remainingMins <= 0) return null;
  const days = Math.max(1, daysLeft);
  return remainingMins / 60 / days;
}
