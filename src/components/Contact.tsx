import Link from "next/link";
import { Actions } from "@/components/Actions";
import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { cx } from "@/lib/cx";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <Section id="contact">
      <Wrap>
        <div className="rv mono live">SAY HELLO</div>
        <h2 className={cx("rv d1", styles.title)}>
          Hiring? I&apos;m one
          <br />
          <span className="accent">email</span> away.
        </h2>
        <div className="rv d2">
          <Actions large />
        </div>
        <p className={cx("rv d3 muted", styles.source)}>
          Not hiring, just passing by?{" "}
          <Link href="/wall">
            Leave a note on the wall <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Wrap>
      <Deco name="laptop" pos="br" />
    </Section>
  );
}
