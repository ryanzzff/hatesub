# Authentication Testing Guide

This document provides instructions for testing the HateSub authentication system (S8).

## Test Coverage

We have created several test files to validate the authentication system:

1. **Basic Authentication Tests** (`e2e/auth-minimal.test.ts`):
   - Simple UI presence tests for authentication pages
   - Validates redirects work correctly
   - Tests utility functions

2. **Authentication System Tests** (`e2e/auth.test.ts`):
   - More comprehensive end-to-end tests
   - Tests form validation and error messages
   - Tests user registration, login, and session management

3. **Demo Test** (`e2e/demo.test.ts`):
   - Simple sanity check for login page

## Running Tests

To run the authentication tests:

```bash
# Run all tests
npm run test:e2e

# Or run specific test files
npx playwright test

# To view test results
npx playwright show-report
```

## Common Test Issues

1. **Element Selection**: 
   - When selecting password fields, use exact selectors to avoid ambiguity
   - For example, use `page.getByLabel('Password', { exact: true })` or `page.locator('#password')`

2. **Button Selection**:
   - Use the filter method to find buttons by text: 
   - `page.getByRole('button').filter({ hasText: /login|sign in/i })`

3. **Form Validation**:
   - Rather than looking for specific error messages, use more generic patterns:
   - `await expect(page.locator('form')).toContainText(/valid email|required/i);`

4. **Navigation/Redirects**:
   - Use assertions with a timeout or check the URL pattern:
   - `await expect(async () => { expect(page.url()).toContain('/auth/login'); }).toPass();`

## Test Maintenance

When modifying the authentication UI, make sure to update tests to reflect any changes in:

1. Form field IDs and labels
2. Button text
3. Error message wording
4. Navigation paths

## Notes

The S8 authentication system implements:
- Email-based registration with verification
- Secure password handling with Argon2
- Session management with secure cookies
- Password reset functionality

Tests validate that these core features work as expected and provide appropriate feedback to users.
