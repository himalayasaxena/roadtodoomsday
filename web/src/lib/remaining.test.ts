// web/src/lib/remaining.test.ts
import { describe, expect, it } from "vitest";
import {
  remainingLiveMinutes,
  remainingTitles,
  progressRemainingTitles,
  progressPercent,
  paceHoursPerDay,
} from "./remaining";
import type { Title } from "./types";

const titles: Title[] = [
  { id: "a", title: "A", year: 2008, sequenceOrder: 1, runtimeMinutes: 120 },
  { id: "b", title: "B", year: 2009, sequenceOrder: 2, runtimeMinutes: 90 },
  { id: "c", title: "C", year: 2010, sequenceOrder: 3, runtimeMinutes: 60 },
  {
    id: "avengers-secret-wars",
    title: "SW",
    year: 2027,
    sequenceOrder: 99,
    runtimeMinutes: 180,
  },
];

describe("progressRemainingTitles", () => {
  it("returns all countable unwatched titles regardless of scroll position", () => {
    expect(progressRemainingTitles(titles, {})).toEqual([
      titles[0],
      titles[1],
      titles[2],
    ]);
    expect(progressRemainingTitles(titles, { a: "watched" })).toEqual([
      titles[1],
      titles[2],
    ]);
    expect(
      progressRemainingTitles(titles, {
        a: "watched",
        b: "skipped",
        c: "watched",
      }),
    ).toEqual([]);
    expect(progressRemainingTitles(titles, {}).every((t) => t.id !== "avengers-secret-wars")).toBe(
      true,
    );
  });
});

describe("remainingTitles", () => {
  it("length and ids match remainingLiveMinutes filter", () => {
    const cases: Array<[string, Record<string, string | undefined>]> = [
      ["a", {}],
      ["b", {}],
      ["a", { a: "watched", b: "skipped" }],
      ["c", { a: "watched" }],
    ];
    for (const [activeId, progress] of cases) {
      const remaining = remainingTitles(titles, activeId, progress);
      const sum = remaining.reduce((s, t) => s + (t.runtimeMinutes || 0), 0);
      expect(sum).toBe(remainingLiveMinutes(titles, activeId, progress));
      expect(remaining.every((t) => t.id !== "avengers-secret-wars")).toBe(true);
    }
  });
});

describe("remainingLiveMinutes", () => {
  it("sums from active index ignoring secret wars", () => {
    expect(remainingLiveMinutes(titles, "a", {})).toBe(270);
    expect(remainingLiveMinutes(titles, "b", {})).toBe(150);
    expect(remainingLiveMinutes(titles, "c", {})).toBe(60);
  });

  it("excludes watched/skipped even at/after active", () => {
    expect(
      remainingLiveMinutes(titles, "a", { a: "watched", b: "skipped" }),
    ).toBe(60);
  });

  it("does not count titles before active (scroll-passed)", () => {
    expect(remainingLiveMinutes(titles, "c", {})).toBe(60);
  });
});

describe("progressPercent", () => {
  it("uses watched+skipped over countable", () => {
    expect(progressPercent(titles, {})).toBe(0);
    expect(progressPercent(titles, { a: "watched" })).toBe(33);
    expect(progressPercent(titles, { a: "watched", b: "skipped", c: "watched" })).toBe(100);
  });
});

describe("paceHoursPerDay", () => {
  it("returns null when remaining is 0", () => {
    expect(paceHoursPerDay(0, 10)).toBe(null);
  });
  it("divides by days left (min 1)", () => {
    expect(paceHoursPerDay(120, 0)).toBe(2);
    expect(paceHoursPerDay(180, 3)).toBe(1);
  });
});
