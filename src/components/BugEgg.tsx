"use client";

import { useState, type MouseEvent } from "react";
import { useEggs } from "@/components/Eggs";
import { Icon } from "@/components/Icons";
import styles from "./BugEgg.module.css";

export const bugFlight = [
  { x: -180, y: 70 },
  { x: -60, y: 170 },
] as const;

const origin = { x: 0, y: 0 };

export function BugEgg() {
  const { found, find } = useEggs();
  const [flights, setFlights] = useState(0);
  const [running, setRunning] = useState(false);
  const [smashedHere, setSmashedHere] = useState(false);
  const [gone, setGone] = useState(false);
  const smashed = found.has("bug");

  if (gone || (smashed && !smashedHere)) return null;

  const approach = () => {
    if (smashed) return;
    if (flights < bugFlight.length) {
      setFlights(flights + 1);
      setRunning(true);
    } else {
      setSmashedHere(true);
      find("bug");
    }
  };

  const spot = flights > 0 ? bugFlight[flights - 1] : origin;
  const from = flights > 1 ? bugFlight[flights - 2] : origin;
  const heading = flights > 0 ? (Math.atan2(spot.y - from.y, spot.x - from.x) * 180) / Math.PI + 90 : 0;

  return (
    <button
      type="button"
      className={styles.bug}
      data-smashed={smashed}
      data-running={running}
      aria-label={smashed ? "A squashed bug. You fixed it." : "A bug. Try to catch it."}
      style={{ transform: `translate(${spot.x}px, ${spot.y}px)` }}
      onPointerEnter={approach}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (e.detail === 0) approach();
      }}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "transform") setRunning(false);
      }}
    >
      <span className={styles.heading} style={{ transform: `rotate(${heading}deg)` }}>
        <span className={styles.icon} onAnimationEnd={() => smashed && setGone(true)}>
          <Icon name="bug" size={44} />
        </span>
      </span>
    </button>
  );
}
