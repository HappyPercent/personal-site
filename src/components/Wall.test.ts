import { describe, expect, it } from "vitest";
import { NOTE_SIZE } from "@/lib/wall-rules";
import { MIN_SCALE, fitAll } from "./Wall";

const view = { w: 1440, h: 900 };
// Below an 80px header.
const open = { w: view.w, h: view.h - 80, top: 80 };

// Where a note lands on screen for a given pan and scale.
function onScreen(n: { x: number; y: number }, pan: { x: number; y: number }, scale: number) {
  return {
    left: pan.x + n.x * scale,
    top: pan.y + n.y * scale,
    right: pan.x + (n.x + NOTE_SIZE.w) * scale,
    bottom: pan.y + (n.y + NOTE_SIZE.h) * scale,
  };
}

describe("fitAll", () => {
  it("shows every note below the header when they fit", () => {
    const notes = [
      { x: 1794, y: 174 },
      { x: 797, y: 1129 },
      { x: 65, y: 854 },
      { x: 1090, y: 665 },
    ];
    const { pan, scale } = fitAll(notes, view, open);
    expect(scale).toBeGreaterThanOrEqual(MIN_SCALE);
    expect(scale).toBeLessThan(1);
    for (const n of notes) {
      const r = onScreen(n, pan, scale);
      expect(r.left).toBeGreaterThanOrEqual(0);
      expect(r.right).toBeLessThanOrEqual(view.w);
      expect(r.top).toBeGreaterThanOrEqual(open.top);
      expect(r.bottom).toBeLessThanOrEqual(view.h);
    }
  });

  it("does not zoom in past full size", () => {
    expect(fitAll([{ x: 1090, y: 665 }], view, open).scale).toBe(1);
  });

  it("frames the biggest group when not everything fits", () => {
    const phone = { w: 390, h: 600 };
    const group = [
      { x: 1000, y: 600 },
      { x: 1100, y: 700 },
      { x: 1050, y: 820 },
    ];
    const loner = { x: 60, y: 120 };
    const { pan, scale } = fitAll([loner, ...group], phone, { ...phone, top: 0 });
    expect(scale).toBe(MIN_SCALE);
    const visible = (n: { x: number; y: number }) => {
      const r = onScreen(n, pan, scale);
      return r.right > 0 && r.left < phone.w && r.bottom > 0 && r.top < phone.h;
    };
    expect(group.filter(visible).length).toBeGreaterThanOrEqual(2);
    expect(visible(loner)).toBe(false);
  });
});
