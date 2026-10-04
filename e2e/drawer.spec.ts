import { expect, test } from "@playwright/test";

test.describe("how it's done drawer", () => {
  test("opens, shows the stack, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "How this page is built" });
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "{ how it's done }" }).first().click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Umami");
    await expect(dialog).toContainText("Lighthouse");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("closes from the close button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "{ how it's done }" }).first().click();
    await page.getByRole("button", { name: "Close drawer" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
