"use client";

type Props = {
  fromSrc: string;
  toSrc: string;
  /** 0 = fully fromSrc, 1 = fully toSrc */
  progress: number;
  reduceMotion?: boolean;
};

const FALLBACK = "/media/backdrops/avengers-doomsday.jpg";

/**
 * Scroll-linked dual backdrop: opacities follow `progress` (0→1)
 * so the crossfade tracks scroll instead of snapping.
 */
export function PathBackdrop({ fromSrc, toSrc, progress, reduceMotion }: Props) {
  const from = fromSrc || FALLBACK;
  const to = toSrc || FALLBACK;
  const t = reduceMotion ? (progress >= 0.5 ? 1 : 0) : Math.min(1, Math.max(0, progress));
  const same = from === to;

  return (
    <div className="path-hero-bg" aria-hidden>
      <div
        className={`path-hero-image is-visible ${reduceMotion ? "no-motion" : ""}`}
        style={{
          backgroundImage: `url(${from})`,
          opacity: same ? 1 : 1 - t,
        }}
      />
      {!same ? (
        <div
          className={`path-hero-image is-visible ${reduceMotion ? "no-motion" : ""}`}
          style={{
            backgroundImage: `url(${to})`,
            opacity: t,
          }}
        />
      ) : null}
      <div className="path-hero-veil" />
    </div>
  );
}
