#!/bin/bash

# GitHub MCP Issue Creator using Podman
# This script reads TODO.md and creates GitHub issues using the GitHub MCP server

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <GITHUB_TOKEN>"
    echo "Example: $0 ghp_xxxxxxxxxxxxxxxxxxxx"
    exit 1
fi

GITHUB_TOKEN="$1"
OWNER="ryanzzff"
REPO="hatesub"

# Function to create a GitHub issue using MCP
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    local request=$(cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_issue",
    "arguments": {
      "owner": "$OWNER",
      "repo": "$REPO",
      "title": "$title",
      "body": "$body",
      "labels": [$labels]
    }
  }
}
EOF
)
    
    echo "$request" | podman run -i --rm \
        -e "GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_TOKEN" \
        -e "GITHUB_TOOLSETS=issues" \
        ghcr.io/github/github-mcp-server
}

# Parse TODO.md and create issues
echo "🚀 Creating GitHub issues from TODO.md..."

# List of incomplete TODO items (excluding C2 which is covered by S7)
declare -A items=(
    ["S8"]="Configure user authentication system|setup,infrastructure"
    ["C1"]="Create data models/types (including subscription reason field)|core,mvp"
    ["C3"]="Implement user authentication and registration|core,mvp"
    ["C4"]="Build main dashboard layout (mobile-first)|core,mvp,ui"
    ["C5"]="Implement subscription CRUD operations|core,mvp"
    ["C6"]="Create add/edit subscription form with reason field|core,mvp,ui"
    ["C7"]="Build rating system components|core,mvp,ui"
    ["C8"]="Implement cost calculation logic with multi-currency support|core,mvp"
    ["C9"]="Create recommendations algorithm (non-AI based)|core,mvp"
    ["C10"]="Build insights/recommendations page|core,mvp,ui"
    ["C11"]="Add responsive design (mobile-first with TailwindCSS)|core,mvp,ui"
    ["C12"]="Implement basic error handling|core,mvp"
    ["C13"]="Add subscription categories system|core,mvp"
    ["E1"]="Implement data export functionality|enhancement"
    ["E2"]="Create spending analytics charts|enhancement,ui"
    ["E3"]="Add renewal date notifications|enhancement"
    ["E4"]="Implement search and filtering|enhancement"
    ["E5"]="Add bulk actions (edit multiple subscriptions)|enhancement"
    ["E6"]="Create settings page|enhancement,ui"
    ["E7"]="Add dark mode support|enhancement,ui"
    ["E8"]="Multi-currency conversion and display|enhancement"
    ["E9"]="Advanced subscription categorization|enhancement"
    ["T1"]="Write unit tests for core functions|testing"
    ["T2"]="Add integration tests|testing"
    ["T3"]="Perform usability testing|testing,ux"
    ["T4"]="Optimize performance|testing,performance"
    ["T5"]="Add accessibility features|testing,accessibility"
    ["T6"]="Create user documentation|testing,docs"
    ["T7"]="Prepare for deployment on Cloudflare Pages|testing,deployment"
    ["F1"]="AI-driven recommendations|future,ai"
    ["F2"]="Bank/credit card integration|future,integration"
    ["F3"]="Automatic subscription detection|future,ai"
    ["F4"]="Negotiation assistant for better deals|future,ai"
    ["F5"]="Create sharing features|future,social"
    ["F6"]="Build mobile app version|future,mobile"
    ["F7"]="Add subscription marketplace|future,marketplace"
    ["F8"]="Family plan optimization suggestions|future,ai"
    ["M1"]="Ensure all components work well on mobile screens|mobile,ui"
    ["M2"]="Optimize touch interactions|mobile,ux"
    ["M3"]="Implement swipe gestures for subscription management|mobile,ux"
    ["M4"]="Responsive navigation suitable for mobile|mobile,ui"
    ["M5"]="Performance optimization for mobile devices|mobile,performance"
    ["D1"]="Implement secure user data handling|security,data"
    ["D2"]="Set up data backup and recovery|security,data"
    ["D3"]="Add data privacy controls|security,privacy"
    ["D4"]="Implement secure session management|security,auth"
    ["D5"]="Add GDPR compliance features (data export, deletion)|security,privacy,compliance"
)

counter=0
total=${#items[@]}

for code in "${!items[@]}"; do
    IFS='|' read -r title labels <<< "${items[$code]}"
    
    body="## Description
$title

## Task Code
$code

## Project Context
This task is part of the HateSub subscription management application. HateSub helps users track and manage their subscriptions with features like cost calculation, recommendations, and insights.

## Acceptance Criteria
- [ ] Implementation complete
- [ ] Tests written (if applicable)  
- [ ] Documentation updated (if applicable)
- [ ] Code reviewed and merged
- [ ] Update TODO.md to mark as completed

## Related Files
- \`docs/TODO.md\` - Main TODO list
- \`docs/PRD.md\` - Product requirements
- \`docs/DATABASE.md\` - Database documentation

---
*Auto-generated from TODO.md via GitHub MCP*"

    # Convert labels to JSON array format
    json_labels=$(echo "$labels" | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')
    
    ((counter++))
    echo "[$counter/$total] Creating issue: $code - $title"
    
    # Create the issue
    response=$(create_issue "$code: $title" "$body" "$json_labels")
    
    # Check if creation was successful
    if echo "$response" | grep -q '"result"'; then
        issue_url=$(echo "$response" | grep -o '"html_url":"[^"]*"' | cut -d'"' -f4)
        echo "✅ Created: $issue_url"
    else
        echo "❌ Failed to create issue for $code"
        echo "Response: $response"
    fi
    
    # Rate limiting - pause between requests
    sleep 2
done

echo "🎉 Completed creating $counter GitHub issues!"
echo ""
echo "You can view all issues at: https://github.com/$OWNER/$REPO/issues"
