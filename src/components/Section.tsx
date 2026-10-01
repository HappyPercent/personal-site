import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Section.module.css";

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} data-panel className={styles.snap}>
      {children}
    </section>
  );
}

export function Wrap({
  narrow = false,
  className,
  children,
}: {
  narrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx(styles.wrap, narrow && styles.narrow, className)}>{children}</div>;
}
