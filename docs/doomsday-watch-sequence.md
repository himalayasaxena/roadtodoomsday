# Avengers: Doomsday — Complete Watch Sequence

**Purpose:** A zero-context guide for someone who wants to watch *Avengers: Doomsday* and understand it — Avengers films, side movies, key Disney+ series, and Fox X-Men titles that feed the crossover.

**Film:** *Avengers: Doomsday* — theaters **December 18, 2026** (post-production as of Aug 10, 2026)  
**Directors:** Anthony Russo & Joe Russo  
**Writers:** Michael Waldron, Stephen McFeely, Chris McKenna & Erik Sommers  
**Official premise (Marvel / Disney):** Heroes from **three distinct universes** collide and face an existential threat.

| Universe | Who shows up |
|---|---|
| **MCU Earth-616** | Avengers, New Avengers (ex-Thunderbolts), Wakandans / Talokan, Loki, Shang-Chi, Thor, Steve Rogers, Ant-Man / Cassie, etc. |
| **Earth-828** | Fantastic Four (*The Fantastic Four: First Steps*) + Doctor Doom’s MCU foothold |
| **Fox X-Men world** | Original-film X-Men (Professor X, Magneto, Cyclops, Mystique, Beast, Nightcrawler, Gambit, and more) |

**Document date:** August 10, 2026  
**Last MCU film before Doomsday:** *Spider-Man: Brand New Day* (Jul 31, 2026) — released  
**Still ahead (optional polish):** *VisionQuest* (Oct 14, 2026)

---

## Runtime & countdown

Each title in `data/titles.json` has **`runtimeMinutes`**.

Track totals + buffer math live in:

- `data/tracks.json` → `runtime.toDoomsday` (excludes *Secret Wars*)
- `data/path-stats.json` → hours until Dec 18, 2026 vs path watch hours

**Preview counter shows:**

1. Hours left until *Avengers: Doomsday*
2. Watch time if user starts the selected path today
3. Buffer (spare hours) or shortfall
4. Required average hours/day to finish before release

Per-poster badge = that title’s runtime.

---

## How to use this doc

Machine-readable tracks live in `data/tracks.json`. Every title has a global **`sequenceOrder`** = **real US release order** (MCU + Fox + Sony + Netflix interleaved).

| Track id | Name | Count | Who it’s for |
|---|---|---|---|
| **`complete`** | Complete Multiverse Path | **80** | Full reel-style path — nothing left out |
| **`prep`** | Doomsday Prep (recommended) | **38** | Best context vs. time (includes Deadpool 1–2 + core X-Men) |
| **`crash`** | Crash Course | **18** | Almost out of time |
| **`xmen`** | Fox X-Men Branch | **14** | Mutant / Deadpool branch only |

**Default for the website:** **`prep`**. Offer **`complete`** as the “watch everything in real sequence” mode.

**Order rule:** Always sort by `sequenceOrder` / `releaseDate` — not by MCU phase alone.

**Priority tags:**

- **ESSENTIAL** — Direct setup for *Doomsday* characters, teams, or multiverse stakes  
- **HIGH** — Strongly improves understanding of returning cast or Multiverse Saga  
- **MEDIUM** — Useful; soft-skip only if short on time  
- **OPTIONAL** — Flavor / legacy / street-level; not load-bearing  
- **SKIP** — Fine to skip for *Doomsday* prep  

---

## Track `complete` — Full Multiverse Path (real release order)

All **80** titles. This is the site’s “everything” track — Sony Spider-Man, Fox Fantastic Four / X-Men / Deadpool, Netflix Defenders, and the full MCU road into *Doomsday*.

