# Storybook Installation Fix

## Issues Fixed

### 1. Incorrect Mermaid Package Name
**Error**: `@mermaid-js/mermaid@^10.6.1' is not in this registry`

**Fix**: Changed from `@mermaid-js/mermaid` to `mermaid` in `package.json`

The correct package name is `mermaid`, not `@mermaid-js/mermaid`.

### 2. Missing tsx Command
**Error**: `'tsx' is not recognized as an internal or external command`

**Fix**: Changed script from `tsx` to `npx tsx` in `package.json`

This ensures tsx runs via npx even if not globally installed.

## Changes Made

### package.json
```json
// Before
"@mermaid-js/mermaid": "^10.6.1",
"storybook:sync-wissil": "tsx scripts/generate-wissil-stories.ts",

// After
"mermaid": "^10.6.1",
"storybook:sync-wissil": "npx tsx scripts/generate-wissil-stories.ts",
```

## Next Steps

1. **Install dependencies**:
   ```powershell
   npm install --legacy-peer-deps
   ```

2. **Verify installation**:
   ```powershell
   Test-Path node_modules/mermaid
   Test-Path node_modules/tsx
   ```

3. **Run Storybook**:
   ```powershell
   npm run storybook
   ```

## Verification

After installation, you should see:
- ✅ No "404 Not Found" errors
- ✅ `tsx` command works via `npx`
- ✅ Storybook sync script runs successfully
- ✅ Storybook starts without errors

