"use client";

import { useState } from "react";
import {
  buildShareCaption,
  copyTextAsync,
  shareJourney,
} from "@/lib/share";

type Props = {
  trackName: string;
  trackId: string;
  watched: number;
  skipped: number;
  total: number;
  remainingLabel: string;
  daysLeft: number;
  getSharePath: () => string;
};

export function ShareBar({
  trackName,
  trackId,
  watched,
  skipped,
  total,
  remainingLabel,
  daysLeft,
  getSharePath,
}: Props) {
  const [note, setNote] = useState("");
  const done = watched + skipped;
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  function buildPayload() {
    const path = getSharePath();
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    const caption = buildShareCaption({
      trackName,
      watched: done,
      total,
      remainingHoursLabel: remainingLabel,
      daysLeft,
    }).replace(
      `${done}/${total} watched`,
      `${watched} watched · ${skipped} skipped · ${done}/${total} done`,
    );
    return { url, caption };
  }

  async function onShare(kind: "system" | "copy") {
    const { url, caption } = buildPayload();

    if (kind === "copy") {
      const ok = await copyTextAsync(url);
      setNote(ok ? "Link copied" : "Could not copy. Long-press the address bar");
      return;
    }

    const result = await shareJourney(caption, url);
    setNote(
      result === "shared"
        ? "Opened share sheet"
        : result === "copied"
          ? "Link copied"
          : result === "cancelled"
            ? ""
            : "Share failed",
    );
  }

  return (
    <div className="share-inline">
      <button
        type="button"
        className="action-btn"
        onClick={() => void onShare("system")}
        title={
          trackId === "custom"
            ? "Share custom journey with progress"
            : "Share journey with progress"
        }
      >
        {canNativeShare ? "Share" : "Share"}
      </button>
      <button
        type="button"
        className="action-btn ghost"
        onClick={() => void onShare("copy")}
      >
        Copy link
      </button>
      {note ? <span className="share-inline-note">{note}</span> : null}
    </div>
  );
}