| # | Date | Title |
|---|---|---|
| 1 | 2000-07-14 | X-Men |
| 2 | 2002-05-03 | Spider-Man |
| 3 | 2003-05-02 | X2: X-Men United |
| 4 | 2004-06-30 | Spider-Man 2 |
| 5 | 2005-07-08 | Fantastic Four (Fox) |
| 6 | 2006-05-26 | X-Men: The Last Stand |
| 7 | 2007-05-04 | Spider-Man 3 |
| 8 | 2007-06-15 | Fantastic Four: Rise of the Silver Surfer |
| 9 | 2008-05-02 | Iron Man |
| 10 | 2008-06-13 | The Incredible Hulk |
| 11 | 2009-05-01 | X-Men Origins: Wolverine |
| 12 | 2010-05-07 | Iron Man 2 |
| 13 | 2011-05-06 | Thor |
| 14 | 2011-06-03 | X-Men: First Class |
| 15 | 2011-07-22 | Captain America: The First Avenger |
| 16 | 2012-05-04 | The Avengers |
| 17 | 2012-07-03 | The Amazing Spider-Man |
| 18 | 2013-05-03 | Iron Man 3 |
| 19 | 2013-07-26 | The Wolverine |
| 20 | 2013-11-08 | Thor: The Dark World |
| 21 | 2014-04-04 | Captain America: The Winter Soldier |
| 22 | 2014-05-02 | The Amazing Spider-Man 2 |
| 23 | 2014-05-23 | X-Men: Days of Future Past |
| 24 | 2014-08-01 | Guardians of the Galaxy |
| 25 | 2015-04-10 | Daredevil (Season 1) |
| 26 | 2015-05-01 | Avengers: Age of Ultron |
| 27 | 2015-07-17 | Ant-Man |
| 28 | 2015-08-07 | Fantastic Four (2015) |
| 29 | 2016-02-12 | Deadpool |
| 30 | 2016-03-18 | Daredevil (Season 2) |
| 31 | 2016-05-06 | Captain America: Civil War |
| 32 | 2016-05-27 | X-Men: Apocalypse |
| 33 | 2016-11-04 | Doctor Strange |
| 34 | 2017-03-03 | Logan |
| 35 | 2017-05-05 | Guardians of the Galaxy Vol. 2 |
| 36 | 2017-07-07 | Spider-Man: Homecoming |
| 37 | 2017-08-18 | The Defenders |
| 38 | 2017-11-03 | Thor: Ragnarok |
| 39 | 2017-11-17 | The Punisher (Season 1) |
| 40 | 2018-02-16 | Black Panther |
| 41 | 2018-04-27 | Avengers: Infinity War |
| 42 | 2018-05-18 | Deadpool 2 |
| 43 | 2018-07-06 | Ant-Man and the Wasp |
| 44 | 2018-10-19 | Daredevil (Season 3) |
| 45 | 2019-01-18 | The Punisher (Season 2) |
| 46 | 2019-03-08 | Captain Marvel |
| 47 | 2019-04-26 | Avengers: Endgame |
| 48 | 2019-06-07 | Dark Phoenix |
| 49 | 2019-07-02 | Spider-Man: Far From Home |
| 50 | 2020-08-28 | The New Mutants |
| 51 | 2021-01-15 | WandaVision |
| 52 | 2021-03-19 | The Falcon and the Winter Soldier |
| 53 | 2021-06-09 | Loki (Season 1) |
| 54 | 2021-07-09 | Black Widow |
| 55 | 2021-08-11 | What If…? (Season 1) |
| 56 | 2021-09-03 | Shang-Chi and the Legend of the Ten Rings |
| 57 | 2021-11-05 | Eternals |
| 58 | 2021-11-24 | Hawkeye |
| 59 | 2021-12-17 | Spider-Man: No Way Home |
| 60 | 2022-05-06 | Doctor Strange in the Multiverse of Madness |
| 61 | 2022-06-08 | Ms. Marvel |
| 62 | 2022-07-08 | Thor: Love and Thunder |
| 63 | 2022-08-18 | She-Hulk: Attorney at Law |
| 64 | 2022-11-11 | Black Panther: Wakanda Forever |
| 65 | 2023-02-17 | Ant-Man and the Wasp: Quantumania |
| 66 | 2023-05-05 | Guardians of the Galaxy Vol. 3 |
| 67 | 2023-06-21 | Secret Invasion |
| 68 | 2023-10-05 | Loki (Season 2) |
| 69 | 2023-11-10 | The Marvels |
| 70 | 2024-01-09 | Echo |
| 71 | 2024-07-26 | Deadpool & Wolverine |
| 72 | 2025-02-14 | Captain America: Brave New World |
| 73 | 2025-03-04 | Daredevil: Born Again |
| 74 | 2025-05-02 | Thunderbolts* |
| 75 | 2025-06-24 | Ironheart |
| 76 | 2025-07-25 | The Fantastic Four: First Steps |
| 77 | 2026-07-31 | Spider-Man: Brand New Day |
| 78 | 2026-10-14 | VisionQuest |
| 79 | 2026-12-18 | **Avengers: Doomsday** |
| 80 | 2027-12-17 | Avengers: Secret Wars |

