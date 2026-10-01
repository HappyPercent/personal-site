import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { skills } from "@/content/experience";
import { cx, delay } from "@/lib/cx";
import shared from "@/styles/shared.module.css";
import styles from "./Toolbox.module.css";

export function Toolbox() {
  return (
    <Section id="tools">
      <Wrap>
        <div className="rv mono live">04 · TOOLBOX</div>
        <h2 className={cx("rv d1", shared.bigTitle)}>What&apos;s on the bench.</h2>
        <div className={styles.grid}>
          {skills.map((g, i) => (
            <div key={g.name} className={cx("rv", delay[i])}>
              <div className={styles.group}>
                <div className={cx("mono dim small", styles.name)}>{g.name}</div>
                <div className={styles.chips}>
                  {g.items.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
      <Deco name="gpu" pos="br" />
    </Section>
  );
}
