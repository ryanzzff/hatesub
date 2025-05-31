# HateSub Scripts

This directory contains utility scripts for the HateSub project.

## GitHub MCP Setup

The project is configured to use GitHub MCP (Model Context Protocol) with Podman instead of Docker for GitHub API interactions.

### Prerequisites

1. **Podman**: Make sure Podman is installed and running
   ```bash
   podman machine start
   ```

2. **GitHub Personal Access Token**: Create a token at https://github.com/settings/personal-access-tokens/new
   - Required permissions: `repo`, `issues`, `pull_requests`

### VS Code MCP Configuration

The GitHub MCP server is configured in `.vscode/mcp.json` to use Podman instead of Docker. This allows VS Code Copilot to interact with GitHub APIs directly.

To use:
1. Open VS Code in this project
2. Enable Agent mode in Copilot Chat
3. You'll be prompted for your GitHub token
4. The MCP server will start automatically

## Scripts

### `test-mcp.mjs`

Test script to verify GitHub MCP server connectivity and authentication.

**Usage:**
```bash
# Using environment variable
export GITHUB_TOKEN="your_github_token_here"
node scripts/test-mcp.mjs

# Or pass token as argument
node scripts/test-mcp.mjs your_github_token_here
```

**Features:**
- Tests MCP server connection with Podman
- Verifies GitHub token authentication
- Provides troubleshooting guidance
- Quick connectivity check before running issue creation

### `create-github-issues.sh`

Creates GitHub issues from the TODO.md file using the GitHub MCP server with Podman.

**Usage:**
```bash
./scripts/create-github-issues.sh YOUR_GITHUB_TOKEN
```

**Features:**
- Parses `docs/TODO.md` for incomplete items
- Creates GitHub issues with appropriate labels
- Excludes C2 (already completed by S7)
- Includes rate limiting to avoid API limits
- Provides detailed issue descriptions with acceptance criteria

**Example:**
```bash
./scripts/create-github-issues.sh ghp_xxxxxxxxxxxxxxxxxxxx
```

### `create-issues.mjs`

Alternative Node.js script for creating GitHub issues with more advanced parsing.

**Usage:**
```bash
node scripts/create-issues.mjs YOUR_GITHUB_TOKEN
# or
GITHUB_TOKEN=your_token node scripts/create-issues.mjs
```

## MCP Commands

You can also use the GitHub MCP server directly with Podman:

```bash
# List available tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  podman run -i --rm \
  -e "GITHUB_PERSONAL_ACCESS_TOKEN=your_token" \
  ghcr.io/github/github-mcp-server

# Create an issue
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"create_issue","arguments":{"owner":"ryanzzff","repo":"hatesub","title":"Test Issue","body":"This is a test"}}}' | \
  podman run -i --rm \
  -e "GITHUB_PERSONAL_ACCESS_TOKEN=your_token" \
  -e "GITHUB_TOOLSETS=issues" \
  ghcr.io/github/github-mcp-server
```

## Available Toolsets

The MCP server is configured with these toolsets:
- `repos` - Repository operations
- `issues` - Issue management  
- `pull_requests` - Pull request operations
- `code_security` - Security scanning

## Security Notes

- Never commit your GitHub token to the repository
- Use environment variables or pass tokens as arguments
- The token is only used during script execution and not stored

## Troubleshooting

### Podman Issues
```bash
# Check if Podman machine is running
podman machine list

# Start Podman machine if needed
podman machine start

# Check if container image is available
podman images | grep github-mcp-server
```

### GitHub API Issues
- Ensure your token has the required permissions
- Check rate limiting if you get 403 errors
- Verify repository access if you get 404 errors

### MCP Connection Issues
- Make sure VS Code has the latest Copilot extension
- Check that Agent mode is enabled
- Restart VS Code if MCP server doesn't start
