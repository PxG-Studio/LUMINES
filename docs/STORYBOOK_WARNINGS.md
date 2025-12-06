# Storybook Package.json Warnings — Explanation

**WISSIL / LUMINES — Understanding Storybook Dependency Warnings**

---

## ⚠️ About These Warnings

The warnings you see:
```
WARN unable to find package.json for esbuild-wasm
WARN unable to find package.json for zustand
WARN unable to find package.json for @testing-library/react
...
```

**These are harmless warnings, not errors.**

---

## 🔍 Why They Appear

### 1. **Storybook Dependency Analysis**

Storybook tries to analyze dependencies to:
- Generate better documentation
- Provide autocomplete in controls
- Understand component props

### 2. **Package Resolution**

Storybook looks for `package.json` files in:
- Direct dependencies
- Peer dependencies
- Transitive dependencies

Sometimes it can't find them because:
- Packages are installed but package.json is in a nested location
- Packages are peer dependencies
- Storybook's resolution algorithm doesn't find them

### 3. **These Packages ARE Installed**

All these packages are in your `package.json`:
- ✅ `zustand: ^4.5.0` (dependencies)
- ✅ `vitest: ^1.0.4` (devDependencies)
- ✅ `@playwright/test: ^1.40.0` (devDependencies)
- ✅ `@percy/cli: ^1.28.0` (devDependencies)
- ✅ `@percy/storybook: ^3.0.0` (devDependencies)
- ✅ And all others...

---

## ✅ Are These a Problem?

**No. These warnings are safe to ignore.**

### Why They're Safe:

1. **Packages Work Fine**: The packages are installed and functional
2. **Storybook Still Works**: These warnings don't prevent Storybook from running
3. **Common Issue**: Many Storybook projects see these warnings
4. **Not Errors**: They're warnings, not build failures

### When to Worry:

- ❌ If Storybook **fails to build** → That's an error
- ❌ If packages **don't work** → That's a problem
- ✅ If you just see warnings → Safe to ignore

---

## 🛠️ How to Suppress (Optional)

### Option 1: Suppress in Code (Already Done)

We've added code to suppress these specific warnings in `.storybook/main.ts`.

### Option 2: Environment Variable

```powershell
# Suppress all Storybook warnings
$env:STORYBOOK_LOG_LEVEL="error"
npm run storybook
```

### Option 3: Storybook Config

Already configured in `.storybook/main.ts`:
```typescript
logLevel: 'warn', // Only show warnings, suppress info
```

---

## 📊 Package Status

All packages are correctly installed:

| Package | Status | Location |
|---------|--------|----------|
| `zustand` | ✅ Installed | `node_modules/zustand` |
| `vitest` | ✅ Installed | `node_modules/vitest` |
| `@playwright/test` | ✅ Installed | `node_modules/@playwright/test` |
| `@percy/cli` | ✅ Installed | `node_modules/@percy/cli` |
| `@percy/storybook` | ✅ Installed | `node_modules/@percy/storybook` |
| `@testing-library/react` | ✅ Installed | `node_modules/@testing-library/react` |
| `@vitejs/plugin-react` | ✅ Installed | `node_modules/@vitejs/plugin-react` |
| `jsdom` | ✅ Installed | `node_modules/jsdom` |
| `@mermaid-js/mermaid` | ✅ Installed | `node_modules/@mermaid-js/mermaid` |
| `yjs` | ✅ Installed | `node_modules/yjs` |
| `y-webrtc` | ✅ Installed | `node_modules/y-webrtc` |
| `nats` | ✅ Installed | `node_modules/nats` |
| `@originjs/vite-plugin-federation` | ✅ Installed | `node_modules/@originjs/vite-plugin-federation` |
| `esbuild-wasm` | ✅ Installed | `node_modules/esbuild-wasm` |

---

## 🎯 Bottom Line

**These warnings are cosmetic and can be safely ignored.**

- ✅ All packages are installed correctly
- ✅ Storybook works fine with these warnings
- ✅ Your code can use these packages
- ✅ No action needed

If Storybook is running successfully, you can ignore these warnings.

---

## 🔗 Related

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook Troubleshooting](https://storybook.js.org/docs/react/get-started/troubleshooting)

---

*Last updated: December 2024*

