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
