import { encodeBase32LowerCase } from '@oslojs/encoding';

export function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

export function validatePassword(password: unknown): password is string {
	return (
		typeof password === 'string' &&
		password.length >= 8 &&
		password.length <= 255 &&
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) // At least one lowercase, uppercase, and digit
	);
}

export function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' &&
		email.length >= 3 &&
		email.length <= 320 &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	);
}

export function normalizeEmail(email: string): string {
	return email.toLowerCase().trim();
}

export function getPasswordRequirements(): string {
	return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.';
}

export function getUsernameRequirements(): string {
	return 'Username must be 3-31 characters long and contain only lowercase letters, numbers, hyphens, and underscores.';
}

export function getEmailRequirements(): string {
	return 'Please enter a valid email address.';
}
