import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  generateSessionToken, 
  createSession,
  validateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  sessionCookieName
} from '$lib/server/auth';
import { db } from '$lib/server/db';

// Mock the database
vi.mock('$lib/server/db', () => {
  return {
    db: {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockResolvedValue({}),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    }
  };
});

describe('Authentication Core', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('generateSessionToken', () => {
    it('should generate a token string', () => {
      const token = generateSessionToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
    
    it('should generate different tokens each time', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('createSession', () => {
    it('should call database to insert a new session', async () => {
      const token = 'test-token';
      const userId = 'test-user-id';
      
      await createSession(token, userId);
      
      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        expiresAt: expect.any(Date)
      }));
    });
    
    it('should return a session object', async () => {
      const token = 'test-token';
      const userId = 'test-user-id';
      
      const session = await createSession(token, userId);
      
      expect(session).toEqual(expect.objectContaining({
        id: expect.any(String),
        userId,
        expiresAt: expect.any(Date)
      }));
    });
  });

  describe('validateSessionToken', () => {
    it('should return null user and session for invalid token', async () => {
      // Mock the DB to return no result
      vi.mocked(db.where).mockResolvedValue([]);
      
      const result = await validateSessionToken('invalid-token');
      
      expect(result).toEqual({
        session: null,
        user: null
      });
    });
    
    it('should return user and session for valid token', async () => {
      // Mock session data
      const mockSessionData = {
        user: { id: 'user-id', username: 'testuser' },
        session: { 
          id: 'session-id',
          userId: 'user-id',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now
        }
      };
      
      vi.mocked(db.where).mockResolvedValue([mockSessionData]);
      
      const result = await validateSessionToken('valid-token');
      
      expect(result).toEqual({
        user: mockSessionData.user,
        session: mockSessionData.session
      });
    });
    
    it('should handle expired sessions', async () => {
      // Mock expired session data
      const mockExpiredSessionData = {
        user: { id: 'user-id', username: 'testuser' },
        session: { 
          id: 'session-id',
          userId: 'user-id',
          expiresAt: new Date(Date.now() - 1000) // 1 second ago (expired)
        }
      };
      
      vi.mocked(db.where).mockResolvedValue([mockExpiredSessionData]);
      
      const result = await validateSessionToken('expired-token');
      
      expect(result).toEqual({
        session: null,
        user: null
      });
      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe('invalidateSession', () => {
    it('should delete the session from DB', async () => {
      await invalidateSession('test-session-id');
      
      expect(db.delete).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
    });
  });

  describe('Cookie Management', () => {
    it('should set session cookie', () => {
      const mockEvent = {
        cookies: {
          set: vi.fn(),
          delete: vi.fn()
        }
      };
      
      const token = 'test-token';
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      
      setSessionTokenCookie(mockEvent as any, token, expiresAt);
      
      expect(mockEvent.cookies.set).toHaveBeenCalledWith(
        sessionCookieName,
        token,
        expect.objectContaining({
          expires: expiresAt,
          path: '/'
        })
      );
    });
    
    it('should delete session cookie', () => {
      const mockEvent = {
        cookies: {
          set: vi.fn(),
          delete: vi.fn()
        }
      };
      
      deleteSessionTokenCookie(mockEvent as any);
      
      expect(mockEvent.cookies.delete).toHaveBeenCalledWith(
        sessionCookieName,
        expect.objectContaining({
          path: '/'
        })
      );
    });
  });
});
