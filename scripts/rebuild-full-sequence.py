#!/usr/bin/env python3
"""Rebuild titles.json with full Doomsday prep catalog in real release order.

Adds Sony / Fox / Netflix legacy titles and assigns sequenceOrder globally.
Also writes data/tracks.json (Track B / C / Complete).
"""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TITLES_PATH = ROOT / "data" / "titles.json"
ERAS_PATH = ROOT / "data" / "eras.json"
TRACKS_PATH = ROOT / "data" / "tracks.json"

# New titles to merge (real US release dates)
NEW = [
    {
        "id": "spider-man-2002",
        "title": "Spider-Man",
        "year": 2002,
        "releaseDate": "2002-05-03",
        "type": "film",
        "phase": None,
        "era": "sony-spiderman",
        "universe": "sony-spiderman",
        "priority": "OPTIONAL",
        "wiki": "Spider-Man_(2002_film)",
        "tmdb": {"media": "movie", "id": 557},
        "accentOverride": "#dc2626",
        "tracks": ["complete"],
    },
    {
        "id": "spider-man-2",
        "title": "Spider-Man 2",
        "year": 2004,
        "releaseDate": "2004-06-30",
        "type": "film",
        "phase": None,
        "era": "sony-spiderman",
        "universe": "sony-spiderman",
        "priority": "OPTIONAL",
        "wiki": "Spider-Man_2",
        "tmdb": {"media": "movie", "id": 558},
        "accentOverride": "#dc2626",
        "tracks": ["complete"],
    },
    {
        "id": "fantastic-four-2005",
        "title": "Fantastic Four",
        "year": 2005,
        "releaseDate": "2005-07-08",
        "type": "film",
        "phase": None,
        "era": "fox-ff",
        "universe": "fox-ff",
        "priority": "OPTIONAL",
        "wiki": "Fantastic_Four_(2005_film)",
        "tmdb": {"media": "movie", "id": 9738},
        "accentOverride": "#2563eb",
        "tracks": ["complete"],
    },
    {
        "id": "spider-man-3",
        "title": "Spider-Man 3",
        "year": 2007,
        "releaseDate": "2007-05-04",
        "type": "film",
        "phase": None,
        "era": "sony-spiderman",
        "universe": "sony-spiderman",
        "priority": "OPTIONAL",
        "wiki": "Spider-Man_3",
        "tmdb": {"media": "movie", "id": 559},
        "accentOverride": "#111827",
        "tracks": ["complete"],
    },
    {
        "id": "fantastic-four-silver-surfer",
        "title": "Fantastic Four: Rise of the Silver Surfer",
        "year": 2007,
        "releaseDate": "2007-06-15",
        "type": "film",
        "phase": None,
        "era": "fox-ff",
        "universe": "fox-ff",
        "priority": "OPTIONAL",
        "wiki": "Fantastic_Four:_Rise_of_the_Silver_Surfer",
        "tmdb": {"media": "movie", "id": 1979},
        "accentOverride": "#94a3b8",
        "tracks": ["complete"],
    },
    {
        "id": "x-men-origins-wolverine",
        "title": "X-Men Origins: Wolverine",
        "year": 2009,
        "releaseDate": "2009-05-01",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "OPTIONAL",
        "wiki": "X-Men_Origins:_Wolverine",
        "tmdb": {"media": "movie", "id": 2080},
        "accentOverride": "#f5c518",
        "tracks": ["complete"],
    },
    {
        "id": "x-men-first-class",
        "title": "X-Men: First Class",
        "year": 2011,
        "releaseDate": "2011-06-03",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "HIGH",
        "wiki": "X-Men:_First_Class",
        "tmdb": {"media": "movie", "id": 49538},
        "accentOverride": "#f5c518",
        "tracks": ["complete", "xmen"],
    },
    {
        "id": "amazing-spider-man",
        "title": "The Amazing Spider-Man",
        "year": 2012,
        "releaseDate": "2012-07-03",
        "type": "film",
        "phase": None,
        "era": "sony-spiderman",
        "universe": "sony-spiderman",
        "priority": "OPTIONAL",
        "wiki": "The_Amazing_Spider-Man_(film)",
        "tmdb": {"media": "movie", "id": 1930},
        "accentOverride": "#dc2626",
        "tracks": ["complete"],
    },
    {
        "id": "the-wolverine",
        "title": "The Wolverine",
        "year": 2013,
        "releaseDate": "2013-07-26",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "OPTIONAL",
        "wiki": "The_Wolverine_(film)",
        "tmdb": {"media": "movie", "id": 76170},
        "accentOverride": "#a3a3a3",
        "tracks": ["complete", "xmen"],
    },
    {
        "id": "amazing-spider-man-2",
        "title": "The Amazing Spider-Man 2",
        "year": 2014,
        "releaseDate": "2014-05-02",
        "type": "film",
        "phase": None,
        "era": "sony-spiderman",
        "universe": "sony-spiderman",
        "priority": "OPTIONAL",
        "wiki": "The_Amazing_Spider-Man_2",
        "tmdb": {"media": "movie", "id": 102382},
        "accentOverride": "#2563eb",
        "tracks": ["complete"],
    },
    {
        "id": "fantastic-four-2015",
        "title": "Fantastic Four",
        "year": 2015,
        "releaseDate": "2015-08-07",
        "type": "film",
        "phase": None,
        "era": "fox-ff",
        "universe": "fox-ff",
        "priority": "SKIP",
        "wiki": "Fantastic_Four_(2015_film)",
        "tmdb": {"media": "movie", "id": 166424},
        "accentOverride": "#1e3a8a",
        "tracks": ["complete"],
    },
    {
        "id": "daredevil-s1",
        "title": "Daredevil (Season 1)",
        "year": 2015,
        "releaseDate": "2015-04-10",
        "type": "series",
        "phase": None,
        "era": "netflix-marvel",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "Daredevil_(TV_series)",
        "tmdb": {"media": "tv", "id": 61889},
        "accentOverride": "#991b1b",
        "season": 1,
        "tracks": ["complete"],
    },
    {
        "id": "deadpool",
        "title": "Deadpool",
        "year": 2016,
        "releaseDate": "2016-02-12",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "HIGH",
        "wiki": "Deadpool_(film)",
        "tmdb": {"media": "movie", "id": 293660},
        "accentOverride": "#ef4444",
        "tracks": ["complete", "prep"],
    },
    {
        "id": "x-men-apocalypse",
        "title": "X-Men: Apocalypse",
        "year": 2016,
        "releaseDate": "2016-05-27",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "OPTIONAL",
        "wiki": "X-Men:_Apocalypse",
        "tmdb": {"media": "movie", "id": 246655},
        "accentOverride": "#7c3aed",
        "tracks": ["complete", "xmen"],
    },
    {
        "id": "daredevil-s2",
        "title": "Daredevil (Season 2)",
        "year": 2016,
        "releaseDate": "2016-03-18",
        "type": "series",
        "phase": None,
        "era": "netflix-marvel",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "Daredevil_(season_2)",
        "tmdb": {"media": "tv", "id": 61889},
        "accentOverride": "#991b1b",
        "season": 2,
        "tracks": ["complete"],
    },
    {
        "id": "defenders",
        "title": "The Defenders",
        "year": 2017,
        "releaseDate": "2017-08-18",
        "type": "series",
        "phase": None,
        "era": "netflix-marvel",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "The_Defenders_(miniseries)",
        "tmdb": {"media": "tv", "id": 62285},
        "accentOverride": "#b91c1c",
        "tracks": ["complete"],
    },
    {
        "id": "punisher-s1",
        "title": "The Punisher (Season 1)",
        "year": 2017,
        "releaseDate": "2017-11-17",
        "type": "series",
        "phase": None,
        "era": "netflix-marvel",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "The_Punisher_(TV_series)",
        "tmdb": {"media": "tv", "id": 67178},
        "accentOverride": "#525252",
        "season": 1,
        "tracks": ["complete"],
    },
    {
        "id": "daredevil-s3",
        "title": "Daredevil (Season 3)",
        "year": 2018,
        "releaseDate": "2018-10-19",
        "type": "series",
        "phase": None,
        "era": "netflix-marvel",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "Daredevil_(season_3)",
        "tmdb": {"media": "tv", "id": 61889},
        "accentOverride": "#991b1b",
        "season": 3,
        "tracks": ["complete"],
    },
    {
        "id": "deadpool-2",
        "title": "Deadpool 2",
        "year": 2018,
        "releaseDate": "2018-05-18",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "HIGH",
        "wiki": "Deadpool_2",
        "tmdb": {"media": "movie", "id": 383498},
        "accentOverride": "#ef4444",
        "tracks": ["complete", "prep"],
    },
    {
        "id": "punisher-s2",
        "title": "The Punisher (Season 2)",
        "year": 2019,
        "releaseDate": "2019-01-18",
        "type": "series",
        "phase": None,
        "era": "netflix-marvel",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "The_Punisher_(season_2)",
        "tmdb": {"media": "tv", "id": 67178},
        "accentOverride": "#525252",
        "season": 2,
        "tracks": ["complete"],
    },
    {
        "id": "dark-phoenix",
        "title": "Dark Phoenix",
        "year": 2019,
        "releaseDate": "2019-06-07",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "OPTIONAL",
        "wiki": "Dark_Phoenix_(film)",
        "tmdb": {"media": "movie", "id": 320288},
        "accentOverride": "#e11d48",
        "tracks": ["complete", "xmen"],
    },
    {
        "id": "new-mutants",
        "title": "The New Mutants",
        "year": 2020,
        "releaseDate": "2020-08-28",
        "type": "film",
        "phase": None,
        "era": "fox-xmen",
        "universe": "fox-xmen",
        "priority": "SKIP",
        "wiki": "The_New_Mutants_(film)",
        "tmdb": {"media": "movie", "id": 340102},
        "accentOverride": "#a855f7",
        "tracks": ["complete"],
    },
    {
        "id": "echo",
        "title": "Echo",
        "year": 2024,
        "releaseDate": "2024-01-09",
        "type": "series",
        "phase": 5,
        "era": "phase-5",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "Echo_(miniseries)",
        "tmdb": {"media": "tv", "id": 122226},
        "accentOverride": "#d97706",
        "tracks": ["complete"],
    },
    {
        "id": "daredevil-born-again",
        "title": "Daredevil: Born Again",
        "year": 2025,
        "releaseDate": "2025-03-04",
        "type": "series",
        "phase": 5,
        "era": "phase-5",
        "universe": "mcu-616",
        "priority": "OPTIONAL",
        "wiki": "Daredevil:_Born_Again",
        "tmdb": {"media": "tv", "id": 202555},
        "accentOverride": "#991b1b",
        "tracks": ["complete"],
    },
]

