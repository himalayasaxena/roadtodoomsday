import { describe, expect, it } from "vitest";
import {
  buildWatchSchedule,
  collectSittingDays,
  eventsToIcs,
} from "./calendar";
import type { Title } from "./types";

const titles: Title[] = [
  {
    id: "iron-man",
    title: "Iron Man",
    year: 2008,
    sequenceOrder: 1,
    runtimeMinutes: 126,
    whyWatch: "Origin.",
  },
  {
    id: "thor",
    title: "Thor",
    year: 2011,
    sequenceOrder: 2,
    runtimeMinutes: 115,
  },
];

describe("buildWatchSchedule", () => {
  it("schedules one title per evening starting tomorrow at preferred time", () => {
    const now = new Date(2026, 5, 1, 12, 0, 0); // jun 1 2026 local
    const { events, tight, movieCount, sittingDays } = buildWatchSchedule(
      titles,
      {
        trackName: "Prep",
        now,
        startHour: 21,
        startMinute: 0,
      },
    );
    expect(tight).toBe(false);
    expect(events).toHaveLength(2);
    expect(movieCount).toBe(2);
    expect(sittingDays).toBe(2);
    expect(events[0].start.getHours()).toBe(21);
    expect(events[0].start.getDate()).toBe(2);
    expect(events[0].end.getTime() - events[0].start.getTime()).toBe(
      126 * 60 * 1000,
    );
    expect(events[0].summary).toContain("Iron Man");
    expect(events[1].start.getDate()).toBe(3);
  });

  it("respects custom start hour and Watch here URL", () => {
    const now = new Date(2026, 5, 1, 12, 0, 0);
    const { events } = buildWatchSchedule(titles, {
      trackName: "Prep",
      now,
      startHour: 20,
      startMinute: 30,
      watchUrls: { "iron-man": "https://stream.example/iron-man" },
    });
    expect(events[0].start.getHours()).toBe(20);
    expect(events[0].start.getMinutes()).toBe(30);
    expect(events[0].description).toContain(
      "Watch here: https://stream.example/iron-man",
    );
    expect(events[0].description).not.toContain("example.com/path");
  });

  it("skips weekends when includeWeekends is false", () => {
    // Friday Jun 5 2026 → tomorrow is Sat Jun 6; with weekends off first sit is Mon Jun 8
    const now = new Date(2026, 5, 5, 12, 0, 0);
    const { events } = buildWatchSchedule(titles, {
      trackName: "Prep",
      now,
      includeWeekends: false,
    });
    expect(events[0].start.getDay()).not.toBe(0);
    expect(events[0].start.getDay()).not.toBe(6);
    expect(events[1].start.getDay()).not.toBe(0);
    expect(events[1].start.getDay()).not.toBe(6);
    expect(events[0].start.getDate()).toBe(8); // Monday
  });

  it("forces tight after Doomsday deadline even for one title", () => {
    const now = new Date(2026, 11, 18, 12, 0, 0);
    const one: Title[] = [
      {
        id: "iron-man",
        title: "Iron Man",
        year: 2008,
        sequenceOrder: 1,
        runtimeMinutes: 126,
      },
    ];
    const { tight, events } = buildWatchSchedule(one, {
      trackName: "Prep",
      now,
    });
    expect(tight).toBe(true);
    expect(events).toHaveLength(1);
    expect(events[0].start.getHours()).toBe(21);
    expect(events[0].start.getDate()).toBe(19);
  });

  it("uses path index from allTitles for event summaries", () => {
    const now = new Date(2026, 5, 1, 12, 0, 0);
    const fullPath: Title[] = [
      ...titles,
      {
        id: "captain-america",
        title: "Captain America",
        year: 2011,
        sequenceOrder: 3,
        runtimeMinutes: 124,
      },
    ];
    const remaining = [fullPath[2]];
    const { events } = buildWatchSchedule(remaining, {
      trackName: "Prep",
      now,
      allTitles: fullPath,
    });
    expect(events).toHaveLength(1);
    expect(events[0].summary).toMatch(/^#3 Captain America/);
  });

  it("sets tight when more titles than nights before Doomsday", () => {
    const many = Array.from({ length: 40 }, (_, i) => ({
      id: `t${i}`,
      title: `T${i}`,
      year: 2000 + i,
      sequenceOrder: i,
      runtimeMinutes: 90,
    }));
    const now = new Date(2026, 11, 10, 12, 0, 0);
    const { tight, events } = buildWatchSchedule(many, {
      trackName: "Prep",
      now,
    });
    expect(tight).toBe(true);
    expect(events.length).toBe(40);
  });
});

describe("collectSittingDays", () => {
  it("excludes weekends when asked", () => {
    const start = new Date(2026, 5, 5); // Fri
    const end = new Date(2026, 5, 8); // Mon
    const days = collectSittingDays(start, end, false);
    expect(days.map((d) => d.getDay())).toEqual([5, 1]); // Fri, Mon
  });
});

describe("eventsToIcs", () => {
  it("includes VCALENDAR, VEVENT, VALARM", () => {
    const now = new Date(2026, 5, 1, 12, 0, 0);
    const { events } = buildWatchSchedule(titles, {
      trackName: "Prep",
      now,
    });
    const ics = eventsToIcs(events, "Doomsday Watch Path");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("TRIGGER:-PT30M");
    expect(ics).toContain("Iron Man");
  });
});
