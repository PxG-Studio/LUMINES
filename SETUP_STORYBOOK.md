# Storybook Setup Guide

## Prerequisites

You need Node.js and npm installed to run Storybook.

### Install Node.js and npm

**Option 1: Using nvm (Recommended)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18 (LTS)
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

**Option 2: Using apt (Ubuntu/Debian)**
```bash
# Install Node.js and npm
sudo apt update
sudo apt install -y nodejs npm

# Verify installation
node --version
npm --version
```

**Option 3: Using snap**
```bash
sudo snap install node --classic
```

## Setup Storybook

Once Node.js and npm are installed:

```bash
# Navigate to project directory
cd /home/cursor-dev/Documents/Lumines

# Install dependencies
npm install

# Build Storybook (creates static files)
npm run build-storybook

# Start Storybook development server
npm run storybook
```

## Access Storybook

After running `npm run storybook`, open your browser to:
```
http://localhost:6006
```

## Storybook Structure

You'll see all WISSIL systems:
- **LANDING** - Production Landing Page
- **WAYPOINT** - Unity Visual Scripting
- **SPARK** - IDE Experience
- **SLATE** - Workspace & Identity
- **IGNIS** - API Backend
- **IGNITION** - Project Bootstrap

Each system has multiple story variants and documentation.

## Troubleshooting

If you encounter issues:

1. **Port 6006 already in use:**
   ```bash
   # Kill process on port 6006
   lsof -ti:6006 | xargs kill -9
   ```

2. **Permission errors:**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

3. **Clear cache:**
   ```bash
   rm -rf node_modules .next storybook-static
   npm install
   ```
