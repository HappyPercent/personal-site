import Link from "next/link";
import { DrawerButton } from "@/components/Drawer";
import { EggCounter } from "@/components/Eggs";
import { Wrap } from "@/components/Section";
import { profile } from "@/content/profile";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Wrap className={styles.row}>
        <a href="#hero" className={styles.logo}>
          andrey<span className="accent">.</span>erofteev
        </a>
        <a href={profile.cvHref} download className={`${styles.link} ${styles.cv}`}>
          CV
        </a>
        <Link href="/wall" className={styles.link}>
          The wall
        </Link>
        <span className={styles.counter}>
          <EggCounter />
        </span>
        <DrawerButton />
      </Wrap>
    </header>
  );
}
