# Cloudflare D1 Database Setup

This project is configured to use Cloudflare D1 databases for both development and production environments.

## Database Configuration

### Development
- **Local Database**: `file:local.db` (SQLite file for local development)
- **D1 Development Database**: `hatesub-dev` (ID: `a378e189-537c-42d9-8e32-0911692ffcdd`)

### Production
- **D1 Production Database**: `hatesub-prod` (ID: `37a56589-1549-4e1c-a935-ed5593a18eee`)

## Environment Setup

### Local Development
1. The project automatically uses the local SQLite database (`local.db`) for development
2. Environment variables are loaded from `.env` file
3. Database URL: `file:local.db`

### Cloudflare Pages/Workers
1. The D1 database binding is configured in `wrangler.toml`
2. The binding name is `DB` and will be available in `platform.env.DB`
3. The application automatically detects the environment and uses the appropriate database

## Available Scripts

### Database Management
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:push` - Push schema changes to local database
- `npm run db:studio` - Open Drizzle Studio for database inspection

### D1 Database Management
- `npm run db:d1:dev` - Apply migrations to D1 development database (local)
- `npm run db:d1:prod` - Apply migrations to D1 production database (remote)

### Wrangler Commands
- `wrangler d1 list` - List all D1 databases
- `wrangler d1 execute hatesub-dev --local --command="<SQL>"` - Execute SQL on dev database
- `wrangler d1 execute hatesub-prod --remote --command="<SQL>"` - Execute SQL on prod database

## Schema Management

1. Make changes to `src/lib/server/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply to local database: `npm run db:push`
4. Apply to D1 development: `npm run db:d1:dev`
5. Apply to D1 production: `npm run db:d1:prod`

## Database Access in Code

The database connection is handled automatically:

```typescript
import { getDatabase } from '$lib/server/db';

// In a server-side function (e.g., +page.server.ts)
export async function load({ platform }) {
    const db = getDatabase(platform);
    // Use db for queries...
}
```

For routes, the database is also available via the utility function that detects the environment automatically.

## Environment Variables

### `.env` (Local Development)
```
DATABASE_URL=file:local.db
```

### `.dev.vars` (Wrangler Development)
```
# Wrangler development environment variables
# These will be available when running `wrangler dev`
```

## Deployment

When deploying to Cloudflare Pages:
1. The build process will use the Cloudflare adapter
2. The D1 database binding will be automatically available
3. The application will automatically use the D1 database in production

## Troubleshooting

### Check D1 Database Status
```bash
wrangler d1 list
wrangler d1 execute hatesub-dev --local --command="SELECT * FROM sqlite_master;"
```

### Reset Local Database
```bash
rm local.db
npm run db:push
```

### Reset D1 Database
```bash
# Re-apply migrations
npm run db:d1:dev  # for development
npm run db:d1:prod # for production
```
