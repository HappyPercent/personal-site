import { expect, test } from "@playwright/test";

test.describe("easter eggs", () => {
  test("poking the avatar five times finds an egg and remembers it", async ({ page }) => {
    await page.goto("/");
    const counter = page.getByTitle("Hidden easter eggs found");
    await expect(counter).toContainText("0/5");

    const face = page.getByRole("button", { name: "Poke the avatar" });
    for (let i = 0; i < 5; i++) await face.click();

    await expect(page.getByRole("status")).toContainText("Avatar whisperer");
    await expect(counter).toContainText("1/5");

    await page.reload();
    await expect(page.getByTitle("Hidden easter eggs found")).toContainText("1/5");
  });

  test("the bug runs away twice, is smashed on the third try and disappears", async ({ page, isMobile }) => {
    test.skip(isMobile, "the decorative bug is hidden on small screens");
    await page.goto("/");
    const counter = page.getByTitle("Hidden easter eggs found");
    const bug = page.getByRole("button", { name: "A bug. Try to catch it." });
    // The bug detaches itself once smashed, so move the mouse by hand instead of using hover(), which retries on detach.
    const approach = async () => {
      await bug.scrollIntoViewIfNeeded();
      const box = await bug.boundingBox();
      if (!box) throw new Error("bug has no box");
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    };

    for (let i = 0; i < 2; i++) {
      await approach();
      await expect(bug).toHaveAttribute("data-running", "true");
      await expect(bug).toHaveAttribute("data-running", "false");
      await expect(counter).toContainText("0/5");
      await page.mouse.move(0, 0);
    }
    await approach();

    await expect(page.getByRole("status")).toContainText("You fixed a bug!");
    await expect(counter).toContainText("1/5");
    await expect(page.getByRole("button", { name: /bug/i })).toHaveCount(0);
  });

  test("visiting the 404 page counts as an egg", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("status")).toContainText("You made it this far, I am impressed");

    await page.getByRole("link", { name: "Back to the CV" }).click();
    await expect(page.getByTitle("Hidden easter eggs found")).toContainText("1/5");
  });
});
