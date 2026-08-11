"use client";

import { useEffect, useState } from "react";
import { onlineCountAt } from "@/lib/onlineCount";

/** Random delay in [5s, 10s] so the chip feels live without a metronome beat. */
function nextTickMs() {
  return 5_000 + Math.floor(Math.random() * 5_001);
}

export function OnlinePresence() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId = 0;
    const tick = () => {
      setCount(onlineCountAt(new Date()));
      timeoutId = window.setTimeout(tick, nextTickMs());
    };
    tick();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const label =
    count == null ? "About people online" : `About ${count} people online`;
  const display = count == null ? "···" : String(count);

  return (
    <div
      className="online-presence"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="online-presence-inner">
        <span className="online-presence-dot" aria-hidden />
        <span className="online-presence-text">{display} online</span>
      </span>
    </div>
  );
}
