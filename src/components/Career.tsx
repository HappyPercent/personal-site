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

function StageBlock({ stage, first, dated }: { stage: Stage; first: boolean; dated: boolean }) {
  const Title = first ? "h2" : "h3";
  return (
    <div className={styles.stage}>
      {!first && <div className={cx("mono dim small", styles.promoted)}>Promoted from</div>}
      <Title className={styles.title}>{stage.title}</Title>
      {first && (
        <p className={styles.company}>
          <span className="accent">{stage.company}</span> <span className="muted">· {stage.context}</span>
        </p>
      )}
      {dated && (
        <div className="mono dim small">
          {stage.dates} · {stage.place}
        </div>
      )}
      {stage.team && (
        <div className={styles.team}>
          <span className={styles.teamN}>{stage.team.n}</span>
          <span className="muted">{stage.team.label}</span>
        </div>
      )}
      <Bullets items={stage.bullets} />
    </div>
  );
}

/** One company on one screen. Several stages (newest first) mean promotions inside it. */
export function Role({ id, year, stages, deco }: { id: string; year: string; stages: Stage[]; deco?: "coffee" }) {
  const newest = stages[0];
  const oldest = stages[stages.length - 1];
  const dates = stages.length > 1 ? `${oldest.dates.split(" to ")[0]} to ${newest.dates.split(" to ")[1]}` : newest.dates;
  const places = [...new Set(stages.map((s) => s.place).reverse())].join(", then ");
  return (
    <Section id={id}>
      <Wrap className={styles.grid}>
        <div>
          <div className={cx("rv", styles.year)} aria-hidden="true">
            {year}
          </div>
          <div className="rv d1 mono muted">{dates}</div>
          <div className="rv d1 dim small">{places}</div>
        </div>
        <div className="rv d2">
          <div className={cx(shared.card, styles.card)}>
            {stages.map((s, i) => (
              <StageBlock key={s.title} stage={s} first={i === 0} dated={stages.length > 1} />
            ))}
          </div>
        </div>
      </Wrap>
      {deco && <Deco name={deco} pos="br" />}
    </Section>
  );
}
