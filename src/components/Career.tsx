import { Deco } from "@/components/Icons";
import { Section, Wrap } from "@/components/Section";
import { type Stage } from "@/content/experience";
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

function RoleCard({ stage }: { stage: Stage }) {
  return (
    <div className={cx(shared.card, styles.card)}>
      <h2 className={styles.title}>{stage.title}</h2>
      <div className={cx("accent", styles.company)}>{stage.company}</div>
      <Bullets items={stage.bullets} />
    </div>
  );
}

export function SingleRole({ id, year, stage, deco }: { id: string; year: string; stage: Stage; deco?: "coffee" }) {
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
          <RoleCard stage={stage} />
        </div>
      </Wrap>
      {deco && <Deco name={deco} pos="br" />}
    </Section>
  );
}
