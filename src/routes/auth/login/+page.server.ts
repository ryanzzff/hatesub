import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { validateEmail, validatePassword, normalizeEmail } from '$lib/server/auth-utils';
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
		const password = formData.get('password');

		if (!validateEmail(email)) {
			return fail(400, { 
				message: 'Please enter a valid email address',
				email: email?.toString() || ''
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { 
				message: 'Invalid password',
				email: email?.toString() || ''
			});
		}

		const normalizedEmail = normalizeEmail(email);

		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, normalizedEmail));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { 
				message: 'Incorrect email or password',
				email: email?.toString() || ''
			});
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});
		if (!validPassword) {
			return fail(400, { 
				message: 'Incorrect email or password',
				email: email?.toString() || ''
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/dashboard');
	},
};
