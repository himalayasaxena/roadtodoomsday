#!/usr/bin/env python3
"""Generate original (non-Marvel-trademark) brand / era SVG marks for the site."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brand"
ERA = ROOT / "assets" / "era"
OUT.mkdir(parents=True, exist_ok=True)
ERA.mkdir(parents=True, exist_ok=True)

DOOMSDAY = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" fill="none">
  <rect width="800" height="200" fill="#050806"/>
  <path d="M40 160 L120 40 L200 160 Z" stroke="#16a34a" stroke-width="6" fill="rgba(22,163,74,0.12)"/>
  <circle cx="120" cy="100" r="18" fill="#c9a227"/>
  <path d="M220 50 H760" stroke="#16a34a" stroke-width="2" opacity="0.5"/>
  <text x="220" y="105" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#f0f7f2" letter-spacing="6">DOOMSDAY</text>
  <text x="220" y="145" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#8fa898" letter-spacing="8">WATCH PATH</text>
  <path d="M40 170 H760" stroke="#c9a227" stroke-width="1" opacity="0.4"/>
</svg>
'''

SITE_MARK = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <rect width="120" height="120" rx="8" fill="#050806"/>
  <path d="M20 95 L60 25 L100 95 Z" stroke="#16a34a" stroke-width="5" fill="rgba(22,163,74,0.15)"/>
  <circle cx="60" cy="70" r="10" fill="#c9a227"/>
  <path d="M30 95 H90" stroke="#8fa898" stroke-width="2"/>
</svg>
'''

ERAS = {
    "fox-xmen": ("#f5c518", "X", "FOX X-MEN"),
    "sony-spiderman": ("#dc2626", "S", "SONY SPIDER-MAN"),
    "fox-ff": ("#3b82f6", "4", "FOX FANTASTIC FOUR"),
    "netflix-marvel": ("#991b1b", "N", "NETFLIX MARVEL"),
    "phase-1": ("#d4a017", "I", "PHASE ONE"),
    "phase-2": ("#3b82f6", "II", "PHASE TWO"),
    "phase-3": ("#7c3aed", "III", "PHASE THREE"),
    "phase-4": ("#22d3ee", "IV", "PHASE FOUR"),
    "phase-5": ("#4ade80", "V", "PHASE FIVE"),
    "phase-6": ("#16a34a", "VI", "DOOMSDAY"),
}


def era_svg(color: str, numeral: str, label: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" fill="none">
  <rect width="400" height="120" fill="#0a0a0a"/>
  <rect x="16" y="16" width="88" height="88" rx="6" stroke="{color}" stroke-width="3" fill="rgba(255,255,255,0.03)"/>
  <text x="60" y="78" text-anchor="middle" font-family="Georgia, serif" font-size="42" font-weight="700" fill="{color}">{numeral}</text>
  <text x="124" y="70" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#f5f5f5" letter-spacing="4">{label}</text>
  <path d="M124 84 H360" stroke="{color}" stroke-width="2" opacity="0.6"/>
</svg>
'''


def main() -> None:
    (OUT / "doomsday-wordmark.svg").write_text(DOOMSDAY)
    (OUT / "site-mark.svg").write_text(SITE_MARK)
    for era_id, (color, numeral, label) in ERAS.items():
        (ERA / f"{era_id}.svg").write_text(era_svg(color, numeral, label))
    print(f"Wrote brand marks → {OUT}")
    print(f"Wrote era marks → {ERA}")


if __name__ == "__main__":
    main()
