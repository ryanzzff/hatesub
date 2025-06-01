import { test } from "@playwright/test";

test("capture screenshot", async ({ page }) => {
  await page.goto("/auth/register");
  await page.waitForTimeout(5000); // Wait for 5 seconds
  await page.screenshot({ path: "register-page.png" });
});
