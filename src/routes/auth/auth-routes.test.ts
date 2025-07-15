import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies first - must be hoisted
vi.mock('$lib/server/db', () => {
  // Create mock functions inside the mock factory
  const mockWhere = vi.fn().mockResolvedValue([]);
  const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
  const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
  const mockValues = vi.fn().mockResolvedValue({});
  const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
  const mockDelete = vi.fn().mockReturnValue({ where: mockWhere });
  const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
  const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
  
  return {
    db: {
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
      update: mockUpdate
    }
  };
});

vi.mock('$lib/server/auth', () => ({
  generateSessionToken: vi.fn().mockReturnValue('mock-session-token'),
  createSession: vi.fn().mockResolvedValue({ id: 'session-id', userId: 'user-id', expiresAt: new Date() }),
  setSessionTokenCookie: vi.fn(),
  deleteSessionTokenCookie: vi.fn(),
  invalidateSession: vi.fn(),
  validatePasswordResetToken: vi.fn().mockResolvedValue({ id: 'token-id', userId: 'user-id', expiresAt: new Date() }),
  deleteUserPasswordResetTokens: vi.fn().mockResolvedValue(undefined),
  createPasswordResetToken: vi.fn().mockResolvedValue('mock-reset-token'),
  deletePasswordResetToken: vi.fn().mockResolvedValue(undefined),
  invalidateUserSessions: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('$lib/server/email', () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('@node-rs/argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  verify: vi.fn().mockResolvedValue(true)
}));

// Import the modules after mocking
import { load as loginLoad, actions as loginActions } from './login/+page.server';
import { load as registerLoad, actions as registerActions } from './register/+page.server';
import { load as forgotPasswordLoad, actions as forgotPasswordActions } from './forgot-password/+page.server';
import { load as resetPasswordLoad, actions as resetPasswordActions } from './reset-password/+page.server';
import * as auth from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';

// Helper to create mock redirect response
function createRedirectResponse(code: number, location: string) {
  return { status: code, location };
}

// Helper to create mock form failure response  
function createFailResponse(code: number, data: any) {
  return { status: code, data };
}

// Helper to create mock request event
function createMockEvent(options: any = {}) {
  return {
    locals: {
      user: options.user || null,
      session: options.session || null
    },
    cookies: {
      set: vi.fn(),
      get: vi.fn(),
      delete: vi.fn()
    },
    request: {
      formData: vi.fn().mockResolvedValue(
        new Map(Object.entries(options.formData || {}))
      )
    },
    url: options.url || new URL('http://localhost')
  };
}

describe('Authentication Routes', () => {
  let mockEvent: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Route', () => {
    it('should redirect logged in users to dashboard', async () => {
      const mockEvent = createMockEvent({ 
        user: { id: 'user-id', email: 'user@example.com' }
      });
      
      const result = await loginLoad(mockEvent as any);
      expect(result.status).toBe(302);
    });

    it('should return empty object for anonymous users', async () => {
      const mockEvent = createMockEvent();
      
      const result = await loginLoad(mockEvent as any);
      expect(result).toEqual({});
    });

    it('should validate email and password', async () => {
      const mockEvent = createMockEvent({
        formData: { email: '', password: '' }
      });
      
      const result = await loginActions.default(mockEvent as any);
      expect(result).toHaveProperty('status', 400);
      expect(result).toHaveProperty('data');
    });

    it('should handle non-existent user', async () => {
      const mockEvent = createMockEvent({
        formData: { email: 'nonexistent@example.com', password: 'Password123' }
      });
      
      // Mock db.select to return empty array (no user found)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([])
        })
      } as any);
      
      const result = await loginActions.default(mockEvent as any);
      expect(result).toHaveProperty('status', 400);
      expect(result).toHaveProperty('data');
    });

    it('should handle incorrect password', async () => {
      const mockEvent = createMockEvent({
        formData: { email: 'user@example.com', password: 'wrongpassword' }
      });
      
      // Mock database to return a user
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ 
            id: 'user-id', 
            email: 'user@example.com', 
            passwordHash: 'hashed-password' 
          }])
        })
      } as any);
      
      // Mock password verification to fail
      vi.mocked(verify).mockResolvedValueOnce(false);
      
      const result = await loginActions.default(mockEvent as any);
      expect(result).toHaveProperty('status', 400);
      expect(result).toHaveProperty('data');
    });

    it('should create session and redirect on successful login', async () => {
      const mockEvent = createMockEvent({
        formData: { email: 'user@example.com', password: 'password' }
      });
      
      // Mock database to return a user
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ 
            id: 'user-id', 
            email: 'user@example.com', 
            passwordHash: 'hashed-password' 
          }])
        })
      } as any);
      
      // Mock password verification to succeed
      vi.mocked(verify).mockResolvedValueOnce(true);
      
      const result = await loginActions.default(mockEvent as any);
      expect(result).toHaveProperty('status', 302);
    });
  });

  describe('Register Route', () => {
    it('should redirect logged in users to dashboard', async () => {
      const mockEvent = createMockEvent({ 
        user: { id: 'user-id', email: 'user@example.com' }
      });
      
      const result = await registerLoad(mockEvent as any);
      expect(result.status).toBe(302);
    });

    it('should validate registration inputs', async () => {
      const mockEvent = createMockEvent({
        formData: { email: '', password: '', passwordConfirm: '' }
      });
      
      const result = await registerActions.default(mockEvent as any);
      expect(result).toHaveProperty('status', 400);
      expect(result).toHaveProperty('data');
    });
  });

  describe('Forgot Password Route', () => {
    it('should process forgot password requests', async () => {
      const mockEvent = createMockEvent({
        formData: { email: 'user@example.com' }
      });
      
      // Mock database to return a user
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ 
            id: 'user-id', 
            email: 'user@example.com'
          }])
        })
      } as any);
      
      const result = await forgotPasswordActions.default(mockEvent as any);
      
      // Should indicate success even if user doesn't exist (security best practice)
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('Reset Password Route', () => {
    it('should validate reset token', async () => {
      const mockEvent = createMockEvent({ 
        url: new URL('http://localhost/auth/reset-password?token=invalid-token')
      });
      
      // Mock invalid token
      vi.mocked(auth.validatePasswordResetToken).mockResolvedValueOnce(null);
      
      const result = await resetPasswordLoad(mockEvent as any);
      expect(result.status).toBe(302);
    });

    it('should process password reset', async () => {
      const mockEvent = createMockEvent({
        formData: { password: 'NewPassword123', passwordConfirm: 'NewPassword123', token: 'valid-token' }
      });
      
      const result = await resetPasswordActions.default(mockEvent as any);
      
      // Should redirect to login page after reset
      expect(result).toHaveProperty('location', '/auth/login');
    });
  });
});
