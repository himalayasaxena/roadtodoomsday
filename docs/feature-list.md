# Doomsday Watch Path — Feature List

**Product:** Website that helps someone with zero MCU context watch the right sequence so they understand *Avengers: Doomsday* (Dec 18, 2026).  
**Status:** Planning backlog — collect ideas here **before** implementing.  
**Last updated:** August 10, 2026  
**Stack direction:** Next.js app in `web/` · data in `data/` · assets in `assets/`

Use this file as the single source of feature intent for the next-year site. Check items off or move them to “Done” when shipped.

---

## Legend

| Tag | Meaning |
|---|---|
| **P0** | Core — site is incomplete without it |
| **P1** | High value — do early after core |
| **P2** | Strong enhancement |
| **P3** | Nice-to-have / later |
| `[ ]` | Not started |
| `[~]` | Partially exists in data/preview, not in Next.js product yet |
| `[x]` | Done in product |

---

## 1. Watch path & sequencing

- [~] **P0 — Complete Multiverse Path** — Full release-order catalog (MCU + Fox X-Men/FF/Deadpool + Sony Spider-Man + Netflix Defenders) ending at *Doomsday* (`tracks.complete`, ~80 titles).
- [~] **P0 — Doomsday Prep track** — Recommended shorter path (`tracks.prep`).
- [~] **P0 — Crash Course track** — Minimum path if late (`tracks.crash`).
- [~] **P1 — X-Men branch track** — Mutant/Deadpool-only path (`tracks.xmen`).
- [~] **P1 — Character arc tracks** — Lead-focused + release order: Iron Man, Thor, Cap, Spider-Man, Doctor Strange, Guardians, Black Panther, Loki, Wanda & Vision, Deadpool (`kind: character` in `tracks.json`).
- [x] **P1 — Track switcher in Next.js UI** — User picks Complete / Prep / Crash / X-Men; list reorders from `sequenceOrder`.
- [~] **P1 — Spoiler-light “why watch” per title** — `whyWatch` + `recommendationScore` (1–10) + label on every title; shown on path timeline.
- [~] **P0 — Path explorer page** — Scrollable timeline with poster, why-watch, score, watch logos, trailer, mark watched/skip.
- [~] **P1 — Share journey** — Copy / Web Share / Instagram paste helper with progress + shareable URL (custom ids in query).
- [~] **P1 — Custom journeys** — Search onboarding → `/path/custom?ids=…` shareable + continueable.
- [ ] **P2 — Prerequisites graph** — “Watch after X”; soft locks / warnings if jumping ahead.
- [x] **P2 — Priority badges** — ESSENTIAL / HIGH / OPTIONAL / SKIP visible on cards.
- [ ] **P3 — In-universe chronological mode** — Advanced rewatch only (not default for newcomers).

---

## 2. Visual era experience (scroll themes)

- [~] **P0 — Era theme tokens** — Phase 1–6, Fox X-Men, Sony Spider-Man, Fox FF, Netflix Marvel (`eras.json`, `themes.css`).
- [ ] **P0 — Scroll-linked era theming** — As user scrolls the path, `data-era` / CSS variables shift to that year’s mood (colors, grain, accents).
- [~] **P1 — Posters per title** — Local posters in `assets/posters/`.
- [ ] **P1 — Poster + backdrop in product UI** — Cards/hero use local assets (or TMDB upgrade).
- [ ] **P2 — Backdrop / atmosphere layers** — Full-bleed era backgrounds while scrolling.
- [~] **P2 — Brand marks** — Original Doomsday wordmark + era banners (non-Marvel trademarks).
- [ ] **P3 — Motion** — Intentional scroll/entrance motion; respect `prefers-reduced-motion`.

---

## 3. Where to watch

