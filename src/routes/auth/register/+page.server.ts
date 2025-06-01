import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { 
	validateEmail, 
	validatePassword, 
	validateUsername,
	normalizeEmail,
	generateUserId 
} from '$lib/server/auth-utils';
import { sendVerificationEmail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		// Validation
		if (!validateEmail(email)) {
			return fail(400, { 
				message: 'Please enter a valid email address',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}
		if (!validateUsername(username)) {
			return fail(400, { 
				message: 'Username must be 3-31 characters long and contain only lowercase letters, numbers, hyphens, and underscores',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { 
				message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}
		if (password !== confirmPassword) {
			return fail(400, { 
				message: 'Passwords do not match',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}

		const normalizedEmail = normalizeEmail(email);

		// Check if email already exists
		const existingEmailUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, normalizedEmail));

		if (existingEmailUser.length > 0) {
			return fail(400, { 
				message: 'An account with this email already exists',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}

		// Check if username already exists
		const existingUsernameUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));

		if (existingUsernameUser.length > 0) {
			return fail(400, { 
				message: 'This username is already taken',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});

		try {
			console.log(`Starting registration for user: ${username} / ${normalizedEmail}`);
			await db.insert(table.user).values({ 
				id: userId, 
				email: normalizedEmail,
				username, 
				passwordHash,
				emailVerified: false,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			// Create email verification token
			const verificationToken = await auth.createEmailVerificationToken(userId, normalizedEmail);
			
			// Send verification email
			try {
				const emailResult = await sendVerificationEmail(normalizedEmail, verificationToken);
				if (!emailResult.success) {
					console.warn('Failed to send verification email:', emailResult.error);
				}
			} catch (emailError) {
				console.error('Exception sending verification email:', emailError);
				// We'll still continue with registration even if email fails
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return redirect(302, '/auth/verify-email');
		} catch (e) {
			console.error('Registration error:', e);
			return fail(500, { 
				message: 'An error occurred while creating your account. Please try again.',
				email: email?.toString() || '',
				username: username?.toString() || ''
			});
		}
	},
};
