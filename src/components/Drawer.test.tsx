import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DrawerButton } from "./Drawer";

const dialog = () => screen.getByRole("dialog", { hidden: true });
const pill = () => screen.getByRole("button", { name: "{ how it's done }" });

describe("Drawer", () => {
  it("starts closed and hidden from assistive tech", () => {
    render(<DrawerButton />);
    expect(dialog()).toHaveAttribute("aria-hidden", "true");
    expect(dialog().parentElement).toHaveAttribute("data-open", "false");
  });

  it("opens from the pill and moves focus to the close button", async () => {
    render(<DrawerButton />);
    await userEvent.click(pill());
    expect(dialog()).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("button", { name: "Close drawer" })).toHaveFocus();
  });

  it("closes with Escape", async () => {
    render(<DrawerButton />);
    await userEvent.click(pill());
    await userEvent.keyboard("{Escape}");
    expect(dialog()).toHaveAttribute("aria-hidden", "true");
  });

  it("closes with the close button", async () => {
    render(<DrawerButton />);
    await userEvent.click(pill());
    await userEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    expect(dialog()).toHaveAttribute("aria-hidden", "true");
  });

  it("closes when the scrim is clicked", async () => {
    render(<DrawerButton />);
    await userEvent.click(pill());
    const scrim = dialog().previousElementSibling as HTMLElement;
    await userEvent.click(scrim);
    expect(dialog()).toHaveAttribute("aria-hidden", "true");
  });

  it("takes the close button out of the tab order while closed", () => {
    render(<DrawerButton />);
    expect(within(dialog()).getByRole("button", { name: "Close drawer", hidden: true })).toHaveAttribute("tabindex", "-1");
  });

  it("highlights the technologies in the accent color", () => {
    render(<DrawerButton />);
    const highlighted = [...dialog().querySelectorAll(".accent")].map((n) => n.textContent);
    expect(highlighted).toEqual(
      expect.arrayContaining(["Next.js", "TypeScript", "Docker", "SQLite", "Cloudflare Tunnel", "Lighthouse", "Umami"]),
    );
  });

  it("lists every how-it's-done row", () => {
    render(<DrawerButton />);
    for (const key of ["FRAMEWORK", "MOTION", "DATA", "LIVE", "HOSTING", "SPEED", "ANALYTICS"]) {
      expect(within(dialog()).getByText(key)).toBeInTheDocument();
    }
  });
});
