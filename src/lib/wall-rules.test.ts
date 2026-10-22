import { describe, expect, it } from "vitest";
import { checkNote, MAX_NOTE_LENGTH, NOTE_SIZE, placeNote, WORLD } from "./wall-rules";

describe("checkNote", () => {
  it("trims and collapses whitespace", () => {
    expect(checkNote("  hello \n  world ")).toEqual({ ok: true, text: "hello world" });
  });

  it("rejects empty and non-string input", () => {
    expect(checkNote("   ").ok).toBe(false);
    expect(checkNote(42).ok).toBe(false);
    expect(checkNote(undefined).ok).toBe(false);
  });

  it("rejects notes over the limit", () => {
    expect(checkNote("a".repeat(MAX_NOTE_LENGTH)).ok).toBe(true);
    expect(checkNote("a".repeat(MAX_NOTE_LENGTH + 1)).ok).toBe(false);
  });

  it("rejects links", () => {
    expect(checkNote("see https://spam.example").ok).toBe(false);
    expect(checkNote("visit WWW.spam.example").ok).toBe(false);
  });
});

describe("checkNote profanity", () => {
  it.each(["Fuck you", "FUCK", "fuuuuck this", "f u c k", "f.u.c.k", "sh1t", "$hit", "what a b!tch", "you are an ass", "motherfucker"])(
    "rejects %s",
    (text) => {
      expect(checkNote(text).ok).toBe(false);
    },
  );

  it.each(["kill me", "Just KILL ME now", "I want to kill myself", "kms", "thinking about suicide", "I wanna die", "going to end my life", "self-harm", "self harm", "k i l l me", "killing myself", "cutting myself", "unalive"])(
    "rejects self-harm talk: %s",
    (text) => {
      expect(checkNote(text).ok).toBe(false);
    },
  );

  it.each(["Hello there!", "This hit the spot", "Great class, assassin game", "Scunthorpe is lovely", "Nice site. Hire this person.", "I will skill you up", "Hello from Essex", "Teach me the skill, merci", "This killed it, nice work", "Selfie with the wall", "The end of my life's work? No, just v1"])(
    "allows %s",
    (text) => {
      expect(checkNote(text).ok).toBe(true);
    },
  );
});

describe("placeNote", () => {
  const overlaps = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.abs(a.x - b.x) < NOTE_SIZE.w && Math.abs(a.y - b.y) < NOTE_SIZE.h;

  it("puts the first note in the middle of the world", () => {
    const p = placeNote([], () => 0.5);
    expect(p.x).toBe((WORLD.w - NOTE_SIZE.w) / 2);
    expect(p.y).toBe((WORLD.h - NOTE_SIZE.h) / 2);
  });

  it("packs notes next to each other without overlap, all inside the world", () => {
    const taken: { x: number; y: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const p = placeNote(taken, () => (i * 0.37) % 1);
      expect(taken.some((t) => overlaps(t, p))).toBe(false);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + NOTE_SIZE.w).toBeLessThanOrEqual(WORLD.w);
      expect(p.y + NOTE_SIZE.h).toBeLessThanOrEqual(WORLD.h);
      expect(Math.abs(p.r)).toBeLessThanOrEqual(4);
      taken.push(p);
    }
    // A tight cluster: the second note sits right beside the first, not across the world.
    const [first, second] = taken;
    expect(Math.hypot(first.x - second.x, first.y - second.y)).toBeLessThan(NOTE_SIZE.w * 1.5);
  });

  it("still places a note when the wall is full", () => {
    const full = [];
    for (let x = 0; x < WORLD.w; x += 50) for (let y = 0; y < WORLD.h; y += 50) full.push({ x, y });
    const p = placeNote(full, () => 0.5);
    expect(p.x + NOTE_SIZE.w).toBeLessThanOrEqual(WORLD.w);
    expect(p.y + NOTE_SIZE.h).toBeLessThanOrEqual(WORLD.h);
  });
});
