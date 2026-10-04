import { expect, test } from "@playwright/test";

test.describe("404 page", () => {
  test("returns a real 404 status", async ({ request }) => {
    const res = await request.get("/this-page-does-not-exist");
    expect(res.status()).toBe(404);
  });

  test("tells the code review joke and links home", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("404: this page didn't pass code review.");
    await page.getByRole("link", { name: "Back to the CV" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Senior Frontend Engineer");
  });
});
