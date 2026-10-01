import { Actions } from "@/components/Actions";
import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { cx } from "@/lib/cx";
import styles from "./Contact.module.css";

const upcoming = ["Play my life", "The wall"];

export function Contact() {
  return (
    <Section id="contact">
      <Wrap>
        <div className="rv mono live">05 · SAY HELLO</div>
        <h2 className={cx("rv d1", styles.title)}>
          Let&apos;s build
          <br />
          something <span className="accent">good</span>.
        </h2>
        <div className="rv d2">
          <Actions large />
        </div>
        <div className={cx("rv d3", styles.soonRow)}>
          {upcoming.map((name) => (
            <div key={name} className={styles.soon}>
              <span className="mono live small">COMING SOON</span>
              <div>{name}</div>
            </div>
          ))}
        </div>
      </Wrap>
      <Deco name="laptop" pos="br" />
    </Section>
  );
}