> Note vs viral Instagram lists: we use **actual US release dates** (e.g. *The Wolverine* before *Thor: The Dark World*; *X-Men: First Class* between *Thor* and *First Avenger*). We also keep MCU-only essentials the reels often skip (*Falcon and the Winter Soldier*, *Black Widow*, *Shang-Chi*, *Hawkeye*).

---

## Track `prep` — Recommended Doomsday Prep

Same as the former Track B, plus *Deadpool* + *Deadpool 2*. Full id list: `data/tracks.json` → `prep`.

## Track B detail — Recommended Doomsday Prep (narrative order notes)

### Act 1 — Infinity Saga backbone

| # | Title | Year | Type | Priority | Why (spoiler-light) |
|---|---|---|---|---|---|
| 1 | *Iron Man* | 2008 | Film | HIGH | Starts the MCU; Tony Stark mythos that reframes Downey’s Doom casting |
| 2 | *Thor* | 2011 | Film | HIGH | Thor, Loki, Asgard foundation |
| 3 | *Captain America: The First Avenger* | 2011 | Film | ESSENTIAL | Steve & Peggy origin — both returning threads |
| 4 | *The Avengers* | 2012 | Film | ESSENTIAL | First full team-up; Avengers grammar for every later crossover |
| 5 | *Captain America: The Winter Soldier* | 2014 | Film | ESSENTIAL | Bucky + modern Cap’s moral center |
| 6 | *Avengers: Age of Ultron* | 2015 | Film | HIGH | Team expansion; Wanda / Vision seeds |
| 7 | *Ant-Man* | 2015 | Film | HIGH | Scott Lang enters (Paul Rudd / Cassie line) |
| 8 | *Captain America: Civil War* | 2016 | Film | ESSENTIAL | Sam, Bucky, Avengers fracture |
| 9 | *Doctor Strange* | 2016 | Film | HIGH | Magic / multiverse vocabulary |
| 10 | *Thor: Ragnarok* | 2017 | Film | HIGH | Best Thor–Loki reset before Endgame / series Loki |
| 11 | *Black Panther* | 2018 | Film | ESSENTIAL | Wakanda core cast |
| 12 | *Avengers: Infinity War* | 2018 | Film | ESSENTIAL | Saga climax part 1 |
| 13 | *Ant-Man and the Wasp* | 2018 | Film | HIGH | Ghost + Lang family → Thunderbolts / Cassie |
| 14 | *Avengers: Endgame* | 2019 | Film | ESSENTIAL | Russo baseline; Steve’s arc; Loki fork; *Doomsday* picks up from here |

### Act 2 — Multiverse Saga (Doomsday-critical)

