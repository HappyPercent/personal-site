import { expect, test } from "@playwright/test";

const panelOrder = ["hero", "numbers", "proof", "netchex", "stenn", "aori", "before", "tools", "contact"];

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

  test("tells the Stenn story on one screen, manager first, promoted from frontend", async ({ page }) => {
    const stenn = page.locator("#stenn");
    await expect(stenn.getByRole("heading", { level: 2 })).toHaveText("Engineering Manager");
    await expect(stenn.getByRole("heading", { level: 3 })).toHaveText("Senior Frontend Developer");
    await expect(stenn).toContainText("Promoted from");
    await expect(page.locator("#stenn-lead")).toHaveCount(0);
  });

  test("puts the proof of craft in the main flow", async ({ page }) => {
    const proof = page.locator("#proof");
    await expect(proof.getByRole("heading", { level: 2 })).toHaveText("This site is my code sample.");
    await expect(proof.getByRole("link", { name: /source on GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/HappyPercent/personal-site",
    );
  });

  test("puts each pre-code role on its own line", async ({ page }) => {
    const lines = page.locator("#before ul > li");
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