- [~] **P0 — Multi-provider watch links** — Per title, per region (IN default + US) via JustWatch (`watch-links.json`).
- [~] **P0 — Provider logos** — Local logos in `assets/providers/`.
- [~] **P0 — “Watch on” buttons in UI** — Logo-only provider chips (no flatrate/buy/rent labels, no site names); bigger logos; one link per provider (prefer stream).
- [x] **P1 — Region selector** — India (JioHotstar) / US (Disney+) at minimum; remember preference.
- [ ] **P1 — Language badges** — Surface Hindi/English (and others) from offer `audioLanguages`.
- [ ] **P2 — Availability status** — Streaming vs rent vs still in theaters vs “OTT TBA”.
- [ ] **P2 — Refresh pipeline** — Documented/scheduled re-run of `fetch-watch-links.py`.
- [ ] **P3 — More regions** — UK, CA, AU, etc.
- [ ] **P3 — Deep-link health check** — Flag broken provider URLs.

---

## 4. Runtime, countdown & pacing

- [~] **P0 — Runtime per title** — `runtimeMinutes` on every title; badge on poster.
- [~] **P0 — Path total watch time** — Sum for selected track (exclude *Secret Wars* from “to Doomsday”).
- [~] **P0 — Countdown to Doomsday** — Hours/days until Dec 18, 2026.
- [x] **P1 — Buffer & required pace** — Hours left after finishing path; avg hours/day needed.
- [x] **P0 — Countdown + path stats in Next.js** — Port preview counter into product.
- [ ] **P1 — Pace presets** — “Casual 1 film/day”, “Weekend binge”, “Finish in 2 weeks”.
- [ ] **P2 — Series scheduling rules** — Split long seasons into episode batches, not one 11h block.
- [x] **P3 — Live ticking countdown** — Second-level timer on landing.

---

## 5. Custom calendar plan (“Import to my calendar”)

> Validated idea: auto-generate a personal watch schedule from path + deadline + user preferences; export so calendar apps notify the user.

- [ ] **P1 — Calendar plan builder (v1)**  
  Inputs: track, start date, timezone, preferred daily window (e.g. 9:00 PM–11:30 PM), allowed days (all / weeknights / weekends).  
  Output: day-by-day schedule **in sequence**.
- [ ] **P1 — Fit algorithm**  
  - Place titles in order without reordering.  
  - Prefer one title per sitting; don’t split films by default.  
  - If title runtime &gt; window → warn / suggest longer slot or weekend.  
  - If path hours &gt; hours until Doomsday → block export + suggest shorter track or more days/hours.
- [ ] **P1 — Schedule preview** — Show “N titles/day, finish by DATE” before export.
- [x] **P1 — `.ics` export** — “Add to Calendar” download (Google/Apple/Outlook compatible).  
  Event fields: title `#12 Iron Man (2h 06m)`, description (why-watch + watch links + site URL), reminder (e.g. 30 min before).
- [ ] **P2 — Watch links inside event description** — One-tap from calendar notification to streamer.
- [ ] **P2 — Regenerate / shift plan** — Missed a day → push remaining titles forward.
- [x] **P2 — Exclude already-watched titles** — From progress state.
- [ ] **P3 — Google Calendar OAuth sync** — Direct write (optional; `.ics` is enough for v1).
- [ ] **P3 — Shared / family calendar** — Export for multiple people.
- [ ] **P3 — Overnight windows** — Correct handling when end time is after midnight (e.g. 10 PM–1 AM).

---

## 6. Progress & personalization

- [x] **P1 — Watched / skipped / in progress** — Local-first (localStorage); updates remaining hours.
- [ ] **P1 — “Continue where I left off”** — Resume next unwatched in sequence.
- [x] **P2 — Progress % on path** — Titles done + hours done / remaining.
- [ ] **P2 — Mark season progress** — For multi-episode series.
- [ ] **P3 — Account sync** — Optional login to sync progress across devices.
- [ ] **P3 — Shareable progress link** — “I’m 40% to Doomsday”.

---

## 7. Title detail & enrichment data

