import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Email verification tokens
export const emailVerificationToken = sqliteTable('email_verification_token', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Password reset tokens
export const passwordResetToken = sqliteTable('password_reset_token', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Subscription management tables
export const category = sqliteTable('category', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	icon: text('icon'),
	color: text('color'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date())
});

export const subscription = sqliteTable('subscription', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	name: text('name').notNull(),
	description: text('description'),
	cost: real('cost').notNull(),
	currency: text('currency').notNull().default('USD'),
	billingCycle: text('billing_cycle').notNull(), // 'one-time', 'weekly', 'monthly', 'quarterly', 'yearly'
	renewalDate: integer('renewal_date', { mode: 'timestamp' }),
	category: text('category').notNull(),
	subscriptionReason: text('subscription_reason').notNull(),
	usageRating: integer('usage_rating'), // 1-5 scale
	valueRating: integer('value_rating'), // 1-5 scale
	status: text('status').notNull().default('active'), // 'active', 'cancelled', 'paused'
	notes: text('notes'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(new Date())
});

export const userPreference = sqliteTable('user_preference', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	defaultCurrency: text('default_currency').notNull().default('USD'),
	timezone: text('timezone').notNull().default('UTC'),
	notificationEmail: integer('notification_email', { mode: 'boolean' }).notNull().default(true),
	notificationPush: integer('notification_push', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(new Date())
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type EmailVerificationToken = typeof emailVerificationToken.$inferSelect;
export type PasswordResetToken = typeof passwordResetToken.$inferSelect;
export type Category = typeof category.$inferSelect;
export type Subscription = typeof subscription.$inferSelect;
export type UserPreference = typeof userPreference.$inferSelect;
