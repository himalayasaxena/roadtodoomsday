import {
  decodeIdBitmask,
  encodeIdBitmask,
  isLegacyIdList,
} from "./customPath";

const KEY = "doomsday-watch-progress-v2";

export type ProgressMap = Record<string, "watched" | "skipped">;

function scopeKey(trackKey: string) {
  return `${KEY}:${trackKey}`;
}

export function trackStorageKey(trackId: string, customIds?: string[]) {
  if (trackId === "custom") {
    return `custom:${(customIds || []).join(",")}`;
  }
  return trackId;
}

export function loadProgress(trackKey: string): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(scopeKey(trackKey));
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(trackKey: string, map: ProgressMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(scopeKey(trackKey), JSON.stringify(map));
}

export function setTitleStatus(
  trackKey: string,
  map: ProgressMap,
  titleId: string,
  status: "watched" | "skipped" | null,
): ProgressMap {
  const next = { ...map };
  if (!status) delete next[titleId];
  else next[titleId] = status;
  saveProgress(trackKey, next);
  return next;
}

/** Encode watched/skipped into URL query for shareable continue */
export function encodeProgressQuery(map: ProgressMap, titleIds: string[]) {
  const watched = titleIds.filter((id) => map[id] === "watched");
  const skipped = titleIds.filter((id) => map[id] === "skipped");
  const params = new URLSearchParams();
  if (watched.length) params.set("w", encodeIdBitmask(watched, titleIds));
  if (skipped.length) params.set("s", encodeIdBitmask(skipped, titleIds));
  return params.toString();
}

export function parseProgressQuery(
  w?: string,
  s?: string,
  pathTitleIds?: string[],
): ProgressMap {
  const map: ProgressMap = {};

  const resolve = (raw: string | undefined, status: "watched" | "skipped") => {
    if (!raw?.trim()) return;
    const value = raw.trim();
    if (pathTitleIds?.length && !isLegacyIdList(value)) {
      const ids = decodeIdBitmask(value, pathTitleIds);
      if (ids.length) {
        for (const id of ids) map[id] = status;
        return;
      }
    }
    for (const id of value.split(",").map((x) => x.trim()).filter(Boolean)) {
      map[id] = status;
    }
  };

  resolve(w, "watched");
  resolve(s, "skipped");
  return map;
}

export function mergeProgress(base: ProgressMap, fromUrl: ProgressMap): ProgressMap {
  return { ...base, ...fromUrl };
}
