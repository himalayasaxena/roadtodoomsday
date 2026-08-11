# Soft online presence — design

**Date:** 2026-08-11  
**Status:** Approved for planning  
**Approach:** Deterministic time curve (no server / presence infra)  
**Copy:** `● {n} online`

## Goal

Show a compact, sitewide social-proof chip that reads like live concurrent users. The count stays inside **250–300**, drifts slowly, and is higher in local evenings than overnight. No network, cookies, analytics, or real presence tracking.

## Non-goals

- Real concurrent-session counting
- Backend / Redis / WebSocket presence
- Per-visitor random walks that diverge across users
- Making the chip clickable or navigational
- Claiming “real-time verified” accuracy in legal/footer copy

## Architecture

| Piece | Role |
|---|---|
| `web/src/lib/onlineCount.ts` | Pure `onlineCountAt(date: Date): number` — deterministic, testable |
| `web/src/components/OnlinePresence.tsx` | Client component; mounts count, ticks on an interval |
| `web/src/app/layout.tsx` | Renders `<OnlinePresence />` above `site-main` so every page gets it |
| `web/src/app/globals.css` | Compact bar + muted green pulse styles |

Data flow: local clock → `onlineCountAt` → render. No store, no fetch.

## UI

- Thin sticky strip at the top of the site (~28–32px), full width.
- Dark translucent background so it works on home glass and content pages.
- Content: muted green pulse dot + `{n} online` (e.g. `● 273 online`).
- Alignment: right on desktop; centered or right-safe on small screens.
- Typography: small Barlow, muted — status chrome, not a headline.
- Accessibility:
  - `aria-live="polite"`
  - Accessible name: `About {n} people online`
  - Pulse respects `prefers-reduced-motion` (static dot when reduced).
- No link, button, or tooltip required for v1.
- Hydration: render the bar immediately with a static `··· online` until client mount, then replace with the live integer (avoids SSR clock skew; same spirit as `DoomsdayCountdown`).

## Count algorithm

`onlineCountAt(now)` uses the viewer’s **local** timezone.

1. **Time-of-day base (smooth)**  
   Map local hour (+ fraction of hour) through a smooth curve:
   - Overnight low ≈ mid-250s
   - Late morning / afternoon climb
   - Evening peak ≈ high-290s toward 300
   - Implementation: sine/cosine or piecewise smooth blend — not a hard step table that jumps at hour boundaries.

2. **Slow wobble**  
   Add a small deterministic offset derived from minute-of-day and day-of-year (hash or low-frequency sine) so the value drifts a few units over tens of minutes without looking random-walk jittery.

3. **Clamp**  
   `Math.round` then hard clamp to integers in `[250, 300]` inclusive.

4. **Tick cadence**  
   Client re-evaluates every **45 seconds** and once on mount. Same local minute → same integer for all visitors (modulo timezone differences, which is intended).

### Invariants (tests)

- For any `Date`, result ∈ `[250, 300]`.
- For a fixed calendar day, evening sample ≥ overnight sample (e.g. 21:00 ≥ 03:00).
- Same `Date` input → same output (pure / stable).
- Adjacent minutes usually change by at most a few units (no ±20 jumps).

## Error handling

- None required beyond safe client-only mount. If `Date` is invalid, fall back to midpoint **275**.

## Testing

- Unit tests in `web/src/lib/onlineCount.test.ts` covering the invariants above.
- Manual: load home, path, and a content page; confirm bar visible, number in range, copy matches `● N online`.

## Out of scope / later

- Timezone-normalized “global” peak (everyone sees same UTC curve)
- Admin knob to shift the band
- A/B label variants (`watching` / `planning Doomsday`)

## Decision log

| Date | Decision |
|---|---|
| 2026-08-11 | Soft social proof (A), not real presence |
| 2026-08-11 | Sitewide compact header (C) |
| 2026-08-11 | Copy: `● N online` |
| 2026-08-11 | Deterministic time curve (#1), not seeded random walk |
