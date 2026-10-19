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
type Spot = { x: number; y: number };

const BOUNDS = { minX: 60, minY: 120, maxX: WORLD.w - NOTE_SIZE.w - 60, maxY: WORLD.h - NOTE_SIZE.h - 60 };
const GAP = 14;
const STEP = 30;

const inBounds = (s: Spot) => s.x >= BOUNDS.minX && s.x <= BOUNDS.maxX && s.y >= BOUNDS.minY && s.y <= BOUNDS.maxY;
const isFree = (s: Spot, taken: Spot[]) =>
  taken.every((t) => Math.abs(t.x - s.x) >= NOTE_SIZE.w + GAP || Math.abs(t.y - s.y) >= NOTE_SIZE.h + GAP);

/** Nearest free spot to the middle of the world, walking outwards ring by ring. */
function findSpot(taken: Spot[], rand: () => number): Spot {
  const cx = (WORLD.w - NOTE_SIZE.w) / 2;
  const cy = (WORLD.h - NOTE_SIZE.h) / 2;
  // Stretch the rings sideways so the cluster grows in the world's shape.
  const stretch = WORLD.w / WORLD.h;
  for (let ring = 0; ring * STEP <= cx; ring++) {
    const radius = ring * STEP;
    const samples = Math.max(1, Math.floor((2 * Math.PI * radius) / STEP));
    const offset = rand() * 2 * Math.PI;
    for (let i = 0; i < samples; i++) {
      const a = offset + (i / samples) * 2 * Math.PI;
      const spot = { x: Math.round(cx + Math.cos(a) * radius), y: Math.round(cy + (Math.sin(a) * radius) / stretch) };
      if (inBounds(spot) && isFree(spot, taken)) return spot;
    }
  }
  // The wall is full: overlap somewhere random.
  return {
    x: Math.round(BOUNDS.minX + rand() * (BOUNDS.maxX - BOUNDS.minX)),
    y: Math.round(BOUNDS.minY + rand() * (BOUNDS.maxY - BOUNDS.minY)),
  };
}

/** `taken` are positions of notes already on the wall. Pass `rand` (0..1) so tests can be deterministic. */
export function placeNote(taken: Spot[] = [], rand: () => number = Math.random): Placement {
  return {
    ...findSpot(taken, rand),
    r: Math.round((rand() * 8 - 4) * 10) / 10,
    color: COLORS[Math.floor(rand() * COLORS.length)],
  };
}
