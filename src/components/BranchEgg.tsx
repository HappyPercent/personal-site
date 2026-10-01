"use client";

import { useState, type PointerEvent } from "react";
import { Icon } from "@/components/Icons";
import { useEggs } from "@/components/Eggs";
import styles from "./BranchEgg.module.css";

const TREE_ID = "egg-tree";

export function EggTree() {
  const { found } = useEggs();
  return (
    <svg
      id={TREE_ID}
      className={styles.tree}
      viewBox="0 0 360 440"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M180 440V250M180 330C140 310 110 290 90 250M180 290C220 270 250 240 270 200M180 250C170 210 150 170 130 130M180 250C190 200 200 160 210 110" />
      <circle cx="90" cy="250" r="9" />
      <circle cx="270" cy="200" r="9" />
      <circle cx="130" cy="130" r="9" />
      <circle cx="210" cy="110" r="9" />
      <g className={styles.merged} data-on={found.has("branch")} stroke="var(--accent)">
        <path d="M180 370C230 360 280 340 312 296" />
        <circle cx="312" cy="296" r="11" fill="var(--bg)" />
      </g>
    </svg>
  );
}

export function BranchDrag() {
  const { found, find } = useEggs();
  const [grab, setGrab] = useState<{ x: number; y: number } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (found.has("branch")) return null;

  const down = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrab({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (grab) setPos({ x: e.clientX - grab.x, y: e.clientY - grab.y });
  };
  const up = (e: PointerEvent<HTMLButtonElement>) => {
    setGrab(null);
    const tree = document.getElementById(TREE_ID)?.getBoundingClientRect();
    const b = e.currentTarget.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    if (tree && cx > tree.left && cx < tree.right && cy > tree.top && cy < tree.bottom) {
      find("branch");
    }
    setPos({ x: 0, y: 0 });
  };

  return (
    <button
      type="button"
      className={styles.drag}
      aria-label="Branch icon. Drag it onto the tree in the background."
      data-dragging={grab !== null}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => {
        setGrab(null);
        setPos({ x: 0, y: 0 });
      }}
    >
      <Icon name="branch" size={44} />
    </button>
  );
}
