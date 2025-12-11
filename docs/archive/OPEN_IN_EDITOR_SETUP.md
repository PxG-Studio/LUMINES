# 🔧 Open in Editor Setup Guide

## Problem
The "Open in Editor" button in Storybook doesn't work - clicking it doesn't open files in your editor.

## Solution

Storybook's "Open in Editor" feature requires the `STORYBOOK_EDITOR` environment variable to be set. This tells Storybook which editor to use.

### Option 1: Use PowerShell Script (Recommended for Windows)

A PowerShell script has been created that sets the environment variable automatically:

```powershell
npm run storybook:win
```

Or run directly:
```powershell
.\scripts\start-storybook.ps1
```

### Option 2: Set Environment Variable Manually

**For PowerShell:**
```powershell
$env:STORYBOOK_EDITOR = "cursor"
npm run storybook
```

**For Command Prompt:**
```cmd
set STORYBOOK_EDITOR=cursor
npm run storybook
```

**For Git Bash:**
```bash
export STORYBOOK_EDITOR=cursor
npm run storybook
```

### Option 3: Install cross-env (Cross-platform)

If you want to use the npm script directly:

```bash
npm install --save-dev cross-env --legacy-peer-deps
```

Then update `package.json`:
```json
"storybook": "npm run storybook:sync-wissil && cross-env STORYBOOK_EDITOR=cursor npx storybook dev -p 6006"
```

## Supported Editors

- `cursor` - Cursor (recommended for this project)
- `code` - Visual Studio Code
- `webstorm` - WebStorm
- `atom` - Atom
- `sublime` - Sublime Text
- `vim` - Vim
- `emacs` - Emacs

## How It Works

Storybook detects your editor by:
1. Checking the `STORYBOOK_EDITOR` environment variable
2. If not set, auto-detecting from common editor processes
3. Opening files using the editor's command-line interface

## Troubleshooting

### Editor Still Doesn't Open

1. **Verify editor is in PATH:**
   ```powershell
   # For Cursor
   cursor --version
   
   # For VS Code
   code --version
   ```

2. **Check Storybook console:**
   - Open browser DevTools
   - Look for errors when clicking "Open in Editor"
   - Check Network tab for failed requests

3. **Try different editor:**
   ```powershell
   $env:STORYBOOK_EDITOR = "code"  # Try VS Code instead
   npm run storybook
   ```

4. **Check file paths:**
   - Ensure Storybook can resolve file paths correctly
   - Check that source files exist at the expected locations

### Permission Errors

If you get permission errors running the PowerShell script:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Current Configuration

- **Script:** `scripts/start-storybook.ps1`
- **Default Editor:** `cursor`
- **Port:** `6006`

## Quick Start

```powershell
# Use the PowerShell script (sets editor automatically)
npm run storybook:win

# Or use regular npm script (requires manual env var)
npm run storybook
```

---

**After setting up, restart Storybook and try clicking "Open in Editor" again!** ✨

