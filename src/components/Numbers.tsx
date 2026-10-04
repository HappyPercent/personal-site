import { BugEgg } from "@/components/BugEgg";
import { Section, Wrap } from "@/components/Section";
import { VimNote } from "@/components/VimNote";
import { stats } from "@/content/profile";
import { cx, delay } from "@/lib/cx";
import shared from "@/styles/shared.module.css";
import styles from "./Numbers.module.css";

export function Numbers() {
  return (
    <Section id="numbers">
      <Wrap>
        <div className="rv mono live">01 · THE NUMBERS</div>
        <h2 className={cx("rv d1", shared.bigTitle)}>What I can say out loud.</h2>
        <div className={styles.grid}>
          {stats.map((s, i) => (
            <div key={s.n} className={cx("rv", delay[i])}>
              <div className={cx(shared.card, styles.stat)}>
                <div className={styles.n}>{s.n}</div>
                <div className={styles.label}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={cx("rv d4", styles.vim)}>
          <VimNote />
        </div>
      </Wrap>
      <BugEgg />
    </Section>
  );
}
