import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	
	// If user is logged in but email is not verified, redirect to verification page
	if (!event.locals.user.emailVerified) {
		return redirect(302, '/auth/verify-email');
	}

	// If user is logged in and verified, redirect to dashboard
	return redirect(302, '/dashboard');
};
