import { expect, test } from "@playwright/test";

test.describe("the wall", () => {
  test("sticks a note and shows it on the wall", async ({ page }, info) => {
    // The server rate-limits per IP, so give each project its own.
    await page.context().setExtraHTTPHeaders({ "x-forwarded-for": `10.0.0.${info.project.name.length}` });
    await page.goto("/wall");
    await expect(page.getByText(/live · /)).toBeVisible();

    const text = `hello from ${info.project.name}`;
    await page.getByLabel("Leave a note").fill(text);
    await page.getByRole("button", { name: "Stick it" }).click();

    await expect(page.getByRole("listitem").filter({ hasText: text })).toHaveCount(1);
    await expect(page.getByLabel("Leave a note")).toHaveValue("");

    await page.reload();
    await expect(page.getByRole("listitem").filter({ hasText: text })).toHaveCount(1);
  });

  test("pushes a new note to another open tab", async ({ browser }, info) => {
    const a = await browser.newPage();
    const b = await browser.newPage({ extraHTTPHeaders: { "x-forwarded-for": `10.1.0.${info.project.name.length}` } });
    await a.goto("/wall");
    await b.goto("/wall");
    await expect(a.getByText(/live · /)).toBeVisible();

    const text = `live ${info.project.name}`;
    await b.getByLabel("Leave a note").fill(text);
    await b.getByRole("button", { name: "Stick it" }).click();
    await expect(a.getByRole("listitem").filter({ hasText: text })).toHaveCount(1);
    await a.close();
    await b.close();
  });

  test("rejects links", async ({ page }) => {
    await page.goto("/wall");
    await page.getByLabel("Leave a note").fill("buy at https://spam.example");
    await page.getByRole("button", { name: "Stick it" }).click();
    await expect(page.getByText(/No links/)).toContainText("No links");
  });

  test("is reachable from the home page header", async ({ page, isMobile }) => {
    test.skip(isMobile, "header links are hidden on small screens");
    await page.goto("/");
    await page.getByRole("link", { name: "The wall" }).click();
    await expect(page).toHaveURL(/\/wall$/);
  });
});
