import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { validatePassword } from '$lib/server/auth-utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token');
	
	if (!token) {
		return {
			error: 'Invalid reset link. Please request a new password reset.'
		};
	}

	// Validate the token
	const resetToken = await auth.validatePasswordResetToken(token);
	
	if (!resetToken) {
		return {
			error: 'Invalid or expired reset link. Please request a new password reset.'
		};
	}

	return {
		token
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const token = formData.get('token');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (!token || typeof token !== 'string') {
			return fail(400, { message: 'Invalid reset token' });
		}

		if (!validatePassword(password)) {
			return fail(400, { 
				message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' });
		}

		// Validate the token again
		const resetToken = await auth.validatePasswordResetToken(token);
		
		if (!resetToken) {
			return fail(400, { message: 'Invalid or expired reset token. Please request a new password reset.' });
		}

		try {
			// Hash the new password
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			// Update user's password
			await db
				.update(table.user)
				.set({ 
					passwordHash,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, resetToken.userId));

			// Delete the reset token
			await auth.deletePasswordResetToken(resetToken.id);

			// Invalidate all existing sessions for this user for security
			await auth.invalidateUserSessions(resetToken.userId);

			return redirect(302, '/auth/login?reset=success');
		} catch (e) {
			console.error('Password reset error:', e);
			return fail(500, { message: 'An error occurred while resetting your password. Please try again.' });
		}
	}
};
