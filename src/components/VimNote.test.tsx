import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { joke } from "@/content/jokes";
import { EggCounter, EggsProvider } from "./Eggs";
import { VimNote } from "./VimNote";

function setup() {
  render(
    <EggsProvider>
      <EggCounter />
      <VimNote />
    </EggsProvider>,
  );
  return screen.getByRole("button", { name: `// ${joke("vim")}` });
}

describe("VimNote", () => {
  it("shows the vim joke as a footnote", () => {
    expect(setup()).toBeInTheDocument();
  });

  it("needs two clicks to count as escaping Vim", async () => {
    const note = setup();
    await userEvent.click(note);
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("0/4");
    await userEvent.click(note);
    expect(screen.getByTitle("Hidden easter eggs found")).toHaveTextContent("1/4");
    expect(screen.getByRole("status")).toHaveTextContent("Escaped Vim");
  });
});
