#!/bin/bash

# Create LUMINES repository under PxG-Studio organization
# This script will authenticate and create the repo

set -e

echo "🚀 Creating LUMINES repository under PxG-Studio organization..."

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
    echo "📝 Authenticating with GitHub CLI..."
    echo "   Please follow the prompts to authenticate"
    gh auth login --git-protocol ssh --hostname github.com
fi

# Create repository under PxG-Studio org
echo "📦 Creating repository..."
gh repo create PxG-Studio/LUMINES \
  --public \
  --source=. \
  --remote=origin \
  --description "WISSIL System - Workspace, Identity, Spark, Slate, Ignis, Landing - LumenForge.io Ecosystem with Storybook"

# Push code
echo "📤 Pushing code to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Repository created successfully!"
echo "🌐 View it at: https://github.com/PxG-Studio/LUMINES"
