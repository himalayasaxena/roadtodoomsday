import type { Title, Track } from "./types";

export const DOOMSDAY_RELEASE = "2026-12-18T00:00:00.000Z";

export function getTrack(tracks: Track[], id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function formatRuntimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

export function sortTitlesBySequence(titles: Title[]): Title[] {
  return [...titles].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

/** Backdrop sets keyed by onboarding card id - prefer recent Doomsday-relevant stills */
export const CARD_BACKDROPS: Record<string, string[]> = {
  prep: [
    "/media/backdrops/avengers-doomsday.jpg",
    "/media/backdrops/thunderbolts.jpg",
    "/media/backdrops/fantastic-four-first-steps.jpg",
    "/media/backdrops/deadpool-wolverine.jpg",
  ],
  crash: [
    "/media/backdrops/thunderbolts.jpg",
    "/media/backdrops/fantastic-four-first-steps.jpg",
    "/media/backdrops/captain-america-brave-new-world.jpg",
    "/media/backdrops/avengers-doomsday.jpg",
  ],
  complete: [
    "/media/backdrops/avengers-endgame.jpg",
    "/media/backdrops/spider-man-no-way-home.jpg",
    "/media/backdrops/avengers-infinity-war.jpg",
    "/media/backdrops/avengers-doomsday.jpg",
  ],
  more: [
    "/media/backdrops/deadpool-wolverine.jpg",
    "/media/backdrops/x-men-days-of-future-past.jpg",
    "/media/backdrops/loki-s2.jpg",
    "/media/backdrops/wandavision.jpg",
  ],
  custom: [
    "/media/backdrops/spider-man-no-way-home.jpg",
    "/media/backdrops/doctor-strange-mom.jpg",
    "/media/backdrops/avengers-doomsday.jpg",
  ],
  default: [
    "/media/backdrops/avengers-doomsday.jpg",
    "/media/backdrops/thunderbolts.jpg",
  ],
};

/** Single hero still for each home path card */
export const CARD_HERO: Record<string, string> = {
  prep: "/media/backdrops/avengers-doomsday.jpg",
  crash: "/media/backdrops/thunderbolts.jpg",
  complete: "/media/backdrops/avengers-endgame.jpg",
  custom: "/media/backdrops/spider-man-no-way-home.jpg",
  more: "/media/backdrops/deadpool-wolverine.jpg",
};

/** Short home-card blurbs (keep path-page descriptions separate if longer) */
export const CARD_BLURBS: Record<string, string> = {
  prep: "Strong Doomsday context without the full catalog.",
  crash: "Must-sees only, when opening night is close.",
  complete: "Every title in release order, zero gaps.",
  custom: "Search and stack your own Doomsday timeline.",
  more: "Character arcs and the Fox X-Men branch.",
};

/** Hero banner art for More-panel track cards */
export const TRACK_BANNERS: Record<string, string> = {
  xmen: "/media/backdrops/x-men-days-of-future-past.jpg",
  "iron-man": "/media/backdrops/iron-man.jpg",
  thor: "/media/backdrops/thor-ragnarok.jpg",
  "captain-america": "/media/backdrops/captain-america-the-winter-soldier.jpg",
  "spider-man": "/media/backdrops/spider-man-no-way-home.jpg",
  "doctor-strange": "/media/backdrops/doctor-strange-mom.jpg",
  guardians: "/media/backdrops/guardians-of-the-galaxy-vol-3.jpg",
  "black-panther": "/media/backdrops/black-panther-wakanda-forever.jpg",
  loki: "/media/backdrops/loki-s1.jpg",
  "wanda-vision": "/media/backdrops/wandavision.jpg",
  deadpool: "/media/backdrops/deadpool-wolverine.jpg",
};

export function trackBanner(
  track: Track,
  titlesById?: Record<string, Title>,
): string {
  if (TRACK_BANNERS[track.id]) return TRACK_BANNERS[track.id];
  if (titlesById) {
    for (const id of [...track.titleIds].reverse()) {
      const src = titlesById[id]?.backdropPublic;
      if (src) return src;
    }
  }
  return CARD_BACKDROPS.default[0];
}
