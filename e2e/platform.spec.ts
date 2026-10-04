import { expect, test } from "@playwright/test";

test.describe("platform", () => {
  test("sends security headers and hides the framework", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("redirects plain http behind the proxy to the https site", async ({ request }) => {
    const res = await request.get("/", {
      headers: { "x-forwarded-proto": "http" },
      maxRedirects: 0,
    });
    expect(res.status()).toBe(308);
    expect(new URL(res.headers()["location"]).href).toBe("https://andrey.erofteev.com/");
  });

  test("publishes a share-preview image that the page points to", async ({ page, request }) => {
    await page.goto("/");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toContain("/opengraph-image");
    const res = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });

  test("loads the analytics script only from the stats host", async ({ page }) => {
    await page.goto("/");
    const sources = await page.locator("script[src]").evaluateAll((els) => els.map((el) => el.getAttribute("src") ?? ""));
    const external = sources.filter((s) => s.startsWith("http"));
    for (const src of external) expect(new URL(src).host).toBe("stats.erofteev.com");
  });
});
