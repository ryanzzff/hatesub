#!/usr/bin/env node

import { spawn } from 'child_process';

async function testMCP(token) {
  console.log('🧪 Testing GitHub MCP server connection...');
  
  return new Promise((resolve, reject) => {
    const mcp = spawn('podman', [
      'run', '-i', '--rm',
      '-e', `GITHUB_PERSONAL_ACCESS_TOKEN=${token}`,
      '-e', 'GITHUB_TOOLSETS=repos,issues,users',
      'ghcr.io/github/github-mcp-server'
    ]);

    // Test by calling get_me to verify authentication
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_me',
        arguments: {}
      }
    };

    let output = '';
    let stderr = '';
    
    mcp.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcp.stderr.on('data', (data) => {
      const message = data.toString().trim();
      // Only show actual errors, not the normal "running on stdio" message
      if (!message.includes('GitHub MCP Server running on stdio')) {
        stderr += message;
      }
    });

    mcp.on('close', (code) => {
      if (code === 0) {
        try {
          const response = JSON.parse(output);
          if (response.error) {
            console.error('❌ MCP Error:', response.error.message);
            reject(new Error(response.error.message));
          } else {
            console.log('✅ MCP connection successful!');
            console.log('👤 Authenticated as:', response.result?.login || 'unknown');
            resolve(response.result);
          }
        } catch (e) {
          console.error('❌ Failed to parse MCP response:', output);
          console.error('Stderr:', stderr);
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      } else {
        console.error('❌ MCP process failed with code:', code);
        console.error('Stderr:', stderr);
        reject(new Error(`MCP process exited with code ${code}`));
      }
    });

    mcp.stdin.write(JSON.stringify(request) + '\n');
    mcp.stdin.end();
  });
}

// Get GitHub token from environment or prompt
const token = process.env.GITHUB_TOKEN || process.argv[2];

if (!token) {
  console.error('❌ Please provide a GitHub token:');
  console.error('  node test-mcp.mjs YOUR_GITHUB_TOKEN');
  console.error('  or set GITHUB_TOKEN environment variable');
  console.error('');
  console.error('💡 To create a token: https://github.com/settings/personal-access-tokens/new');
  console.error('   Required permissions: Contents, Issues, Pull requests');
  process.exit(1);
}

// Run the test
testMCP(token).then(() => {
  console.log('\n🎉 MCP test completed successfully!');
  console.log('📋 You can now create GitHub issues from TODO.md using:');
  console.log('   node scripts/create-issues.mjs YOUR_GITHUB_TOKEN');
}).catch((error) => {
  console.error('\n❌ MCP test failed:', error.message);
  console.error('\n🔧 Troubleshooting:');
  console.error('   1. Check your GitHub token permissions');
  console.error('   2. Ensure Podman is running');
  console.error('   3. Verify internet connection');
  process.exit(1);
});
