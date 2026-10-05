"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { useEggs } from "@/components/Eggs";
import { Icon } from "@/components/Icons";
import styles from "./BugEgg.module.css";

export const bugFlight = [
  { x: -180, y: 70 },
  { x: -60, y: 170 },
] as const;

const runMs = 600;

const drops = [
  { dx: -24, dy: -6, r: 2.4 },
  { dx: -17, dy: 10, r: 1.8 },
  { dx: -6, dy: 15, r: 2.6 },
  { dx: 8, dy: 14, r: 1.9 },
  { dx: 19, dy: 9, r: 2.5 },
  { dx: 25, dy: -4, r: 2 },
  { dx: 10, dy: -14, r: 2.2 },
  { dx: -9, dy: -13, r: 1.7 },
];

function SmackedBug({ heading }: { heading: number }) {
  return (
    <svg
      className={styles.splat}
      width={44}
      height={44}
      viewBox="0 0 48 48"
      fill="none"
      stroke="var(--text)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle className={styles.palm} cx="24" cy="29" r="20" fill="var(--text)" stroke="none" />
      <ellipse className={styles.puddle} cx="24" cy="30" rx="15" ry="5" fill="var(--accent)" stroke="none" />
      <circle className={styles.ring} cx="24" cy="29" r="6" stroke="var(--accent)" strokeWidth="2" />
      {drops.map((d, i) => (
        <circle
          key={i}
          className={styles.drop}
          cx="24"
          cy="29"
          r={d.r}
          fill="var(--accent)"
          stroke="none"
          style={{ "--dx": `${d.dx}px`, "--dy": `${d.dy}px` } as CSSProperties}
        />
      ))}
      <g className={styles.squash}>
        <g className={styles.twitch}>
          <g transform={`rotate(${heading} 24 29)`}>
            <g className={styles.legs}>
              <path d="M15 25H8M15 33H8M33 25h7M33 33h7M21 10l-3-4M27 10l3-4" />
            </g>
            <ellipse cx="24" cy="29" rx="9" ry="11" fill="var(--surface-2)" />
            <path d="M24 20v20" />
            <circle cx="24" cy="14" r="5" stroke="var(--accent)" />
          </g>
        </g>
      </g>
    </svg>
  );
}
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
      setTimeout(() => setRunning(false), runMs);
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
    >
      <span className={styles.heading} style={{ transform: smashed ? undefined : `rotate(${heading}deg)` }}>
        <span
          className={styles.icon}
          onAnimationEnd={(e) => {
            if (smashed && e.target === e.currentTarget) setGone(true);
          }}
        >
          {smashed ? <SmackedBug heading={heading} /> : <Icon name="bug" size={44} />}
        </span>
      </span>
    </button>
  );
}
