# Sticky Path Rail + Calendar Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sticky path rail (Doomsday countdown, scroll+progress remaining watch time, pace, progress %, Add to Calendar `.ics`) plus track switcher chips and site footer attribution.

**Architecture:** Pure helpers in `lib/remaining.ts` and `lib/calendar.ts` own math and ICS generation. `StickyPathRail` is a client UI wired from `PathExplorer` using existing `activeTitleId` + `progress`. Footer lives in root layout. No new backend.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · CSS in `globals.css` · Vitest for pure lib tests · `.ics` download via Blob URL

## Global Constraints

- Doomsday target: `2026-12-18T00:00:00.000Z` (`DOOMSDAY_RELEASE` in `web/src/lib/catalog.ts`)
- Exclude `avengers-secret-wars` from countable / remaining / calendar
- Remaining math = option C (scroll active index + watched/skipped permanent)
- Calendar v1 = `.ics` download only (no OAuth, no planner modal)
- Default sitting: 21:00 local; start tomorrow; 30‑min alarm
- Glass UI; no card height change from rail
- Respect `prefers-reduced-motion`
- Do not commit unless user asks

---

## File structure

| File | Responsibility |
|---|---|
| `web/src/lib/remaining.ts` | `remainingLiveMinutes`, `progressPercent`, `paceHoursPerDay` |
| `web/src/lib/calendar.ts` | Schedule remaining titles → ICS string + download |
| `web/src/lib/remaining.test.ts` | Unit tests for remaining/pace |
| `web/src/lib/calendar.test.ts` | Unit tests for schedule + ICS |
| `web/src/components/path/StickyPathRail.tsx` | Sticky UI + calendar button |
| `web/src/components/path/PathExplorer.tsx` | Wire rail + track switcher |
| `web/src/components/SiteFooter.tsx` | Attribution footer |
| `web/src/app/layout.tsx` | Render footer |
| `web/src/app/globals.css` | Rail, switcher, footer, priority visibility |
| `web/package.json` | Add `vitest` + `test` script |
| `docs/feature-list.md` | Mark shipped items |

---

### Task 1: Remaining / pace helpers + Vitest

**Files:**
- Create: `web/src/lib/remaining.ts`
- Create: `web/src/lib/remaining.test.ts`
- Modify: `web/package.json` (add vitest, `"test": "vitest run"`)
- Create: `web/vitest.config.ts` (resolve `@` → `./src`)

**Interfaces:**
- Produces:
  - `remainingLiveMinutes(titles: Title[], activeTitleId: string, progress: Record<string, string | undefined>): number`
  - `progressPercent(titles: Title[], progress: Record<string, string | undefined>): number` (0–100, integer)
  - `paceHoursPerDay(remainingMins: number, daysLeft: number): number | null` (`null` when remaining is 0)

- [ ] **Step 1: Add vitest**

```bash
cd /Users/himalaya/Desktop/dooms/web && npm install -D vitest
```

`web/vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write failing tests**

```ts
// web/src/lib/remaining.test.ts
import { describe, expect, it } from "vitest";
import {
  remainingLiveMinutes,
  progressPercent,
  paceHoursPerDay,
} from "./remaining";
import type { Title } from "./types";

const titles: Title[] = [
  { id: "a", title: "A", year: 2008, sequenceOrder: 1, runtimeMinutes: 120 },
  { id: "b", title: "B", year: 2009, sequenceOrder: 2, runtimeMinutes: 90 },
  { id: "c", title: "C", year: 2010, sequenceOrder: 3, runtimeMinutes: 60 },
  {
    id: "avengers-secret-wars",
    title: "SW",
    year: 2027,
    sequenceOrder: 99,
    runtimeMinutes: 180,
  },
];

describe("remainingLiveMinutes", () => {
  it("sums from active index ignoring secret wars", () => {
    expect(remainingLiveMinutes(titles, "a", {})).toBe(270);
    expect(remainingLiveMinutes(titles, "b", {})).toBe(150);
    expect(remainingLiveMinutes(titles, "c", {})).toBe(60);
  });

  it("excludes watched/skipped even at/after active", () => {
    expect(
      remainingLiveMinutes(titles, "a", { a: "watched", b: "skipped" }),
    ).toBe(60);
  });

  it("does not count titles before active (scroll-passed)", () => {
    expect(remainingLiveMinutes(titles, "c", {})).toBe(60);
  });
});

