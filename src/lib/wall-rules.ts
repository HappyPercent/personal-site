import { hasProfanity } from "./wall-profanity";

export const MAX_NOTE_LENGTH = 140;
export const NOTE_COOLDOWN_MS = 30_000;

export const WORLD = { w: 2400, h: 1500 } as const;
export const NOTE_SIZE = { w: 220, h: 170 } as const;
const COLORS = ["#F0A64E", "#5FD4A0", "#F2E3B3"] as const;

const BLOCKED = ["http://", "https://", "www.", ".com", "viagra", "casino", "crypto"];

export type NoteCheck = { ok: true; text: string } | { ok: false; error: string };

export function checkNote(input: unknown): NoteCheck {
  if (typeof input !== "string") return { ok: false, error: "Write something first." };
  const text = input.replace(/\s+/g, " ").trim();
  if (text.length === 0) return { ok: false, error: "Write something first." };
  if (text.length > MAX_NOTE_LENGTH) return { ok: false, error: `Keep it under ${MAX_NOTE_LENGTH} characters.` };
  const lower = text.toLowerCase();
  if (BLOCKED.some((word) => lower.includes(word))) return { ok: false, error: "No links or ads on the wall, sorry." };
  if (hasProfanity(text)) return { ok: false, error: "Keep it friendly, please. This wall is moderated." };
  return { ok: true, text };
}

export type Placement = { x: number; y: number; r: number; color: string };

/** Pass `rand` (0..1) so tests can be deterministic. */
export function placeNote(rand: () => number = Math.random): Placement {
  return {
    x: Math.round(60 + rand() * (WORLD.w - NOTE_SIZE.w - 120)),
    y: Math.round(120 + rand() * (WORLD.h - NOTE_SIZE.h - 180)),
    r: Math.round((rand() * 8 - 4) * 10) / 10,
    color: COLORS[Math.floor(rand() * COLORS.length)],
  };
}
