import { test, expect } from "@playwright/test";

test("can find register button with correct text", async ({ page }) => {
  // Navigate to register page
  await page.goto("/auth/register");
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Wait for the form to be visible
  await page.waitForSelector('form', { state: 'visible' });
  
  // Take a screenshot for debugging if needed
  // await page.screenshot({ path: "register-page-debug.png" });
  
  // Log all button texts for debugging
  const buttons = await page.getByRole("button").all();
  console.log("FOUND BUTTONS:", buttons.length);
  
  for (const button of buttons) {
    const text = await button.textContent();
    console.log(`BUTTON TEXT: "${text}"`);
  }

  // Try to find the button with "Create account" text - wait for it to be visible
  const createAccountButton = page.getByRole("button", { name: /Create account/i });
  
  // Wait for the button to be visible instead of just checking if it exists
  await expect(createAccountButton).toBeVisible();
});
