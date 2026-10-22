import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DrawerButton } from "./Drawer";

const dialog = () => screen.getByRole("dialog", { hidden: true });
const pill = () => screen.getByRole("button", { name: "How it's built" });

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

  it("returns focus to the pill when it closes", async () => {
    render(<DrawerButton />);
    await userEvent.click(pill());
    await userEvent.keyboard("{Escape}");
    expect(pill()).toHaveFocus();
  });

  it("makes the rest of the page inert while open", async () => {
    render(<DrawerButton />);
    expect(dialog().parentElement).toHaveAttribute("inert");
    await userEvent.click(pill());
    expect(dialog().parentElement).not.toHaveAttribute("inert");
    const page = pill().closest("body > div") as HTMLElement;
    expect(page.inert).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(page.inert).toBe(false);
  });

  it("links to the source code", () => {
    render(<DrawerButton />);
    expect(within(dialog()).getByRole("link", { name: /source on GitHub/, hidden: true })).toHaveAttribute(
      "href",
      "https://github.com/HappyPercent/personal-site",
    );
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

  it("calls out the technologies in bold, not the link colour", () => {
    render(<DrawerButton />);
    const highlighted = [...dialog().querySelectorAll("strong")].map((n) => n.textContent);
    expect(highlighted).toEqual(
      expect.arrayContaining(["Next.js", "TypeScript", "Docker", "SQLite", "Cloudflare Tunnel", "Lighthouse", "Umami", "Vitest", "Testing Library", "Playwright", "axe-core", "GitHub Actions"]),
    );
    expect(dialog().querySelector(".accent")).toBeNull();
  });

  it("lists every how-it's-done row", () => {
    render(<DrawerButton />);
    for (const key of ["FRAMEWORK", "MOTION", "DATA", "LIVE", "HOSTING", "TESTING", "SPEED", "ANALYTICS"]) {
      expect(within(dialog()).getByText(key)).toBeInTheDocument();
    }
  });
});
