#!/usr/bin/env python3
"""Fetch multi-provider watch links for every title (IN + US) via JustWatch.

Writes:
  data/providers.json
  data/watch-links.json
  assets/providers/{technical_name}.png
"""

from __future__ import annotations

import json
import re
import ssl
import time
import urllib.request
from pathlib import Path

from simplejustwatchapi import offers_for_countries, search

ROOT = Path(__file__).resolve().parents[1]
TITLES = json.loads((ROOT / "data" / "titles.json").read_text())["titles"]
OUT_LINKS = ROOT / "data" / "watch-links.json"
OUT_PROVIDERS = ROOT / "data" / "providers.json"
LOGO_DIR = ROOT / "assets" / "providers"
LOGO_DIR.mkdir(parents=True, exist_ok=True)

COUNTRIES = ["IN", "US"]
UA = "DoomsdayWatchPath/1.0 (educational; local asset sync)"
CTX = ssl.create_default_context()

# Prefer these in UI ordering
PRIORITY = [
    "jiohotstar",
    "disneyplus",
    "netflix",
    "amazonprimevideo",
    "appletvplus",
    "itunes",
    "amazon",
    "youtubetv",
    "youtube",
    "googleplay",
    "vudu",
    "vimoviesandtv",
]

MONETIZATION_RANK = {"FLATRATE": 0, "ADS": 1, "FREE": 2, "RENT": 3, "BUY": 4}


def normalize(s: str) -> str:
    s = s.lower()
    s = s.replace("&", "and")
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def download_logo(url: str, tech: str) -> str | None:
    if not url:
        return None
    dest = LOGO_DIR / f"{tech}.png"
    if dest.exists() and dest.stat().st_size > 200:
        return f"assets/providers/{tech}.png"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, context=CTX, timeout=30) as resp:
            data = resp.read()
        if len(data) < 200:
            return None
        dest.write_bytes(data)
        return f"assets/providers/{tech}.png"
    except Exception as e:
        print(f"  logo fail {tech}: {e}")
        return None


def match_entry(title_meta: dict, results: list):
    want_year = title_meta["year"]
    want_type = "SHOW" if title_meta["type"] == "series" else "MOVIE"
    want_tmdb = str((title_meta.get("tmdb") or {}).get("id") or "")
    want_norm = normalize(title_meta["title"].split("(")[0])

    scored = []
    for e in results:
        if e.object_type != want_type:
            continue
        score = 0
        if e.release_year == want_year:
            score += 5
        if want_tmdb and str(e.tmdb_id or "") == want_tmdb:
            score += 10
        en = normalize(e.title)
        if en == want_norm or want_norm in en or en in want_norm:
            score += 4
        # Loki seasons share one SHOW entry
        if title_meta["id"].startswith("loki") and "loki" in en:
            score += 3
        if score >= 5:
            scored.append((score, e))
    if not scored:
        return None
    scored.sort(key=lambda x: -x[0])
    return scored[0][1]


def compress_offers(offers: list) -> list:
    """Keep best offer per provider (prefer stream over rent/buy, higher res)."""
    best = {}
    for o in offers:
        pkg = o.package
        tech = pkg.technical_name
        key = tech
        rank = (
            MONETIZATION_RANK.get(o.monetization_type, 9),
            0 if o.presentation_type == "_4K" else 1 if o.presentation_type == "HD" else 2,
        )
        prev = best.get(key)
        if prev is None or rank < prev[0]:
            best[key] = (
                rank,
                {
                    "providerId": tech,
                    "providerName": pkg.name,
                    "type": o.monetization_type.lower(),
                    "quality": (o.presentation_type or "").lstrip("_") or None,
                    "url": o.url,
                    "price": o.price_string,
                    "currency": o.price_currency,
                    "audioLanguages": list(o.audio_languages or [])[:8],
                },
            )
    items = [v[1] for v in best.values()]

    def sort_key(item):
        tech = item["providerId"]
        pri = PRIORITY.index(tech) if tech in PRIORITY else 100
        mon = MONETIZATION_RANK.get(item["type"].upper(), 9)
        return (mon, pri, item["providerName"])

    items.sort(key=sort_key)
    return items


def search_query(title_meta: dict) -> str:
    t = title_meta["title"]
    t = re.sub(r"\s*\(Season \d+\)\s*", "", t)
    t = t.replace("*", "")
    return t.strip()


