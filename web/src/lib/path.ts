import { DOOMSDAY_RELEASE } from "./catalog";
import type { Title, Track } from "./types";

export function resolvePathTitles(
  trackId: string,
  tracks: Track[],
  titlesById: Record<string, Title>,
  customIds?: string[],
): { trackName: string; description: string; titles: Title[] } {
  if (trackId === "custom") {
    const ids = customIds || [];
    const titles = ids
      .map((id) => titlesById[id])
      .filter(Boolean)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    return {
      trackName: "Custom journey",
      description: "Your hand-picked roadmap in release order.",
      titles,
    };
  }
  const track = tracks.find((t) => t.id === trackId);
  if (!track) {
    return { trackName: trackId, description: "", titles: [] };
  }
  const titles = track.titleIds.map((id) => titlesById[id]).filter(Boolean);
  return {
    trackName: track.name,
    description: track.description,
    titles,
  };
}

export function pathMinutes(titles: Title[], excludeSecretWars = true) {
  return titles.reduce((sum, t) => {
    if (excludeSecretWars && t.id === "avengers-secret-wars") return sum;
    return sum + (t.runtimeMinutes || 0);
  }, 0);
}

export function formatRuntime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

export function daysUntilDoomsday(now = Date.now()) {
  const ms = Math.max(0, new Date(DOOMSDAY_RELEASE).getTime() - now);
  return Math.floor(ms / 86400000);
}

export function providerLogoPublic(logoPath?: string) {
  if (!logoPath) return null;
  const name = logoPath.split("/").pop();
  return name ? `/media/providers/${name}` : null;
}
