import { test } from "@playwright/test";

test("examine console logs", async ({ page }) => {
  // Listen for console messages
  page.on("console", (msg) => {
    console.log(`CONSOLE LOG: [${msg.type()}] ${msg.text()}`);
  });
  
  // Listen for page errors
  page.on("pageerror", (error) => {
    console.error(`PAGE ERROR: ${error.message}`);
  });
  
  // Navigate to the register page
  await page.goto("/auth/register");
  
  // Wait for potential errors
  await page.waitForTimeout(5000);
});
