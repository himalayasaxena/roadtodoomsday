"use client";

import { useEffect, useState } from "react";
import { onlineCountAt } from "@/lib/onlineCount";

const TICK_MS = 45_000;

export function OnlinePresence() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setCount(onlineCountAt(new Date()));
    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
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
