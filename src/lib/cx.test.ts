import { describe, expect, it } from "vitest";
import { cx, delay } from "./cx";

describe("cx", () => {
  it("joins class names with a space", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("supports conditional classes", () => {
    const active = true;
    const disabled = false;
    expect(cx("btn", active && "active", disabled && "disabled")).toBe("btn active");
  });

  it("returns an empty string when nothing is left", () => {
    expect(cx(false, null)).toBe("");
  });
});

describe("delay", () => {
  it("starts with no delay and steps up to d4", () => {
    expect(delay).toEqual(["", "d1", "d2", "d3", "d4"]);
  });
});
