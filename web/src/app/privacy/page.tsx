import type { Metadata } from "next";
import { ContentPage, pageMeta } from "@/components/ContentPage";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How Doomsday Watch Path handles analytics, local progress, and third-party links.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="What we collect, what stays on your device, and how analytics works."
      updated="August 11, 2026"
    >
      <h2>Overview</h2>
      <p>
        Doomsday Watch Path is a fan-made website that helps you plan an MCU
        watch order before Avengers: Doomsday. This policy explains what
        information is used when you visit the site.
      </p>

      <h2>Information stored on your device</h2>
      <p>
        Progress markers (watched / skipped), region preference, and similar
        path state are saved in your browser&apos;s local storage. That data
        stays on your device and is not uploaded to our servers.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Google Analytics (Measurement ID G-FVRBK0453Q) to understand
        aggregate traffic, such as page views and approximate geography. Google
        may set cookies or similar identifiers according to its own policies.
        You can block analytics with browser settings or extensions.
      </p>

      <h2>Third-party links</h2>
      <p>
        Watch provider links, trailers, and calendar files may send you to
        services we do not control (streamers, YouTube, calendar apps, TMDB,
        JustWatch). Their privacy practices apply once you leave this site.
      </p>

      <h2>Sharing links</h2>
      <p>
        If you use Share or Copy link, the URL may include a compact encoding of
        your custom path and progress so others can open the same journey. Do
        not share a link if you do not want that selection to be visible.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: reach Himalaya Saxena via{" "}
        <a href="https://himalayasaxena.com" rel="noopener noreferrer">
          himalayasaxena.com
        </a>
        .
      </p>
    </ContentPage>
  );
}
