import { expect, test } from "@playwright/test";

test.describe("easter eggs", () => {
  test("poking the avatar five times finds an egg and remembers it", async ({ page }) => {
    await page.goto("/");
    const counter = page.getByTitle("Hidden easter eggs found");
    await expect(counter).toContainText("0/3");

    const face = page.getByRole("button", { name: "Poke the avatar" });
    for (let i = 0; i < 5; i++) await face.click();

    await expect(page.getByRole("status")).toContainText("Avatar whisperer");
    await expect(counter).toContainText("1/3");

    await page.reload();
    await expect(page.getByTitle("Hidden easter eggs found")).toContainText("1/3");
  });
});
