import { test, expect } from "@playwright/test";

test("can find register button with correct text", async ({ page }) => {
  // Navigate to register page
  await page.goto("/auth/register");
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Take a screenshot to see what's actually there
  await page.screenshot({ path: "register-page-debug.png" });
  
  // Log all button texts for debugging
  const buttons = await page.getByRole("button").all();
  console.log("FOUND BUTTONS:", buttons.length);
  
  for (const button of buttons) {
    const text = await button.textContent();
    console.log(`BUTTON TEXT: "${text}"`);
  }

  // Try to find the button with "Create account" text
  const createAccountButton = page.getByRole("button", { name: /Create account/i });
  expect(await createAccountButton.isVisible()).toBeTruthy();
});
