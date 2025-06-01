import { expect, test } from '@playwright/test';

test('login page has expected heading', async ({ page }) => {
	// The home page redirects to login, so we go there directly
	await page.goto('/auth/login');
	
	// Wait for the page to load
	await page.waitForLoadState('networkidle');
	
	// Check for the heading with specific text
	await expect(page.getByRole('heading', { name: /sign in|login/i })).toBeVisible();
	
	// Check for login form
	await expect(page.locator('form')).toBeVisible();
});
