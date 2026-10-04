import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EggCounter, EggsProvider, eggs, useEggs } from "./Eggs";

function Finder({ id }: { id: (typeof eggs)[number]["id"] }) {
  const { find } = useEggs();
  return (
    <button type="button" onClick={() => find(id)}>
      find {id}
    </button>
  );
}

function setup(id: (typeof eggs)[number]["id"] = "branch") {
  return render(
    <EggsProvider>
      <EggCounter />
      <Finder id={id} />
    </EggsProvider>,
  );
}

describe("Eggs", () => {
  it("starts at zero found", () => {
    setup();
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("0/5");
  });

  it("counts a found egg and announces it", async () => {
    setup("vim");
    await userEvent.click(screen.getByRole("button", { name: "find vim" }));
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("1/5");
    expect(screen.getByRole("status")).toHaveTextContent("Easter egg found: Escaped Vim (1/5)");
  });

  it("ignores a repeat find of the same egg", async () => {
    setup();
    const button = screen.getByRole("button", { name: "find branch" });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("1/5");
  });

  it("persists found eggs to localStorage", async () => {
    setup("avatar");
    await userEvent.click(screen.getByRole("button", { name: "find avatar" }));
    expect(JSON.parse(localStorage.getItem("eggs-found") ?? "[]")).toEqual(["avatar"]);
  });

  it("restores found eggs on the next visit", () => {
    localStorage.setItem("eggs-found", JSON.stringify(["branch", "vim"]));
    setup();
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("2/5");
  });

  it("survives corrupt or unknown stored data", () => {
    localStorage.setItem("eggs-found", "not json");
    setup();
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("0/5");
  });

  it("drops stored ids that are not real eggs", () => {
    localStorage.setItem("eggs-found", JSON.stringify(["branch", "ghost"]));
    setup();
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("1/5");
  });

  it("marks the counter done once every egg is found", () => {
    localStorage.setItem("eggs-found", JSON.stringify(eggs.map((e) => e.id)));
    setup();
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveAttribute("data-done", "true");
  });

  it("hides the toast after a few seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    setup();
    await userEvent.click(screen.getByRole("button", { name: "find branch" }));
    expect(screen.getByRole("status")).toHaveAttribute("data-show", "true");
    act(() => {
      vi.advanceTimersByTime(3600);
    });
    expect(screen.getByRole("status")).toHaveAttribute("data-show", "false");
  });

  it("throws when used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<EggCounter />)).toThrow("useEggs must be used inside EggsProvider");
    spy.mockRestore();
  });
});
