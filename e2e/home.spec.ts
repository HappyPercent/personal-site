import { expect, test } from "@playwright/test";

const panelOrder = ["hero", "numbers", "netchex", "stenn-lead", "stenn", "aori", "before", "tools", "contact"];

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has a title and a single main landmark", async ({ page }) => {
    await expect(page).toHaveTitle(/Andrey Erofteev/);
    await expect(page.getByRole("main")).toHaveCount(1);
  });

  test("shows the headline", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Senior Frontend Engineer");
  });

  test("renders the sections in order, newest role first", async ({ page }) => {
    const ids = await page.locator("[data-panel]").evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(panelOrder);
  });

  test("splits Stenn into a management screen and a frontend screen", async ({ page }) => {
    await expect(page.locator("#stenn-lead")).toContainText("Engineering Manager");
    await expect(page.locator("#stenn")).toContainText("Senior Frontend Developer");
    await expect(page.locator("#stenn-lead")).not.toContainText("Senior Frontend Developer");
  });

  test("puts each pre-code role on its own line", async ({ page }) => {
    const lines = page.locator("#before h2 > span");
    await expect(lines).toHaveCount(3);
  });

  test("lists SQL in the backend skills", async ({ page }) => {
    await expect(page.locator("#tools")).toContainText("SQL");
  });

  test("exposes only the public contact channels", async ({ page }) => {
    await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute("href", "mailto:erofteev@gmail.com");
    await expect(page.locator('a[href*="linkedin.com"]').first()).toBeVisible();
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });

  test("serves the CV as a PDF", async ({ request }) => {
    const res = await request.get("/Andrey_Erofteev_CV.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
  });
});
