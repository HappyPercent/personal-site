import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { joke } from "@/content/jokes";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("tells the joke as the page heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1, name: joke("404") })).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: "Back to the CV" })).toHaveAttribute("href", "/");
  });
});
