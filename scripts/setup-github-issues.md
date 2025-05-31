# GitHub Issues Setup Guide

## Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/personal-access-tokens/new
2. Give it a name like "HateSub MCP Token"
3. Set expiration (recommend 90 days)
4. Select repository access: Choose "Selected repositories" → `ryanzzff/hatesub`
5. Set permissions:
   - **Contents**: Read and Write
   - **Issues**: Write
   - **Pull requests**: Write  
   - **Metadata**: Read
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

## Step 2: Test MCP Connectivity

```bash
# Test the connection first
node scripts/test-mcp.mjs YOUR_GITHUB_TOKEN_HERE
```

Expected output:
```
🧪 Testing GitHub MCP server connection...
✅ MCP connection successful!
👤 Authenticated as: your-username
🎉 MCP test completed successfully!
```

## Step 3: Create GitHub Issues from TODO

```bash
# Create all issues from TODO.md
node scripts/create-issues.mjs YOUR_GITHUB_TOKEN_HERE
```

Or using npm scripts:
```bash
# Set token as environment variable (more secure)
export GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"

# Test connectivity
npm run mcp:test

# Create issues
npm run issues:create
```

## What Issues Will Be Created

The script will parse `docs/TODO.md` and create GitHub issues for all incomplete items:

- **S8**: Configure user authentication system
- **C1-C13**: All core development tasks (13 issues)
- **E1-E9**: Enhanced features (9 issues)  
- **T1-T7**: Testing & polish tasks (7 issues)
- **F1-F8**: Future enhancements (8 issues)
- **M1-M5**: Mobile-first design priorities (5 issues)
- **D1-D5**: Data & security tasks (5 issues)

**Total**: ~47 GitHub issues will be created

Each issue will include:
- Proper title with task code
- Detailed description
- Appropriate labels (setup, core, enhancement, etc.)
- Acceptance criteria
- Section context

## Security Notes

- Never commit your token to the repository
- Use environment variables when possible
- The token is only used during script execution
- Consider using shorter expiration periods for security

## Troubleshooting

### Token Issues
- Make sure you copied the entire token
- Verify repository access is granted
- Check that required permissions are enabled

### MCP Issues  
- Ensure Podman is running: `podman machine start`
- Check container image: `podman images | grep github-mcp-server`
- Test with simple command first

### Rate Limiting
- The script includes 1-second delays between API calls
- If you hit rate limits, wait and retry
- GitHub allows 5000 requests per hour for authenticated users
