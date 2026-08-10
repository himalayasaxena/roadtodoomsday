"use client";

import { useMemo } from "react";
import type { Provider, Title, WatchOffer } from "@/lib/types";
import { formatRuntime, providerLogoPublic } from "@/lib/path";

type Props = {
  title: Title;
  index: number;
  total: number;
  side: "left" | "right";
  active?: boolean;
  status?: "watched" | "skipped";
  offers: WatchOffer[];
  providers: Record<string, Provider>;
  onStatus: (id: string, status: "watched" | "skipped" | null) => void;
};

const TYPE_RANK: Record<string, number> = {
  flatrate: 0,
  ads: 1,
  free: 2,
  cinema: 3,
  rent: 4,
  buy: 5,
};

export function TimelineCard({
  title,
  index,
  total,
  side,
  active,
  status,
  offers,
  providers,
  onStatus,
}: Props) {
  const uniqueOffers = useMemo(() => {
    const best = new Map<string, WatchOffer & { rank: number }>();
    for (const o of offers) {
      const rank = TYPE_RANK[o.type] ?? 9;
      const prev = best.get(o.providerId);
      if (!prev || rank < prev.rank) best.set(o.providerId, { ...o, rank });
    }
    return [...best.values()].sort((a, b) => a.rank - b.rank).slice(0, 5);
  }, [offers]);

  const score = title.recommendationScore ?? 5;
  const done = status === "watched";
  const skipped = status === "skipped";
  const poster = title.posterPublic || "/media/posters/avengers-doomsday.jpg";

  return (
    <li
      className={`timeline-item side-${side} ${active ? "is-active" : ""} ${done ? "is-watched" : ""} ${skipped ? "is-skipped" : ""}`}
      id={`title-${title.id}`}
      aria-current={active ? "true" : undefined}
    >
      <div className="timeline-node" aria-hidden>
        <span>{index}</span>
      </div>

      <article className="timeline-card glass-panel">
        <div className="timeline-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={`${title.title} (${title.year}) poster`}
            loading="lazy"
            width={300}
            height={450}
          />
          <span className="timeline-runtime">{formatRuntime(title.runtimeMinutes || 0)}</span>
        </div>

        <div className="timeline-body">
          <div className="timeline-topline">
            <span className="timeline-index">
              #{index} / {total}
            </span>
            <time dateTime={title.releaseDate || String(title.year)}>
              {title.releaseDate || title.year}
            </time>
            {title.priority ? (
              <span className="timeline-priority">{title.priority}</span>
            ) : null}
          </div>

          <h2 className="timeline-title">{title.title}</h2>

          <p className="timeline-watch-time">
            <span className="timeline-watch-time-label">Watch time</span>
            <span className="timeline-watch-time-value">
              {formatRuntime(title.runtimeMinutes || 0)}
            </span>
          </p>

          <div
            className="score-row"
            aria-label={`Recommendation score ${score} of 10`}
          >
            <span className="score-num">{score}/10</span>
            <span className="score-label">{title.recommendationLabel || "Optional"}</span>
          </div>

          <p className="why-watch">
            <strong>Why watch before Doomsday:</strong> {title.whyWatch}
          </p>

          <div className="timeline-actions">
            <button
              type="button"
              className={`action-btn ${done ? "on" : ""}`}
              onClick={() => onStatus(title.id, done ? null : "watched")}
            >
              {done ? "Watched ✓" : "Mark watched"}
            </button>
            <button
              type="button"
              className={`action-btn ghost ${skipped ? "on" : ""}`}
              onClick={() => onStatus(title.id, skipped ? null : "skipped")}
            >
              {skipped ? "Skipped" : "Skip"}
            </button>
            {title.trailerUrl ? (
              <a
                className="action-btn ghost"
                href={title.trailerUrl}
                target="_blank"
                rel="noopener"
              >
                Trailer
              </a>
            ) : null}
          </div>

          {uniqueOffers.length > 0 ? (
            <div className="watch-on">
              <span className="watch-on-label">Watch On</span>
              <div className="watch-logos" role="list">
                {uniqueOffers.map((o) => {
                  const logo = providerLogoPublic(providers[o.providerId]?.logo);
                  const name =
                    providers[o.providerId]?.displayName || o.providerName;
                  return (
                    <a
                      key={o.providerId}
                      href={o.url}
                      target="_blank"
                      rel="noopener"
                      role="listitem"
                      title={`Watch on ${name}`}
                      aria-label={`Watch on ${name}`}
                    >
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt="" />
                      ) : (
                        <span className="watch-logo-fallback">{name.slice(0, 2)}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="watch-empty">
              No streaming link listed yet. Check theaters / OTT later.
            </p>
          )}
        </div>
      </article>
    </li>
  );
}
