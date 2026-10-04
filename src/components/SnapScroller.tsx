"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./SnapScroller.module.css";

export type Section = { id: string; label: string };

export function SnapScroller({
  sections,
  header,
  children,
}: {
  sections: Section[];
  header: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    document.body.classList.add("js");
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          const viewport = e.rootBounds?.height ?? window.innerHeight;
          if (e.intersectionRect.height >= viewport * 0.5) {
            setActive(panels.indexOf(e.target as HTMLElement));
          }
        }
      },
      { root, threshold: [0.05, 0.25, 0.5, 0.75, 1] },
    );
    panels.forEach((p) => io.observe(p));
    return () => {
      io.disconnect();
      document.body.classList.remove("js");
    };
  }, []);

  return (
    <main ref={ref} className={styles.scroller}>
      {header}
      <nav aria-label="Sections" className={styles.dots}>
        {sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-label={s.label} className={styles.dotLink}>
            <span className={styles.dot} data-active={i === active} />
          </a>
        ))}
      </nav>
      {children}
    </main>
  );
}
