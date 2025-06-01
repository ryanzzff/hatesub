import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(new Date())
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

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type EmailVerificationToken = typeof emailVerificationToken.$inferSelect;
export type PasswordResetToken = typeof passwordResetToken.$inferSelect;
