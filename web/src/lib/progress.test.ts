import { describe, expect, it } from "vitest";
import { encodeProgressQuery, parseProgressQuery } from "./progress";

const PATH = ["a", "b", "c", "d", "e"];

describe("progress compact query", () => {
  it("round-trips watched/skipped via bitmask", () => {
    const map = { a: "watched" as const, c: "skipped" as const, e: "watched" as const };
    const q = encodeProgressQuery(map, PATH);
    const params = new URLSearchParams(q);
    const parsed = parseProgressQuery(
      params.get("w") || undefined,
      params.get("s") || undefined,
      PATH,
    );
    expect(parsed).toEqual(map);
    expect(params.get("w")!.length).toBeLessThan(12);
  });

  it("still accepts legacy comma lists", () => {
    expect(parseProgressQuery("a,e", "c", PATH)).toEqual({
      a: "watched",
      e: "watched",
      c: "skipped",
    });
  });

  it("does not treat a single slug as a bitmask", () => {
    expect(parseProgressQuery("iron-man", undefined, PATH)).toEqual({
      "iron-man": "watched",
    });
  });
});
