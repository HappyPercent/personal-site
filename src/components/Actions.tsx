import { profile } from "@/content/profile";
import { cx } from "@/lib/cx";
import styles from "./Actions.module.css";

export function Actions({ large = false }: { large?: boolean }) {
  return (
    <div className={cx(styles.actions, large && styles.large)}>
      <a className={cx(styles.btn, styles.primary)} href={profile.cvHref} download>
        Download CV (PDF)
      </a>
      <a className={styles.btn} href={`mailto:${profile.email}`}>
        {large ? profile.email : "Email me"}
      </a>
      <a className={styles.btn} href={profile.linkedin} rel="noopener">
        LinkedIn
      </a>
    </div>
  );
}
