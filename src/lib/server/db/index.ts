import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

// For local development using libsql
const databaseUrl = env.DATABASE_URL || 'file:local.db';
const client = createClient({ url: databaseUrl });
export const db = drizzleLibsql(client, { schema });

// Function to get DB instance for Cloudflare D1
export function createD1Database(d1: D1Database) {
	return drizzle(d1, { schema });
}

// Export a function that returns the appropriate database instance
export function getDatabase(platform?: App.Platform) {
	// In development, always use the local database
	if (dev) {
		return db;
	}

	// In production on Cloudflare, use the D1 database if available
	if (platform?.env?.DB) {
		return createD1Database(platform.env.DB);
	}

	// Fallback to local database
	return db;
}
