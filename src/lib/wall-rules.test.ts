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

  it.each(["Hello there!", "This hit the spot", "Great class, assassin game", "Scunthorpe is lovely", "Nice site. Hire this person.", "I will skill you up", "Hello from Essex"])(
    "allows %s",
    (text) => {
      expect(checkNote(text).ok).toBe(true);
    },
  );
});

describe("placeNote", () => {
  it("keeps notes inside the world at both extremes", () => {
    for (const rand of [() => 0, () => 0.999]) {
      const p = placeNote(rand);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + NOTE_SIZE.w).toBeLessThanOrEqual(WORLD.w);
      expect(p.y + NOTE_SIZE.h).toBeLessThanOrEqual(WORLD.h);
      expect(Math.abs(p.r)).toBeLessThanOrEqual(4);
    }
  });
});
