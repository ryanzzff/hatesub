import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { validateEmail, normalizeEmail } from '$lib/server/auth-utils';
import { sendPasswordResetEmail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// If user is already logged in, redirect to dashboard
	if (event.locals.user) {
		return { redirect: '/dashboard' };
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');

		if (!validateEmail(email)) {
			return fail(400, { 
				message: 'Please enter a valid email address',
				email: email?.toString() || ''
			});
		}

		const normalizedEmail = normalizeEmail(email);

		try {
			// Check if user exists
			const results = await db
				.select()
				.from(table.user)
				.where(eq(table.user.email, normalizedEmail));

			const existingUser = results.at(0);
			
			// Always return success message to prevent email enumeration
			if (!existingUser) {
				return {
					success: true,
					message: 'If an account with that email exists, we\'ve sent a password reset link.'
				};
			}

			// Delete any existing password reset tokens for this user
			await auth.deleteUserPasswordResetTokens(existingUser.id);

			// Create new password reset token
			const resetToken = await auth.createPasswordResetToken(existingUser.id);

			// Send password reset email
			const emailResult = await sendPasswordResetEmail(normalizedEmail, resetToken);
			if (!emailResult.success) {
				console.warn('Failed to send password reset email:', emailResult.error);
			}

			return {
				success: true,
				message: 'If an account with that email exists, we\'ve sent a password reset link.'
			};
		} catch (e) {
			console.error('Password reset error:', e);
			return fail(500, { 
				message: 'An error occurred while processing your request. Please try again.',
				email: email?.toString() || ''
			});
		}
	}
};