# Known US release dates for existing titles (for true chronological order)
RELEASE_DATES = {
    "x-men-2000": "2000-07-14",
    "x2": "2003-05-02",
    "x-men-the-last-stand": "2006-05-26",
    "iron-man": "2008-05-02",
    "incredible-hulk": "2008-06-13",
    "iron-man-2": "2010-05-07",
    "thor": "2011-05-06",
    "captain-america-the-first-avenger": "2011-07-22",
    "the-avengers": "2012-05-04",
    "iron-man-3": "2013-05-03",
    "thor-the-dark-world": "2013-11-08",
    "captain-america-the-winter-soldier": "2014-04-04",
    "guardians-of-the-galaxy": "2014-08-01",
    "x-men-days-of-future-past": "2014-05-23",
    "avengers-age-of-ultron": "2015-05-01",
    "ant-man": "2015-07-17",
    "captain-america-civil-war": "2016-05-06",
    "doctor-strange": "2016-11-04",
    "guardians-of-the-galaxy-vol-2": "2017-05-05",
    "spider-man-homecoming": "2017-07-07",
    "thor-ragnarok": "2017-11-03",
    "logan": "2017-03-03",
    "black-panther": "2018-02-16",
    "avengers-infinity-war": "2018-04-27",
    "ant-man-and-the-wasp": "2018-07-06",
    "captain-marvel": "2019-03-08",
    "avengers-endgame": "2019-04-26",
    "spider-man-far-from-home": "2019-07-02",
    "wandavision": "2021-01-15",
    "falcon-and-winter-soldier": "2021-03-19",
    "loki-s1": "2021-06-09",
    "black-widow": "2021-07-09",
    "what-if-s1": "2021-08-11",
    "shang-chi": "2021-09-03",
    "eternals": "2021-11-05",
    "hawkeye": "2021-11-24",
    "spider-man-no-way-home": "2021-12-17",
    "doctor-strange-mom": "2022-05-06",
    "ms-marvel": "2022-06-08",
    "thor-love-and-thunder": "2022-07-08",
    "she-hulk": "2022-08-18",
    "black-panther-wakanda-forever": "2022-11-11",
    "ant-man-quantumania": "2023-02-17",
    "guardians-of-the-galaxy-vol-3": "2023-05-05",
    "secret-invasion": "2023-06-21",
    "loki-s2": "2023-10-05",
    "the-marvels": "2023-11-10",
    "deadpool-wolverine": "2024-07-26",
    "captain-america-brave-new-world": "2025-02-14",
    "thunderbolts": "2025-05-02",
    "ironheart": "2025-06-24",
    "fantastic-four-first-steps": "2025-07-25",
    "spider-man-brand-new-day": "2026-07-31",
    "visionquest": "2026-10-14",
    "avengers-doomsday": "2026-12-18",
    "avengers-secret-wars": "2027-12-17",
}

