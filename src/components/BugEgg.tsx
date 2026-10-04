"use client";

import { useState, type MouseEvent } from "react";
import { useEggs } from "@/components/Eggs";
import { Icon } from "@/components/Icons";
import styles from "./BugEgg.module.css";

export const bugFlight = [
  { x: -180, y: 70 },
  { x: -60, y: 170 },
  { x: -230, y: 230 },
] as const;

export function BugEgg() {
  const { found, find } = useEggs();
  const [flights, setFlights] = useState(0);
  const smashed = found.has("bug");

  const approach = () => {
    if (smashed) return;
    if (flights < bugFlight.length) setFlights(flights + 1);
    else find("bug");
  };

  const spot = flights > 0 ? bugFlight[flights - 1] : { x: 0, y: 0 };

  return (
    <button
      type="button"
      className={styles.bug}
      data-smashed={smashed}
      aria-label={smashed ? "A squashed bug. You fixed it." : "A bug. Try to catch it."}
      style={{ transform: `translate(${smashed ? 0 : spot.x}px, ${smashed ? 0 : spot.y}px)` }}
      onPointerEnter={approach}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (e.detail === 0) approach();
      }}
    >
      <span className={styles.icon}>
        <Icon name="bug" size={44} />
      </span>
    </button>
  );
}
