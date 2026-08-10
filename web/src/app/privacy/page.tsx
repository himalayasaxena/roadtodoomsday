import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "Privacy Policy for Doomsday Watch Path: local progress storage, Google Analytics, share links, and third-party streaming services.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="How Doomsday Watch Path handles device storage, analytics, and outbound links."
      updated="August 11, 2026"
    >
      <p>
        This Privacy Policy describes how Doomsday Watch Path (&quot;the
        site&quot;) handles information when you visit doomsdayroadmap.com or
        related deployment URLs. The site is a fan-made MCU watch roadmap
        operated by Himalaya Saxena. It is designed to keep most of your
        personal watch progress on your own device.
      </p>

      <h2>Scope</h2>
      <p>
        The policy covers the public website experience: browsing paths,
        marking progress, sharing links, exporting calendar files, and reading
        guide or legal pages. It does not cover third-party websites you open
        from our links, such as streaming platforms, YouTube, TMDB, JustWatch,
        Instagram, LinkedIn, or calendar providers.
      </p>

      <h2>Information stored on your device</h2>
      <p>
        When you mark titles watched or skipped, choose a watch region, or keep
        similar path preferences, the site stores that state in your
        browser&apos;s local storage. Local storage stays on the device and
        browser profile you used. It is not uploaded to a Doomsday Watch Path
        account database, because the product does not require accounts in the
        current version.
      </p>
      <p>
        Clearing site data, switching browsers, or using another phone will
        usually reset that local progress unless you reopen a shared URL that
        encodes the same state. That is a product tradeoff for simplicity, not
        a claim that local data is immune to device access by other people who
        use your unlocked browser.
      </p>

      <h2>Analytics</h2>
      <p>
        The site uses Google Analytics with measurement ID G-FVRBK0453Q to
        understand aggregate traffic. Typical signals include page views,
        approximate location derived by Google, device category, and referral
        paths. Google may use cookies or similar technologies under its own
        terms and privacy policy.
      </p>
      <p>
        Analytics helps answer practical questions: which paths people open,
        whether guides are read, and whether the marketing site is reaching
        anyone at all. It is not used to sell your personal watch history to
        advertisers through this project. You can limit analytics with browser
        controls, tracking protection, or extensions. If those tools block the
        Google tag, the rest of the site should still function.
      </p>

      <h2>Server logs and hosting</h2>
      <p>
        The site is hosted on Vercel. Like most hosts, Vercel may process
        technical request data such as IP address, user agent, timestamps, and
        requested URLs for delivery, security, and reliability. Those
        operations follow Vercel&apos;s policies as the processor for hosting.
        Domain DNS may also involve Vercel or your registrar while the domain
        is connected.
      </p>

      <h2>Share links and URL contents</h2>
      <p>
        Share and Copy link features create URLs that can include a compact
        encoding of a custom title set and optional progress markers. Anyone
        who receives the link can reconstruct that selection. Do not share a
        URL if you consider the encoded list private. Query parameters may
        appear in browser history, analytics referrers, or messaging apps
        according to how those tools work.
      </p>

      <h2>Calendar exports</h2>
      <p>
        Add to Calendar generates an .ics file on your device side of the
        flow. Once you import events into Apple Calendar, Google Calendar, or
        Outlook, those apps apply their own privacy and sync rules. Event
        descriptions may include path context and caveats. They are not a
        request for those companies to collect new MCU preferences beyond what
        you already store in your calendar account.
      </p>

      <h2>Third-party content and outbound links</h2>
      <p>
        Posters and some metadata are sourced from TMDB. Watch offers are
        informed by public listings such as JustWatch. Clicking a provider
        logo, trailer, or credit link leaves this site. From that point, the
        destination&apos;s privacy policy controls. We do not receive your
        streaming passwords and we do not process payments for tickets or
        subscriptions through Doomsday Watch Path.
      </p>

      <h2>Children</h2>
      <p>
        The site is a general audience fan tool about mainstream films and
        shows. It is not directed at children under 13, and it does not
        knowingly collect personal information from children for account
        creation because accounts are not offered.
      </p>

      <h2>International visitors</h2>
      <p>
        The default experience offers India and US watch-link regions because
        those were the first practical catalogs for this project. Visitors
        elsewhere can still use paths, progress, share links, and calendar
        exports. Provider buttons may be less accurate outside those regions.
        Analytics may still record coarse geography through Google.
      </p>

      <h2>Your choices</h2>
      <p>
        You can avoid Share links that encode progress. You can refuse calendar
        import. You can block Google Analytics. You can use a private browsing
        window if you do not want local storage to persist after the session,
        understanding that progress will not stick. Those choices are yours.
        The site remains usable for read-only browsing of paths and guides
        even when storage and analytics are limited.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes in a material way, the Updated date at the top
        of the page will change. Continued use of the site after an update
        means you should read the revised text. Major product shifts, such as
        adding accounts later, would require a clearer notice and a revised
        policy before launch.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions can be sent through{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        . Related pages: <Link href="/terms">Terms of Use</Link> and{" "}
        <Link href="/about">About</Link>.
      </p>
    </ContentPage>
  );
}