def main() -> None:
    providers_catalog: dict[str, dict] = {}
    watch: dict[str, dict] = {}
    unmatched = []

    for i, t in enumerate(TITLES, 1):
        q = search_query(t)
        print(f"[{i}/{len(TITLES)}] {t['id']} ← {q!r}")
        try:
            results = search(q, country="IN", language="en", count=8)
        except Exception as e:
            print(f"  search fail: {e}")
            unmatched.append(t["id"])
            time.sleep(1.2)
            continue

        entry = match_entry(t, results)
        if not entry:
            # try US search as fallback discovery
            try:
                results_us = search(q, country="US", language="en", count=8)
                entry = match_entry(t, results_us)
            except Exception:
                entry = None

        if not entry:
            print("  ✗ no match")
            unmatched.append(t["id"])
            watch[t["id"]] = {
                "id": t["id"],
                "title": t["title"],
                "year": t["year"],
                "justwatch": None,
                "regions": {"IN": [], "US": []},
                "status": "unmatched",
            }
            time.sleep(0.8)
            continue

        print(f"  ✓ {entry.title} ({entry.release_year}) {entry.entry_id}")
        try:
            by_country = offers_for_countries(entry.entry_id, countries=COUNTRIES)
        except Exception as e:
            print(f"  offers fail: {e}")
            by_country = {"IN": list(entry.offers or []), "US": []}

        regions = {}
        for country in COUNTRIES:
            offers = compress_offers(by_country.get(country) or [])
            regions[country] = offers
            for o in by_country.get(country) or []:
                pkg = o.package
                tech = pkg.technical_name
                if tech not in providers_catalog:
                    logo = download_logo(pkg.icon, tech)
                    providers_catalog[tech] = {
                        "id": tech,
                        "name": pkg.name,
                        "shortName": pkg.short_name,
                        "packageId": pkg.package_id,
                        "logo": logo,
                        "logoSource": pkg.icon,
                        "homepageHint": None,
                    }

        # homepage hints for major apps
        hints = {
            "jiohotstar": "https://www.hotstar.com/in",
            "disneyplus": "https://www.disneyplus.com",
            "netflix": "https://www.netflix.com",
            "amazonprimevideo": "https://www.primevideo.com",
            "appletvplus": "https://tv.apple.com",
            "itunes": "https://tv.apple.com",
            "amazon": "https://www.amazon.com/gp/video",
            "youtube": "https://www.youtube.com/movies",
            "youtubetv": "https://tv.youtube.com",
            "vimoviesandtv": "https://moviesandtv.myvi.in",
        }
        for tech, hint in hints.items():
            if tech in providers_catalog:
                providers_catalog[tech]["homepageHint"] = hint

        watch[t["id"]] = {
            "id": t["id"],
            "title": t["title"],
            "year": t["year"],
            "justwatchId": entry.entry_id,
            "justwatch": {
                "IN": entry.url if "/in/" in (entry.url or "") else f"https://www.justwatch.com/in/movie/{entry.url.split('/')[-1]}" if entry.url else None,
                "US": f"https://www.justwatch.com/us/{'tv-show' if entry.object_type=='SHOW' else 'movie'}/{entry.url.split('/')[-1]}" if entry.url else None,
            },
            "tmdbId": entry.tmdb_id,
            "imdbId": entry.imdb_id,
            "regions": regions,
            "streamCount": {
                "IN": sum(1 for x in regions["IN"] if x["type"] in ("flatrate", "ads", "free")),
                "US": sum(1 for x in regions["US"] if x["type"] in ("flatrate", "ads", "free")),
            },
            "status": "ok",
        }
        time.sleep(0.55)

    # Sort providers with priority first
    def prov_sort(item):
        tech = item[0]
        return (PRIORITY.index(tech) if tech in PRIORITY else 100, item[1]["name"])

    providers_sorted = [providers_catalog[k] for k, _ in sorted(providers_catalog.items(), key=prov_sort)]

    payload = {
        "version": 1,
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "JustWatch (unofficial GraphQL via simple-justwatch-python-api)",
        "defaultRegion": "IN",
        "regions": COUNTRIES,
        "note": "Availability changes often. Re-run scripts/fetch-watch-links.py to refresh. Links open the provider's official watch/store page when available.",
        "unmatched": unmatched,
        "titles": watch,
    }
    OUT_LINKS.write_text(json.dumps(payload, indent=2))
    OUT_PROVIDERS.write_text(
        json.dumps(
            {
                "version": 1,
                "defaultRegion": "IN",
                "priority": PRIORITY,
                "providers": providers_sorted,
            },
            indent=2,
        )
    )
    print(f"\nWrote {OUT_LINKS}")
    print(f"Wrote {OUT_PROVIDERS}")
    print(f"Logos in {LOGO_DIR} ({len(list(LOGO_DIR.glob('*.png')))} files)")
    print(f"Unmatched: {unmatched}")


if __name__ == "__main__":
    main()
