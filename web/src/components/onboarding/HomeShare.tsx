"use client";

import { useState } from "react";
import { copyTextAsync, shareJourney } from "@/lib/share";

const CAPTION =
  "Doomsday Watch Path. Pick your MCU roadmap before Avengers: Doomsday.";

export function HomeShare() {
  const [note, setNote] = useState("");

  function siteUrl() {
    if (typeof window === "undefined") return "/";
    return `${window.location.origin}/`;
  }

  async function onShare(kind: "system" | "copy") {
    const url = siteUrl();

    if (kind === "copy") {
      const ok = await copyTextAsync(url);
      setNote(ok ? "Link copied" : "Could not copy. Long-press the address bar");
      return;
    }

    const result = await shareJourney(CAPTION, url);
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
    <div className="home-share">
      <button
        type="button"
        className="action-btn"
        onClick={() => void onShare("system")}
        title="Share this site"
      >
        Share
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
