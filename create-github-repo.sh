#!/bin/bash

# Script to create LUMINES repository on GitHub
# Run this script after authenticating with GitHub CLI

set -e

echo "🚀 Creating LUMINES repository on GitHub..."

# Check if authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo ""
    echo "Please run: gh auth login"
    echo "Then run this script again, or run:"
    echo "  gh repo create LUMINES --public --source=. --remote=origin --description 'WISSIL System - Workspace, Identity, Spark, Slate, Ignis, Landing - LumenForge.io Ecosystem with Storybook' --push"
    exit 1
fi

# Create repository
gh repo create LUMINES \
  --public \
  --source=. \
  --remote=origin \
  --description "WISSIL System - Workspace, Identity, Spark, Slate, Ignis, Landing - LumenForge.io Ecosystem with Storybook" \
  --push

echo ""
echo "✅ Repository created successfully!"
echo "🌐 View it at: https://github.com/$(gh api user --jq .login)/LUMINES"
