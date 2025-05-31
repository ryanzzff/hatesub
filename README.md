# HateSub

A subscription management application built with SvelteKit, helping users track and manage their subscriptions with intelligent insights and recommendations.

## Features

- 📊 Subscription tracking and management
- 💰 Cost calculation with multi-currency support  
- 📱 Mobile-first responsive design
- 🔒 Secure user authentication
- 📈 Spending analytics and insights
- 🌐 Cloudflare D1 database integration
- 🤖 GitHub MCP integration for development workflow

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Podman (for GitHub MCP integration)
- GitHub Personal Access Token (for MCP features)

### Database Setup

The project uses Cloudflare D1 databases:

```bash
# Apply schema to local database
npm run db:push

# Apply to D1 development database  
npm run db:d1:dev

# Apply to D1 production database
npm run db:d1:prod
```

See [`docs/DATABASE.md`](docs/DATABASE.md) for detailed database setup.

### GitHub MCP Integration

This project uses GitHub MCP with Podman for enhanced development workflow:

```bash
# Test MCP connectivity first
npm run mcp:test YOUR_GITHUB_TOKEN

# Create GitHub issues from TODO list
npm run issues:create YOUR_GITHUB_TOKEN
```

See [`scripts/README.md`](scripts/README.md) for MCP setup and usage.

### VS Code Agent Mode

The project includes VS Code MCP configuration for Copilot Agent mode:

1. Open project in VS Code
2. Enable Agent mode in Copilot Chat  
3. Enter your GitHub token when prompted
4. Use natural language to interact with GitHub APIs

Example: *"Create an issue for implementing user authentication"*

## Project Structure

```
├── docs/              # Documentation
├── scripts/           # Utility scripts  
├── src/
│   ├── lib/           # Shared components and utilities
│   ├── routes/        # SvelteKit pages and API routes
│   └── app.html       # App template
├── static/            # Static assets
└── drizzle/           # Database migrations
```

## Development Workflow

1. **Planning**: See [`docs/TODO.md`](docs/TODO.md) for planned features
2. **Database**: Use Drizzle ORM with Cloudflare D1  
3. **Issues**: Auto-create from TODO using GitHub MCP
4. **Testing**: Unit and integration tests with Vitest
5. **Deployment**: Cloudflare Pages with D1 database

## Documentation

- [`docs/PRD.md`](docs/PRD.md) - Product Requirements Document
- [`docs/TODO.md`](docs/TODO.md) - Development roadmap
- [`docs/DATABASE.md`](docs/DATABASE.md) - Database setup and schema
- [`scripts/README.md`](scripts/README.md) - GitHub MCP and automation

## Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS  
- **Database**: Cloudflare D1 with Drizzle ORM
- **Authentication**: Custom auth with secure sessions
- **Deployment**: Cloudflare Pages
- **Development**: GitHub MCP with Podman integration

## Contributing

1. Check [`docs/TODO.md`](docs/TODO.md) for available tasks
2. Create issues using the MCP script: `./scripts/create-github-issues.sh`
3. Follow the mobile-first development approach
4. Ensure tests pass: `npm test`
5. Update documentation as needed

## License

MIT License - see LICENSE file for details.
