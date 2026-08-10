import Link from "next/link";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/guides/mcu-watch-order", label: "Watch order" },
  { href: "/guides/calendar-plan", label: "Calendar" },
  { href: "/guides/custom-path", label: "Custom path" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-brand">Doomsday Watch Path</p>
      <nav className="site-footer-nav" aria-label="Site">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="site-footer-credit">
        Built by{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          Himalaya Saxena
        </a>
        {" · "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        {" · "}
        <a
          href="https://instagram.com/himalayasaxena"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        {" · "}
        <a
          href="https://www.linkedin.com/in/himalayasaxena"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </p>
      <p>
        Fan-made watch roadmap. Not affiliated with Marvel, Disney, or any
        studio.
      </p>
      <p>
        Posters/metadata courtesy of TMDB. Watch links via JustWatch. Runtimes
        and availability can change. Calendar export is a personal plan, not a
        guarantee.
      </p>
    </footer>
  );
}
