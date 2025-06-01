import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Make sure environment variables are available in workers
process.env.FROM_EMAIL = process.env.FROM_EMAIL || '';

export default defineConfig({
	webServer: {
		command: 'npm run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'e2e',
	use: {
		baseURL: 'http://localhost:5173',
		screenshot: 'only-on-failure',
		trace: 'on-first-retry'
	},
	retries: 1,
	reporter: 'html'
});
