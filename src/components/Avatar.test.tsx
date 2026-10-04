import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";
import { EggCounter, EggsProvider } from "./Eggs";

function setup() {
  render(
    <EggsProvider>
      <EggCounter />
      <Avatar />
    </EggsProvider>,
  );
  return screen.getByRole("button", { name: "Poke the avatar" });
}

describe("Avatar", () => {
  it("renders an accessible portrait", () => {
    setup();
    expect(screen.getByRole("img", { name: "Cartoon portrait of Andrey" })).toBeInTheDocument();
  });

  it("does not reward fewer than five pokes", async () => {
    const face = setup();
    for (let i = 0; i < 4; i++) await userEvent.click(face);
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("0/5");
  });

  it("rewards the fifth poke exactly once", async () => {
    const face = setup();
    for (let i = 0; i < 12; i++) await userEvent.click(face);
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("1/5");
    expect(JSON.parse(localStorage.getItem("eggs-found") ?? "[]")).toEqual(["avatar"]);
  });

  it("changes the mouth with each poke", async () => {
    const face = setup();
    const mouth = () => document.querySelector("svg path[stroke='#A55F49']")?.getAttribute("d");
    const first = mouth();
    await userEvent.click(face);
    expect(mouth()).not.toBe(first);
  });
});