# Track B prep ids (recommended) — keep + add Deadpool 1/2
PREP_IDS = {
    "iron-man", "thor", "captain-america-the-first-avenger", "the-avengers",
    "captain-america-the-winter-soldier", "avengers-age-of-ultron", "ant-man",
    "captain-america-civil-war", "doctor-strange", "thor-ragnarok", "black-panther",
    "avengers-infinity-war", "ant-man-and-the-wasp", "avengers-endgame",
    "wandavision", "falcon-and-winter-soldier", "loki-s1", "black-widow", "shang-chi",
    "hawkeye", "spider-man-no-way-home", "doctor-strange-mom",
    "black-panther-wakanda-forever", "ant-man-quantumania", "loki-s2",
    "deadpool", "deadpool-2", "deadpool-wolverine",
    "captain-america-brave-new-world", "thunderbolts", "fantastic-four-first-steps",
    "spider-man-brand-new-day", "avengers-doomsday",
    "x-men-2000", "x2", "x-men-the-last-stand", "x-men-days-of-future-past",
    "x-men-first-class",
}

CRASH_IDS = {
    "captain-america-the-first-avenger", "the-avengers",
    "captain-america-the-winter-soldier", "captain-america-civil-war",
    "avengers-infinity-war", "avengers-endgame",
    "falcon-and-winter-soldier", "loki-s1", "loki-s2",
    "doctor-strange-mom", "black-panther-wakanda-forever",
    "deadpool-wolverine", "captain-america-brave-new-world",
    "thunderbolts", "fantastic-four-first-steps",
    "x-men-2000", "x2", "avengers-doomsday",
}

