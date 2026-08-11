# Soft Online Presence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sitewide sticky chip showing `● {n} online` where `n` is a deterministic, time-of-day-aware integer clamped to 250–300.

**Architecture:** Pure `onlineCountAt(date)` in `lib/onlineCount.ts` owns the math. A small client `OnlinePresence` component ticks every 45s and mounts in root `layout.tsx` above `site-main`. Styles live in `globals.css`. No network or storage.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · CSS in `globals.css` · Vitest (already configured)

## Global Constraints

- Soft social proof only — no real presence infra
- Count always integer in `[250, 300]` inclusive
- Copy exactly: `● {n} online` (placeholder before hydrate: `··· online`)
- Accessible name: `About {n} people online`
- Tick every **45 seconds** + once on mount
- Local timezone for the curve
- Invalid `Date` → fallback **275**
- Pulse respects `prefers-reduced-motion`
- Sitewide via root layout (not per-page headers)
- Do not commit unless user asks

---

## File structure

| File | Responsibility |
|---|---|
| `web/src/lib/onlineCount.ts` | Pure `onlineCountAt(date: Date): number` |
| `web/src/lib/onlineCount.test.ts` | Invariant unit tests |
| `web/src/components/OnlinePresence.tsx` | Client UI + 45s tick |
| `web/src/app/layout.tsx` | Mount bar above `site-main` |
| `web/src/app/globals.css` | Bar + pulse styles |
| `docs/feature-list.md` | Inbox / decision note for the feature |

---

### Task 1: `onlineCountAt` + Vitest

**Files:**
- Create: `web/src/lib/onlineCount.ts`
- Create: `web/src/lib/onlineCount.test.ts`

**Interfaces:**
- Produces: `onlineCountAt(date: Date): number` — integer in `[250, 300]`; invalid date → `275`

- [x] **Step 1: Write the failing tests**

```ts
// web/src/lib/onlineCount.test.ts
import { describe, expect, it } from "vitest";
import { onlineCountAt } from "./onlineCount";

/** Local-wall-clock Date for a fixed calendar day (avoids TZ flakes in CI). */
function localAt(
  y: number,
  m: number,
  d: number,
  h: number,
  min = 0,
  s = 0,
): Date {
  return new Date(y, m - 1, d, h, min, s, 0);
}

describe("onlineCountAt", () => {
  it("returns 275 for invalid Date", () => {
    expect(onlineCountAt(new Date(Number.NaN))).toBe(275);
  });

  it("is stable for the same Date", () => {
    const t = localAt(2026, 8, 11, 15, 30);
    expect(onlineCountAt(t)).toBe(onlineCountAt(t));
  });

  it("always stays in [250, 300]", () => {
    const day = localAt(2026, 8, 11, 0, 0);
    for (let min = 0; min < 24 * 60; min += 7) {
      const t = new Date(day.getTime() + min * 60_000);
      const n = onlineCountAt(t);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(250);
      expect(n).toBeLessThanOrEqual(300);
    }
  });

  it("is higher in evening than overnight on the same day", () => {
    const overnight = onlineCountAt(localAt(2026, 8, 11, 3, 0));
    const evening = onlineCountAt(localAt(2026, 8, 11, 21, 0));
    expect(evening).toBeGreaterThanOrEqual(overnight);
  });

  it("does not jump by more than 5 between adjacent minutes", () => {
    const base = localAt(2026, 8, 11, 12, 0);
    for (let i = 0; i < 180; i++) {
      const a = onlineCountAt(new Date(base.getTime() + i * 60_000));
      const b = onlineCountAt(new Date(base.getTime() + (i + 1) * 60_000));
      expect(Math.abs(a - b)).toBeLessThanOrEqual(5);
    }
  });
});
```

- [x] **Step 2: Run tests to verify they fail**

```bash
cd /Users/himalaya/Desktop/dooms/web && npm test -- src/lib/onlineCount.test.ts
```

Expected: FAIL — cannot find module `./onlineCount` (or `onlineCountAt` undefined).

- [x] **Step 3: Write minimal implementation**

```ts
// web/src/lib/onlineCount.ts

const MIN = 250;
const MAX = 300;
const FALLBACK = 275;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

/**
 * Soft social-proof concurrent count.
 * Deterministic from local wall clock; no network.
 */
export function onlineCountAt(date: Date): number {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return FALLBACK;
  }

  const hours =
    date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  // Peak ~20:00 local, trough ~04:00. Range ≈ mid-250s → high-290s before wobble.
  const phase = ((hours - 4) / 24) * Math.PI * 2;
  const tod = 0.5 + 0.5 * Math.sin(phase - Math.PI / 2);
  // tod ≈ 0 at ~04:00, ≈ 1 at ~20:00
  const base = 255 + tod * 40; // 255–295

  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const doy = dayOfYear(date);
  const wobble =
    2.2 * Math.sin((minuteOfDay / 60) * 0.35 + doy * 0.17) +
    1.4 * Math.sin((minuteOfDay / 40) * 0.55 + doy * 0.09);

  return clamp(Math.round(base + wobble), MIN, MAX);
}
```

