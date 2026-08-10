"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Title } from "@/lib/types";
import { formatRuntimeLabel, sortTitlesBySequence } from "@/lib/catalog";
import {
  catalogIdsInOrder,
  encodeCustomPathParam,
} from "@/lib/customPath";
import Link from "next/link";

type Props = {
  titles: Title[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  variant?: "home" | "builder";
  /** Optional; defaults to sequence-sorted titles when omitted */
  catalogIds?: string[];
};

const BROWSE_LIMIT = 12;
const SEARCH_LIMIT = 12;

type MenuLayout = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

export function TitleSearch({
  titles,
  selectedIds,
  onChange,
  variant = "home",
  catalogIds,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [menuLayout, setMenuLayout] = useState<MenuLayout | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selected = useMemo(() => {
    return sortTitlesBySequence(titles.filter((t) => selectedSet.has(t.id)));
  }, [titles, selectedSet]);

  const sortedCatalog = useMemo(
    () => sortTitlesBySequence(titles),
    [titles],
  );

  const results = useMemo(() => {
    const available = sortedCatalog.filter((t) => !selectedSet.has(t.id));
    const q = query.trim().toLowerCase();
    if (!q) return available.slice(0, BROWSE_LIMIT);
    return available
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, SEARCH_LIMIT);
  }, [sortedCatalog, query, selectedSet]);

  const totalMins = useMemo(
    () => selected.reduce((n, t) => n + (t.runtimeMinutes || 0), 0),
    [selected],
  );

  function clearBlurTimer() {
    if (blurTimer.current != null) {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
  }

  function updateMenuLayout() {
    const input = inputRef.current;
    if (!input) return;
    const rect = input.getBoundingClientRect();
    const vv = window.visualViewport;
    const viewTop = vv?.offsetTop ?? 0;
    const viewBottom = viewTop + (vv?.height ?? window.innerHeight);
    const gap = 8;
    const spaceBelow = viewBottom - rect.bottom - gap - 8;
    const spaceAbove = rect.top - viewTop - gap - 8;
    const placeAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      140,
      Math.min(320, placeAbove ? spaceAbove : spaceBelow),
    );
    const top = placeAbove
      ? Math.max(viewTop + 8, rect.top - gap - maxHeight)
      : rect.bottom + gap;

    setMenuLayout({
      top,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  }

  function openMenu() {
    clearBlurTimer();
    setOpen(true);
    window.requestAnimationFrame(() => {
      updateMenuLayout();
    });
  }

  function closeMenu() {
    clearBlurTimer();
    setOpen(false);
    setMenuLayout(null);
  }

  useEffect(() => {
    if (!open) return;
    updateMenuLayout();
    const onReposition = () => updateMenuLayout();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    window.visualViewport?.addEventListener("resize", onReposition);
    window.visualViewport?.addEventListener("scroll", onReposition);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
      window.visualViewport?.removeEventListener("resize", onReposition);
      window.visualViewport?.removeEventListener("scroll", onReposition);
    };
  }, [open, query, selectedIds]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
      const menuEl = document.getElementById("title-search-results");
      if (menuEl?.contains(target)) return;
      closeMenu();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function add(id: string) {
    if (selectedSet.has(id)) return;
    onChange([...selectedIds, id]);
    setQuery("");
    setOpen(true);
    window.requestAnimationFrame(updateMenuLayout);
    inputRef.current?.focus();
  }

  function remove(id: string) {
    onChange(selectedIds.filter((x) => x !== id));
  }

  const universe = catalogIds?.length
    ? catalogIds
    : catalogIdsInOrder(titles);
  const customHref =
    selected.length > 0
      ? `/path/custom?p=${encodeCustomPathParam(
          selected.map((t) => t.id),
          universe,
        )}`
      : "#";

  const showMenu = open && menuLayout && mounted;

  const menu =
    showMenu && results.length > 0
      ? createPortal(
          <ul
            id="title-search-results"
            className="search-results search-results-portal"
            role="listbox"
            style={{
              top: menuLayout.top,
              left: menuLayout.left,
              width: menuLayout.width,
              maxHeight: menuLayout.maxHeight,
            }}
            onPointerDown={(e) => {
              e.preventDefault();
            }}
          >
            {results.map((t) => (
              <li key={t.id} role="option">
                <button type="button" onClick={() => add(t.id)}>
                  <span className="search-result-poster" aria-hidden>
                    {t.posterPublic ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.posterPublic} alt="" loading="lazy" />
                    ) : (
                      <span className="search-result-poster-fallback" />
                    )}
                  </span>
                  <span className="search-result-copy">
                    <span className="search-result-title">{t.title}</span>
                    <span className="search-result-meta">
                      {t.year}
                      {t.runtimeMinutes
                        ? ` · ${formatRuntimeLabel(t.runtimeMinutes)}`
                        : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : showMenu && results.length === 0
        ? createPortal(
            <p
              id="title-search-results"
              className="search-empty search-results-portal"
              style={{
                top: menuLayout.top,
                left: menuLayout.left,
                width: menuLayout.width,
              }}
            >
              No matching titles left to add.
            </p>,
            document.body,
          )
        : null;

  return (
    <div
      ref={rootRef}
      className={`title-search glass-panel ${open ? "is-open" : ""} ${variant === "builder" ? "is-builder" : ""}`}
    >
      <label className="search-label" htmlFor="title-search">
        {variant === "builder" ? "Add titles" : "Build a custom roadmap"}
      </label>
      <div className="search-row">
        <input
          ref={inputRef}
          id="title-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            openMenu();
          }}
          onFocus={openMenu}
          onClick={openMenu}
          onBlur={(e) => {
            const next = e.relatedTarget as Node | null;
            if (rootRef.current?.contains(next)) return;
            const menuEl = document.getElementById("title-search-results");
            if (next && menuEl?.contains(next)) return;
            clearBlurTimer();
            blurTimer.current = window.setTimeout(() => closeMenu(), 180);
          }}
          placeholder="Search movies & shows…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-expanded={open}
          aria-controls="title-search-results"
          aria-autocomplete="list"
          role="combobox"
        />
      </div>

      {menu}

      {selected.length > 0 ? (
        <div className="custom-draft">
          <div className="custom-chips">
            {selected.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className="chip"
                onClick={() => remove(t.id)}
                title="Remove"
              >
                <span className="chip-n">{i + 1}</span>
                {t.title}
                <span aria-hidden>×</span>
              </button>
            ))}
          </div>
          {variant !== "builder" ? (
            <div className="custom-footer">
              <span>
                {selected.length} titles · {formatRuntimeLabel(totalMins)}
              </span>
              <Link className="path-cta compact" href={customHref}>
                Open custom path
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
