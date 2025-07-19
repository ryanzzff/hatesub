# Email Service Setup

The authentication system now includes real email functionality using [Resend](https://resend.com), a modern email API service.

## Features

✅ **Email Verification**: New users receive verification emails with secure tokens
✅ **Password Reset**: Users can reset passwords via email
✅ **Resend Functionality**: Users can request new verification emails
✅ **Development Mode**: Fallback to console logging when email service isn't configured

## Setup

### 1. Get a Resend API Key

1. Visit [resend.com](https://resend.com) and create an account
2. Go to the [API Keys page](https://resend.com/api-keys)
3. Create a new API key

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your values:

```env
# Resend API Key
RESEND_API_KEY=re_YourActualAPIKey_here

# From email (must be from a verified domain)
FROM_EMAIL=noreply@yourdomain.com

# App URL for email links
PUBLIC_APP_URL=http://localhost:5173
```

### 3. Verify Your Domain (Production Only)

For production, you'll need to verify your domain in Resend:

1. Go to [Domains](https://resend.com/domains) in Resend
2. Add your domain
3. Update your DNS records as instructed
4. Use an email address from your verified domain in `FROM_EMAIL`

## Development Mode

If `RESEND_API_KEY` is not set, the system will:

- Log verification tokens to the console
- Show verification URLs in the terminal
- Display "Email service not configured" messages
- Still create and validate tokens normally

This allows development without requiring email setup.

## Email Templates

The system includes responsive HTML email templates for:

- **Email Verification**: Welcome email with verification link
- **Password Reset**: Secure password reset instructions

Templates are in `/src/lib/server/email.ts` and can be customized.

## Testing

### Local Testing

1. Start the development server: `npm run dev`
2. Register a new user
3. Check the console for verification links (if no API key set)
4. Or check your email (if API key is configured)

### Production Testing

1. Set up a verified domain in Resend
2. Configure environment variables
3. Test the complete email flow

## Customization

You can customize the email service by editing `/src/lib/server/email.ts`:

- **Templates**: Modify the HTML/text email templates
- **Sender**: Change the from address and app name
- **Styling**: Update the CSS in email templates
- **Content**: Customize email subject lines and content

## Error Handling

The system gracefully handles email failures:

- Failed sends are logged but don't break the user flow
- Users can always resend verification emails
- Console fallback ensures development continues smoothly

## Security

- All tokens are cryptographically secure (18 bytes of entropy)
- Tokens expire after 2 hours
- Email links are one-time use
- No sensitive information is logged in production
