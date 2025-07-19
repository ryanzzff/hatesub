import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const HOUR_IN_MS = 1000 * 60 * 60;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export function generateEmailVerificationToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export function generatePasswordResetToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function createEmailVerificationToken(userId: string, email: string) {
	const token = generateEmailVerificationToken();
	const tokenId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const verificationToken: table.EmailVerificationToken = {
		id: tokenId,
		userId,
		email,
		expiresAt: new Date(Date.now() + HOUR_IN_MS * 2) // 2 hours
	};
	await db.insert(table.emailVerificationToken).values(verificationToken);
	return token;
}

export async function createPasswordResetToken(userId: string) {
	const token = generatePasswordResetToken();
	const tokenId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const resetToken: table.PasswordResetToken = {
		id: tokenId,
		userId,
		expiresAt: new Date(Date.now() + HOUR_IN_MS * 2) // 2 hours
	};
	await db.insert(table.passwordResetToken).values(resetToken);
	return token;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { 
				id: table.user.id, 
				username: table.user.username, 
				email: table.user.email,
				emailVerified: table.user.emailVerified
			},
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export async function validateEmailVerificationToken(token: string) {
	const tokenId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select()
		.from(table.emailVerificationToken)
		.where(eq(table.emailVerificationToken.id, tokenId));

	if (!result) {
		return null;
	}

	// Clean up expired token
	if (Date.now() >= result.expiresAt.getTime()) {
		await db.delete(table.emailVerificationToken).where(eq(table.emailVerificationToken.id, tokenId));
		return null;
	}

	return result;
}

export async function validatePasswordResetToken(token: string) {
	const tokenId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select()
		.from(table.passwordResetToken)
		.where(eq(table.passwordResetToken.id, tokenId));

	if (!result) {
		return null;
	}

	// Clean up expired token
	if (Date.now() >= result.expiresAt.getTime()) {
		await db.delete(table.passwordResetToken).where(eq(table.passwordResetToken.id, tokenId));
		return null;
	}

	return result;
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export async function invalidateUserSessions(userId: string) {
	await db.delete(table.session).where(eq(table.session.userId, userId));
}

export async function deleteEmailVerificationToken(tokenId: string) {
	await db.delete(table.emailVerificationToken).where(eq(table.emailVerificationToken.id, tokenId));
}

export async function deletePasswordResetToken(tokenId: string) {
	await db.delete(table.passwordResetToken).where(eq(table.passwordResetToken.id, tokenId));
}

export async function deleteUserEmailVerificationTokens(userId: string) {
	await db.delete(table.emailVerificationToken).where(eq(table.emailVerificationToken.userId, userId));
}

export async function deleteUserPasswordResetTokens(userId: string) {
	await db.delete(table.passwordResetToken).where(eq(table.passwordResetToken.userId, userId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV === 'production'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		sameSite: 'lax',
		httpOnly: true,
		path: '/',
		secure: process.env.NODE_ENV === 'production'
	});
}
