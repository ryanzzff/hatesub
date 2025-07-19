import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername,
  normalizeEmail, 
  generateUserId
} from '$lib/server/auth-utils';

describe('Authentication Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user-name@domain.org')).toBe(true);
    });

    it('should reject incorrect emails', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('not-an-email')).toBe(false);
      expect(validateEmail('missing@tld')).toBe(false);
      expect(validateEmail('@nodomain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@domain@extra.com')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(123)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords meeting criteria', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('StrongP4ssword')).toBe(true);
      expect(validatePassword('C0mplexP@ssw0rd')).toBe(true);
    });

    it('should reject passwords not meeting criteria', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('onlylowercase')).toBe(false);
      expect(validatePassword('ONLYUPPERCASE')).toBe(false);
      expect(validatePassword('123456789')).toBe(false);
      expect(validatePassword('NoNumbers')).toBe(false);
      expect(validatePassword('nouppercase123')).toBe(false);
      expect(validatePassword('NOLOWERCASE123')).toBe(false);
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
      expect(validatePassword(123)).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate proper usernames', () => {
      expect(validateUsername('user')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('user-name')).toBe(true);
      expect(validateUsername('user_name')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(validateUsername('')).toBe(false);
      expect(validateUsername('ab')).toBe(false); // too short
      expect(validateUsername('a'.repeat(32))).toBe(false); // too long
      expect(validateUsername('User')).toBe(false); // uppercase
      expect(validateUsername('user@name')).toBe(false); // special char
      expect(validateUsername('user name')).toBe(false); // spaces
      expect(validateUsername(null)).toBe(false);
      expect(validateUsername(undefined)).toBe(false);
      expect(validateUsername(123)).toBe(false);
    });
  });

  describe('normalizeEmail', () => {
    it('should normalize emails correctly', () => {
      expect(normalizeEmail('User@Example.com')).toBe('user@example.com');
      expect(normalizeEmail('  user@domain.com  ')).toBe('user@domain.com');
      expect(normalizeEmail('USER@DOMAIN.COM')).toBe('user@domain.com');
      expect(normalizeEmail('Mixed.Case@Domain.com')).toBe('mixed.case@domain.com');
    });
  });

  describe('generateUserId', () => {
    it('should generate different IDs each time', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with expected format', () => {
      const id = generateUserId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      // Base32 format uses characters a-z and 2-7
      expect(/^[a-z2-7]+$/.test(id)).toBe(true);
    });
    
    it('should generate IDs with expected length', () => {
      // 15 bytes of entropy encoded in base32 should produce 24 characters
      const id = generateUserId();
      expect(id.length).toBe(24);
    });
  });
});
