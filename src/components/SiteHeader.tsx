import { DrawerButton } from "@/components/Drawer";
import { EggCounter } from "@/components/Eggs";
import { Wrap } from "@/components/Section";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Wrap className={styles.row}>
        <a href="#hero" className={styles.logo}>
          andrey<span className="accent">.</span>erofteev
        </a>
        <a href="#netchex" className={styles.link}>
          CV
        </a>
        <span className={styles.soon}>
          Play my life <span className="mono accent small">soon</span>
        </span>
        <span className={styles.soon}>
          The wall <span className="mono accent small">soon</span>
        </span>
        <EggCounter />
        <DrawerButton />
      </Wrap>
    </header>
  );
}