| # | Title | Year | Type | Priority | Why |
|---|---|---|---|---|---|
| 15 | *WandaVision* (S1) | 2021 | Series | HIGH | Wanda / Vision fallout feeding Multiverse-era stories |
| 16 | *The Falcon and the Winter Soldier* | 2021 | Series | ESSENTIAL | Sam becomes Cap; U.S. Agent introduced; Bucky’s modern path |
| 17 | *Loki* (S1) | 2021 | Series | ESSENTIAL | TVA, variants, Sacred Timeline — Loki’s *Doomsday* starting point |
| 18 | *Black Widow* | 2021 | Film | ESSENTIAL | Yelena, Red Guardian, Black Widow family → Thunderbolts |
| 19 | *Shang-Chi and the Legend of the Ten Rings* | 2021 | Film | ESSENTIAL | Shang-Chi origin; Simu Liu confirmed for *Doomsday* |
| 20 | *Hawkeye* | 2021 | Series | HIGH | Yelena’s post-*Black Widow* arc into Thunderbolts |
| 21 | *Spider-Man: No Way Home* | 2021 | Film | HIGH | Live-action multiverse collision |
| 22 | *Doctor Strange in the Multiverse of Madness* | 2022 | Film | ESSENTIAL | Incursions + Xavier variant; Multiverse Saga grammar |
| 23 | *Black Panther: Wakanda Forever* | 2022 | Film | ESSENTIAL | Shuri, Namor, Namora, M’Baku’s current status |
| 24 | *Ant-Man and the Wasp: Quantumania* | 2023 | Film | HIGH | Grown-up Cassie; Kang-era context for the Doom pivot |
| 25 | *Loki* (S2) | 2023 | Series | ESSENTIAL | Completes Loki’s multiverse-level role |
| 26 | *Deadpool & Wolverine* | 2024 | Film | ESSENTIAL | Fox-universe collision, TVA after Loki S2, Gambit / mutant bridge energy |
| 27 | *Captain America: Brave New World* | 2025 | Film | ESSENTIAL | Sam’s Cap status and Avengers rebuild |
| 28 | *Thunderbolts\** | 2025 | Film | ESSENTIAL | New Avengers form; post-credits are direct *Doomsday* connective tissue |
| 29 | *The Fantastic Four: First Steps* | 2025 | Film | ESSENTIAL | Earth-828 FF + Doctor Doom’s MCU introduction — most important single prequel |

### Act 3 — Optional polish before Dec 18

| # | Title | Year | Priority | Note |
|---|---|---|---|---|
| 30 | *Thor: Love and Thunder* | 2022 | OPTIONAL | Thor / Love threads teased in marketing |
| 31 | *Spider-Man: Brand New Day* | 2026 | OPTIONAL | Latest 616 snapshot; Holland **not** firmly billed for *Doomsday* |
| 32 | *VisionQuest* | Oct 2026 | OPTIONAL | WandaVision trilogy closer; Vision not confirmed for *Doomsday* |

### Act 4 — Fox X-Men branch (third universe)

Watch after Act 2, or in parallel once past *Endgame*.

| # | Title | Year | Priority | Why |
|---|---|---|---|---|
| X1 | *X-Men* | 2000 | ESSENTIAL | Professor X, Magneto, Cyclops, Mystique, team dynamic |
| X2 | *X2: X-Men United* | 2003 | ESSENTIAL | Peak original-team chemistry; Nightcrawler showcase |
| X3 | *X-Men: The Last Stand* | 2006 | HIGH | Completes original trilogy arcs |
| X4 | *X-Men: Days of Future Past* | 2014 | HIGH | Bridges timelines; Stewart / McKellen / legacy cast |
| X5 | *Logan* | 2017 | OPTIONAL | Emotional coda; not required |

**Minimum X-Men:** *X-Men* → *X2* → *Days of Future Past*  
**Skip for now:** *Origins: Wolverine*, *First Class*, *Apocalypse*, *Dark Phoenix*, *New Mutants*

### Finish line

| # | Title | Year |
|---|---|---|
| ★ | ***Avengers: Doomsday*** | Dec 18, 2026 |
| — | *Avengers: Secret Wars* | Dec 17, 2027 (after) |

