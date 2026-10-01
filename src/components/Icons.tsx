import type { ReactNode } from "react";
import styles from "./Icons.module.css";

export type IconName = "laptop" | "coffee" | "gpu" | "bug" | "droplet" | "branch";

const A = "var(--accent)";

const shapes: Record<IconName, ReactNode> = {
  laptop: (
    <>
      <rect x="8" y="12" width="32" height="22" rx="3" fill="var(--surface-2)" />
      <path d="M4 39h40" />
      <path d="M19 21l-4 4 4 4M29 21l4 4-4 4" stroke={A} />
    </>
  ),
  coffee: (
    <>
      <path d="M10 18h24v10a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z" fill="var(--surface-2)" />
      <path d="M34 21h3a4 4 0 0 1 0 8h-3" />
      <path d="M18 7c-2 3 2 4 0 7M26 7c-2 3 2 4 0 7" stroke={A} />
    </>
  ),
  gpu: (
    <>
      <rect x="4" y="12" width="40" height="22" rx="3" fill="var(--surface-2)" />
      <circle cx="17" cy="23" r="6" stroke={A} />
      <circle cx="32" cy="23" r="6" />
      <path d="M10 38v4M16 38v4M22 38v4" />
    </>
  ),
  bug: (
    <>
      <ellipse cx="24" cy="29" rx="9" ry="11" fill="var(--surface-2)" />
      <circle cx="24" cy="14" r="5" stroke={A} />
      <path d="M15 25H8M15 33H8M33 25h7M33 33h7M21 10l-3-4M27 10l3-4M24 20v20" />
    </>
  ),
  droplet: (
    <>
      <path d="M24 6c8 10 12 16 12 22a12 12 0 0 1-24 0c0-6 4-12 12-22z" fill="var(--surface-2)" />
      <path d="M18 30a6 6 0 0 0 5 5" stroke={A} />
    </>
  ),
  branch: (
    <>
      <circle cx="14" cy="11" r="4" fill="var(--surface-2)" />
      <circle cx="14" cy="37" r="4" fill="var(--surface-2)" />
      <circle cx="34" cy="19" r="4" stroke={A} />
      <path d="M14 15v18M34 23c0 7-8 9-16 11" />
    </>
  ),
};

export function Icon({ name, size = 48 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="var(--text)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}

export function Deco({ name, pos }: { name: IconName; pos: "tr" | "br" | "bl" | "tl" }) {
  return (
    <span className={`${styles.deco} ${styles[pos]}`} aria-hidden="true">
      <Icon name={name} size={44} />
    </span>
  );
}
