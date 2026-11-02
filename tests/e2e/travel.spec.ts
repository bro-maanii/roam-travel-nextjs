import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";

const start = new Date();
start.setDate(start.getDate() + 14);
const end = new Date(start);
end.setDate(end.getDate() + 4);
const dateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Essential only", exact: true })
    .click();
});

test("all four services return relevant mock quotes and enquiries", async ({
  page,
}) => {
  await page
    .getByRole("textbox", { name: "Departure date", exact: true })
    .fill(dateString(start));
  await page
    .getByRole("button", { name: "Let’s explore", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Flights for your next adventure" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Karachi → Bali" }),
  ).toHaveCount(2);

  await page.getByRole("tab", { name: "Hotels", exact: true }).click();
  await page
    .getByLabel("Check-in date", { exact: true })
    .fill(dateString(start));
  await page
    .getByLabel("Check-out date", { exact: true })
    .fill(dateString(end));
  await page
    .getByRole("button", { name: "Let’s explore", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The Hideaway, Bali" }),
  ).toBeVisible();
  await expect(page.locator(".result-card").first()).toContainText("$476");

  await page.getByRole("tab", { name: "Visa", exact: true }).click();
  await page
    .getByRole("button", { name: "Let’s explore", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Indonesia tourist visa assistance" }),
  ).toBeVisible();
  await expect(page.locator(".result-card")).toContainText("$178");

  await page.getByRole("tab", { name: "Car rental", exact: true }).click();
  await page
    .getByRole("button", { name: "Let’s explore", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Compact explorer" }),
  ).toBeVisible();
  await expect(page.locator(".result-card").first()).toContainText("$156");
  await page
    .getByRole("button", { name: "Enquire", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("textbox", { name: "What does your dream trip look like?" }),
  ).toHaveValue(/Car rental: Compact explorer/);
});

test("destination filters, saved state, modal and enquiry flow work", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Europe", exact: true }).click();
  await expect(page.locator(".destination-card")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "Santorini", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Save Santorini", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Unsave Santorini" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Santorini", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Santorini", exact: true }).click();
  await page.getByRole("button", { name: "Make it my next chapter" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "What does your dream trip look like?" }),
  ).toHaveValue(/Santorini escape/);
});

test("contact form validates fields and redirects only after a successful send", async ({
  page,
}) => {
  const submit = page.getByRole("button", {
    name: "Let’s start something good",
  });
  await submit.click();
  await expect(page.locator("#name-error")).toBeVisible();
  await page.getByRole("textbox", { name: /Your name/ }).fill("Alex Morgan");
  await page
    .getByRole("textbox", { name: /Email address/ })
    .fill("alex@example.com");
  await page
    .getByRole("textbox", { name: /What does your dream trip look like/ })
    .fill("A relaxing week in Bali for two people.");
  let release!: () => void;
  const sent = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    await sent;
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await submit.click();
  await expect(
    page.getByRole("button", { name: "Sending your enquiry…" }),
  ).toBeDisabled();
  release();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.locator("h1")).toContainText("Good things start");
});

test("mobile navigation, keyboard tabs and responsive layouts", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Our services" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "Flights", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Hotels", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "Hotels", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});

test("page loads cleanly and captures desktop and mobile previews", async ({
  page,
}) => {
  mkdirSync("test-results/previews", { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.reload();
  await page
    .locator(".hero-image")
    .evaluate((image: HTMLImageElement) => image.decode());
  await page.screenshot({ path: "test-results/previews/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/previews/mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("page has no serious accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        message: node.failureSummary,
      })),
    })),
  ).toEqual([]);
});

test("GSAP reveals, counters and hover effects work with motion enabled", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  await page.locator(".stats-section").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-count="40"]')).toHaveText("40");
  const card = page.locator(".destination-card").first();
  await card.hover();
  await expect(card).not.toHaveCSS("transform", "none");
  await expect(card.locator("img")).not.toHaveCSS("transform", "none");
});
