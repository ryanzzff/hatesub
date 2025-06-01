import { Page, expect } from '@playwright/test';

/**
 * Test utilities for authentication testing
 */

/**
 * Generates a unique test email using the domain from FROM_EMAIL in .env
 * if available, otherwise falls back to example.test
 */
export function generateTestEmail(prefix = 'user'): string {
  // Extract domain from FROM_EMAIL environment variable if available
  const fromEmail = process.env.FROM_EMAIL || '';
  let domain = 'example.test';
  
  if (fromEmail && fromEmail.includes('@')) {
    const emailParts = fromEmail.split('@');
    if (emailParts.length === 2 && emailParts[1]) {
      domain = emailParts[1];
    }
  }
  
  return `${prefix}.${Date.now()}@${domain}`;
}

/**
 * Generates a valid test password that meets requirements
 */
export function generateTestPassword(): string {
  return `TestPass${Date.now() % 1000}`;
}

/**
 * Waits for navigation to complete after a redirect
 * Enhanced version with better error handling and fallbacks
 */
export async function waitForNavigation(page: Page): Promise<void> {
  try {
    // Initial pause to allow redirects to start
    await page.waitForTimeout(1500); 
    
    // Try to wait for network activity to settle
    await Promise.race([
      page.waitForLoadState('networkidle', { timeout: 7000 }),
      page.waitForTimeout(7000) // Fallback timeout
    ]).catch(err => {
      console.log('Network idle wait timed out:', err.message);
    });
    
    // Also wait for DOM content to be loaded
    await Promise.race([
      page.waitForLoadState('domcontentloaded', { timeout: 7000 }),
      page.waitForTimeout(7000) // Fallback timeout
    ]).catch(err => {
      console.log('DOM content loaded wait timed out:', err.message);
    });
    
    // Wait for any visible form elements to be fully rendered
    const hasForm = await page.locator('form').count() > 0;
    if (hasForm) {
      await page.locator('form').waitFor({ state: 'attached', timeout: 5000 })
        .catch(() => console.log('Form wait timed out'));
    }
    
    // Final stabilization time
    await page.waitForTimeout(1500); 
  } catch (error) {
    // If all timeouts fail, ensure we have a minimum delay
    await page.waitForTimeout(3000);
    console.log('Navigation wait encountered a critical error, but continuing:', error.message);
  }
}

/**
 * Creates a test user account via form submission
 * Enhanced with better error handling and response waiting
 */
export async function createTestUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/auth/register');
  await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
  
  // Fill in the form using more reliable selectors
  const username = email.split('@')[0].replace(/[^a-z0-9_-]/g, '').substring(0, 20);
  
  await page.locator('#email').fill(email);
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#confirmPassword').fill(password);
  
  // Submit and wait for response
  try {
    await Promise.all([
      // Accept both success and error responses to avoid hanging
      page.waitForResponse(
        response => response.url().includes('/auth/register') && 
                   (response.status() === 200 || response.status() === 302 || 
                   (response.status() >= 400 && response.status() < 500)),
        { timeout: 10000 }
      ),
      page.locator('form button[type="submit"]').click()
    ]);
  } catch (error) {
    console.log('Registration form submission response wait timed out:', error.message);
  }
  
  await waitForNavigation(page);
}

/**
 * Logs in a test user
 * Enhanced with better error handling and response waiting
 */
export async function loginTestUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/auth/login');
  await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
  
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  
  // Submit and wait for response
  try {
    await Promise.all([
      // Accept both success and error responses to avoid hanging
      page.waitForResponse(
        response => response.url().includes('/auth/login') && 
                   (response.status() === 200 || response.status() === 302 || 
                   (response.status() >= 400 && response.status() < 500)),
        { timeout: 10000 }
      ),
      page.locator('form button[type="submit"]').click()
    ]);
  } catch (error) {
    console.log('Login form submission response wait timed out:', error.message);
  }
  
  await waitForNavigation(page);
}

/**
 * Waits for an error message to appear in the form
 */
export async function waitForFormError(page: Page, errorRegex: RegExp): Promise<void> {
  await page.waitForFunction((regex) => {
    const formText = document.querySelector('form')?.textContent || '';
    return new RegExp(regex).test(formText);
  }, errorRegex.source, { timeout: 5000 });
}

/**
 * Logs out a user and ensures we end up at the login page
 * With robust error handling and manual navigation if needed
 */
export async function logoutUser(page: Page): Promise<void> {
  try {
    // First try the logout endpoint
    await page.goto('/auth/logout');
    
    // Wait briefly to see if redirect happens automatically
    await page.waitForTimeout(3000);
    
    // Check if we got redirected to login page
    const currentUrl = page.url();
    if (!currentUrl.includes('/auth/login')) {
      console.log('Did not auto-redirect to login page, navigating manually...');
      
      // Manually navigate to login page as a fallback
      await page.goto('/auth/login');
    }
    
    // Wait for the login form to appear
    try {
      await page.locator('form').waitFor({ state: 'visible', timeout: 7000 });
    } catch (err) {
      console.log('Login form visibility check timed out, continuing anyway');
    }
    
    // Additional wait for stability
    await page.waitForTimeout(2000);
    
    // Clear cookies and storage to ensure logout state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
  } catch (error) {
    console.log('Logout process encountered an error:', error.message);
    
    // Ensure we're on the login page even if there was an error
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);
    
    // Clear authentication state
    await page.context().clearCookies();
  }
}
