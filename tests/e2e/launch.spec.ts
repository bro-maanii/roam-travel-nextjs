import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("unique page metadata, canonicals, structured data and crawl files", async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  for (const path of ["/", "/privacy", "/terms", "/thank-you"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    titles.add(await page.title());
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{50,}/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://roam-travel-nextjs.vercel.app${path === "/" ? "" : path}`,
    );
    await expect(
      page.locator('meta[property="og:image"]').first(),
    ).toHaveAttribute("content", /opengraph-image/);
  }
  expect(titles.size).toBe(4);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(
    "Sitemap: https://roam-travel-nextjs.vercel.app/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/privacy");
  expect(await sitemap.text()).not.toContain("/thank-you");
  await page.goto("/");
  const schema = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const graph = JSON.parse(schema!)["@graph"];
  expect(
    graph.some((entry: { "@type": string }) => entry["@type"] === "FAQPage"),
  ).toBe(true);
  expect(schema).toContain("emanaliabbasi99@gmail.com");
  for (const file of [
    "/opengraph-image",
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/manifest.webmanifest",
  ]) {
    const response = await request.get(file);
    expect(response.status(), file).toBe(200);
    expect((await response.body()).length).toBeGreaterThan(50);
  }
});

test("custom 404 offers working recovery navigation", async ({ page }) => {
  const response = await page.goto("/a-trip-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /Even good trips/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Find your way home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("analytics stays off until consent and preferences can be changed", async ({
  page,
}) => {
  await page.route("**/_vercel/insights/script.js", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "/* analytics test */",
    }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("complementary", { name: "Privacy preferences" }),
  ).toBeVisible();
  await expect(page.locator('script[src*="/insights/script.js"]')).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Essential only", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("complementary", { name: "Privacy preferences" }),
  ).toHaveCount(0);
  await expect(page.locator('script[src*="/insights/script.js"]')).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accept analytics", exact: true })
    .click();
  await expect(page.locator('script[src*="/insights/script.js"]')).toHaveCount(
    1,
  );
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Essential only", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("roam-privacy-v1")!).choice,
    ),
  ).toBe("essential");
});

test("failed contact requests preserve the enquiry and show a useful error", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Essential only", exact: true })
    .click();
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      json: {
        error:
          "Email delivery is temporarily unavailable. Please email us directly.",
      },
    }),
  );
  await page
    .getByRole("textbox", { name: "Your name", exact: true })
    .fill("Alex Morgan");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("alex@example.com");
  await page
    .getByRole("textbox", { name: /What does your dream trip/ })
    .fill("A quiet trip to Bali for two people.");
  await page
    .getByRole("button", { name: "Let’s start something good" })
    .click();
  await expect(page.locator("#contact").getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(
    page.getByRole("textbox", { name: /What does your dream trip/ }),
  ).toHaveValue("A quiet trip to Bali for two people.");
  await expect(page).not.toHaveURL(/thank-you/);
});

test("contact endpoint rejects forged origins and invalid fields without sending", async ({
  request,
  baseURL,
}) => {
  const forged = await request.post("/api/contact", {
    headers: { Origin: "https://unrelated.example" },
    data: {},
  });
  expect(forged.status()).toBe(403);
  const invalid = await request.post("/api/contact", {
    headers: { Origin: baseURL! },
    data: { name: " ", email: "invalid", service: "Unknown", message: "short" },
  });
  expect(invalid.status()).toBe(400);
  expect(Object.keys((await invalid.json()).errors)).toHaveLength(4);
});

test("mobile CTA, accessible consent and document pages have no overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Quick travel contact" }),
  ).toBeVisible();
  const checks = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    checks.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    })),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Essential only", exact: true })
    .click();
  for (const path of ["/privacy", "/terms", "/thank-you", "/missing-page"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map(({ target }) => target),
      })),
    ).toEqual([]);
  }
});
