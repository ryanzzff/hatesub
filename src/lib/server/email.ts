import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);

const FROM_EMAIL = env.FROM_EMAIL || 'onboarding@resend.dev';
const APP_NAME = 'HateSub';
const BASE_URL = env.PUBLIC_APP_URL || 'http://localhost:5173';

export async function sendVerificationEmail(email: string, token: string) {
	if (!env.RESEND_API_KEY) {
		console.log('⚠️  RESEND_API_KEY not set. Email verification token:', token);
		console.log(`🔗 Verification URL: ${BASE_URL}/auth/verify-email?token=${token}`);
		return { success: false, error: 'Email service not configured' };
	}

	const verificationUrl = `${BASE_URL}/auth/verify-email?token=${token}`;

	try {
		// Try to use configured FROM_EMAIL, but fall back to Resend shared email if domain isn't verified
		let fromEmail = FROM_EMAIL;
		// Check if it's likely a custom domain that might not be verified
		if (fromEmail !== 'onboarding@resend.dev' && !fromEmail.includes('resend.dev')) {
			console.log(`Using custom FROM_EMAIL: ${fromEmail} (make sure it's verified in Resend)`);
		}

		const { data, error } = await resend.emails.send({
			from: fromEmail,
			to: [email],
			subject: `Verify your ${APP_NAME} email address`,
			html: getVerificationEmailHtml(verificationUrl),
			text: getVerificationEmailText(verificationUrl),
		});

		if (error) {
			console.error('Email sending error:', error);
			// Output the verification URL to console for testing
			console.log(`🔗 Verification URL: ${verificationUrl}`);
			return { success: false, error: error.message };
		}

		console.log('✅ Verification email sent successfully:', data?.id);
		return { success: true, messageId: data?.id };
	} catch (error) {
		console.error('Email sending exception:', error);
		// Output the verification URL to console for testing
		console.log(`🔗 Verification URL: ${verificationUrl}`);
		return { success: false, error: 'Failed to send email' };
	}
}

export async function sendPasswordResetEmail(email: string, token: string) {
	if (!env.RESEND_API_KEY) {
		console.log('⚠️  RESEND_API_KEY not set. Password reset token:', token);
		console.log(`🔗 Reset URL: ${BASE_URL}/auth/reset-password?token=${token}`);
		return { success: false, error: 'Email service not configured' };
	}

	const resetUrl = `${BASE_URL}/auth/reset-password?token=${token}`;

	try {
		// Try to use configured FROM_EMAIL, but fall back to Resend shared email if domain isn't verified
		let fromEmail = FROM_EMAIL;
		// Check if it's likely a custom domain that might not be verified
		if (fromEmail !== 'onboarding@resend.dev' && !fromEmail.includes('resend.dev')) {
			console.log(`Using custom FROM_EMAIL: ${fromEmail} (make sure it's verified in Resend)`);
		}

		const { data, error } = await resend.emails.send({
			from: fromEmail,
			to: [email],
			subject: `Reset your ${APP_NAME} password`,
			html: getPasswordResetEmailHtml(resetUrl),
			text: getPasswordResetEmailText(resetUrl),
		});

		if (error) {
			console.error('Email sending error:', error);
			// Output the reset URL to console for testing
			console.log(`🔗 Reset URL: ${resetUrl}`);
			return { success: false, error: error.message };
		}

		console.log('✅ Password reset email sent successfully:', data?.id);
		return { success: true, messageId: data?.id };
	} catch (error) {
		console.error('Email sending exception:', error);
		// Output the reset URL to console for testing
		console.log(`🔗 Reset URL: ${resetUrl}`);
		return { success: false, error: 'Failed to send email' };
	}
}

function getVerificationEmailHtml(verificationUrl: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Verify your email address</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
		.content { padding: 30px 0; }
		.button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; }
		.button:hover { background-color: #3f37c9; }
		.footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
		a { color: #4f46e5; }
		/* Force white text on buttons for all email clients */
		.button, .button:visited, .button:active, .button:hover { color: #ffffff !important; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>${APP_NAME}</h1>
		</div>
		<div class="content">
			<h2>Verify your email address</h2>
			<p>Thank you for signing up! Please click the button below to verify your email address and complete your account setup.</p>
			<p style="text-align: center; margin: 30px 0;">
				<a href="${verificationUrl}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500;">Verify Email Address</a>
			</p>
			<p>If the button doesn't work, you can copy and paste this link into your browser:</p>
			<p style="word-break: break-all; color: #666;">${verificationUrl}</p>
			<p><strong>This link will expire in 2 hours.</strong></p>
		</div>
		<div class="footer">
			<p>If you didn't create an account, you can safely ignore this email.</p>
		</div>
	</div>
</body>
</html>
	`.trim();
}

function getVerificationEmailText(verificationUrl: string): string {
	return `
${APP_NAME} - Verify your email address

Thank you for signing up! Please click the link below to verify your email address and complete your account setup.

${verificationUrl}

This link will expire in 2 hours.

If you didn't create an account, you can safely ignore this email.
	`.trim();
}

function getPasswordResetEmailHtml(resetUrl: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Reset your password</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
		.content { padding: 30px 0; }
		.button { display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; }
		.button:hover { background-color: #b91c1c; }
		.footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px; }
		a { color: #dc2626; }
		/* Force white text on buttons for all email clients */
		.button, .button:visited, .button:active, .button:hover { color: #ffffff !important; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>${APP_NAME}</h1>
		</div>
		<div class="content">
			<h2>Reset your password</h2>
			<p>We received a request to reset your password. Click the button below to create a new password.</p>
			<p style="text-align: center; margin: 30px 0;">
				<a href="${resetUrl}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500;">Reset Password</a>
			</p>
			<p>If the button doesn't work, you can copy and paste this link into your browser:</p>
			<p style="word-break: break-all; color: #666;">${resetUrl}</p>
			<p><strong>This link will expire in 2 hours.</strong></p>
		</div>
		<div class="footer">
			<p>If you didn't request a password reset, you can safely ignore this email.</p>
		</div>
	</div>
</body>
</html>
	`.trim();
}

function getPasswordResetEmailText(resetUrl: string): string {
	return `
${APP_NAME} - Reset your password

We received a request to reset your password. Click the link below to create a new password.

${resetUrl}

This link will expire in 2 hours.

If you didn't request a password reset, you can safely ignore this email.
	`.trim();
}
