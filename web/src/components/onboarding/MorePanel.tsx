"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { formatRuntimeLabel, trackBanner } from "@/lib/catalog";
import type { Title, Track } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  characterTracks: Track[];
  xmenTrack?: Track;
  titles: Title[];
  onFocusCard: (id: string) => void;
};

type MoreCard = {
  id: string;
  name: string;
  description: string;
  href: string;
  banner: string;
  meta: string;
};

export function MorePanel({
  open,
  onClose,
  characterTracks,
  xmenTrack,
  titles,
  onFocusCard,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const titlesById = useMemo(
    () => Object.fromEntries(titles.map((t) => [t.id, t])),
    [titles],
  );

  const cards = useMemo(() => {
    const list: MoreCard[] = [];
    if (xmenTrack) {
      list.push({
        id: xmenTrack.id,
        name: "X-Men",
        description: xmenTrack.description,
        href: "/path/xmen",
        banner: trackBanner(xmenTrack, titlesById),
        meta: `${xmenTrack.titleIds.length} titles · ${xmenTrack.runtime?.toDoomsday.label ?? formatRuntimeLabel(0)}`,
      });
    }
    for (const tr of characterTracks) {
      list.push({
        id: tr.id,
        name: tr.name,
        description: tr.description,
        href: `/path/${tr.id}`,
        banner: trackBanner(tr, titlesById),
        meta: `${tr.titleIds.length} titles · ${tr.runtime?.toDoomsday.label ?? "-"}`,
      });
    }
    return list;
  }, [characterTracks, xmenTrack, titlesById]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="more-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="More paths"
    >
      <div className="more-panel">
        <div className="more-toolbar">
          <button
            type="button"
            className="modal-back-btn"
            onClick={onClose}
            aria-label="Close more paths"
          >
            <span className="chevron chevron-left" aria-hidden />
            Back
          </button>
        </div>

        <header className="more-head">
          <div className="more-head-copy">
            <h2>More ways in</h2>
            <p className="more-lead">
              Character arcs and the Fox X-Men branch, release order,
              lead-focused.
            </p>
          </div>
        </header>

        <div className="more-grid">
          {cards.map((card) => (
            <Link
              key={card.id}
              className="more-item"
              href={card.href}
              onClick={() => onFocusCard("more")}
              style={{ ["--more-banner" as string]: `url(${card.banner})` }}
            >
              <span className="more-item-banner" aria-hidden />
              <span className="more-item-veil" aria-hidden />
              <span className="more-item-body">
                <span className="more-item-kicker">{card.meta}</span>
                <strong className="more-item-title">{card.name}</strong>
                <span className="more-item-desc">{card.description}</span>
                <span className="more-item-cta">
                  Open path
                  <span className="chevron chevron-right" aria-hidden />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="more-note">
          Or open the Custom card on the home screen to build your own roadmap.
        </p>
      </div>
    </div>,
    document.body,
  );
}
