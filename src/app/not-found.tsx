import Link from "next/link";
import { LostEgg } from "@/components/LostEgg";
import { joke } from "@/content/jokes";
import { cx } from "@/lib/cx";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <LostEgg />
      <h1 className={styles.title}>{joke("404")}</h1>
      <p className={cx("muted", styles.text)}>The page you wanted isn&apos;t here. The rest of the site is.</p>
      <Link href="/" className={styles.back}>
        Back to the CV
      </Link>
    </main>
  );
}
