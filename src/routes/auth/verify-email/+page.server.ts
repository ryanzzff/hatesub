import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sendVerificationEmail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	// If already verified, redirect to dashboard
	if (event.locals.user.emailVerified) {
		return redirect(302, '/dashboard');
	}

	const token = event.url.searchParams.get('token');
	
	if (token) {
		// Verify the token from URL
		const verificationToken = await auth.validateEmailVerificationToken(token);
		
		if (!verificationToken) {
			return {
				user: event.locals.user,
				error: 'Invalid or expired verification token. Please request a new one.'
			};
		}

		if (verificationToken.userId !== event.locals.user.id) {
			return {
				user: event.locals.user,
				error: 'This verification token is for a different account.'
			};
		}

		// Verify the email
		try {
			await db
				.update(table.user)
				.set({ 
					emailVerified: true,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, event.locals.user.id));

			// Delete the verification token
			const tokenId = token; // We'd need to hash this in a real implementation
			await auth.deleteUserEmailVerificationTokens(event.locals.user.id);

			return redirect(302, '/dashboard?verified=true');
		} catch (e) {
			console.error('Email verification error:', e);
			return {
				user: event.locals.user,
				error: 'An error occurred while verifying your email. Please try again.'
			};
		}
	}

	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	resend: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Not authenticated' });
		}

		if (event.locals.user.emailVerified) {
			return fail(400, { message: 'Email is already verified' });
		}

		try {
			// Delete existing verification tokens
			await auth.deleteUserEmailVerificationTokens(event.locals.user.id);

			// Create new verification token
			const verificationToken = await auth.createEmailVerificationToken(
				event.locals.user.id, 
				event.locals.user.email
			);

			// Send verification email
			const emailResult = await sendVerificationEmail(event.locals.user.email, verificationToken);
			if (!emailResult.success) {
				console.warn('Failed to send verification email:', emailResult.error);
				return fail(500, { message: 'Failed to send verification email. Please try again.' });
			}

			return {
				success: true,
				message: 'Verification email sent successfully'
			};
		} catch (e) {
			console.error('Error resending verification email:', e);
			return fail(500, { message: 'Failed to send verification email. Please try again.' });
		}
	}
};
