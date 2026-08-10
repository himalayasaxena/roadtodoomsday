# Asset Inventory — Doomsday Watch Path

**Collected:** August 10, 2026  
**Mode:** Local downloads (Approach A)  
**Scope:** Full catalog (Track A MCU + Fox X-Men essentials + Doomsday / Secret Wars)

---

## Folder layout

```
assets/
  posters/          # One poster per title (jpg/png) — 56 files
  backdrops/        # Wide stills (TMDB only; empty until TMDB_API_KEY set)
  brand/            # Original site marks (not Marvel trademarks)
    doomsday-wordmark.svg
    site-mark.svg
  era/              # Phase / universe section marks
    phase-1.svg … phase-6.svg
    fox-xmen.svg
    swatches/       # Color strip PNGs per era
  heroes/
    doomsday-poster.*   # Hero art for landing

data/
  titles.json           # Full catalog metadata + TMDB/wiki ids + accents
  eras.json             # Scroll-era theme tokens
  themes.css            # CSS variables keyed by [data-era="…"]
  asset-manifest.json   # Poster paths + source URLs

scripts/
  download-assets.py
  retry-missing-posters.py
  generate-brand.py
```

---

## Scroll theme system

As the user scrolls titles by **release year**, the UI should set `data-era` on `<html>` (or a shell) from `titles[].era`.

| Era id | Years / module | Accent mood |
|---|---|---|
| `fox-xmen` | X-Men module | Yellow / black mutant noir |
| `phase-1` | 2008–2012 | Stark crimson + arc-reactor gold |
| `phase-2` | 2013–2015 | Winter Soldier steel blue |
| `phase-3` | 2016–2019 | Infinity purple + stone gold |
| `phase-4` | 2021–2022 | Multiverse cyan / magenta rift |
| `phase-5` | 2023–2025 | Thunderbolts tactical green |
| `phase-6` | 2025–2027 | Latveria green + Doom gold |

Tokens live in `data/eras.json` and are mirrored in `data/themes.css`:

```css
[data-era="phase-6"] {
  --bg: #050806;
  --accent: #16a34a;
  --accent-2: #c9a227;
  /* … */
}
```

Each title also has `accentOverride` in `titles.json` for card-level accents (e.g. Wakanda gold, Loki cyan).

---

## Poster coverage

| Metric | Count |
|---|---|
| Titles in `titles.json` | 56 |
| Local posters | **56 / 56** |
| Backdrops | 0 (needs TMDB) |

Sources used for this pull: Wikipedia / Wikimedia fair-use page images + Marvel Cinematic Universe Fandom page images where Wikipedia rate-limited.

---

## Brand marks (original)

These are **original** graphics for this project — not official Marvel / Disney / Fox logos:

- `assets/brand/doomsday-wordmark.svg` — “DOOMSDAY / WATCH PATH”
- `assets/brand/site-mark.svg` — triangle + gold node icon
- `assets/era/*.svg` — phase banners

Do **not** ship official Marvel Studios / Avengers trademarks unless you have license / press-kit rights.

---

## Upgrade path: higher-res via TMDB

Wikipedia posters are often ~220–600px (fair-use). For production-quality:

1. Get a free key at https://www.themoviedb.org/settings/api  
2. Export it and re-run:

```bash
export TMDB_API_KEY='your_key'
python3 scripts/download-assets.py
```

That writes `w780` posters + `w1280` backdrops into `assets/posters` and `assets/backdrops`.

---

## Legal / attribution

- Poster and still imagery remains copyright of Marvel / Disney / 20th Century / respective studios.
- This repo uses them for **local development** of an educational watch-order guide.
- Before a public launch: switch to TMDB with proper attribution, official press stills, or licensed assets; keep Marvel wordmarks out unless cleared.
- Site brand SVGs in `assets/brand` and `assets/era` are project-original.

Suggested footer credit:

> This product uses the TMDB API but is not endorsed or certified by TMDB. Movie imagery © Marvel / Disney / respective owners.

---

## Watch links (where to stream)

See [`watch-links.md`](./watch-links.md).

- `data/watch-links.json` — real deep links per title for **IN** + **US** (JioHotstar, Disney+, Netflix, rent/buy, cinema…)  
- `data/providers.json` + `assets/providers/*.png` — platform logos  
- Refresh: `python3 scripts/fetch-watch-links.py`

## Next build hooks

1. Load `data/titles.json` + `data/asset-manifest.json` + `data/watch-links.json` + `data/providers.json`  
2. Import `data/themes.css`  
3. On scroll intersection of each title card → `document.documentElement.dataset.era = title.era`  
4. Crossfade `--bg` / `--accent` (CSS transitions on custom properties)  
5. Hero section uses `assets/heroes/doomsday-poster.*` + `assets/brand/doomsday-wordmark.svg`  
6. Per-card “Watch on” buttons from `regions[userRegion]` with provider logos
