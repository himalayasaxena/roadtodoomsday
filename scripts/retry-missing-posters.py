#!/usr/bin/env python3
"""Retry missing posters only, with slower pacing."""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
import ssl
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TITLES = json.loads((ROOT / "data" / "titles.json").read_text())["titles"]
MANIFEST_PATH = ROOT / "data" / "asset-manifest.json"
OUT_POSTERS = ROOT / "assets" / "posters"
UA = "DoomsdayWatchOrderAssetBot/1.1 (local-dev; educational)"
CTX = ssl.create_default_context()


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
        return r.read()


def wiki_media_url(wiki: str) -> str | None:
    # Prefer MediaWiki API pageimages (sometimes more resilient)
    title = urllib.parse.quote(wiki.replace("%26", "&"), safe="")
    api = (
        "https://en.wikipedia.org/w/api.php"
        f"?action=query&titles={title}&prop=pageimages&piprop=original|thumbnail"
        "&pithumbsize=600&format=json"
    )
    try:
        data = json.loads(get(api).decode())
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            if "original" in page:
                return page["original"]["source"].split("?")[0]
            if "thumbnail" in page:
                return page["thumbnail"]["source"].split("?")[0]
    except Exception as e:
        print(f"  api fail: {e}")

    # REST fallback
    encoded = urllib.parse.quote(wiki, safe="()_,!:*'")
    try:
        data = json.loads(get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}").decode())
        for key in ("originalimage", "thumbnail"):
            src = (data.get(key) or {}).get("source")
            if src:
                return src.split("?")[0]
    except Exception as e:
        print(f"  rest fail: {e}")
    return None


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text()) if MANIFEST_PATH.exists() else {"items": {}}
    missing = []
    for t in TITLES:
        dest = OUT_POSTERS / f"{t['id']}.jpg"
        if not dest.exists() or dest.stat().st_size < 800:
            missing.append(t)
    print(f"Missing: {len(missing)}")

    recovered = 0
    for i, t in enumerate(missing, 1):
        tid = t["id"]
        print(f"[{i}/{len(missing)}] {tid}")
        url = wiki_media_url(t.get("wiki", ""))
        if not url:
            print("  ✗ no url")
            time.sleep(2.5)
            continue
        try:
            data = get(url)
            if len(data) < 800:
                print("  ✗ tiny file")
                continue
            dest = OUT_POSTERS / f"{tid}.jpg"
            dest.write_bytes(data)
            entry = manifest.setdefault("items", {}).setdefault(tid, {"id": tid})
            entry.update(
                {
                    "title": t["title"],
                    "year": t["year"],
                    "era": t["era"],
                    "accent": t.get("accentOverride"),
                    "poster": f"assets/posters/{tid}.jpg",
                    "sources": {**(entry.get("sources") or {}), "poster": url},
                }
            )
            recovered += 1
            print(f"  ✓ {len(data)} bytes")
        except urllib.error.HTTPError as e:
            print(f"  ✗ HTTP {e.code}")
        except Exception as e:
            print(f"  ✗ {e}")
        time.sleep(2.2)

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
    still = [t["id"] for t in TITLES if not (OUT_POSTERS / f"{t['id']}.jpg").exists()]
    print(f"\nRecovered {recovered}. Still missing: {len(still)}")
    if still:
        print(", ".join(still))


if __name__ == "__main__":
    main()
