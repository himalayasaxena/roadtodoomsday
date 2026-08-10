"use client";

import { useEffect, useMemo, useState } from "react";
import { CARD_BACKDROPS } from "@/lib/catalog";

/** Home hero playlist - rotates on its own; not tied to card hover. */
const HOME_PLAYLIST = [
  ...CARD_BACKDROPS.prep,
  ...CARD_BACKDROPS.crash,
  ...CARD_BACKDROPS.complete,
  ...CARD_BACKDROPS.custom,
  ...CARD_BACKDROPS.more,
].filter((src, i, arr) => arr.indexOf(src) === i);

const INTERVAL_MS = 7000;

type Props = {
  /** Kept for API stability; backdrop no longer follows card focus. */
  activeCard?: string;
};

export function BackdropStage({ activeCard: _activeCard }: Props) {
  const sources = useMemo(() => HOME_PLAYLIST, []);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || sources.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % sources.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [sources, reduceMotion]);

  return (
    <div className="backdrop-stage" aria-hidden>
      {sources.map((src, i) => (
        <div
          key={src}
          className={`backdrop-layer ${i === index ? "is-active" : ""} ${reduceMotion ? "no-motion" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="backdrop-veil" />
      <div className="backdrop-grain" />
    </div>
  );
}
