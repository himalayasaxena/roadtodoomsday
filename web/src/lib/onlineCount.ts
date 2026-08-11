const MIN = 200;
const MAX = 500;
const FALLBACK = 350;

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

  // Peak ~20:00 local, trough ~04:00.
  const phase = ((hours - 4) / 24) * Math.PI * 2;
  const tod = 0.5 + 0.5 * Math.sin(phase - Math.PI / 2);
  // tod ≈ 0 at ~04:00, ≈ 1 at ~20:00 → base ≈ 230–480 before wobble
  const base = 230 + tod * 250;

  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const secondOfDay =
    minuteOfDay * 60 + date.getSeconds() + date.getMilliseconds() / 1000;
  const doy = dayOfYear(date);
  // Slow drift (minutes) + faster wiggle so a 5–10s UI tick can change the digit.
  const wobble =
    14 * Math.sin((minuteOfDay / 60) * 0.35 + doy * 0.17) +
    9 * Math.sin((minuteOfDay / 40) * 0.55 + doy * 0.09) +
    3.2 * Math.sin(secondOfDay / 8.5 + doy * 0.05);

  return clamp(Math.round(base + wobble), MIN, MAX);
}
