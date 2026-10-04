import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { joke, jokeBank } from "./jokes";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

describe("joke bank", () => {
  it("has unique ids", () => {
    const ids = jokeBank.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty text and at least one tag on every joke", () => {
    for (const j of jokeBank) {
      expect(j.text.trim().length, j.id).toBeGreaterThan(0);
      expect(j.tags.length, j.id).toBeGreaterThan(0);
    }
  });

  it("returns the text for a known id", () => {
    expect(joke("404")).toBe("404: this page didn't pass code review.");
  });

  it("throws for an unknown id", () => {
    expect(() => joke("does-not-exist")).toThrow("Unknown joke: does-not-exist");
  });

  it("covers every joke id the site references", () => {
    const known = new Set(jokeBank.map((j) => j.id));
    const used = sourceFiles(join(process.cwd(), "src"))
      .flatMap((file) => [...readFileSync(file, "utf8").matchAll(/\bjoke\("([^"]+)"\)/g)])
      .map((m) => m[1]);
    expect(used.length).toBeGreaterThan(0);
    for (const id of used) expect(known.has(id), id).toBe(true);
  });
});
