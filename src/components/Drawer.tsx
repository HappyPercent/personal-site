"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { joke } from "@/content/jokes";
import { profile } from "@/content/profile";
import styles from "./Drawer.module.css";

// Keywords are emphasis, not links, so they stay out of the accent colour.
const K = ({ children }: { children: ReactNode }) => <strong className={styles.k}>{children}</strong>;

const rows: [string, ReactNode][] = [
  ["FRAMEWORK", <><K>Next.js</K> and strict <K>TypeScript</K>, deployed as a small standalone <K>Docker</K> image.</>],
  ["MOTION", <><K>CSS</K> scroll reveals and snap scrolling. Everything is off under reduced-motion.</>],
  ["DATA", <><K>SQLite</K> for the wall, so there is one file to back up.</>],
  ["LIVE", <><K>Server-sent events</K> push new sticky notes to every open tab.</>],
  ["HOSTING", <>A home server behind a <K>Cloudflare Tunnel</K>. Yes, really.</>],
  ["TESTING", <><K>Vitest</K> and <K>Testing Library</K> for components, <K>Playwright</K> for end-to-end on desktop and mobile, <K>axe-core</K> for accessibility. All of it runs in <K>GitHub Actions</K>, and a red test blocks the deploy.</>],
  ["SPEED", <><K>Lighthouse</K> on the live site: <K>96</K> on mobile and <K>100</K> on desktop for performance, <K>100</K> for best practices and SEO.</>],
  ["ANALYTICS", <><K>Umami</K>, self-hosted on the same home server. Page views only, no personal data. {joke("no-cookies")}</>],
];

const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

export function DrawerButton() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const pillRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    // Everything outside the drawer goes inert, so Tab can't leave the dialog.
    const outside = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== wrapRef.current && !el.inert,
    );
    outside.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const pill = pillRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      outside.forEach((el) => (el.inert = false));
      pill?.focus();
    };
  }, [open]);

  const drawer = (
    <div ref={wrapRef} className={styles.wrap} data-open={open} inert={!open}>
      <div className={styles.scrim} onClick={() => setOpen(false)} />
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="How this page is built" aria-hidden={!open}>
        <div className={styles.top}>
          <div className="mono live">{"{ how it's done }"}</div>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close drawer" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            ×
          </button>
        </div>
        {/* The pitch lives in the "This site" section; the drawer is the stack behind it. */}
        <h2 className={styles.heading}>The stack, layer by layer.</h2>
        <p className="muted">Every part of this page, from the framework to the server it runs on.</p>
        <div className={styles.links}>
          <a href={profile.source} className={styles.link} rel="noopener">
            Read the source on GitHub <span aria-hidden="true">↗</span>
          </a>
          <Link href="/wall" className={styles.link}>
            Leave a note on the wall <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.rows}>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <div className={`mono dim ${styles.key}`}>{k}</div>
              <div>{v}</div>
            </div>
          ))}
        </div>
        <div className={`mono ${styles.joke}`}>{`// ${joke("cocoa")}`}</div>
      </div>
    </div>
  );

  return (
    <>
      <button ref={pillRef} type="button" className={styles.pill} onClick={() => setOpen(true)}>
        How it&apos;s built
      </button>
      {/* Portaled to <body> so the sticky header's stacking context can't trap it under the page. */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
