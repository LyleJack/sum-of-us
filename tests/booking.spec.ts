import { expect, test } from "@playwright/test";

test("a class booking requires sign-in before Checkout can start", async ({ page }) => {
  await page.goto("/booking");

  await page.getByRole("group", { name: "Available class dates" }).getByRole("button").first().click();
  await page.getByRole("button", { name: "Continue to payment" }).click();

  await expect(page.getByRole("heading", { name: "Hello there 👀" })).toBeVisible();
});

test("monthly booking is presented as a hosted-checkout path, not a card form", async ({ page }) => {
  await page.goto("/booking");

  await page.getByRole("button", { name: "Pay Monthly" }).click();
  await expect(page.getByRole("button", { name: "Continue to payment" })).toBeEnabled();
  await expect(page.getByPlaceholder("Card number")).toHaveCount(0);
});
