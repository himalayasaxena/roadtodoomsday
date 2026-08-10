# Using real movie images without copyright headaches

**Purpose:** Practical options for Doomsday Watch Path.  
**Not legal advice.** Studio/API terms change — re-check before public launch or monetization.  
**Updated:** August 10, 2026

---

## Reality check

There is **no magic “free MCU poster pack.”**  
Theatrical posters and stills are owned by **Marvel / Disney / Sony / etc.**  
What you *can* do is use **licensed channels** or **strategies that avoid hosting** studio art.

Google/Bing image search is **not** a license.

---

## Best options (ranked for this project)

### 1) TMDB API (recommended for fan/guide apps)

**What it is:** Industry-standard way apps show posters/backdrops with metadata.

**What TMDB says (summary):**
- You may use TMDB content **through their API** under their [API Terms of Use](https://www.themoviedb.org/api-terms-of-use).
- TMDB **does not claim ownership** of the underlying studio images; they provide access + DMCA process.
- You **must attribute** TMDB (logo + notice). Required notice:

  > This product uses the TMDB API but is not endorsed or certified by TMDB.

  (Full terms also use a longer “not endorsed, certified, or otherwise approved” form — follow the current terms page.)

- Logos: use [official TMDB attribution logos](https://www.themoviedb.org/about/logos-attribution); TMDB mark must be **less prominent** than your brand.
- **Non-commercial** developer key is free for non-revenue use.
- If you **monetize** (ads, paid features, etc.), TMDB expects a **paid/commercial** plan (community answers cite ~$149/mo — confirm current pricing).

**How to use cleanly:**
1. Get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api).
2. Load posters from `image.tmdb.org` (or cache briefly per their rules).
3. Footer: TMDB logo + disclaimer + “Artwork © respective studios.”
4. Do **not** imply Marvel/Disney endorsement.

**Fit for us:** Best path for “real posters” on a non-commercial watch-order site.

---

### 2) Don’t host images — link out (safest legally)

Show **title + runtime + “Open poster / trailer / stream”** that goes to:
- JustWatch title page  
- Disney+ / JioHotstar / Netflix title URL  
- YouTube **official trailer** (embed or link)

You never store the poster file → lowest copyright risk.  
UX tradeoff: less pretty; still fully functional for a planner/calendar product.

---

### 3) YouTube official trailers (embed)

Embedding the **official** trailer via YouTube’s embed is generally allowed under YouTube’s terms when you use their player (not downloaded MP4s).  
Good for detail pages; not a substitute for poster grids unless you only show trailer thumbs via YouTube’s embed UI.

---

### 4) Official press / publicity stills (limited)

Disney/Marvel press sites often mark assets **“Editorial use only”** and restrict access to **accredited media**.

- Example: Disney UK press galleries: “All images ©Disney. Editorial use only.”
- Disney TV press TOU: for authorized news/entertainment media; editorial/promotional of that programming; keep copyright notices; don’t imply association; don’t sell/archive beyond terms.
- Commercial or broad website licensing: [disneystudiolicensing.com](https://www.disneystudiolicensing.com/) · Marvel film stills requests: **permissions@marvel.com** (written; slow).

**Fit for us:** Unreliable for a normal fan site unless you are press or get explicit permission. Don’t scrape press kits for a public app by default.

---

### 5) Pay for a real license (bulletproof, expensive)

Contact studio licensing for posters/stills for your exact use (web, territory, term).  
Correct for commercial products; overkill for a free fan planner unless you raise money / brand partnership.

---

### 6) Create original art (always safe)

What we already do well:
- Era color systems, wordmarks, icons you designed  
- Typography-led cards (“IRON MAN · 2008 · 2h 06m”)

Can look premium without any studio poster.

---

## What to avoid

| Approach | Why |
|---|---|
| Google/Bing “download image” | No license granted |
| Wikipedia/Wikimedia **fair-use posters** | Usually not free to rehost on your site |
| Hotlinking random fan sites | Infringement + broken links |
| Unofficial JustWatch scrapers for images at scale | Against JustWatch commercial rules; fragile |
| Official Marvel logos as your brand | Trademark issue |
| Claiming “fair use” for a full poster grid | Weak / risky for a whole catalog site |

---

## JustWatch note (watch links vs images)

JustWatch is great for **where to stream** data (we already use it).  
Their widget/partner terms restrict how you use **their** branding/widgets; unofficial API use is typically **non-commercial only** and can change.  

**Recommendation:** Keep JustWatch for **links + provider names**; get **posters from TMDB** (or no posters). Don’t rely on scraping JustWatch images.

---

## Recommended policy for Doomsday Watch Path

| Phase | Image strategy |
|---|---|
| **Now / v1** | Host existing posters in `assets/posters/` + watch links (no TMDB key needed) |
| **Later (optional)** | TMDB `w780`/`w1280` upgrade via `scripts/fetch-tmdb-images.py` + attribution |
| **If ads / paid features** | Revisit licensing / TMDB commercial terms |
| **Always** | Original site branding; studio © disclaimer; no “official Marvel” claim |

### Decision (2026-08-10, updated)

**Current:** Use the **posters already downloaded** under `assets/posters/` and keep **watch deep-links**. Good enough to build the product.

**Deferred:** TMDB API high-res fetch (`scripts/fetch-tmdb-images.py`) — optional later if we want sharper art + formal TMDB attribution. Not required for v1.

### Footer copy (draft)

> Movie artwork remains © Marvel / Disney / Sony / and other rights holders.  
> This product uses the TMDB API but is not endorsed or certified by TMDB.  
> Streaming availability via third parties (e.g. JustWatch data); not affiliated with Disney, Marvel, or JioHotstar.

---

## Action items (when we implement)

1. Use existing `assets/posters/` (and watch links) in the Next.js UI.  
2. Footer: studio © disclaimer; optional TMDB notice only if/when TMDB is enabled.  
3. Keep calendar/path features image-independent.  
4. Later (optional): run `scripts/fetch-tmdb-images.py` for sharper art.  
5. Keep launch checklist in `docs/feature-list.md` (legal/ops).

---

## Sources

- [TMDB API Terms of Use](https://www.themoviedb.org/api-terms-of-use)  
- [TMDB Logos & Attribution](https://www.themoviedb.org/about/logos-attribution)  
- [TMDB Developer FAQ](https://developer.themoviedb.org/docs/faq)  
- [Disney Studios Licensing](https://www.disneystudiolicensing.com/) (Marvel: permissions@marvel.com)  
- Disney press “editorial use only” examples (e.g. press.disney.co.uk galleries)  
- JustWatch widget / partner terms (branding & non-scraping constraints)
