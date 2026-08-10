# Onboarding journey selection — design

**Date:** 2026-08-11  
**Status:** Approved — implement v1  
**Scope:** Next.js first screen only (path cards + timer + search/custom draft)

## Goal

User lands and picks how they’ll prepare for *Avengers: Doomsday* — readable glass UI, MCU night atmosphere, live countdown, backdrop reaction on card focus.

## Cards (Option A)

| Card | Track id | Notes |
|---|---|---|
| Recommended | `prep` | Default highlight |
| Quick / Crash | `crash` | Minimum path |
| Complete | `complete` | Full release order |
| More | — | Character arcs, X-Men, Custom |

## Interactions

- Live countdown to `2026-12-18T00:00:00Z` including **seconds**
- Hover/focus card → backdrop crossfade + light parallax for that path
- Top search → add titles to custom draft chips (sorted by `sequenceOrder`)
- **Open path** → `/path/[trackId]` placeholder (explorer later)
- Custom → `/path/custom?ids=...` placeholder

## Visual

- Glass morphism over cinematic backdrops
- Palette: void navy/black, frost white text, crimson MCU accent
- Motion: staggered card entrance; backdrop ken-burns; respect `prefers-reduced-motion`

## Out of scope (v1)

- Full path explorer, progress, calendar, watch buttons on this screen
