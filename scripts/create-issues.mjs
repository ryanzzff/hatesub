#!/usr/bin/env node

import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the TODO.md file (go up one directory from scripts to reach docs)
const todoPath = join(__dirname, '..', 'docs', 'TODO.md');
const todoContent = fs.readFileSync(todoPath, 'utf8');

// Parse TODO items
const lines = todoContent.split('\n');
const incompleteItems = [];
let currentSection = '';

for (const line of lines) {
  // Track current section
  if (line.startsWith('## ')) {
    currentSection = line.replace('## ', '').trim();
    continue;
  }
  
  // Find incomplete items
  if (line.includes('- [ ]')) {
    const item = line.replace('- [ ]', '').trim();
    const [code, ...titleParts] = item.split('. ');
    const title = titleParts.join('. ');
    
    incompleteItems.push({
      code,
      title,
      section: currentSection,
      fullText: item
    });
  }
}

// Filter out C2 since it's essentially completed by S7
const filteredItems = incompleteItems.filter(item => item.code !== 'C2');

console.log(`Found ${filteredItems.length} incomplete TODO items:`);
filteredItems.forEach(item => {
  console.log(`- ${item.code}: ${item.title} (${item.section})`);
});

// Create GitHub issues using MCP
async function createGitHubIssues(token) {
  for (const item of filteredItems) {
    const labels = getSectionLabels(item.section);
    const body = generateIssueBody(item);
    
    console.log(`\nCreating issue: ${item.code}: ${item.title}`);
    
    try {
      await createIssue(token, item.code, item.title, body, labels);
      console.log(`✅ Created issue for ${item.code}`);
    } catch (error) {
      console.error(`❌ Failed to create issue for ${item.code}:`, error.message);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

function getSectionLabels(section) {
  const labelMap = {
    '🚀 Setup & Infrastructure (S1-S8)': ['setup', 'infrastructure'],
    '🎯 Core Development (MVP) (C1-C13)': ['core', 'mvp'],
    '🔧 Enhanced Features (E1-E9)': ['enhancement', 'feature'],
    '🧪 Testing & Polish (T1-T7)': ['testing', 'polish'],
    '🔮 Far Future Enhancements (F1-F8)': ['future', 'enhancement'],
    '📱 Mobile-First Design Priorities (M1-M5)': ['mobile', 'design'],
    '💾 Data & Security (D1-D5)': ['data', 'security']
  };
  
  return labelMap[section] || ['todo'];
}

function generateIssueBody(item) {
  return `## Description
${item.title}

## Section
${item.section}

## Task Code
${item.code}

## Additional Context
This issue was automatically created from the project TODO list.

## Acceptance Criteria
- [ ] Implementation complete
- [ ] Tests written (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] Code reviewed and merged

---
*Generated from TODO.md*`;
}

async function createIssue(token, code, title, body, labels) {
  return new Promise((resolve, reject) => {
    const mcp = spawn('podman', [
      'run', '-i', '--rm',
      '-e', `GITHUB_PERSONAL_ACCESS_TOKEN=${token}`,
      '-e', 'GITHUB_TOOLSETS=issues',
      'ghcr.io/github/github-mcp-server'
    ]);

    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'create_issue',
        arguments: {
          owner: 'ryanzzff',
          repo: 'hatesub',
          title: `${code}: ${title}`,
          body: body,
          labels: labels
        }
      }
    };

    let output = '';
    mcp.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcp.stderr.on('data', (data) => {
      const message = data.toString().trim();
      // Only show actual errors, not the normal "running on stdio" message
      if (!message.includes('GitHub MCP Server running on stdio')) {
        console.error('MCP stderr:', message);
      }
    });

    mcp.on('close', (code) => {
      if (code === 0) {
        try {
          const response = JSON.parse(output);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      } else {
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
  console.error('Please provide a GitHub token:');
  console.error('  node create-issues.mjs YOUR_GITHUB_TOKEN');
  console.error('  or set GITHUB_TOKEN environment variable');
  process.exit(1);
}

// Run the script
createGitHubIssues(token).then(() => {
  console.log('\n🎉 All issues created successfully!');
}).catch((error) => {
  console.error('\n❌ Error creating issues:', error);
  process.exit(1);
});
