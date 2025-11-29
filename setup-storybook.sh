#!/bin/bash

# Storybook Setup Script
# This script installs Node.js (if needed) and sets up Storybook

set -e

echo "🚀 Setting up Storybook for Lumines WISSIL..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing..."

    # Check if nvm is available
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        echo "📦 Using nvm to install Node.js..."
        source "$HOME/.nvm/nvm.sh"
        nvm install 18
        nvm use 18
    else
        echo "📦 Installing Node.js via apt..."
        sudo apt update
        sudo apt install -y nodejs npm
    fi
fi

# Verify Node.js installation
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo "✅ Node.js installed: $NODE_VERSION"
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ Failed to install Node.js. Please install manually."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Storybook
echo "🔨 Building Storybook..."
npm run build-storybook

echo "✅ Storybook build complete!"
echo ""
echo "To start Storybook development server, run:"
echo "  npm run storybook"
echo ""
echo "Then open http://localhost:6006 in your browser"
