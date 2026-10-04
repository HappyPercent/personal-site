import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BugEgg, bugFlight } from "./BugEgg";
import { EggCounter, EggsProvider } from "./Eggs";

function setup() {
  render(
    <EggsProvider>
      <EggCounter />
      <BugEgg />
    </EggsProvider>,
  );
  return screen.getByRole("button", { name: "A bug. Try to catch it." });
}

async function approach(bug: HTMLElement) {
  await userEvent.hover(bug);
  await userEvent.unhover(bug);
}

const counter = () => screen.getByTitle("Hidden easter eggs found");

describe("BugEgg", () => {
  it("sits still until the cursor comes near", () => {
    const bug = setup();
    expect(bug).toHaveStyle({ transform: "translate(0px, 0px)" });
  });

  it("runs away to a new spot on each of the first two approaches", async () => {
    const bug = setup();
    for (const spot of bugFlight) {
      await approach(bug);
      expect(bug).toHaveStyle({ transform: `translate(${spot.x}px, ${spot.y}px)` });
    }
    expect(counter()).toHaveTextContent("0/5");
  });

  it("is smashed on the third approach and counts as an egg", async () => {
    const bug = setup();
    for (let i = 0; i < 3; i++) await approach(bug);
    expect(counter()).toHaveTextContent("1/5");
    expect(screen.getByRole("status")).toHaveTextContent("You fixed a bug!");
    expect(screen.getByRole("button", { name: "A squashed bug. You fixed it." })).toHaveAttribute("data-smashed", "true");
  });

  it("stays smashed and does not count twice", async () => {
    const bug = setup();
    for (let i = 0; i < 8; i++) await approach(bug);
    expect(counter()).toHaveTextContent("1/5");
    expect(JSON.parse(localStorage.getItem("eggs-found") ?? "[]")).toEqual(["bug"]);
  });

  it("disappears once the smash animation ends", async () => {
    const bug = setup();
    for (let i = 0; i < 3; i++) await approach(bug);
    const squashed = screen.getByRole("button", { name: "A squashed bug. You fixed it." });
    // jsdom has no CSS animation support, so React listens for the prefixed name
    fireEvent(squashed.querySelector("span span") as HTMLElement, new Event("webkitAnimationEnd", { bubbles: true }));
    expect(screen.queryByRole("button", { name: /bug/i })).not.toBeInTheDocument();
  });

  it("is not shown for a visitor who already fixed it", () => {
    localStorage.setItem("eggs-found", JSON.stringify(["bug"]));
    render(
      <EggsProvider>
        <BugEgg />
      </EggsProvider>,
    );
    expect(screen.queryByRole("button", { name: /bug/i })).not.toBeInTheDocument();
  });

  it("lets keyboard users chase it too", async () => {
    const bug = setup();
    bug.focus();
    for (let i = 0; i < 3; i++) await userEvent.keyboard("{Enter}");
    expect(counter()).toHaveTextContent("1/5");
  });
});
