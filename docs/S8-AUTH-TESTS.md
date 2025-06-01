# S8 Authentication System Test Cases

This directory contains comprehensive test cases for the HateSub authentication system (S8 task). These tests cover all aspects of the authentication flow, from user registration to login, session management, and password reset functionality.

## Test Structure

The test suite is organized into three main categories:

### 1. End-to-End Tests (`e2e/auth.test.ts`)

These Playwright-based tests simulate actual user interactions with the authentication system through a browser. They cover:

- User registration flow
- Login validation
- Session persistence
- Logout functionality
- Password reset workflow
- Redirection behavior for authenticated/unauthenticated users
- Form validation on all auth pages

### 2. Authentication Utilities Tests (`src/lib/server/auth-utils.test.ts`)

These unit tests verify the core validation and utility functions used by the authentication system:

- Email validation and normalization
- Password validation against security requirements
- Username validation
- User ID generation and uniqueness

### 3. Core Authentication Tests (`src/lib/server/auth.test.ts`)

These tests focus on the underlying authentication mechanisms:

- Session token generation
- Session creation and storage
- Token validation and session renewal
- Cookie management
- Session invalidation (logout)

### 4. Route Handler Tests (`src/routes/auth/auth-routes.test.ts`)

These integration tests verify the server-side logic in authentication route handlers:

- Form submission processing
- Input validation
- Error handling
- Successful authentication flows
- Redirection logic

## Running the Tests

### Unit and Integration Tests

```bash
npm test
```

This runs all Vitest tests, including authentication utilities, core auth functions, and route handlers.

### End-to-End Tests

```bash
npm run test:e2e
```

This runs the Playwright end-to-end tests which simulate real user interactions with the auth system.

## Test Coverage

These tests provide comprehensive coverage of the authentication system, including:

- ✅ Input validation
- ✅ Error handling
- ✅ Security measures (password requirements, token generation)
- ✅ User experience flows
- ✅ Edge cases (expired sessions, invalid tokens)
- ✅ Session management

## Future Test Enhancements

As the application evolves, consider adding:

1. More specific tests for email verification flow
2. Load testing for authentication endpoints
3. Security penetration tests
4. Tests for multi-device login scenarios
5. Tests for account lockout after failed attempts
