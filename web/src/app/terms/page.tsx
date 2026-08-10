import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "Terms of Use for Doomsday Watch Path, the unofficial fan-made MCU watch roadmap for Avengers: Doomsday.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="The rules for using this unofficial MCU watch roadmap."
      updated="August 11, 2026"
    >
      <p>
        These Terms of Use govern access to Doomsday Watch Path, including
        doomsdayroadmap.com and related deployments. By using the site, you
        agree to these terms. If you do not agree, do not use the site.
      </p>

      <h2>Fan-made and unofficial</h2>
      <p>
        Doomsday Watch Path is an unofficial fan project created by Himalaya
        Saxena. It is not affiliated with, endorsed by, sponsored by, or
        otherwise connected to Marvel Studios, The Walt Disney Company,
        Disney+, or any other studio, distributor, or streaming service. Marvel
        characters, titles, and artwork remain the property of their respective
        owners. Mentions of films and shows are for identification and
        commentary around personal watch planning.
      </p>

      <h2>License to use the site</h2>
      <p>
        You receive a limited, non-exclusive, revocable license to use the site
        for personal, non-commercial entertainment planning. That includes
        browsing paths, marking local progress, sharing links for friends, and
        exporting calendar files for your own devices. You may not sell access
        to the site, wrap it as an official Marvel product, or scrape it in a
        way that harms availability for other visitors.
      </p>

      <h2>No warranties</h2>
      <p>
        The site is provided as is. Path curation is editorial opinion. Runtimes
        can be wrong. Release dates can move. Scores and why-watch blurbs are
        guidance, not objective truth. Watch links can break, point at the
        wrong offer, or vanish when licensing changes. Calendar exports estimate
        sittings. They do not guarantee you will finish before Avengers:
        Doomsday, and they do not reserve theater seats.
      </p>
      <p>
        To the fullest extent allowed by law, Himalaya Saxena and operators of
        the site disclaim warranties of merchantability, fitness for a
        particular purpose, and non-infringement. Some jurisdictions do not
        allow certain disclaimers, so parts of this section may not apply to
        you.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent allowed by law, the site and its creator are not
        liable for indirect, incidental, special, consequential, or punitive
        damages, or for lost profits, data, or goodwill, arising from your use
        of the site or reliance on any path, link, or calendar plan. Your main
        remedy is to stop using the site.
      </p>

      <h2>Third-party services</h2>
      <p>
        Outbound links may send you to TMDB, JustWatch, YouTube, streamers,
        ticket sites, social networks, or calendar apps. Those services have
        their own terms. The site is not responsible for their content,
        pricing, availability, or account rules. Clicking Watch on does not
        create a purchase relationship with Doomsday Watch Path.
      </p>

      <h2>User conduct</h2>
      <p>
        You agree not to misuse the site. Misuse includes attempting to break
        security, overload infrastructure, inject malicious code, harvest data
        at abusive scale, impersonate the creator, or present screenshots or
        links as official studio communications. Share features exist for
        convenience among viewers, not for spam.
      </p>

      <h2>Intellectual property on this site</h2>
      <p>
        Original site code, copy, and arrangement of fan paths are provided for
        personal use as described above. Studio trademarks and title artwork
        remain with their owners. Poster images are displayed under the source
        provider&apos;s terms via TMDB and related pipelines. If you believe
        content should be removed, contact the creator through{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        .
      </p>

      <h2>Privacy</h2>
      <p>
        Data practices are described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>. Local progress storage and
        Google Analytics are the main mechanisms to understand. Share URLs can
        expose encoded selections to anyone who receives them.
      </p>

      <h2>Indemnity for misuse</h2>
      <p>
        If you misuse the site in a way that causes claims against the creator,
        such as scraping that triggers third-party complaints or falsely
        presenting the project as an official studio product, you agree to take
        responsibility for that misuse to the extent applicable law allows.
        This section is about abusive behavior, not ordinary personal viewing.
      </p>

      <h2>Severability</h2>
      <p>
        If a court finds one part of these terms unenforceable, the rest still
        applies. A waiver of one breach is not a waiver of later breaches.
      </p>

      <h2>Changes and termination</h2>
      <p>
        These terms may update when the product changes. The Updated date on
        this page will reflect revisions. The site may change, pause, or shut
        down features without advance notice. Continued use after a change
        means you accept the revised terms.
      </p>

      <h2>Governing sense of the project</h2>
      <p>
        This is a small personal project. Disputes should start with a human
        message to the creator before anything formal. Nothing in these terms
        creates an employment, partnership, or agency relationship with Marvel
        or Disney. Local consumer protections that cannot be waived still
        apply where they apply.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms of Use:{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        . Learn more on the <Link href="/about">About</Link> page, review the{" "}
        <Link href="/privacy">Privacy Policy</Link>, or start watching from the{" "}
        <Link href="/">home page</Link>.
      </p>
    </ContentPage>
  );
}
