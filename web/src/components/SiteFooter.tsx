import Link from "next/link";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/guides/mcu-watch-order", label: "Watch order" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-brand">Doomsday Watch Path</p>

        <nav className="site-footer-nav" aria-label="Site">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="site-footer-credit">
          Built by{" "}
          <a href="https://himalayasaxena.com" rel="noopener noreferrer">
            Himalaya
          </a>
          {" & "}
          Ritika
          <span className="site-footer-sep" aria-hidden>
            ·
          </span>
          <span className="site-footer-himika">HIMIKA</span>
          <span className="site-footer-sep" aria-hidden>
            ·
          </span>
          <a href="https://instagram.com/himalayasaxena" rel="noopener noreferrer">
            Instagram
          </a>
          <span className="site-footer-sep" aria-hidden>
            ·
          </span>
          <a
            href="https://www.linkedin.com/in/himalayasaxena"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>

        <p className="site-footer-note">
          Fan-made roadmap. Not affiliated with Marvel or Disney.
        </p>
      </div>
    </footer>
  );
}