---

## Track C — Crash course

1. *Captain America: The First Avenger*  
2. *The Avengers*  
3. *Captain America: The Winter Soldier*  
4. *Captain America: Civil War*  
5. *Avengers: Infinity War*  
6. *Avengers: Endgame*  
7. *The Falcon and the Winter Soldier*  
8. *Loki* (S1 + S2)  
9. *Doctor Strange in the Multiverse of Madness*  
10. *Black Panther: Wakanda Forever*  
11. *Deadpool & Wolverine*  
12. *Captain America: Brave New World*  
13. *Thunderbolts\**  
14. *The Fantastic Four: First Steps*  
15. *X-Men* (2000) + *X2*  
16. ***Avengers: Doomsday***

---

## Track A — Complete MCU path (release order)

### Phase One (2008–2012)

| Order | Title | Priority |
|---|---|---|
| 1 | *Iron Man* (2008) | HIGH |
| 2 | *The Incredible Hulk* (2008) | SKIP |
| 3 | *Iron Man 2* (2010) | OPTIONAL |
| 4 | *Thor* (2011) | HIGH |
| 5 | *Captain America: The First Avenger* (2011) | ESSENTIAL |
| 6 | *The Avengers* (2012) | ESSENTIAL |

### Phase Two (2013–2015)

| Order | Title | Priority |
|---|---|---|
| 7 | *Iron Man 3* (2013) | OPTIONAL |
| 8 | *Thor: The Dark World* (2013) | OPTIONAL |
| 9 | *Captain America: The Winter Soldier* (2014) | ESSENTIAL |
| 10 | *Guardians of the Galaxy* (2014) | SKIP |
| 11 | *Avengers: Age of Ultron* (2015) | HIGH |
| 12 | *Ant-Man* (2015) | HIGH |

### Phase Three (2016–2019)

| Order | Title | Priority |
|---|---|---|
| 13 | *Captain America: Civil War* (2016) | ESSENTIAL |
| 14 | *Doctor Strange* (2016) | HIGH |
| 15 | *Guardians of the Galaxy Vol. 2* (2017) | SKIP |
| 16 | *Spider-Man: Homecoming* (2017) | OPTIONAL |
| 17 | *Thor: Ragnarok* (2017) | HIGH |
| 18 | *Black Panther* (2018) | ESSENTIAL |
| 19 | *Avengers: Infinity War* (2018) | ESSENTIAL |
| 20 | *Ant-Man and the Wasp* (2018) | HIGH |
| 21 | *Captain Marvel* (2019) | OPTIONAL |
| 22 | *Avengers: Endgame* (2019) | ESSENTIAL |
| 23 | *Spider-Man: Far From Home* (2019) | OPTIONAL |

### Phase Four — films + key series (2021–2022)

| Order | Title | Type | Priority |
|---|---|---|---|
| 24 | *WandaVision* (2021) | Series | HIGH |
| 25 | *The Falcon and the Winter Soldier* (2021) | Series | ESSENTIAL |
| 26 | *Loki* S1 (2021) | Series | ESSENTIAL |
| 27 | *Black Widow* (2021) | Film | ESSENTIAL |
| 28 | *What If…?* S1 (2021) | Series | OPTIONAL |
| 29 | *Shang-Chi…* (2021) | Film | ESSENTIAL |
| 30 | *Eternals* (2021) | Film | SKIP |
| 31 | *Hawkeye* (2021) | Series | HIGH |
| 32 | *Spider-Man: No Way Home* (2021) | Film | HIGH |
| 33 | *Doctor Strange in the Multiverse of Madness* (2022) | Film | ESSENTIAL |
| 34 | *Ms. Marvel* (2022) | Series | SKIP |
| 35 | *Thor: Love and Thunder* (2022) | Film | OPTIONAL |
| 36 | *She-Hulk* (2022) | Series | SKIP |
| 37 | *Black Panther: Wakanda Forever* (2022) | Film | ESSENTIAL |

