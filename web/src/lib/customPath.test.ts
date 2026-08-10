import { describe, expect, it } from "vitest";
import {
  catalogIdsInOrder,
  decodeIdBitmask,
  encodeCustomPathParam,
  encodeIdBitmask,
  parseCustomPathParam,
} from "./customPath";

const CATALOG = catalogIdsInOrder([
  { id: "a", sequenceOrder: 1 },
  { id: "b", sequenceOrder: 2 },
  { id: "c", sequenceOrder: 3 },
  { id: "d", sequenceOrder: 4 },
  { id: "e", sequenceOrder: 5 },
  { id: "f", sequenceOrder: 6 },
  { id: "g", sequenceOrder: 7 },
  { id: "h", sequenceOrder: 8 },
  { id: "i", sequenceOrder: 9 },
  { id: "j", sequenceOrder: 10 },
]);

describe("customPath bitmask", () => {
  it("round-trips a selection", () => {
    const selected = ["a", "c", "j"];
    const code = encodeIdBitmask(selected, CATALOG);
    expect(code.length).toBeGreaterThan(0);
    expect(code.length).toBeLessThan(20);
    expect(decodeIdBitmask(code, CATALOG)).toEqual(selected);
  });

  it("round-trips full catalog", () => {
    const code = encodeIdBitmask(CATALOG, CATALOG);
    expect(decodeIdBitmask(code, CATALOG)).toEqual(CATALOG);
  });

  it("parses compact p= and legacy ids=", () => {
    const selected = ["b", "e", "h"];
    const p = encodeCustomPathParam(selected, CATALOG);
    expect(parseCustomPathParam(p, undefined, CATALOG)).toEqual(selected);
    expect(
      parseCustomPathParam(undefined, "b,e,h", CATALOG),
    ).toEqual(selected);
  });

  it("treats slug-like values in ids= as legacy lists", () => {
    expect(
      parseCustomPathParam(undefined, "iron-man", CATALOG),
    ).toEqual(["iron-man"]);
    expect(
      parseCustomPathParam(undefined, "a,c", CATALOG),
    ).toEqual(["a", "c"]);
  });

  it("stays short for ~80 titles", () => {
    const big = Array.from({ length: 80 }, (_, i) => `t${i}`);
    const pick = big.filter((_, i) => i % 3 === 0);
    const code = encodeIdBitmask(pick, big);
    expect(code.length).toBeLessThanOrEqual(16);
    expect(decodeIdBitmask(code, big)).toEqual(pick);
  });
});