- [ ] **P1 — Title detail panel/page** — Poster, runtime, why-watch, watch buttons, era, priority.
- [ ] **P1 — Short spoiler-safe synopsis** — Trimmed overview.
- [ ] **P1 — Age rating / content flags** — Helpful for families.
- [~] **P1 — Official trailer link** — YouTube via TMDB (`trailerUrl` / `trailer` on titles); shown in preview; wire into Next.js later.
- [ ] **P2 — Doomsday cast tags** — “Appears in Doomsday” chips (Sam, FF, Xavier, etc.).
- [ ] **P2 — Unify asset paths on title object** — `poster`, `backdrop` on `titles.json` (not only manifest).
- [ ] **P3 — Scores** — IMDb / RT (optional, not path-critical).
- [ ] **P3 — Backdrops / stills library** — Higher-res via TMDB when API key available.

---

## 8. Landing & product UX

- [~] **P0 — Next.js marketing/home** — Glass onboarding: journey cards + live Doomsday countdown (incl. seconds) + custom search draft.
- [~] **P0 — Path explorer page** — Scrollable sequence with era theming.
- [ ] **P1 — Mobile-first layout** — Usable on phone for “what’s next tonight”.
- [ ] **P1 — Empty/error states** — Missing poster, no offers in region, theatrical-only titles.
- [ ] **P2 — Compare tracks** — Side-by-side hours + title counts (Complete vs Prep vs Crash).
- [ ] **P2 — Accessibility** — Keyboard, focus, contrast, reduced motion.
- [ ] **P3 — Installable PWA** — Add to home screen checklist.

---

## 9. Trust, legal & ops

- [x] **P0 — Attribution** — JustWatch / TMDB / studio copyright notes in footer.
- [ ] **P0 — No fake official Marvel branding** — Use original site marks; don’t imply endorsement.
- [x] **P1 — Disclaimer** — Availability and runtimes can change; calendar is a plan, not a guarantee.
- [ ] **P2 — Data refresh docs** — How to re-fetch posters, watch links, runtimes.
- [ ] **P3 — Analytics** — Privacy-light: which track chosen, calendar exports (no PII required).

---

## 10. Already collected (foundation — wire into Next.js)

These exist as data/assets/preview today; product work is to integrate them:

| Asset / data | Location |
|---|---|
| Title catalog + sequence + runtimes | `data/titles.json` |
| Tracks (paths + character arcs) | `data/tracks.json` |
| Era themes | `data/eras.json`, `data/themes.css` |
| Watch links + providers | `data/watch-links.json`, `data/providers.json` |
| Path stats / countdown snapshot | `data/path-stats.json` |
| Posters / logos / brand | `assets/` |
| Sequence research doc | `docs/doomsday-watch-sequence.md` |
| Static preview prototype | `assets/preview.html` |
| Next.js scaffold | `web/` |

---

## Suggested build order (when we start implementing)

1. **Wire data into Next.js** — titles, tracks, posters, watch buttons, runtimes, countdown.  
2. **Path explorer + era scroll theming.**  
3. **Progress (local).**  
4. **Calendar plan builder + `.ics` export.**  
5. **Enrichment** — why-watch, synopsis, trailers, ratings.  
6. **Polish** — motion, PWA, more regions, OAuth calendar.

---

## Idea inbox (unvalidated / park here)

Add raw ideas below; promote into numbered sections once accepted.

- [x] Soft online presence chip (deterministic 250–300, sitewide) — shipped
- [ ] —

---

## Decision log

| Date | Decision |
|---|---|
| 2026-08-10 | Default track for newcomers = **Prep**; Complete = full release-order everything. |
| 2026-08-10 | Sequence = **real US release order**, not viral Instagram order when they conflict. |
| 2026-08-10 | India default region = **JioHotstar** (Hotstar URLs); US = Disney+. |
| 2026-08-10 | Calendar v1 = **`.ics` download**, not Google OAuth. |
| 2026-08-10 | Collect features in this file before further feature implementation. |
| 2026-08-11 | Path UI = **zigzag centered timeline**; SEO baseline (metadata, OG, JSON-LD, sitemap, robots). |
| 2026-08-11 | Soft online presence = deterministic local time curve in [250, 300]; not real presence. |
