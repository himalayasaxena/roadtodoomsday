# Watch links data

**Fetched:** see `fetchedAt` inside `data/watch-links.json`  
**Source:** [JustWatch](https://www.justwatch.com) (via unofficial GraphQL client)  
**Default region:** India (`IN`) — also includes `US`

Streaming rights move often. Refresh anytime:

```bash
python3 scripts/fetch-watch-links.py
```

---

## Files

| File | Purpose |
|---|---|
| `data/watch-links.json` | Per-title watch offers + deep links by region |
| `data/providers.json` | Provider catalog (name, logo path, homepage) |
| `assets/providers/*.png` | Local logos (40 platforms) |

---

## Schema (per title)

```json
{
  "id": "iron-man",
  "title": "Iron Man",
  "year": 2008,
  "justwatch": { "IN": "https://www.justwatch.com/in/movie/iron-man", "US": "..." },
  "regions": {
    "IN": [
      {
        "providerId": "jiohotstar",
        "providerName": "JioHotstar",
        "type": "flatrate",
        "quality": "HD",
        "url": "https://www.hotstar.com/in/1660000038",
        "price": null,
        "currency": "INR",
        "audioLanguages": ["en", "hi", "ta", "te"]
      }
    ],
    "US": [ /* Disney+, Hulu, rent/buy… */ ]
  },
  "streamCount": { "IN": 1, "US": 2 },
  "status": "ok"
}
```

### `type` values

| type | Meaning |
|---|---|
| `flatrate` | Included with subscription |
| `ads` | Free with ads / ad tier |
| `free` | Free |
| `rent` | Digital rental |
| `buy` | Digital purchase / disc |
| `cinema` | Still in theaters (tickets) |

### UI tip

1. Read `providers.json` once → map `providerId` → local `logo`  
2. For the user’s region (default `IN`), render buttons sorted already (stream first)  
3. Prefer `flatrate` / `ads` as primary CTAs; nest rent/buy/cinema under “More ways to watch”  
4. Always keep a fallback link to `justwatch.IN` / `justwatch.US` if a deep link fails

---

## India reality (Aug 2026)

- Most MCU + Fox X-Men library streams on **JioHotstar** (former Disney+ Hotstar) — URLs still use `hotstar.com`  
- US counterpart is usually **Disney+** (sometimes Hulu)  
- New theatrical titles (*Brand New Day*, *Doomsday*) may only show **cinema** offers until OTT windows open  
- Netflix appears when Sony / other windows land there — not the default MCU home in India

---

## Example: Iron Man (IN)

- **JioHotstar (stream):** https://www.hotstar.com/in/1660000038  
- Logo: `assets/providers/jiohotstar.png`
