#!/usr/bin/env python3
"""Download high-quality posters + backdrops from TMDB and wire them into the catalog.

Requires one of:
  TMDB_API_KEY=...
  TMDB_READ_TOKEN=...   (v4 bearer)

Optional: place them in repo-root `.env` (loaded automatically).

Usage:
  python3 scripts/fetch-tmdb-images.py
  python3 scripts/fetch-tmdb-images.py --force   # re-download even if file exists
"""

from __future__ import annotations

import argparse
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
MANIFEST_PATH = ROOT / "data" / "asset-manifest.json"
OUT_POSTERS = ROOT / "assets" / "posters"
OUT_BACKDROPS = ROOT / "assets" / "backdrops"
WEB_POSTERS = ROOT / "web" / "public" / "media" / "posters"
WEB_BACKDROPS = ROOT / "web" / "public" / "media" / "backdrops"
ENV_PATH = ROOT / ".env"

UA = "DoomsdayWatchPath/1.0 (educational; TMDB-attributed)"
CTX = ssl.create_default_context()
IMG = "https://image.tmdb.org/t/p"
POSTER_SIZE = "w780"      # sharp for cards
BACKDROP_SIZE = "w1280"   # hero / era atmosphere


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k, v = k.strip(), v.strip().strip('"').strip("'")
        os.environ.setdefault(k, v)


def http_get(url: str, headers: dict | None = None) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, context=CTX, timeout=60) as resp:
        return resp.read()


def http_get_json(url: str, headers: dict | None = None) -> dict:
    return json.loads(http_get(url, headers).decode("utf-8"))


def auth() -> tuple[dict, str | None]:
    token = os.environ.get("TMDB_READ_TOKEN") or os.environ.get("TMDB_ACCESS_TOKEN")
    key = os.environ.get("TMDB_API_KEY")
    if token:
        return {"Authorization": f"Bearer {token}", "Accept": "application/json"}, None
    if key:
        return {"Accept": "application/json"}, key
    return {}, None


def tmdb_images(media: str, tmdb_id: int, headers: dict, api_key: str | None) -> dict:
    url = f"https://api.themoviedb.org/3/{media}/{tmdb_id}/images"
    if api_key:
        url += f"?api_key={urllib.parse.quote(api_key)}"
    return http_get_json(url, headers)


def pick_path(items: list, langs=("en", None)) -> str | None:
    if not items:
        return None
    for lang in langs:
        for item in items:
            if item.get("iso_639_1") == lang or (lang is None and not item.get("iso_639_1")):
                return item.get("file_path")
    return items[0].get("file_path")


def download(url: str, dest: Path) -> bool:
    try:
        data = http_get(url)
        if len(data) < 1000:
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"    ! download fail: {e}")
        return False


