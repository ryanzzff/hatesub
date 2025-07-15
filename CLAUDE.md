# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Quality
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Format code with Prettier
- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run Svelte type checking in watch mode

### Testing
- `npm run test` - Run all tests (unit + e2e)
- `npm run test:unit` - Run unit tests with Vitest
- `npm run test:e2e` - Run Playwright end-to-end tests

### Database Management
- `npm run db:push` - Push schema changes to local database
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:studio` - Open Drizzle Studio for database inspection
- `npm run db:d1:dev` - Apply migrations to D1 development database
- `npm run db:d1:prod` - Apply migrations to D1 production database

### Additional Tools
- `npm run wrangler:dev` - Run Wrangler dev server for Cloudflare Pages
- `npm run mcp:test` - Test GitHub MCP integration
- `npm run issues:create` - Create GitHub issues from TODO list

## Architecture Overview

### Tech Stack
- **Framework**: SvelteKit 2.x with TypeScript
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Styling**: TailwindCSS 4.x with mobile-first approach
- **Authentication**: Custom session-based auth with secure tokens
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Deployment**: Cloudflare Pages with D1 database

### Key Directory Structure
```
src/
├── lib/
│   ├── server/
│   │   ├── auth.ts          # Session management & token validation
│   │   ├── db/
│   │   │   ├── index.ts     # Database connection & utilities
│   │   │   └── schema.ts    # Drizzle schema definitions
│   │   └── email.ts         # Email functionality (Resend)
│   └── paraglide/           # Internationalization
├── routes/
│   ├── auth/                # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── dashboard/           # Protected user dashboard
└── hooks.server.ts          # Server-side hooks for auth & i18n
```

### Database Schema
Current tables:
- `user` - User accounts with email verification
- `session` - User sessions with expiration
- `email_verification_token` - Email verification tokens
- `password_reset_token` - Password reset tokens

### Authentication System
- Session-based authentication using secure tokens
- Email verification required for new accounts
- Password reset functionality via email tokens
- Automatic session renewal (30-day expiry, renewed at 15 days)
- Secure cookie handling with httpOnly and sameSite settings

### Environment Configuration
- **Local Development**: Uses SQLite file (`local.db`)
- **Production**: Uses Cloudflare D1 database
- **Email**: Resend service for verification and password reset emails
- **Environment Variables**: Loaded from `.env` file in development

### Testing Strategy
- **Unit Tests**: Vitest with @testing-library/svelte
- **E2E Tests**: Playwright with authentication flow testing
- **Test Setup**: Custom vitest setup with jsdom and matchMedia mock
- **Coverage**: Focus on authentication flows and critical user paths

### Development Workflow
1. Mobile-first responsive design approach
2. TypeScript strict mode enabled
3. ESLint + Prettier for code quality
4. Drizzle migrations for database schema changes
5. GitHub MCP integration for issue management
6. Comprehensive testing before deployment

### Key Dependencies
- **@sveltejs/kit**: Main framework
- **drizzle-orm**: Database ORM
- **@libsql/client**: Database client for D1
- **@node-rs/argon2**: Password hashing
- **@oslojs/crypto**: Cryptographic utilities
- **resend**: Email service
- **@tailwindcss/vite**: TailwindCSS integration
- **@inlang/paraglide-js**: Internationalization

### Important Notes
- Database schema is in `src/lib/server/db/schema.ts`
- Authentication logic is centralized in `src/lib/server/auth.ts`
- All authentication routes follow SvelteKit conventions with `+page.server.ts`
- Email verification is required for new user accounts
- Project uses Cloudflare D1 for production database
- Mobile-first design philosophy throughout the application