### Phase Five (2023–2025)

| Order | Title | Type | Priority |
|---|---|---|---|
| 38 | *Ant-Man and the Wasp: Quantumania* (2023) | Film | HIGH |
| 39 | *Guardians of the Galaxy Vol. 3* (2023) | Film | SKIP |
| 40 | *Secret Invasion* (2023) | Series | SKIP |
| 41 | *Loki* S2 (2023) | Series | ESSENTIAL |
| 42 | *The Marvels* (2023) | Film | SKIP |
| 43 | *Deadpool & Wolverine* (2024) | Film | ESSENTIAL |
| 44 | *Captain America: Brave New World* (2025) | Film | ESSENTIAL |
| 45 | *Thunderbolts\** (2025) | Film | ESSENTIAL |
| 46 | *Ironheart* (2025) | Series | SKIP |

### Phase Six — road into Doomsday (2025–2026)

| Order | Title | Status (Aug 10, 2026) | Priority |
|---|---|---|---|
| 47 | *The Fantastic Four: First Steps* (Jul 25, 2025) | Released | ESSENTIAL |
| 48 | *Eyes of Wakanda* / *Marvel Zombies* / *Wonder Man* / street-level TV | Released | SKIP |
| 49 | *Spider-Man: Brand New Day* (Jul 31, 2026) | Released | OPTIONAL |
| 50 | *VisionQuest* (Oct 14, 2026) | Upcoming | OPTIONAL |
| ★ | ***Avengers: Doomsday*** (Dec 18, 2026) | Post-production | — |
| — | *Avengers: Secret Wars* (Dec 17, 2027) | Pre-production | Sequel |

---

## Cast → prior-title map

From Marvel.com / Disney billing + SDCC 2026 reporting (spoiler-light).

| Presence | Actor | Watch first |
|---|---|---|
| Doctor Doom | Robert Downey Jr. | *Fantastic Four: First Steps*; Infinity Saga for Downey MCU history |
| Steve Rogers | Chris Evans | Cap trilogy + *Endgame* |
| Peggy Carter | Hayley Atwell | *First Avenger* + *Endgame* (confirmed SDCC 2026; may lag static Marvel.com billing) |
| Thor | Chris Hemsworth | Thor films through *Ragnarok* / *Endgame* (+ *Love and Thunder* optional) |
| Loki | Tom Hiddleston | *Avengers* + *Loki* S1–S2 |
| Fantastic Four | Pascal / Kirby / Quinn / Moss-Bachrach | *Fantastic Four: First Steps* |
| Sam Wilson / Cap | Anthony Mackie | *Falcon and the Winter Soldier* and/or *Brave New World* |
| Bucky Barnes | Sebastian Stan | *Winter Soldier*, *Civil War*, *TFATWS*, *Thunderbolts\** |
| New Avengers / Thunderbolts | Pugh, Russell, Harbour, Pullman, John-Kamen, Newton, Ramirez, etc. | *Thunderbolts\** (+ *Black Widow*, *Hawkeye*, Ant-Man films) |
| Scott / Cassie Lang | Paul Rudd / Kathryn Newton | *Ant-Man* → *Ant-Man and the Wasp* → *Quantumania* |
| Shang-Chi | Simu Liu | *Shang-Chi* |
| Wakanda / Talokan | Wright, Duke, Huerta, Cadena | *Black Panther* + *Wakanda Forever* |
| Fox X-Men | Stewart, McKellen, Marsden, Romijn, Grammer, Cumming, Tatum | *X-Men*, *X2*, preferably *Last Stand* / *Days of Future Past*; *Deadpool & Wolverine* for Gambit bridge |

**Uncertain (rumored / not firmly billed):** Tom Holland, Benedict Cumberbatch, Jeremy Renner, Ryan Reynolds, Scarlet Witch — do not treat as required prep until officially confirmed.

