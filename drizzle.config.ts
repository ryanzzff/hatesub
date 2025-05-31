import { defineConfig } from 'drizzle-kit';

const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = process.env.DATABASE_URL || 'file:local.db';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: databaseUrl },
	out: './drizzle',
	verbose: true,
	strict: true
});
