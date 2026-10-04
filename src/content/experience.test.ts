import { describe, expect, it } from "vitest";
import { aori, beforeCode, netchex, skills, stennDev, stennLead, type Stage } from "./experience";

const timeline: Stage[] = [netchex, stennLead, stennDev, aori];
const startYear = (s: Stage) => Number(/\d{4}/.exec(s.dates)?.[0]);

describe("career content", () => {
  it("lists roles newest first", () => {
    const years = timeline.map(startYear);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it("gives every role the fields the card needs", () => {
    for (const s of timeline) {
      expect(s.title).toBeTruthy();
      expect(s.company).toBeTruthy();
      expect(s.place).toBeTruthy();
      expect(s.bullets.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("does not repeat a bullet inside a role", () => {
    for (const s of timeline) expect(new Set(s.bullets).size).toBe(s.bullets.length);
  });

  it("keeps both Stenn stages under the same company", () => {
    expect(stennDev.company).toBe(stennLead.company);
  });

  it("splits the pre-code career into one line per employer", () => {
    expect(beforeCode.lines).toHaveLength(3);
    for (const line of beforeCode.lines) expect(line.endsWith(".")).toBe(true);
  });
});

describe("skills", () => {
  it("has no empty or duplicated groups", () => {
    const names = skills.map((g) => g.name);
    expect(new Set(names).size).toBe(names.length);
    for (const g of skills) expect(g.items.length, g.name).toBeGreaterThan(0);
  });

  it("lists SQL under backend", () => {
    expect(skills.find((g) => g.name === "BACKEND")?.items).toContain("SQL");
  });
});
