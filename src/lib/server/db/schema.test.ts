import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './index';
import { subscription, category, userPreference, user } from './schema';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';

describe('Database Schema', () => {
	beforeEach(async () => {
		// Clean up test data before each test (delete in order of dependencies)
		// Use try-catch to handle cases where foreign keys might prevent deletion
		try {
			await db.delete(subscription);
		} catch (e) {
			// Ignore foreign key constraint errors during cleanup
		}
		try {
			await db.delete(userPreference);
		} catch (e) {
			// Ignore foreign key constraint errors during cleanup
		}
		try {
			await db.delete(category);
		} catch (e) {
			// Ignore foreign key constraint errors during cleanup
		}
		try {
			await db.delete(user);
		} catch (e) {
			// Ignore foreign key constraint errors during cleanup
		}
	});

	it('should create subscription with all required fields', async () => {
		const testUserId = nanoid();
		const testCategoryId = nanoid();
		
		// Create test user first
		await db.insert(user).values({
			id: testUserId,
			email: `test-${testUserId}@example.com`,
			username: `testuser-${testUserId}`,
			passwordHash: 'test-hash',
			emailVerified: true
		});

		// Create test category
		await db.insert(category).values({
			id: testCategoryId,
			name: `Entertainment-${testCategoryId}`,
			description: 'Entertainment subscriptions',
			icon: '🎬',
			color: '#ff6b6b'
		});

		// Create subscription
		const subscriptionData = {
			id: nanoid(),
			userId: testUserId,
			name: 'Netflix',
			description: 'Video streaming service',
			cost: 15.99,
			currency: 'USD',
			billingCycle: 'monthly',
			renewalDate: new Date('2025-08-01'),
			category: `Entertainment-${testCategoryId}`,
			subscriptionReason: 'Family entertainment',
			usageRating: 5,
			valueRating: 4,
			status: 'active',
			notes: 'Great for family movie nights'
		};

		const result = await db.insert(subscription).values(subscriptionData).returning();
		
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Netflix');
		expect(result[0].cost).toBe(15.99);
		expect(result[0].currency).toBe('USD');
		expect(result[0].status).toBe('active');
	});

	it('should create user preferences with defaults', async () => {
		const testUserId = nanoid();
		
		// Create test user first
		await db.insert(user).values({
			id: testUserId,
			email: `test2-${testUserId}@example.com`,
			username: `testuser2-${testUserId}`,
			passwordHash: 'test-hash',
			emailVerified: true
		});

		const preferencesData = {
			id: nanoid(),
			userId: testUserId
		};

		const result = await db.insert(userPreference).values(preferencesData).returning();
		
		expect(result).toHaveLength(1);
		expect(result[0].defaultCurrency).toBe('USD');
		expect(result[0].timezone).toBe('UTC');
		expect(result[0].notificationEmail).toBe(true);
		expect(result[0].notificationPush).toBe(false);
	});

	it('should enforce foreign key constraints', async () => {
		const invalidSubscription = {
			id: nanoid(),
			userId: 'invalid-user-id',
			name: 'Test Service',
			cost: 9.99,
			currency: 'USD',
			billingCycle: 'monthly',
			category: 'Test',
			subscriptionReason: 'Testing',
			status: 'active'
		};

		await expect(
			db.insert(subscription).values(invalidSubscription).returning()
		).rejects.toThrow();
	});

	it('should validate category uniqueness', async () => {
		const categoryId = nanoid();
		const categoryData = {
			id: categoryId,
			name: `Productivity-${categoryId}`,
			description: 'Productivity tools'
		};

		// First insertion should succeed
		await db.insert(category).values(categoryData);

		// Second insertion with same name should fail
		const duplicateCategory = {
			id: nanoid(),
			name: `Productivity-${categoryId}`,
			description: 'Different description'
		};

		await expect(
			db.insert(category).values(duplicateCategory)
		).rejects.toThrow();
	});
});