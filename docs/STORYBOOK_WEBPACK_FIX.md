# Storybook Webpack Module Resolution Fix

## Critical Issue
Webpack cannot resolve dependencies even though they're in `package.json` and `node_modules`.

## Root Cause Analysis
1. **Packages ARE in package.json** ✅
2. **Packages may not be properly installed** ❓
3. **Webpack module resolution may be misconfigured** ❓

## Solution Applied

### 1. Enhanced Webpack Configuration
Updated `.storybook/main.ts` webpack configuration to:
- Prioritize root `node_modules` directory
- Enable symlink resolution
- Ensure proper extension resolution
- Configure `resolveLoader` for webpack loaders

### 2. Dependencies Added to package.json
All required packages are now in `package.json`:
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "monaco-editor": "^0.47.0",
    "simple-git": "^3.27.0",
    "@mdx-js/mdx": "^3.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "fuse.js": "^7.0.0",
    "@webcontainer/api": "^1.1.0",
    "zustand": "^4.5.0",
    "esbuild-wasm": "^0.19.12"
  }
}
```

## Next Steps (CRITICAL)

### Step 1: Clean Install
```powershell
# Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Fresh install
npm install
```

### Step 2: Clear Storybook Cache
```powershell
Remove-Item -Recurse -Force node_modules/.cache
Remove-Item -Recurse -Force .storybook-static
```

### Step 3: Verify Installation
```powershell
# Check if packages exist
Test-Path "node_modules/@monaco-editor/react"
Test-Path "node_modules/zustand"
Test-Path "node_modules/simple-git"
Test-Path "node_modules/@webcontainer/api"
```

### Step 4: Run Storybook
```powershell
npm run storybook
```

## If Issues Persist

### Option A: Force Reinstall Specific Packages
```powershell
npm install @monaco-editor/react monaco-editor simple-git @mdx-js/mdx remark-gfm rehype-highlight fuse.js @webcontainer/api --force
```

### Option B: Check Node/NPM Version
```powershell
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### Option C: Use Yarn Instead
If npm continues to have issues:
```powershell
# Install yarn
npm install -g yarn

# Install dependencies
yarn install

# Run storybook
yarn storybook
```

## Verification Checklist

After following the steps above, verify:
- [ ] All packages listed in `package.json` dependencies exist in `node_modules`
- [ ] No "Module not found" errors in Storybook
- [ ] Storybook starts successfully on port 6006
- [ ] All stories load without errors

## Technical Details

### Webpack Resolution Order
1. Root `node_modules` (explicit path)
2. Standard `node_modules` resolution
3. Existing module paths

### Why This Matters
Storybook uses webpack to bundle code. If webpack can't find modules, it fails. The explicit path resolution ensures webpack looks in the right place first.

