"use client";

import Link from "next/link";
import type { KeyboardEvent, ReactNode } from "react";
import { CARD_HERO } from "@/lib/catalog";

type Props = {
  id: string;
  badge?: string;
  title: string;
  subtitle: string;
  meta: string;
  href?: string;
  onOpen?: () => void;
  featured?: boolean;
  active: boolean;
  onFocusCard: (id: string) => void;
  cta?: string;
  banner?: string;
};

export function PathCard({
  id,
  badge,
  title,
  subtitle,
  meta,
  href,
  onOpen,
  featured,
  active,
  onFocusCard,
  cta = "Open path",
  banner,
}: Props) {
  const art = banner || CARD_HERO[id] || CARD_HERO.prep;
  const className = `path-card ${featured ? "is-featured" : ""} ${active ? "is-active" : ""} ${onOpen ? "is-more" : ""} ${id === "custom" ? "is-custom" : ""}`;
  const style = { ["--path-banner" as string]: `url(${art})` };

  const body: ReactNode = (
    <>
      <span className="path-card-banner" aria-hidden />
      <span className="path-card-veil" aria-hidden />
      {badge ? <span className="path-badge">{badge}</span> : null}
      <div className="path-card-body">
        <span className="path-meta">{meta}</span>
        <h2 className="path-title">{title}</h2>
        <p className="path-subtitle">{subtitle}</p>
        <span className="path-card-cta">
          {cta}
          <span className="chevron chevron-right" aria-hidden />
        </span>
      </div>
    </>
  );

  if (href && !onOpen) {
    return (
      <Link
        href={href}
        className={className}
        style={style}
        onMouseEnter={() => onFocusCard(id)}
        onFocus={() => onFocusCard(id)}
      >
        {body}
      </Link>
    );
  }

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFocusCard(id);
      onOpen?.();
    }
  }

  return (
    <article
      className={className}
      style={style}
      onMouseEnter={() => onFocusCard(id)}
      onFocusCapture={() => onFocusCard(id)}
      onClick={() => {
        onFocusCard(id);
        onOpen?.();
      }}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      {body}
    </article>
  );
}
