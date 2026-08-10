"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Provider, Title, WatchOffer } from "@/lib/types";
import { formatRuntimeLabel, sortTitlesBySequence } from "@/lib/catalog";
import { encodeCustomPathParam } from "@/lib/customPath";
import { TitleSearch } from "@/components/onboarding/TitleSearch";
import { PathExplorer } from "@/components/path/PathExplorer";
import { PathBackdrop } from "@/components/path/PathBackdrop";

type Props = {
  titles: Title[];
  initialIds: string[];
  catalogIds: string[];
  watchLinks: Record<string, { regions?: Record<string, WatchOffer[]> }>;
  providers: Provider[];
};

export function CustomBuilder({
  titles,
  initialIds,
  catalogIds,
  watchLinks,
  providers,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const selected = useMemo(() => {
    const set = new Set(selectedIds);
    return sortTitlesBySequence(titles.filter((t) => set.has(t.id)));
  }, [titles, selectedIds]);

  const totalMins = useMemo(
    () => selected.reduce((n, t) => n + (t.runtimeMinutes || 0), 0),
    [selected],
  );

  // Sync URL without Next.js navigation (avoids lag on every add).
  useEffect(() => {
    const next =
      selectedIds.length > 0
        ? `/custom?p=${encodeCustomPathParam(selectedIds, catalogIds)}`
        : "/custom";
    const timer = window.setTimeout(() => {
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) {
        window.history.replaceState(window.history.state, "", next);
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [selectedIds, catalogIds]);

  const emptyBackdrop =
    selected[0]?.backdropPublic ||
    "/media/backdrops/avengers-doomsday.jpg";

  return (
    <div className="custom-builder">
      {selected.length === 0 ? (
        <PathBackdrop
          fromSrc={emptyBackdrop}
          toSrc={emptyBackdrop}
          progress={0}
          reduceMotion
        />
      ) : null}

      <div className="custom-builder-chrome">
        <div className="custom-builder-top">
          <Link className="back-link" href="/">
            <span className="chevron chevron-left" aria-hidden />
            Journeys
          </Link>
          <div className="custom-builder-heading">
            <h1 className="brand-title path-heading">Custom roadmap</h1>
            <p className="brand-sub path-lede">
              Search and add titles. Your timeline builds in release order.
            </p>
          </div>
          <TitleSearch
            titles={titles}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            variant="builder"
            catalogIds={catalogIds}
          />
          {selected.length > 0 ? (
            <p className="custom-builder-meta">
              {selected.length} titles · {formatRuntimeLabel(totalMins)}
            </p>
          ) : null}
        </div>
      </div>

      {selected.length === 0 ? (
        <div className="custom-builder-empty">
          <p>No titles yet. Use search above to start your roadmap.</p>
        </div>
      ) : (
        <PathExplorer
          trackId="custom"
          trackName="Custom journey"
          description="Your hand-picked roadmap in release order."
          titles={selected}
          customIds={selectedIds}
          catalogIds={catalogIds}
          watchLinks={watchLinks}
          providers={providers}
          embedded
        />
      )}
    </div>
  );
}
