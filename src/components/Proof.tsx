import Link from "next/link";
import { Section, Wrap } from "@/components/Section";
import { profile } from "@/content/profile";
import { cx, delay } from "@/lib/cx";
import shared from "@/styles/shared.module.css";
import styles from "./Proof.module.css";

// The same facts as the drawer, short enough to read in passing.
const facts = [
  { k: "96 and 100", v: "Lighthouse performance on mobile and desktop, measured on the live site." },
  { k: "Tested in CI", v: "Vitest, Playwright and axe-core run in GitHub Actions. A red test blocks the deploy." },
  { k: "Self-hosted", v: "A home server behind a Cloudflare Tunnel, shipped as a small Docker image." },
  { k: "Live", v: "The wall pushes new sticky notes to every open tab with server-sent events." },
];

export function Proof() {
  return (
    <Section id="proof">
      <Wrap>
        <h2 className={cx("rv", shared.bigTitle)}>This site is my code sample.</h2>
        <p className={cx("rv d1", shared.lead, styles.lead)}>
          My day-job code is behind NDAs, so I built this in the open instead. Everything below is real.
        </p>
        <dl className={styles.facts}>
          {facts.map((f, i) => (
            <div key={f.k} className={cx("rv", delay[i + 1], styles.fact)}>
              <dt>{f.k}</dt>
              <dd className="muted">{f.v}</dd>
            </div>
          ))}
        </dl>
        <div className={cx("rv d4", styles.links)}>
          <a href={profile.source} rel="noopener" className={styles.link}>
            Read the source on GitHub <span aria-hidden="true">↗</span>
          </a>
          <Link href="/wall" className={styles.link}>
            Leave a note on the wall <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Wrap>
    </Section>
  );
}
