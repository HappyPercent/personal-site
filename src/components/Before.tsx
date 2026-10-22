import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { beforeCode } from "@/content/experience";
import { cx } from "@/lib/cx";
import styles from "./Before.module.css";

export function Before() {
  return (
    <Section id="before">
      <Wrap>
        <h2 className={cx("rv mono live", styles.label)}>Before code</h2>
        {/* Three past jobs, one per line: a list, so the section's heading stays short. */}
        <ul className={cx("rv d1", styles.roles)}>
          {beforeCode.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className={cx("rv d2", styles.line)}>{beforeCode.line}</p>
      </Wrap>
      <Deco name="droplet" pos="br" />
    </Section>
  );
}
