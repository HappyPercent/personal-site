"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { joke } from "@/content/jokes";
import styles from "./Drawer.module.css";

const K = ({ children }: { children: ReactNode }) => <span className="accent">{children}</span>;

const rows: [string, ReactNode][] = [
  ["FRAMEWORK", <><K>Next.js</K> and strict <K>TypeScript</K>, deployed as a small standalone <K>Docker</K> image.</>],
  ["MOTION", <><K>CSS</K> scroll reveals and snap scrolling. Everything is off under reduced-motion.</>],
  ["DATA", <><K>SQLite</K> for the wall (coming), so there is one file to back up.</>],
  ["LIVE", <><K>Server-sent events</K> will push new sticky notes to every open tab.</>],
  ["HOSTING", <>A home server behind a <K>Cloudflare Tunnel</K>. Yes, really.</>],
  ["TESTING", <><K>Vitest</K> and <K>Testing Library</K> for components, <K>Playwright</K> for end-to-end on desktop and mobile, <K>axe-core</K> for accessibility. All of it runs in <K>GitHub Actions</K>, and a red test blocks the deploy.</>],
  ["SPEED", <><K>Lighthouse</K> on the live site: <K>96</K> on mobile and <K>100</K> on desktop for performance, <K>100</K> for best practices and SEO.</>],
  ["ANALYTICS", <><K>Umami</K>, self-hosted on the same home server. Page views only, no personal data. {joke("no-cookies")}</>],
];

export function DrawerButton() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className={styles.pill} onClick={() => setOpen(true)}>
        {"{ how it's done }"}
      </button>
      <div className={styles.wrap} data-open={open}>
        <div className={styles.scrim} onClick={() => setOpen(false)} />
        <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="How this page is built" aria-hidden={!open}>
          <div className={styles.top}>
            <div className="mono live">{"{ how it's done }"}</div>
            <button ref={closeRef} type="button" className={styles.close} aria-label="Close drawer" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              ×
            </button>
          </div>
          <h2 className={styles.heading}>This page is also the portfolio.</h2>
          <p className="muted">
            My day-job code is behind NDAs, so I built this instead. Everything here is open source, and everything below is real.
          </p>
          <div className={styles.rows}>
            {rows.map(([k, v]) => (
              <div key={k} className={styles.row}>
                <div className={`mono dim ${styles.key}`}>{k}</div>
                <div>{v}</div>
              </div>
            ))}
          </div>
          <div className={`mono ${styles.joke}`}>{`// ${joke("cocoa")}`}</div>
        </aside>
      </div>
    </>
  );
}
