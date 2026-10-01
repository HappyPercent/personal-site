import { Actions } from "@/components/Actions";
import { Avatar } from "@/components/Avatar";
import { BranchDrag } from "@/components/BranchEgg";
import { LetterSwap } from "@/components/LetterSwap";
import { Section, Wrap } from "@/components/Section";
import { profile } from "@/content/profile";
import shared from "@/styles/shared.module.css";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <Section id="hero">
      <BranchDrag />
      <Wrap className={styles.grid}>
        <div className={styles.stack}>
          <div className="rv mono live">● {profile.status}</div>
          <h1 className={`rv d1 ${styles.title}`} aria-label={profile.roleAria}>
            {profile.headline}
            <br />
            <span aria-hidden="true">
              {profile.roleStart}
              <LetterSwap options={profile.roleSwap} />
              {profile.roleEnd}
            </span>
          </h1>
          <p className={`rv d2 ${shared.lead}`}>{profile.pitch}</p>
          <div className="rv d3">
            <Actions />
          </div>
          <div className="rv d4 mono dim small">↓ scroll</div>
        </div>
        <div className={`rv d2 ${styles.avatarWrap}`}>
          <div className={styles.avatarCard}>
            <Avatar size={320} />
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
