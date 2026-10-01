"use client";

import { useEffect, useRef, useState } from "react";
import { useEggs } from "@/components/Eggs";
import styles from "./Avatar.module.css";

type Mood = "idle" | "wink" | "surprise" | "laugh" | "cool";
const moods: Mood[] = ["idle", "wink", "surprise", "laugh", "cool", "idle"];

const mouths: Record<Mood, string> = {
  idle: "M89 120 Q100 127 112 119",
  wink: "M86 120 Q100 135 114 120",
  surprise: "M95 123 Q100 134 105 123 Q100 119 95 123 Z",
  laugh: "M84 119 Q100 142 116 119 Z",
  cool: "M88 123 Q100 128 114 120",
};

const PUPIL_REACH = 2.2;

export function Avatar({ size = 200 }: { size?: number }) {
  const [n, setN] = useState(0);
  const { find } = useEggs();
  const [look, setLook] = useState({ x: 0, y: 0, ms: 120 });
  const faceRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const box = faceRef.current?.getBoundingClientRect();
        if (!box) return;
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = PUPIL_REACH * (1 - Math.exp(-dist / 180));
        const ms = Math.round(Math.min(450, 60 + dist * 0.6));
        setLook({
          x: Math.round((dx / dist) * reach * 10) / 10,
          y: Math.round((dy / dist) * reach * 10) / 10,
          ms,
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const m = n % 6;
  const mood = moods[m];
  const closedL = mood === "laugh";
  const closedR = mood === "laugh" || mood === "wink";
  const hideL = mood === "laugh" || mood === "cool";
  const hideR = hideL || mood === "wink";
  const filled = mood === "laugh" || mood === "surprise";

  return (
    <div className={styles.avatar}>
      <button
        ref={faceRef}
        type="button"
        className={styles.btn}
        aria-label="Poke the avatar"
        onClick={() => {
          const next = n + 1;
          setN(next);
          if (next === 5) find("avatar");
        }}
      >
        <div key={`p${n}`} className={n > 0 ? styles.pop : undefined}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            role="img"
            aria-label="Cartoon portrait of Andrey"
          >
            <path d="M26 200 C26 162 58 148 100 148 C142 148 174 162 174 200 Z" fill="#1F3A31" />
            <path d="M76 149 L100 180 L92 147 Z M124 149 L100 180 L108 147 Z" fill="#2E5446" />
            <path d="M86 122 H114 V152 C108 160 92 160 86 152 Z" fill="#D8A07E" />
            <ellipse cx="55" cy="94" rx="7" ry="11" fill="#E3AC89" />
            <ellipse cx="145" cy="94" rx="7" ry="11" fill="#E3AC89" />
            <path d="M56 82 C56 46 78 34 100 34 C122 34 144 46 144 82 C144 110 132 134 100 138 C68 134 56 110 56 82 Z" fill="#EDBA98" />
            <path d="M62 100 C64 126 80 138 100 138 C120 138 136 126 138 100 C130 120 116 125 100 125 C84 125 70 120 62 100 Z" fill="#2A2420" opacity="0.14" />
            <path d="M56 82 C50 44 76 26 100 26 C124 26 150 44 144 82 C141 66 134 56 124 54 C114 52 108 56 100 50 C92 56 86 52 76 54 C66 56 59 66 56 82 Z" fill="#2A2420" />
            <g className={styles.brow} style={{ transform: `translateY(${mood === "surprise" ? -5 : 0}px)` }}>
              <path d="M72 82 Q82 77 92 81" stroke="#2A2420" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M108 81 Q118 77 128 82" stroke="#2A2420" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
            <g
              className={styles.pupils}
              style={{ transform: `translate(${look.x}px, ${look.y}px)`, transitionDuration: `${look.ms}ms` }}
            >
              <g className={styles.blink} opacity={hideL ? 0 : 1}>
                <circle cx="82" cy="93" r={mood === "surprise" ? 7 : 5.5} fill="#2A1B14" />
                <circle cx="84" cy="91" r="1.6" fill="#fff" />
              </g>
              <g className={styles.blink} opacity={hideR ? 0 : 1}>
                <circle cx="118" cy="93" r={mood === "surprise" ? 7 : 5.5} fill="#2A1B14" />
                <circle cx="120" cy="91" r="1.6" fill="#fff" />
              </g>
            </g>
            <path d="M75 95 Q82 88 89 95" stroke="#2A1B14" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={closedL ? 1 : 0} />
            <path d="M111 95 Q118 88 125 95" stroke="#2A1B14" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={closedR ? 1 : 0} />
            <g opacity={mood === "cool" ? 1 : 0}>
              <rect x="67" y="84" width="30" height="19" rx="7" fill="#101614" stroke="#E9F0EB" strokeWidth="2" />
              <rect x="103" y="84" width="30" height="19" rx="7" fill="#101614" stroke="#E9F0EB" strokeWidth="2" />
              <path d="M97 90 H103" stroke="#E9F0EB" strokeWidth="2" />
              <path d="M72 88 L80 88" stroke="#F0A64E" strokeWidth="2" strokeLinecap="round" />
            </g>
            <path d="M100 97 Q95 110 98 114 Q103 116 106 113" stroke="#C98C69" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d={mouths[mood]} stroke="#A55F49" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill={filled ? "#7A2E2A" : "none"} />
          </svg>
        </div>
      </button>
    </div>
  );
}
