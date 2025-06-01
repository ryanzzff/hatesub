import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	// If email is not verified, redirect to verification page
	if (!event.locals.user.emailVerified) {
		return redirect(302, '/auth/verify-email');
	}

	return {
		user: event.locals.user
	};
};
