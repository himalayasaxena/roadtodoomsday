#!/usr/bin/env python3
"""Download local poster/backdrop assets for Doomsday watch-order site.

Sources (in order):
1. TMDB (if TMDB_API_KEY or TMDB_READ_TOKEN env is set) — preferred quality
2. Wikipedia REST summary originalimage/thumbnail — fair-use sized posters

Writes:
  assets/posters/{id}.jpg
  assets/backdrops/{id}.jpg  (TMDB only; skipped if unavailable)
  data/asset-manifest.json
"""

from __future__ import annotations

import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TITLES_PATH = ROOT / "data" / "titles.json"
OUT_POSTERS = ROOT / "assets" / "posters"
OUT_BACKDROPS = ROOT / "assets" / "backdrops"
OUT_MANIFEST = ROOT / "data" / "asset-manifest.json"

UA = "DoomsdayWatchOrderAssetBot/1.0 (local-dev; educational watch-order guide)"
CTX = ssl.create_default_context()


def http_get(url: str, headers: dict | None = None) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, context=CTX, timeout=45) as resp:
        return resp.read()


def http_get_json(url: str, headers: dict | None = None) -> dict:
    return json.loads(http_get(url, headers).decode("utf-8"))


def download_file(url: str, dest: Path) -> bool:
    try:
        data = http_get(url)
        if len(data) < 800:
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"  ! download failed: {e}")
        return False


def wiki_image(wiki_title: str) -> str | None:
    # wiki titles may already be encoded partially; normalize
    encoded = urllib.parse.quote(wiki_title, safe="()_,!:*'")
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"
    try:
        data = http_get_json(url)
    except urllib.error.HTTPError as e:
        print(f"  ! wiki HTTP {e.code} for {wiki_title}")
        return None
    except Exception as e:
        print(f"  ! wiki error: {e}")
        return None

    for key in ("originalimage", "thumbnail"):
        img = data.get(key) or {}
        src = img.get("source")
        if src:
            # strip tracking query
            return src.split("?")[0]
    return None


def tmdb_headers() -> dict | None:
    token = os.environ.get("TMDB_READ_TOKEN") or os.environ.get("TMDB_ACCESS_TOKEN")
    key = os.environ.get("TMDB_API_KEY")
    if token:
        return {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    if key:
        return {"Accept": "application/json", "_api_key": key}
    return None


def tmdb_images(media: str, tmdb_id: int, headers: dict) -> tuple[str | None, str | None]:
    if not tmdb_id:
        return None, None
    api_key = headers.pop("_api_key", None) if "_api_key" in headers else None
    base = f"https://api.themoviedb.org/3/{media}/{tmdb_id}/images"
    if api_key:
        base += f"?api_key={api_key}"
    try:
        data = http_get_json(base, headers)
    except Exception as e:
        print(f"  ! tmdb images: {e}")
        return None, None

    posters = data.get("posters") or []
    backdrops = data.get("backdrops") or []

    def best(items, lang_pref=("en", None)):
        for lang in lang_pref:
            for item in items:
                if item.get("iso_639_1") == lang or (lang is None and not item.get("iso_639_1")):
                    path = item.get("file_path")
                    if path:
                        return path
        return items[0]["file_path"] if items else None

    poster_path = best(posters)
    backdrop_path = best(backdrops, lang_pref=(None, "en"))
    poster_url = f"https://image.tmdb.org/t/p/w780{poster_path}" if poster_path else None
    backdrop_url = f"https://image.tmdb.org/t/p/w1280{backdrop_path}" if backdrop_path else None
    return poster_url, backdrop_url


def main() -> int:
    titles = json.loads(TITLES_PATH.read_text())["titles"]
    OUT_POSTERS.mkdir(parents=True, exist_ok=True)
    OUT_BACKDROPS.mkdir(parents=True, exist_ok=True)

    headers = tmdb_headers()
    use_tmdb = headers is not None
    print(f"Titles: {len(titles)} | TMDB: {'ON' if use_tmdb else 'OFF (Wikipedia fallback)'}")

    manifest = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "tmdb+wikipedia" if use_tmdb else "wikipedia",
        "items": {},
    }

    ok = 0
    fail = []

    for t in titles:
        tid = t["id"]
        print(f"→ {tid}")
        poster_dest = OUT_POSTERS / f"{tid}.jpg"
        backdrop_dest = OUT_BACKDROPS / f"{tid}.jpg"
        entry = {
            "id": tid,
            "title": t["title"],
            "year": t["year"],
            "era": t["era"],
            "accent": t.get("accentOverride"),
            "poster": None,
            "backdrop": None,
            "sources": {},
        }

        poster_url = None
        backdrop_url = None

        if use_tmdb and t.get("tmdb", {}).get("id"):
            # copy headers each call because we may pop api_key helper
            h = dict(headers)
            poster_url, backdrop_url = tmdb_images(t["tmdb"]["media"], t["tmdb"]["id"], h)

        if not poster_url and t.get("wiki"):
            poster_url = wiki_image(t["wiki"])

        if poster_url and download_file(poster_url, poster_dest):
            entry["poster"] = f"assets/posters/{tid}.jpg"
            entry["sources"]["poster"] = poster_url
            ok += 1
            print(f"  ✓ poster")
        else:
            fail.append(tid)
            print(f"  ✗ poster missing")

        if backdrop_url and download_file(backdrop_url, backdrop_dest):
            entry["backdrop"] = f"assets/backdrops/{tid}.jpg"
            entry["sources"]["backdrop"] = backdrop_url
            print(f"  ✓ backdrop")

        manifest["items"][tid] = entry
        time.sleep(0.35)  # be polite to Wikipedia

    OUT_MANIFEST.write_text(json.dumps(manifest, indent=2))
    print(f"\nDone. Posters ok={ok} fail={len(fail)}")
    if fail:
        print("Failed:", ", ".join(fail))
    print(f"Manifest → {OUT_MANIFEST}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
