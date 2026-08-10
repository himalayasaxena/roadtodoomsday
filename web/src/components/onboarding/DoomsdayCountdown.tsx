"use client";

import { useEffect, useState } from "react";
import { DOOMSDAY_RELEASE } from "@/lib/catalog";

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function calc(now: number): Parts {
  const totalMs = Math.max(0, new Date(DOOMSDAY_RELEASE).getTime() - now);
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, totalMs };
}

function Cell({ label, value }: { label: string; value: number }) {
  return (
    <div className="countdown-cell">
      <span className="countdown-value">{String(value).padStart(2, "0")}</span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export function DoomsdayCountdown() {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(calc(Date.now()));
    const id = window.setInterval(() => setParts(calc(Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <div className="countdown glass-panel" aria-hidden>
        <div className="countdown-cell">
          <span className="countdown-value">--</span>
          <span className="countdown-label">days</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="countdown glass-panel"
      role="timer"
      aria-live="polite"
      aria-label={`Doomsday in ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds`}
    >
      <div className="countdown-heading">
        <span className="countdown-kicker">Until Avengers: Doomsday</span>
        <span className="countdown-date">Dec 18, 2026</span>
      </div>
      <div className="countdown-grid">
        <Cell label="days" value={parts.days} />
        <Cell label="hrs" value={parts.hours} />
        <Cell label="min" value={parts.minutes} />
        <Cell label="sec" value={parts.seconds} />
      </div>
    </div>
  );
}
