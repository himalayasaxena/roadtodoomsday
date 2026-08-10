import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
};

export function ContentPage({ title, description, updated, children }: Props) {
  return (
    <main className="content-page">
      <div className="content-page-inner">
        <Link className="back-link" href="/">
          <span className="chevron chevron-left" aria-hidden />
          Home
        </Link>
        <header className="content-page-header">
          <h1 className="brand-title path-heading">{title}</h1>
          <p className="brand-sub path-lede">{description}</p>
          {updated ? <p className="content-updated">Updated {updated}</p> : null}
        </header>
        <article className="content-prose">{children}</article>
      </div>
    </main>
  );
}

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      type: "website",
    },
    twitter: {
      title: opts.title,
      description: opts.description,
    },
  };
}
