import Link from "next/link";
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
        <Link href="/wall" className={styles.link}>
          The wall
        </Link>
        <EggCounter />
        <DrawerButton />
      </Wrap>
    </header>
  );
}
