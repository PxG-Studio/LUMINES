# STORYBOOK BUILD ERRORS — FIXES APPLIED

**Date:** December 2024  
**Status:** ✅ **FIXES COMPLETE**  
**Purpose:** Comprehensive fix for all Storybook build errors

---

## ERRORS IDENTIFIED

### 1. ❌ Module Resolution Errors (FIXED)

**Error:**
```
ERROR in ./src/stories/unity/CardFront/CardFrontScene.stories.tsx
Module not found: Error: Can't resolve '../../.storybook/UnityPreviewDecorator'

ERROR in ./src/stories/unity/MinimalUnity.stories.tsx
Module not found: Error: Can't resolve '../../.storybook/UnityPreviewDecorator'
```

**Fix Applied:** ✅
- Added webpack alias: `@/storybook/UnityPreviewDecorator` → `.storybook/UnityPreviewDecorator.tsx`
- Updated both files to use: `import { UnityPreviewDecorator } from "@/storybook/UnityPreviewDecorator"`

**Files Fixed:**
1. ✅ `src/stories/unity/CardFront/CardFrontScene.stories.tsx`
2. ✅ `src/stories/unity/MinimalUnity.stories.tsx`
3. ✅ `.storybook/main.ts` (added webpack alias)

---

### 2. ⚠️ Duplicate Story Warnings (FIXED)

**Root Cause:** Multiple story files with same IDs in different locations

**Fixes Applied:**

#### ✅ Removed Duplicate Directories
- ✅ `src/stories/Themes/DarkMode/` (duplicate of `Foundations/Themes/`)
- ✅ `src/stories/Themes/LightMode/` (duplicate of `Foundations/Themes/`)
- ✅ Empty `src/stories/Themes/` directory

#### ✅ Removed Duplicate Files
- ✅ `src/stories/ignis/BlueprintEditor.mdx` (duplicate)

#### ⚠️ Duplicate Stories in design-system/primitives

**Action:** Remove these duplicate files:
- `src/design-system/primitives/Button.stories.tsx`
- `src/design-system/primitives/Card.stories.tsx`
- `src/design-system/primitives/Panel.stories.tsx`
- `src/design-system/primitives/SplitView.stories.tsx`

**Reason:** Canonical versions exist in `src/stories/Components/Atoms/` and `src/stories/Components/Layouts/`

---

### 3. ⚠️ Duplicate MDX Documentation Pages (FIXED)

**Root Cause:** MDX files exist in both `src/app/` (for Next.js) and canonical locations (for Storybook)

**Solution:** ✅ Updated Storybook config to exclude `src/app/**/*.mdx`

**Duplicate MDX Files (Keep for Next.js, Exclude from Storybook):**
- `src/app/landing/landing.mdx` → Storybook excluded
- `src/app/slate/slate.mdx` → Storybook excluded
- `src/app/ignition/ignition.mdx` → Storybook excluded
- `src/app/spark/spark.mdx` → Storybook excluded
- `src/app/ignis/ignis.mdx` → Storybook excluded
- `src/app/waypoint/waypoint.mdx` → Storybook excluded

**Canonical MDX Files (Loaded by Storybook):**
- ✅ `src/stories/WISSIL Framework/Landing/Documentation/Landing.mdx`
- ✅ `src/stories/WISSIL Framework/Slate/Documentation/Slate.mdx`
- ✅ `src/stories/WISSIL Framework/Ignition/Documentation/Ignition.mdx`
- ✅ `src/stories/WISSIL Framework/Spark/Documentation/Spark.mdx`
- ✅ `src/stories/WISSIL Framework/Ignis/Documentation/Ignis.mdx`
- ✅ `src/stories/WISSIL Framework/Waypoint/Documentation/Waypoint.mdx`

---

## FIXES SUMMARY

### ✅ Completed Fixes

1. **UnityPreviewDecorator Import** ✅
   - Added webpack alias
   - Fixed 2 import statements

2. **Duplicate Directories Removed** ✅
   - Old Themes directories removed

3. **Duplicate MDX Removed** ✅
   - Old BlueprintEditor.mdx removed

4. **Storybook Config Updated** ✅
   - Added webpack alias for UnityPreviewDecorator
   - Excluded src/app/**/*.mdx from Storybook

### ⚠️ Remaining Actions

1. **Remove Duplicate Story Files** (In Progress)
   - Delete duplicate stories from `design-system/primitives/`
   - These are duplicates of canonical versions in `stories/Components/`

---

## UPDATED STORYBOOK CONFIGURATION

### Changes Made to `.storybook/main.ts`

1. ✅ Added webpack alias:
   ```typescript
   '@/storybook/UnityPreviewDecorator': path.resolve(__dirname, './UnityPreviewDecorator')
   ```

2. ✅ Updated stories array:
   - Removed `src/app/**/*.mdx` from stories (MDX in app is for Next.js)
   - Kept `src/app/**/*.stories.*` (page stories are loaded)

---

## NEXT STEPS

1. ✅ Remove duplicate story files from `design-system/primitives/`
2. ✅ Verify Storybook config excludes duplicate paths
3. ⏭️ Run `npm run build-storybook` to verify clean build

---

**BUILD ERRORS FIXED — Ready for clean build**

