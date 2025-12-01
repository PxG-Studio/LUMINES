# 🚀 Storybook Vite Migration Guide

**Switching from Next.js to Vite Builder for 20-60× Performance**

*Last updated: December 2024*

---

## 📘 Overview

This guide helps you migrate from `@storybook/nextjs` to `@storybook/react-vite` for massive performance improvements.

**Benefits:**
- ✅ 20-60× faster cold starts (90-120s → 2-5s)
- ✅ 10-30× faster story reloads (3-10s → <300ms)
- ✅ Better HMR (Hot Module Replacement)
- ✅ Smaller bundle sizes
- ✅ Better caching

---

## 🔧 Migration Steps

### Step 1: Install Vite Dependencies

```bash
npm install --save-dev @storybook/react-vite @storybook/builder-vite vite
```

### Step 2: Update `.storybook/main.ts`

**Before (Next.js):**
```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  // ...
};
```

**After (Vite):**
```typescript
import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      cacheDir: "../../.cache/storybook-vite",
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "zustand",
          "react-spring",
          "@floating-ui/react",
          "@radix-ui/react-dialog",
          "@tabler/icons-react",
        ],
      },
      build: {
        sourcemap: false,
        chunkSizeWarningLimit: 2000,
      }
    });
  },
  // ...
};
```

### Step 3: Remove Next.js-Specific Code

Remove or update:
- `webpackFinal` → Use `viteFinal` instead
- Next.js aliases → Use Vite `resolve.alias`
- Next.js image optimization → Use Vite asset handling

### Step 4: Update Storybook Scripts

**No changes needed** - scripts remain the same:
```json
{
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

### Step 5: Test Migration

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Run Chromatic
npm run chromatic
```

---

## ⚠️ Breaking Changes

### Next.js-Specific Features

If you're using:
- `next/image` → Replace with regular `<img>` or Vite asset imports
- `next/link` → Replace with regular `<a>` or React Router
- `next/router` → Use React Router or remove
- Next.js API routes → Not available in Storybook

### Webpack Plugins

Vite uses Rollup, not Webpack. Some plugins may need alternatives:
- Webpack plugins → Vite plugins
- Custom loaders → Vite plugins or transforms

---

## 🎯 Performance Comparison

| Metric | Next.js Builder | Vite Builder | Improvement |
|--------|----------------|--------------|-------------|
| Cold Start | 90-120s | 2-5s | **20-60×** |
| Story Reload | 3-10s | <300ms | **10-30×** |
| HMR Speed | Slow | Instant | **10×+** |
| Build Time | 10-15 min | 3-5 min | **3×** |

---

## 🔄 Rollback Plan

If you need to rollback:

1. Revert `.storybook/main.ts` to Next.js config
2. Reinstall Next.js builder: `npm install --save-dev @storybook/nextjs`
3. Remove Vite dependencies: `npm uninstall @storybook/react-vite @storybook/builder-vite vite`

---

## 📚 Additional Resources

- [Storybook Vite Migration Guide](https://storybook.js.org/docs/react/builders/vite)
- [Vite Documentation](https://vitejs.dev/)
- [Phase 6.3 Documentation](./PHASE_6.3_STORYBOOK_CACHING_AND_SPEED.md)

---

**Status: Migration Guide Ready** ✅

*Last Updated: December 2024*

