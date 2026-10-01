"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import styles from "./LetterSwap.module.css";

export function LetterSwap({ options }: { options: readonly [string, string] }) {
  const root = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const size = parseFloat(getComputedStyle(el).fontSize);
      el.querySelectorAll<HTMLElement>("[data-letters]").forEach((n, i) => {
        el.style.setProperty(`--w${i}`, `${n.offsetWidth / size}em`);
      });
      setReady(true);
    };
    void document.fonts.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span ref={root} className={styles.swap} data-ready={ready} aria-hidden="true">
      <span data-letters className={styles.letters}>
        {options[0]}
      </span>
      <span data-letters className={cx(styles.letters, styles.second)}>
        {options[1]}
      </span>
    </span>
  );
}
