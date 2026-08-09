import { expect, test } from "@playwright/test";

test("welcome hero is visually stable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".welcome-background")).toHaveScreenshot("welcome-hero.png");
});

test("mobile navigation exposes the full wordmark in its drawer", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "chromium" || testInfo.project.name === "tablet", "Drawer visual is mobile-only.");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.locator(".app-nav-drawer")).toHaveScreenshot("mobile-nav-drawer.png");
});
