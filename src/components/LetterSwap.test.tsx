import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LetterSwap } from "./LetterSwap";

describe("LetterSwap", () => {
  it("renders both words and hides them from screen readers", () => {
    Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() }, configurable: true });
    const { container } = render(<LetterSwap options={["ch", "am"]} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.querySelectorAll("[data-letters]")).toHaveLength(2);
    expect(root).toHaveTextContent("cham");
  });

  it("measures the words once fonts are ready", async () => {
    Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() }, configurable: true });
    const { container } = render(<LetterSwap options={["ch", "am"]} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-ready", "false");
    await waitFor(() => expect(root).toHaveAttribute("data-ready", "true"));
    expect(root.style.getPropertyValue("--w0")).toMatch(/em$/);
    expect(root.style.getPropertyValue("--w1")).toMatch(/em$/);
  });
});
