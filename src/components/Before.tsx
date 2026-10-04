import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { beforeCode } from "@/content/experience";
import { cx } from "@/lib/cx";
import styles from "./Before.module.css";

export function Before() {
  return (
    <Section id="before">
      <Wrap narrow>
        <div className="rv mono live">03 · BEFORE CODE</div>
        <h2 className={cx("rv d1", styles.title)}>
          {beforeCode.lines.map((l) => (
            <span key={l} className={styles.titleLine}>
              {l}
            </span>
          ))}
        </h2>
        <p className={cx("rv d2", styles.line)}>{beforeCode.line}</p>
      </Wrap>
      <Deco name="droplet" pos="br" />
    </Section>
  );
}