def mirror(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(src.read_bytes())


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    load_env(ENV_PATH)
    headers, api_key = auth()
    if not headers.get("Authorization") and not api_key:
        print("Missing TMDB credentials.")
        print("1. Create a free key: https://www.themoviedb.org/settings/api")
        print("2. Add to /Users/himalaya/Desktop/dooms/.env :")
        print("     TMDB_API_KEY=your_key_here")
        print("3. Re-run: python3 scripts/fetch-tmdb-images.py")
        return 1

    data = json.loads(TITLES_PATH.read_text())
    titles = data["titles"]
    manifest = {"generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "source": "tmdb", "items": {}}
    if MANIFEST_PATH.exists() and not args.force:
        try:
            manifest = json.loads(MANIFEST_PATH.read_text())
            manifest["source"] = "tmdb"
        except Exception:
            pass

    OUT_POSTERS.mkdir(parents=True, exist_ok=True)
    OUT_BACKDROPS.mkdir(parents=True, exist_ok=True)

    ok_p = ok_b = fail = 0
    for i, t in enumerate(titles, 1):
        tid = t["id"]
        tmdb = t.get("tmdb") or {}
        media = tmdb.get("media")
        tmdb_id = tmdb.get("id")
        print(f"[{i}/{len(titles)}] {tid}")
        if not media or not tmdb_id:
            print("  skip — no tmdb id")
            fail += 1
            continue

        poster_dest = OUT_POSTERS / f"{tid}.jpg"
        backdrop_dest = OUT_BACKDROPS / f"{tid}.jpg"

        try:
            imgs = tmdb_images(media, int(tmdb_id), dict(headers), api_key)
        except urllib.error.HTTPError as e:
            print(f"  ! API HTTP {e.code}")
            fail += 1
            time.sleep(0.4)
            continue
        except Exception as e:
            print(f"  ! API {e}")
            fail += 1
            time.sleep(0.4)
            continue

        poster_path = pick_path(imgs.get("posters") or [])
        backdrop_path = pick_path(imgs.get("backdrops") or [], langs=(None, "en"))

        entry = manifest.setdefault("items", {}).setdefault(tid, {"id": tid})
        entry.update(
            {
                "title": t["title"],
                "year": t["year"],
                "era": t["era"],
                "accent": t.get("accentOverride"),
                "tmdb": {"media": media, "id": tmdb_id},
            }
        )

        if poster_path:
            t["tmdbPosterPath"] = poster_path
            t["posterUrl"] = f"{IMG}/{POSTER_SIZE}{poster_path}"
            need = args.force or not poster_dest.exists() or poster_dest.stat().st_size < 5000
            if need and download(f"{IMG}/{POSTER_SIZE}{poster_path}", poster_dest):
                print(f"  ✓ poster {POSTER_SIZE}")
                ok_p += 1
            elif poster_dest.exists():
                print("  · poster exists")
                ok_p += 1
            entry["poster"] = f"assets/posters/{tid}.jpg"
            entry["sources"] = {**(entry.get("sources") or {}), "poster": t["posterUrl"]}
            t["poster"] = f"assets/posters/{tid}.jpg"
            mirror(poster_dest, WEB_POSTERS / f"{tid}.jpg")
            t["posterPublic"] = f"/media/posters/{tid}.jpg"
        else:
            print("  ✗ no poster on TMDB")
            fail += 1

        if backdrop_path:
            t["tmdbBackdropPath"] = backdrop_path
            t["backdropUrl"] = f"{IMG}/{BACKDROP_SIZE}{backdrop_path}"
            need = args.force or not backdrop_dest.exists() or backdrop_dest.stat().st_size < 5000
            if need and download(f"{IMG}/{BACKDROP_SIZE}{backdrop_path}", backdrop_dest):
                print(f"  ✓ backdrop {BACKDROP_SIZE}")
                ok_b += 1
            elif backdrop_dest.exists():
                print("  · backdrop exists")
                ok_b += 1
            entry["backdrop"] = f"assets/backdrops/{tid}.jpg"
            entry["sources"] = {**(entry.get("sources") or {}), "backdrop": t["backdropUrl"]}
            t["backdrop"] = f"assets/backdrops/{tid}.jpg"
            mirror(backdrop_dest, WEB_BACKDROPS / f"{tid}.jpg")
            t["backdropPublic"] = f"/media/backdrops/{tid}.jpg"

        time.sleep(0.25)

    data["imagePolicy"] = {
        "provider": "tmdb",
        "posterSize": POSTER_SIZE,
        "backdropSize": BACKDROP_SIZE,
        "attribution": "This product uses the TMDB API but is not endorsed or certified by TMDB.",
        "note": "Artwork remains © respective studios. Hosted copies for this app under TMDB API terms.",
    }
    TITLES_PATH.write_text(json.dumps(data, indent=2))
    manifest["generatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))

    print(f"\nPosters ok≈{ok_p}  Backdrops ok≈{ok_b}  issues≈{fail}")
    print(f"Local: {OUT_POSTERS}")
    print(f"Next public: {WEB_POSTERS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