XMEN_IDS = {
    "x-men-2000", "x2", "x-men-the-last-stand", "x-men-origins-wolverine",
    "x-men-first-class", "the-wolverine", "x-men-days-of-future-past",
    "x-men-apocalypse", "logan", "dark-phoenix", "new-mutants",
    "deadpool", "deadpool-2", "deadpool-wolverine",
}


def main() -> None:
    data = json.loads(TITLES_PATH.read_text())
    by_id = {t["id"]: t for t in data["titles"]}

    for t in NEW:
        if t["id"] in by_id:
            by_id[t["id"]].update(t)
        else:
            by_id[t["id"]] = t

    for tid, rd in RELEASE_DATES.items():
        if tid in by_id:
            by_id[tid]["releaseDate"] = rd

    # Ensure new release dates present
    for t in NEW:
        by_id[t["id"]]["releaseDate"] = t["releaseDate"]

    titles = list(by_id.values())
    titles.sort(key=lambda t: (t.get("releaseDate") or f"{t['year']}-12-31", t["title"]))

    for i, t in enumerate(titles, 1):
        t["sequenceOrder"] = i
        # tracks membership
        tid = t["id"]
        tracks = set(t.get("tracks") or [])
        tracks.add("complete")
        if tid in PREP_IDS:
            tracks.add("prep")
        if tid in CRASH_IDS:
            tracks.add("crash")
        if tid in XMEN_IDS:
            tracks.add("xmen")
        if t.get("priority") == "TARGET":
            tracks.update({"complete", "prep", "crash"})
        t["tracks"] = sorted(tracks)
        # clear old releaseOrder confusion — keep for MCU-only reference if phase set
        if "releaseOrder" in t and t.get("phase") is None and t.get("universe") != "mcu-616":
            t.pop("releaseOrder", None)

    data["titles"] = titles
    data["version"] = 2
    data["sequenceNote"] = "sequenceOrder is real-world release order (US) across MCU + Fox + Sony + Netflix Marvel."
    TITLES_PATH.write_text(json.dumps(data, indent=2))

    # Expand eras
    eras = json.loads(ERAS_PATH.read_text())
    extra_eras = [
        {
            "id": "sony-spiderman",
            "label": "Sony Spider-Man Legacy",
            "years": [2002, 2014],
            "note": "Raimi + Webb Spider-Man — multiverse cameo context",
            "theme": {
                "bg": "#0a0606",
                "bgAlt": "#1a0a0a",
                "fg": "#fee2e2",
                "muted": "#a8a29e",
                "accent": "#dc2626",
                "accent2": "#2563eb",
                "danger": "#fbbf24",
                "glow": "rgba(220, 38, 38, 0.4)",
                "grain": 0.1,
            },
            "mood": "red-blue web-slinger pulp",
            "logoHint": "spider glyph",
        },
        {
            "id": "fox-ff",
            "label": "Fox Fantastic Four",
            "years": [2005, 2015],
            "note": "Pre-MCU Fantastic Four — optional lore only",
            "theme": {
                "bg": "#070b14",
                "bgAlt": "#0f172a",
                "fg": "#e2e8f0",
                "muted": "#94a3b8",
                "accent": "#3b82f6",
                "accent2": "#f8fafc",
                "danger": "#f97316",
                "glow": "rgba(59, 130, 246, 0.35)",
                "grain": 0.1,
            },
            "mood": "blue-white cosmic family",
            "logoHint": "4 mark",
        },
        {
            "id": "netflix-marvel",
            "label": "Netflix Marvel / Street Level",
            "years": [2015, 2019],
            "note": "Defenders saga — optional for Doomsday",
            "theme": {
                "bg": "#0a0505",
                "bgAlt": "#1c0a0a",
                "fg": "#fecaca",
                "muted": "#a8a29e",
                "accent": "#991b1b",
                "accent2": "#e5e5e5",
                "danger": "#ef4444",
                "glow": "rgba(153, 27, 27, 0.45)",
                "grain": 0.14,
            },
            "mood": "Hell's Kitchen grit",
            "logoHint": "DD horns abstract",
        },
    ]
    existing = {e["id"] for e in eras["eras"]}
    for e in extra_eras:
        if e["id"] not in existing:
            eras["eras"].append(e)
    # Expand fox-xmen year span
    for e in eras["eras"]:
        if e["id"] == "fox-xmen":
            e["years"] = [2000, 2020]
    ERAS_PATH.write_text(json.dumps(eras, indent=2))

    # Tracks
    complete = [t["id"] for t in titles]
    prep = [t["id"] for t in titles if "prep" in t["tracks"]]
    crash = [t["id"] for t in titles if "crash" in t["tracks"]]
    xmen = [t["id"] for t in titles if "xmen" in t["tracks"]]

    TRACKS_PATH.write_text(
        json.dumps(
            {
                "version": 1,
                "defaultTrack": "prep",
                "tracks": [
                    {
                        "id": "complete",
                        "name": "Complete Multiverse Path",
                        "description": "Every title in real release order — MCU + Fox X-Men/FF/Deadpool + Sony Spider-Man + Netflix Defenders — ending at Avengers: Doomsday.",
                        "orderField": "sequenceOrder",
                        "titleIds": complete,
                    },
                    {
                        "id": "prep",
                        "name": "Doomsday Prep (Recommended)",
                        "description": "Best context for Doomsday without every legacy film. Includes Deadpool 1–2 and core Fox X-Men.",
                        "orderField": "sequenceOrder",
                        "titleIds": prep,
                    },
                    {
                        "id": "crash",
                        "name": "Crash Course",
                        "description": "Minimum path if you are almost out of time.",
                        "orderField": "sequenceOrder",
                        "titleIds": crash,
                    },
                    {
                        "id": "xmen",
                        "name": "Fox X-Men Branch",
                        "description": "Mutant / Deadpool branch only, in release order.",
                        "orderField": "sequenceOrder",
                        "titleIds": xmen,
                    },
                ],
            },
            indent=2,
        )
    )

    print(f"Titles: {len(titles)}")
    print(f"Complete track: {len(complete)}")
    print(f"Prep track: {len(prep)}")
    print(f"Crash track: {len(crash)}")
    print("First 15 sequence:")
    for t in titles[:15]:
        print(f"  {t['sequenceOrder']:2}. {t['releaseDate']}  {t['title']}")
    print("...")
    for t in titles[-5:]:
        print(f"  {t['sequenceOrder']:2}. {t['releaseDate']}  {t['title']}")


if __name__ == "__main__":
    main()
