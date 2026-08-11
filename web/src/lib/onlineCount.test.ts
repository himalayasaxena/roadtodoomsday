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
  it("returns 350 for invalid Date", () => {
    expect(onlineCountAt(new Date(Number.NaN))).toBe(350);
  });

  it("is stable for the same Date", () => {
    const t = localAt(2026, 8, 11, 15, 30);
    expect(onlineCountAt(t)).toBe(onlineCountAt(t));
  });

  it("always stays in [200, 500]", () => {
    const day = localAt(2026, 8, 11, 0, 0);
    for (let min = 0; min < 24 * 60; min += 7) {
      const t = new Date(day.getTime() + min * 60_000);
      const n = onlineCountAt(t);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(200);
      expect(n).toBeLessThanOrEqual(500);
    }
  });

  it("is higher in evening than overnight on the same day", () => {
    const overnight = onlineCountAt(localAt(2026, 8, 11, 3, 0));
    const evening = onlineCountAt(localAt(2026, 8, 11, 21, 0));
    expect(evening).toBeGreaterThanOrEqual(overnight);
  });

  it("does not jump by more than 12 between adjacent minutes", () => {
    const base = localAt(2026, 8, 11, 12, 0);
    for (let i = 0; i < 180; i++) {
      const a = onlineCountAt(new Date(base.getTime() + i * 60_000));
      const b = onlineCountAt(new Date(base.getTime() + (i + 1) * 60_000));
      expect(Math.abs(a - b)).toBeLessThanOrEqual(12);
    }
  });

  it("can change within a 10-second window", () => {
    const base = localAt(2026, 8, 11, 15, 0, 0);
    const values = new Set<number>();
    for (let s = 0; s <= 10; s++) {
      values.add(onlineCountAt(new Date(base.getTime() + s * 1000)));
    }
    expect(values.size).toBeGreaterThan(1);
  });

  it("does not jump by more than 3 between adjacent seconds", () => {
    const base = localAt(2026, 8, 11, 15, 0, 0);
    for (let s = 0; s < 120; s++) {
      const a = onlineCountAt(new Date(base.getTime() + s * 1000));
      const b = onlineCountAt(new Date(base.getTime() + (s + 1) * 1000));
      expect(Math.abs(a - b)).toBeLessThanOrEqual(3);
    }
  });
});