---

## Safe soft-skips for Doomsday

- *The Incredible Hulk*, *Iron Man 3*, *Thor: The Dark World*  
- Guardians trilogy, *Eternals*, *The Marvels*, *Captain Marvel*  
- *She-Hulk*, *Secret Invasion*, *Moon Knight*, *Ms. Marvel*, *Echo*, *Ironheart*  
- *Wonder Man*, *Eyes of Wakanda*, *Marvel Zombies*, *Daredevil: Born Again*, Punisher special  
- Most *What If…?* beyond a light sample  
- Full Fox prequel stack (*First Class*, *Apocalypse*, *Dark Phoenix*, *New Mutants*)

---

## Website sequencing recommendation

1. **Landing:** “Start here to understand Doomsday” → Track B  
2. **Toggle:** Complete (A) / Prep (B) / Crash (C)  
3. **Universe modules:** Infinity Saga → Multiverse → New Teams → Fantastic Four → X-Men → Doomsday  
4. **Per-title cards:** year, type, priority badge, one-line why, runtime  
5. **Progress:** checklist → “what’s next”

**Canonical product checklist order = Track B tables (Acts 1–2), then Act 4 (X-Men), then optional Act 3 polish, then *Doomsday*.**

---

## Sources

**Primary**

- [Marvel.com — Avengers: Doomsday](https://www.marvel.com/movies/avengers-doomsday)  
- [Disney Movies — Avengers: Doomsday](https://movies.disney.com/avengers-doomsday)  
- [Wikipedia — List of MCU films](https://en.wikipedia.org/wiki/List_of_Marvel_Cinematic_Universe_films)  
- [Wikipedia — Avengers: Doomsday](https://en.wikipedia.org/wiki/Avengers:_Doomsday)  
- [Wikipedia — MCU Phase Six](https://en.wikipedia.org/wiki/Marvel_Cinematic_Universe:_Phase_Six)

**Secondary (priority cross-check)**

- [ScreenRant — Doomsday viewing guide](https://screenrant.com/mcu-movies-shows-watch-before-avengers-doomsday/) (May 2026)  
- [Rotten Tomatoes — Marvel movies in order](https://editorial.rottentomatoes.com/guide/marvel-movies-in-order/)  
- Variety / THR / Deadline / Collider coverage (trailer, SDCC 2026, Thunderbolts post-credits)

---

## Uncertainty flags (as of Aug 10, 2026)

- Exact *Doomsday* plot beyond the three-universe / Doom logline is still under wraps.  
- Priorities are driven by **confirmed cast**, official synopsis, and direct prior films (*FF*, *Thunderbolts\**, *Loki*, *Endgame*, Cap / Wakanda arcs).  
- *Brand New Day* and *VisionQuest* may add texture; they are **OPTIONAL** until Marvel bills those characters into *Doomsday*.  
- Which exact Fox X-Men continuity slice appears is not fully public — original trilogy + *Days of Future Past* remains the safest prep.

---

## Appendix — Chronological note

Disney+ has an official MCU Timeline Order. It moves titles like *First Avenger*, *Captain Marvel*, and *Fantastic Four: First Steps* earlier than release order.

**Do not default first-timers to chronological order** — it spoils introductions and muddies how the Multiverse Saga was revealed. Offer it later as an advanced / rewatch mode only.

**Practical chronology notes for prep only:**

| Title | Note |
|---|---|
| *Black Widow* | Mostly pre-*Civil War*; released in Phase Four — keep in release order for newcomers |
| *Fantastic Four: First Steps* | 1960s on Earth-828 — watch near *Doomsday* in release order, not next to Cap 1 |
| *Thunderbolts\** → *Doomsday* | Sacred Timeline placement ~14 months after Thunderbolts |
| *Loki* / *Deadpool & Wolverine* | Largely outside / adjacent to Sacred Timeline present |
