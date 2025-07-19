import { describe, it, expect } from 'vitest';
import { db } from './index';
import { subscription, category, userPreference, user } from './schema';
import { nanoid } from 'nanoid';

describe('Database Schema', () => {
	it('should create subscription with all required fields', async () => {
		const testUserId = nanoid();
		const testCategoryId = nanoid();
		
		// Create test user first
		await db.insert(user).values({
			id: testUserId,
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: 'test-hash',
			emailVerified: true
		});

		// Create test category
		await db.insert(category).values({
			id: testCategoryId,
			name: 'Entertainment',
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
			category: 'Entertainment',
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
			email: 'test2@example.com',
			username: 'testuser2',
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
		const categoryData = {
			id: nanoid(),
			name: 'Productivity',
			description: 'Productivity tools'
		};

		// First insertion should succeed
		await db.insert(category).values(categoryData);

		// Second insertion with same name should fail
		const duplicateCategory = {
			id: nanoid(),
			name: 'Productivity',
			description: 'Different description'
		};

		await expect(
			db.insert(category).values(duplicateCategory)
		).rejects.toThrow();
	});
});