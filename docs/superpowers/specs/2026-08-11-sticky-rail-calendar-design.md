# Sticky path rail + calendar export — design

**Date:** 2026-08-11  
**Status:** Implemented  
**Approach:** A — Compact sticky rail  
**Remaining math:** C — scroll-linked live readout + watched/skipped permanent removal

## Goal

On path explorer pages, keep pacing visible while scrolling: time until *Avengers: Doomsday*, how much watch time is left on the current path, required daily pace, and a one-tap **Add to Calendar** `.ics` for remaining titles. Close a few half-built product gaps in the same pass.

## Sticky rail

### Placement

- Sticky / fixed bar on path pages (`/path/[trackId]`), above the timeline content.
- Glass panel matching existing path UI; compact enough for mobile.
- Does not change timeline card height or layout when active highlight changes.

### Contents

| Element | Behavior |
|---|---|
| Until Doomsday | Live d / h / m / s countdown to `2026-12-18T00:00:00Z` |
| Remaining watch | Formatted hours/mins still ahead on this path (see math below) |
| Pace | `remainingHours / max(daysUntilDoomsday, 1)` → avg hrs/day needed |
| Progress % | `(watched + skipped) / countableTitles` (Secret Wars excluded from countable) |
| Add to Calendar | Downloads `.ics` for remaining titles |

### Remaining watch math

1. **Countable titles** = path titles excluding `avengers-secret-wars`.
2. **Progress-removed** = titles marked `watched` or `skipped` in local progress (permanent).
3. **Active index** = index of the scroll-active timeline card (existing scroll mid-band logic).
4. **Scroll-passed** = countable titles with index `< activeIndex` that are not progress-removed — treated as “accounted for” in the *live* readout only (does not write progress).
5. **`remainingLiveMins`** = sum of `runtimeMinutes` for titles that are:
   - index `>= activeIndex`, and
   - not watched/skipped.
6. Sticky rail displays `formatRuntime(remainingLiveMins)`.
7. Marking watched/skipped immediately drops those minutes from remaining (even if the card is still at/after active).

### Pace

- `paceHrsPerDay = remainingLiveMins / 60 / max(daysUntilDoomsday, 1)`.
- Show one decimal when useful (e.g. `2.4h/day`).
- If remaining is 0 → show “Path clear” / ready for Doomsday, not a pace number.

## Add to Calendar (`.ics` v1)

### Inputs (implicit — no full planner modal)

- Current track (or custom ids).
- Remaining titles = sequence order, not watched/skipped, exclude Secret Wars.
- User local timezone.
- Default sitting: **21:00 local**, duration = title runtime.
- Start: **tomorrow** (local calendar day).
- Deadline: day before Doomsday release (or Doomsday morning — use Dec 17 evening as last preferred slot; never schedule past Dec 18 00:00 local if avoidable).

### Scheduling algorithm (simple)

1. Let `N` = remaining title count, `D` = available evenings from start through last preferred night.
2. If `N <= D`: one title per evening, consecutive nights.
3. If `N > D`: pack multiple titles per evening in order (warn in UI: “Tight schedule — multiple titles some nights”).
4. Do not reorder titles.
5. Films are not split across days.
6. If remaining hours exceed hours until Doomsday in a hard way, still export but surface a short warning in the rail toast / button title.

### Event fields

- **Summary:** `#12 Iron Man (2h 06m)`
- **Description:** why-watch (if any) + path URL on the site + short disclaimer that availability can change
- **Duration:** `runtimeMinutes`
- **Alarm:** 30 minutes before
- **Filename:** `doomsday-watch-{trackId}.ics`

### Out of calendar v1

- Daily window picker, allowed-days UI, regenerate/shift, Google OAuth, family calendars, overnight windows.

## Also in this pass

| Item | Notes |
|---|---|
| Progress % | On sticky rail (and keep ShareBar counts) |
| Track switcher | Chips: Prep / Crash / Complete / X-Men → navigate to `/path/{id}` (preserve progress is per-track already) |
| Priority badges | Already rendered when `title.priority` exists — verify styles are visible |
| Footer attribution | Site footer: fan project, not affiliated with Marvel/Disney; TMDB + JustWatch attribution |

## Out of scope (this pass)

- Full calendar plan builder UI
- Era scroll theming (`data-era`)
- PWA, OAuth calendar
- Language badges, prerequisites graph
- In-universe chronological mode
- Account sync

## Components / files (expected)

- `StickyPathRail` — client component; props: titles, activeTitleId, progress, trackId, trackName, getSharePath / path URL
- `lib/calendar.ts` — schedule builder + ICS string + download helper
- Wire into `PathExplorer`; light CSS in `globals.css`
- Optional: extract shared countdown tick helper if sticky rail and landing both need it
- Update `docs/feature-list.md` checkboxes for shipped items after implement

## Success criteria

- [ ] Sticky rail stays visible while scrolling the path
- [ ] Remaining time decreases as active card advances; watched/skipped also reduce it
- [ ] Pace updates with remaining + days to Doomsday
- [ ] Add to Calendar downloads a valid `.ics` openable in Apple/Google/Outlook
- [ ] Track switcher + footer attribution present
- [ ] No card height jump from rail or active highlight
- [ ] Respects `prefers-reduced-motion` for any rail motion
