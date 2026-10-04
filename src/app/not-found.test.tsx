import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { joke } from "@/content/jokes";
import { EggCounter, EggsProvider } from "@/components/Eggs";
import NotFound from "./not-found";

const renderPage = () =>
  render(
    <EggsProvider>
      <EggCounter />
      <NotFound />
    </EggsProvider>,
  );

describe("NotFound", () => {
  it("tells the joke as the page heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: joke("404") })).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    renderPage();
    expect(screen.getByRole("link", { name: "Back to the CV" })).toHaveAttribute("href", "/");
  });

  it("counts as an easter egg and says so", () => {
    renderPage();
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("1/5");
    expect(screen.getByRole("status")).toHaveTextContent("You made it this far, I am impressed");
  });

  it("remembers the egg for the next visit", () => {
    renderPage();
    expect(JSON.parse(localStorage.getItem("eggs-found") ?? "[]")).toEqual(["lost"]);
  });
});
