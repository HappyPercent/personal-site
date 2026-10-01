import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { stenn, type Stage } from "@/content/experience";
import { cx } from "@/lib/cx";
import shared from "@/styles/shared.module.css";
import styles from "./Career.module.css";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

function RoleCard({ stage, meta }: { stage: Stage; meta: "dates" | "company" }) {
  return (
    <div className={cx(shared.card, styles.card)}>
      {meta === "dates" && (
        <div className="mono accent small">
          {stage.dates} · {stage.place}
        </div>
      )}
      <h2 className={styles.title}>{stage.title}</h2>
      {meta === "company" && <div className={cx("accent", styles.company)}>{stage.company}</div>}
      <Bullets items={stage.bullets} />
    </div>
  );
}

export function SingleRole({ id, year, stage }: { id: string; year: string; stage: Stage }) {
  return (
    <Section id={id}>
      <Wrap className={styles.grid}>
        <div>
          <div className="rv mono live">02 · CAREER</div>
          <div className={cx("rv d1", styles.year)} aria-hidden="true">
            {year}
          </div>
          <div className="rv d2 mono accent">{stage.dates}</div>
          <div className="rv d2 muted small">{stage.place}</div>
        </div>
        <div className="rv d2">
          <RoleCard stage={stage} meta="company" />
        </div>
      </Wrap>
    </Section>
  );
}

export function StennScreen() {
  return (
    <Section id="stenn">
      <Wrap>
        <div className="rv mono live">02 · CAREER</div>
        <div className={cx("rv d1", styles.stennHead)}>
          <span className={cx(styles.year, styles.stennYear)} aria-hidden="true">
            {stenn.years}
          </span>
          <span className={styles.stennCompany}>{stenn.company}</span>
        </div>
        <div className={styles.stennGrid}>
          <div className={cx("rv d2", styles.stage)}>
            <RoleCard stage={stenn.stages[0]} meta="dates" />
          </div>
          <div className={cx("rv d3", styles.arrow)} aria-hidden="true">
            <svg width="72" height="24" viewBox="0 0 72 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h66M58 4l10 8-10 8" />
            </svg>
          </div>
          <div className={cx("rv d4", styles.stage)}>
            <RoleCard stage={stenn.stages[1]} meta="dates" />
          </div>
        </div>
      </Wrap>
      <Deco name="coffee" pos="br" />
    </Section>
  );
}
