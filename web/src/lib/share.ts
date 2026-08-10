export function buildShareText(opts: {
  trackName: string;
  watched: number;
  total: number;
  remainingHoursLabel: string;
  daysLeft: number;
  url: string;
}) {
  const pct = opts.total ? Math.round((opts.watched / opts.total) * 100) : 0;
  return [
    `My Doomsday Watch Path: ${opts.trackName}`,
    `${opts.watched}/${opts.total} watched (${pct}%)`,
    `${opts.remainingHoursLabel} left · ${opts.daysLeft}d until Avengers: Doomsday`,
    opts.url,
  ].join("\n");
}

/** Caption without the raw URL (iOS share sheet uses the `url` field). */
export function buildShareCaption(opts: {
  trackName: string;
  watched: number;
  total: number;
  remainingHoursLabel: string;
  daysLeft: number;
}) {
  const pct = opts.total ? Math.round((opts.watched / opts.total) * 100) : 0;
  return [
    `My Doomsday Watch Path: ${opts.trackName}`,
    `${opts.watched}/${opts.total} watched (${pct}%)`,
    `${opts.remainingHoursLabel} left · ${opts.daysLeft}d until Avengers: Doomsday`,
  ].join("\n");
}

/** Works on HTTP / older WebViews where Clipboard API is blocked. */
export function copyText(text: string): boolean {
  if (typeof document === "undefined") return false;

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "0";
  ta.style.width = "1px";
  ta.style.height = "1px";
  ta.style.padding = "0";
  ta.style.border = "none";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

export async function copyTextAsync(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* insecure context / permission - try legacy */
    }
  }
  return copyText(text);
}

export async function shareJourney(text: string, url: string) {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    const ok = await copyTextAsync(text.includes(url) ? text : `${text}\n${url}`);
    return ok ? ("copied" as const) : ("failed" as const);
  }

  // Prefer native sheet. Keep URL out of `text` so iOS/Android don't double it.
  const caption = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== url)
    .join("\n");

  const attempts: ShareData[] = [
    { title: "Doomsday Watch Path", text: caption, url },
    { title: "Doomsday Watch Path", url },
    { title: "Doomsday Watch Path", text: `${caption}\n${url}` },
  ];

  for (const data of attempts) {
    try {
      if (typeof navigator.canShare === "function" && !navigator.canShare(data)) {
        continue;
      }
      await navigator.share(data);
      return "shared" as const;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled" as const;
      }
      /* try next payload shape */
    }
  }

  const ok = await copyTextAsync(`${caption}\n${url}`);
  return ok ? ("copied" as const) : ("failed" as const);
}

/** Instagram has no web deep-link for feed posts; open app share intent on mobile when possible */
export function instagramHintUrl() {
  return "https://www.instagram.com/";
}
