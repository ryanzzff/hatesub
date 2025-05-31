import { dev } from '$app/environment';
import { db, createD1Database } from './index.js';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Get the appropriate database instance based on the environment
 * In development: uses local SQLite database
 * In production: uses Cloudflare D1 database from platform.env
 */
export function getDatabase(event?: RequestEvent) {
	// In development, always use the local database
	if (dev) {
		return db;
	}

	// In production on Cloudflare, use the D1 database
	if (event?.platform?.env?.DB) {
		return createD1Database(event.platform.env.DB);
	}

	// Fallback to local database (shouldn't happen in production)
	return db;
}