describe("progressPercent", () => {
  it("uses watched+skipped over countable", () => {
    expect(progressPercent(titles, {})).toBe(0);
    expect(progressPercent(titles, { a: "watched" })).toBe(33);
    expect(progressPercent(titles, { a: "watched", b: "skipped", c: "watched" })).toBe(100);
  });
});

describe("paceHoursPerDay", () => {
  it("returns null when remaining is 0", () => {
    expect(paceHoursPerDay(0, 10)).toBe(null);
  });
  it("divides by days left (min 1)", () => {
    expect(paceHoursPerDay(120, 0)).toBe(2);
    expect(paceHoursPerDay(180, 3)).toBe(1);
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `cd web && npm test -- src/lib/remaining.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 4: Implement `remaining.ts`**

```ts
import type { Title } from "./types";

const SECRET = "avengers-secret-wars";

export function countableTitles(titles: Title[]) {
  return titles.filter((t) => t.id !== SECRET);
}

export function remainingLiveMinutes(
  titles: Title[],
  activeTitleId: string,
  progress: Record<string, string | undefined>,
): number {
  const list = countableTitles(titles);
  let activeIdx = list.findIndex((t) => t.id === activeTitleId);
  if (activeIdx < 0) activeIdx = 0;
  let sum = 0;
  for (let i = activeIdx; i < list.length; i++) {
    const t = list[i];
    const st = progress[t.id];
    if (st === "watched" || st === "skipped") continue;
    sum += t.runtimeMinutes || 0;
  }
  return sum;
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
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `cd web && npm test -- src/lib/remaining.test.ts`
Expected: PASS

---

### Task 2: Calendar schedule + ICS

**Files:**
- Create: `web/src/lib/calendar.ts`
- Create: `web/src/lib/calendar.test.ts`

**Interfaces:**
- Consumes: `Title`, `DOOMSDAY_RELEASE`, `formatRuntime` from `path.ts`
- Produces:
  - `type CalendarEvent = { titleId: string; summary: string; description: string; start: Date; end: Date }`
  - `buildWatchSchedule(titles: Title[], opts: { pathUrl: string; trackName: string; now?: Date }): { events: CalendarEvent[]; tight: boolean }`
  - `eventsToIcs(events: CalendarEvent[], calendarName: string): string`
  - `downloadIcs(filename: string, ics: string): void` (browser-only; no unit test)

- [ ] **Step 1: Write failing tests**

```ts
// web/src/lib/calendar.test.ts
import { describe, expect, it } from "vitest";
import { buildWatchSchedule, eventsToIcs } from "./calendar";
import type { Title } from "./types";

const titles: Title[] = [
  {
    id: "iron-man",
    title: "Iron Man",
    year: 2008,
    sequenceOrder: 1,
    runtimeMinutes: 126,
    whyWatch: "Origin.",
  },
  {
    id: "thor",
    title: "Thor",
    year: 2011,
    sequenceOrder: 2,
    runtimeMinutes: 115,
  },
];

describe("buildWatchSchedule", () => {
  it("schedules one title per evening starting tomorrow at 21:00 local", () => {
    const now = new Date(2026, 5, 1, 12, 0, 0); // Jun 1 2026 local
    const { events, tight } = buildWatchSchedule(titles, {
      pathUrl: "https://example.com/path/prep",
      trackName: "Prep",
      now,
    });
    expect(tight).toBe(false);
    expect(events).toHaveLength(2);
    expect(events[0].start.getHours()).toBe(21);
    expect(events[0].start.getDate()).toBe(2);
    expect(events[0].end.getTime() - events[0].start.getTime()).toBe(126 * 60 * 1000);
    expect(events[0].summary).toContain("Iron Man");
    expect(events[1].start.getDate()).toBe(3);
  });

  it("sets tight when more titles than nights before Doomsday", () => {
    const many = Array.from({ length: 40 }, (_, i) => ({
      id: `t${i}`,
      title: `T${i}`,
      year: 2000 + i,
      sequenceOrder: i,
      runtimeMinutes: 90,
    }));
    const now = new Date(2026, 11, 10, 12, 0, 0); // Dec 10 — few nights left
    const { tight, events } = buildWatchSchedule(many, {
      pathUrl: "https://example.com/path/prep",
      trackName: "Prep",
      now,
    });
    expect(tight).toBe(true);
    expect(events.length).toBe(40);
  });
});

describe("eventsToIcs", () => {
  it("includes VCALENDAR, VEVENT, VALARM", () => {
    const now = new Date(2026, 5, 1, 12, 0, 0);
    const { events } = buildWatchSchedule(titles, {
      pathUrl: "https://example.com/path/prep",
      trackName: "Prep",
      now,
    });
    const ics = eventsToIcs(events, "Doomsday Watch Path");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("TRIGGER:-PT30M");
    expect(ics).toContain("Iron Man");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `cd web && npm test -- src/lib/calendar.test.ts`

- [ ] **Step 3: Implement `calendar.ts`**

Implementation notes (must match tests):

- Filter out secret wars; keep input order.
- `startDay` = local calendar date of `now` + 1 day.
- `lastNight` = local Dec 17, 2026 (day before Doomsday).
- `nightsAvailable` = number of calendar days from startDay through lastNight inclusive; `Math.max(1, …)`.
- `tight = titles.length > nightsAvailable`.
- If not tight: event `i` on `startDay + i` at 21:00, duration = runtime.
- If tight: distribute round-robin / pack — place titles in order across nights, multiple per night when needed (fill nights evenly: `titlesPerNight = ceil(N/D)`, assign sequentially).
- Summary: `#${i+1} ${title.title} (${formatRuntime(mins)})`.
- Description: whyWatch + `\n\n` + pathUrl + `\n\nFan plan — not affiliated with Marvel/Disney. Availability may change.`
- ICS: use local floating times `YYYYMMDDTHHMMSS` (no Z) OR UTC; prefer floating local via components from Date getters.
- Escape ICS text (`,;\\` and newlines → `\\n`).
- `downloadIcs`: create Blob `text/calendar`, temporary `<a download>`, click, revoke.

- [ ] **Step 4: Run — expect PASS**

Run: `cd web && npm test -- src/lib/calendar.test.ts`

---

### Task 3: StickyPathRail component + CSS

**Files:**
- Create: `web/src/components/path/StickyPathRail.tsx`
- Modify: `web/src/app/globals.css` (append sticky-rail styles)

**Interfaces:**
- Consumes: remaining helpers, `daysUntilDoomsday`, `formatRuntime`, `DOOMSDAY_RELEASE`, calendar helpers, `ProgressMap` / Title
- Produces: `<StickyPathRail titles activeTitleId progress trackId trackName pathUrl />`

- [ ] **Step 1: Implement component**

```tsx
"use client";
// StickyPathRail.tsx — glass sticky bar with:
// - live Doomsday countdown (setInterval 1s)
// - Remaining: formatRuntime(remainingLiveMinutes(...))
// - Pace: paceHoursPerDay(...) → `${x.toFixed(1)}h/day` or "Path clear"
// - Progress: `${progressPercent(...)}%`
// - Button "Add to Calendar" → buildWatchSchedule(remaining titles only) → downloadIcs
//   remaining titles = countable from active onward not watched/skipped (same filter as remainingLiveMinutes list)
// - If schedule.tight, set brief status text "Tight schedule — multiple titles some nights"
```

Export a small helper in `remaining.ts` if useful:

```ts
export function remainingTitles(
  titles: Title[],
  activeTitleId: string,
  progress: Record<string, string | undefined>,
): Title[]
```

(same filter as the sum loop; add a unit test that length matches.)

- [ ] **Step 2: CSS**

```css
.sticky-path-rail {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  margin: 0 0 1rem;
  /* glass-panel class on element */
}
.sticky-rail-stats { display: flex; flex-wrap: wrap; gap: 1rem; align-items: baseline; }
.sticky-rail-stat { display: flex; flex-direction: column; gap: 0.1rem; }
.sticky-rail-stat .label { font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.sticky-rail-stat .value { font-variant-numeric: tabular-nums; font-size: 0.95rem; }
.sticky-rail-actions { display: flex; gap: 0.5rem; align-items: center; }
.sticky-rail-note { font-size: 0.75rem; color: var(--muted); width: 100%; }
@media (max-width: 720px) {
  .sticky-path-rail { top: 0; border-radius: 0; margin-left: -1rem; margin-right: -1rem; }
}
```

Reuse countdown cell styles where possible (compact single-line `12d 04h 22m 08s` is fine for rail density).

- [ ] **Step 3: Manual check** — `npm run build` compiles with the new file imported from a temporary export or after Task 4 wire-up.

---

### Task 4: Wire PathExplorer — rail + track switcher

**Files:**
- Modify: `web/src/components/path/PathExplorer.tsx`
- Modify: `web/src/app/globals.css` (track switcher chips)

**Interfaces:**
- Consumes: `StickyPathRail`, tracks list for switcher
- PathExplorer gains optional `switcherTracks: { id: string; name: string }[]` prop OR hardcode the four path ids

- [ ] **Step 1: Pass tracks into PathExplorer**

In `web/src/app/path/[trackId]/page.tsx`, filter `tracks.filter(t => ["prep","crash","complete","xmen"].includes(t.id))` and pass as `switcherTracks`.

- [ ] **Step 2: Render rail + switcher in PathExplorer**

Place `<StickyPathRail … />` immediately inside `<main>`, before or after header (prefer after `path-top` so brand stays first; rail sticks on scroll).

```tsx
<StickyPathRail
  titles={titles}
  activeTitleId={activeTitleId}
  progress={progress}
  trackId={trackId}
  trackName={trackName}
  pathUrl={typeof window !== "undefined" ? `${window.location.origin}${getSharePath()}` : getSharePath()}
/>
```

For SSR-safe pathUrl, build absolute URL only inside the calendar click handler (read `window.location.origin` there). Pass `getSharePath` instead.

Track switcher in `path-toolbar`:

```tsx
<nav className="track-switcher" aria-label="Switch journey">
  {switcherTracks.map((t) => (
    <Link
      key={t.id}
      href={`/path/${t.id}`}
      className={`chip-btn ${t.id === trackId ? "on" : ""}`}
    >
      {shortLabel(t.id)}
    </Link>
  ))}
</nav>
```

`shortLabel`: prep→Recommended, crash→Crash, complete→Complete, xmen→X-Men.

- [ ] **Step 3: Build**

Run: `cd web && npm run build`
Expected: success

---

### Task 5: Site footer + priority polish + feature-list

**Files:**
- Create: `web/src/components/SiteFooter.tsx`
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/globals.css`
- Modify: `docs/feature-list.md`
- Modify: `docs/superpowers/specs/2026-08-11-sticky-rail-calendar-design.md` (Status: Implemented)

- [ ] **Step 1: Footer**

```tsx
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Fan-made watch roadmap — not affiliated with Marvel, Disney, or any studio.
      </p>
      <p>
        Posters/metadata courtesy of TMDB. Watch links via JustWatch. Runtimes and
        availability can change. Calendar export is a personal plan, not a guarantee.
      </p>
    </footer>
  );
}
```

Add to layout after `{children}`.

- [ ] **Step 2: Priority badge** — ensure `.timeline-priority` has visible contrast; if ESSENTIAL/HIGH/OPTIONAL strings look weak, add:

```css
.timeline-priority {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

- [ ] **Step 3: Update feature-list checkboxes** for:
  - Countdown + path stats in Next.js → `[x]`
  - Live ticking countdown → `[x]` (landing already + rail)
  - Watched/skipped local → `[x]`
  - Progress % → `[x]`
  - Shareable progress (partial already) leave as was
  - `.ics` export → `[x]` (v1 simple)
  - Exclude already-watched from calendar → `[x]`
  - Track switcher → `[x]`
  - Priority badges → `[x]`
  - Attribution footer → `[x]`
  - Disclaimer → `[x]`
  - Region selector → already in PathExplorer → `[x]`
  - Buffer & required pace → `[x]` (pace on rail)

- [ ] **Step 4: Final verify**

```bash
cd web && npm test && npm run build
```

Expected: all tests pass; build OK.

Manual: open `/path/prep`, scroll — remaining drops; mark watched — drops; Add to Calendar downloads ICS; switcher navigates; footer visible.

---

## Spec coverage check

| Spec item | Task |
|---|---|
| Sticky rail countdown | 3–4 |
| Remaining live (scroll + progress) | 1, 3–4 |
| Pace hrs/day | 1, 3 |
| Progress % | 1, 3 |
| Add to Calendar `.ics` | 2–3 |
| Tight schedule warning | 2–3 |
| Track switcher | 4 |
| Priority badges polish | 5 |
| Footer attribution | 5 |
| feature-list update | 5 |
| No card height jump | (existing; rail separate) |
| reduced-motion | 3 (no mandatory motion on rail) |

## Placeholder scan

None intentional — calendar packing algorithm spelled in Task 2 notes.