Tune constants only if a test fails (evening ≥ overnight must hold with this phase).

- [x] **Step 4: Run tests to verify they pass**

```bash
cd /Users/himalaya/Desktop/dooms/web && npm test -- src/lib/onlineCount.test.ts
```

Expected: PASS (all 5 tests).

- [ ] **Step 5: Commit** (only if user asked)

```bash
git add web/src/lib/onlineCount.ts web/src/lib/onlineCount.test.ts
git commit -m "$(cat <<'EOF'
Add deterministic online-count helper for soft social proof.

EOF
)"
```

---

### Task 2: `OnlinePresence` component + CSS + layout mount

**Files:**
- Create: `web/src/components/OnlinePresence.tsx`
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/globals.css` (append styles near `.site-main`)
- Modify: `docs/feature-list.md` (idea inbox + decision log)

**Interfaces:**
- Consumes: `onlineCountAt(date: Date): number` from `@/lib/onlineCount`
- Produces: `<OnlinePresence />` — no props

- [x] **Step 1: Create the client component**

```tsx
// web/src/components/OnlinePresence.tsx
"use client";

import { useEffect, useState } from "react";
import { onlineCountAt } from "@/lib/onlineCount";

const TICK_MS = 45_000;

export function OnlinePresence() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setCount(onlineCountAt(new Date()));
    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const label =
    count == null ? "About people online" : `About ${count} people online`;
  const display = count == null ? "···" : String(count);

  return (
    <div
      className="online-presence"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="online-presence-inner">
        <span className="online-presence-dot" aria-hidden />
        <span className="online-presence-text">
          {display} online
        </span>
      </span>
    </div>
  );
}
```

Visual copy uses a CSS bullet via the dot span (not a unicode `●` in the text node) so the accessible name stays clean. Visible text should still read as “273 online” with a green dot before it — matching the approved `● 273 online` look.

- [x] **Step 2: Add CSS after `.site-main` block in `globals.css`**

```css
.online-presence {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 30px;
  padding: 0.35rem clamp(0.75rem, 3vw, 1.25rem);
  background: color-mix(in oklab, #0a0a0a 88%, transparent);
  border-bottom: 1px solid color-mix(in oklab, #fff 10%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.online-presence-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: color-mix(in oklab, #fff 72%, transparent);
}

.online-presence-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 color-mix(in oklab, #4ade80 55%, transparent);
  animation: online-pulse 2.4s ease-out infinite;
}

.online-presence-text {
  font-variant-numeric: tabular-nums;
}

@keyframes online-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in oklab, #4ade80 45%, transparent);
  }
  70% {
    box-shadow: 0 0 0 0.45rem color-mix(in oklab, #4ade80 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in oklab, #4ade80 0%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .online-presence-dot {
    animation: none;
  }
}

@media (max-width: 520px) {
  .online-presence {
    justify-content: center;
  }
}
```

- [x] **Step 3: Mount in root layout**

In `web/src/app/layout.tsx`:

1. Add import: `import { OnlinePresence } from "@/components/OnlinePresence";`
2. Inside `<body>`, render before `site-main`:

```tsx
<OnlinePresence />
<div className="site-main">{children}</div>
```

Full body children order becomes: GA scripts / JSON-LD (unchanged) → `<OnlinePresence />` → `<div className="site-main">` → `<SiteFooter />` → `<SpeedInsights />`.

- [x] **Step 4: Note in feature list**

In `docs/feature-list.md` Idea inbox, replace an empty `- [ ] —` with:

```md
- [x] Soft online presence chip (deterministic 250–300, sitewide) — shipped
```

Add decision-log row:

```md
| 2026-08-11 | Soft online presence = deterministic local time curve in [250, 300]; not real presence. |
```

- [x] **Step 5: Manual verify** (build + unit tests; visual check left to user)

```bash
cd /Users/himalaya/Desktop/dooms/web && npm run dev
```

Check `/`, `/path/prep`, and `/about`:

- Bar sticky at top; shows green dot + integer + `online`
- Number ∈ 250–300
- Before JS hydrate briefly shows `··· online`
- With reduced motion enabled, dot does not pulse

- [x] **Step 6: Run full unit tests**

```bash
cd /Users/himalaya/Desktop/dooms/web && npm test
```

Expected: all existing + new tests PASS.

- [ ] **Step 7: Commit** (only if user asked)

```bash
git add \
  web/src/components/OnlinePresence.tsx \
  web/src/app/layout.tsx \
  web/src/app/globals.css \
  docs/feature-list.md
git commit -m "$(cat <<'EOF'
Add sitewide soft online-presence social proof chip.

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Deterministic `onlineCountAt` | Task 1 |
| Clamp 250–300; invalid → 275 | Task 1 |
| Evening ≥ overnight; slow drift | Task 1 tests + impl |
| `OnlinePresence` client + 45s tick | Task 2 |
| Hydrate placeholder `··· online` | Task 2 |
| Copy / a11y label / reduced motion | Task 2 |
| Sitewide via `layout.tsx` | Task 2 |
| CSS sticky compact bar | Task 2 |
| No server / presence infra | Both (by omission) |
