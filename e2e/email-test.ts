import { test, expect } from '@playwright/test';
import { generateTestEmail } from './test-utils';

test('Environment variable email domain is used', async ({ page }) => {
  console.log('FROM_EMAIL from env:', process.env.FROM_EMAIL);
  
  const testEmail = generateTestEmail('test');
  console.log('Generated test email:', testEmail);
  
  // If FROM_EMAIL is properly loaded from .env, we expect the domain to match
  if (process.env.FROM_EMAIL) {
    const envDomain = process.env.FROM_EMAIL.split('@')[1];
    const generatedDomain = testEmail.split('@')[1];
    
    expect(generatedDomain).toBe(envDomain);
    console.log(`Success: Using domain from FROM_EMAIL: ${envDomain}`);
  } else {
    // If FROM_EMAIL is not available, we expect the fallback domain
    expect(testEmail).toContain('@example.test');
    console.log('Using fallback domain: example.test');
  }
});
