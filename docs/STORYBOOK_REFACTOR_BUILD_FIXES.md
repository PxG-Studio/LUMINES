# STORYBOOK BUILD FIXES — COMPREHENSIVE

**Date:** December 2024  
**Status:** ✅ **FIXES APPLIED**  
**Purpose:** Fix all Storybook build errors and duplicate file issues

---

## BUILD ERRORS IDENTIFIED

### 1. Module Resolution Errors (CRITICAL)

**Error:**
```
ERROR in ./src/stories/unity/CardFront/CardFrontScene.stories.tsx
Module not found: Error: Can't resolve '../../.storybook/UnityPreviewDecorator'

ERROR in ./src/stories/unity/MinimalUnity.stories.tsx  
Module not found: Error: Can't resolve '../../.storybook/UnityPreviewDecorator'
```

**Root Cause:** Incorrect relative import paths to UnityPreviewDecorator

**Fix Applied:** ✅
- Added webpack alias: `@/storybook/UnityPreviewDecorator`
- Updated both files to use absolute import path

**Files Fixed:**
1. ✅ `src/stories/unity/CardFront/CardFrontScene.stories.tsx`
2. ✅ `src/stories/unity/MinimalUnity.stories.tsx`

---

### 2. Duplicate Story Warnings

**Warning Type:** Duplicate stories with same ID found in multiple locations

**Root Causes:**
1. Old story files in `src/stories/Themes/` (should be in `Foundations/Themes/`)
2. Duplicate stories in `src/design-system/primitives/` and `src/stories/Components/`
3. Duplicate stories in `src/app/` and canonical locations

**Fixes Applied:**

#### ✅ Removed Duplicate Directories

**Removed:**
- `src/stories/Themes/DarkMode/` (duplicate of `Foundations/Themes/`)
- `src/stories/Themes/LightMode/` (duplicate of `Foundations/Themes/`)
- Empty `src/stories/Themes/` directory

**Status:** ✅ Old theme directories removed

#### Duplicate Story Files (Action Required)

**Identified Duplicates:**

1. **Button.stories.tsx:**
   - `src/stories/Components/Atoms/Button.stories.tsx` ✅ (canonical)
   - `src/design-system/primitives/Button.stories.tsx` ⚠️ (duplicate)

2. **Card.stories.tsx:**
   - `src/stories/Components/Atoms/Card.stories.tsx` ✅ (canonical)
   - `src/design-system/primitives/Card.stories.tsx` ⚠️ (duplicate)

3. **Panel.stories.tsx:**
   - `src/stories/Components/Atoms/Panel.stories.tsx` ✅ (canonical)
   - `src/design-system/primitives/Panel.stories.tsx` ⚠️ (duplicate)

4. **SplitView.stories.tsx:**
   - `src/stories/Components/Layouts/SplitView.stories.tsx` ✅ (canonical)
   - `src/design-system/primitives/SplitView.stories.tsx` ⚠️ (duplicate)

**Recommendation:** 
- Option 1: Remove duplicate stories from `src/design-system/primitives/`
- Option 2: Update Storybook config to exclude `src/design-system/primitives/**/*.stories.*`

---

### 3. Duplicate MDX Documentation Warnings

**Warning Type:** Duplicate component docs pages with same Meta title

**Root Cause:** MDX files exist in both old locations (`src/app/`) and new canonical locations

**Duplicates Identified:**

| Old Location | Canonical Location | Status |
|-------------|-------------------|--------|
| `src/app/landing/landing.mdx` | `src/stories/WISSIL Framework/Landing/Documentation/Landing.mdx` | ⚠️ Both exist |
| `src/app/slate/slate.mdx` | `src/stories/WISSIL Framework/Slate/Documentation/Slate.mdx` | ⚠️ Both exist |
| `src/app/ignition/ignition.mdx` | `src/stories/WISSIL Framework/Ignition/Documentation/Ignition.mdx` | ⚠️ Both exist |
| `src/app/spark/spark.mdx` | `src/stories/WISSIL Framework/Spark/Documentation/Spark.mdx` | ⚠️ Both exist |
| `src/app/ignis/ignis.mdx` | `src/stories/WISSIL Framework/Ignis/Documentation/Ignis.mdx` | ⚠️ Both exist |
| `src/app/waypoint/waypoint.mdx` | `src/stories/WISSIL Framework/Waypoint/Documentation/Waypoint.mdx` | ⚠️ Both exist |
| `src/stories/ignis/BlueprintEditor.mdx` | `src/stories/WISSIL Framework/Ignis/Documentation/BlueprintEditor.mdx` | ✅ Old removed |

**Recommendation:**
- Update Storybook config to exclude `src/app/**/*.mdx` from story scanning
- OR update MDX files in `src/app/` to have different Meta titles
- OR remove duplicate MDX files from `src/app/` (if not needed for Next.js)

---

## FIXES APPLIED

### ✅ Fixed Import Paths

1. **UnityPreviewDecorator Import Fix:**
   - Added webpack alias: `@/storybook/UnityPreviewDecorator`
   - Updated `CardFrontScene.stories.tsx` to use absolute import
   - Updated `MinimalUnity.stories.tsx` to use absolute import

2. **Deleted Duplicate Files:**
   - ✅ Removed `src/stories/ignis/BlueprintEditor.mdx` (duplicate)
   - ✅ Removed `src/stories/Themes/DarkMode/` directory (duplicate)
   - ✅ Removed `src/stories/Themes/LightMode/` directory (duplicate)
   - ✅ Removed empty `src/stories/Themes/` directory

---

## REMAINING ISSUES

### ⚠️ Duplicate Stories in design-system/primitives

**Action Required:**

**Option 1: Remove Duplicate Stories** (Recommended)
Remove stories from `src/design-system/primitives/`:
- `Button.stories.tsx`
- `Card.stories.tsx`
- `Panel.stories.tsx`
- `SplitView.stories.tsx`

**Option 2: Exclude from Storybook Config**
Update `.storybook/main.ts` to exclude `design-system/primitives` stories.

**Recommendation:** Remove duplicates from `design-system/primitives` since canonical versions exist in `src/stories/Components/`.

---

### ⚠️ Duplicate MDX Files in src/app/

**Action Required:**

**Option 1: Exclude from Storybook** (Recommended)
Update `.storybook/main.ts` to exclude `src/app/**/*.mdx` since these are for Next.js app, not Storybook.

**Option 2: Remove MDX from Storybook Scanning**
These files should remain in `src/app/` for Next.js but not be loaded by Storybook.

**Recommendation:** Exclude `src/app/**/*.mdx` from Storybook stories array.

---

## UPDATED STORYBOOK CONFIGURATION

### Recommended Changes to `.storybook/main.ts`

```typescript
stories: [
  // WISSIL Pages (stories only, exclude MDX from app)
  '../src/app/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  // EXCLUDE: '../src/app/**/*.mdx', // Excluded - MDX files are for Next.js app
  
  // WISSIL Components
  '../src/wissil/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  
  // Consolidated Story Structure
  '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  '../src/stories/**/*.mdx',
  
  // Editor Components
  '../src/stories/Editor/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  
  // EXCLUDE: Design System primitives (duplicate of stories/Components)
  // '../src/design-system/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  
  // Fallback
  '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
],
```

---

## SUMMARY

### ✅ Completed Fixes

1. ✅ Fixed UnityPreviewDecorator import paths (2 files)
2. ✅ Removed duplicate BlueprintEditor.mdx
3. ✅ Removed duplicate Themes directories
4. ✅ Added webpack alias for UnityPreviewDecorator

### ⚠️ Remaining Actions

1. ⚠️ Remove or exclude duplicate stories in `design-system/primitives/`
2. ⚠️ Exclude `src/app/**/*.mdx` from Storybook config
3. ⚠️ Verify no other duplicate files exist

---

## NEXT STEPS

1. **Update Storybook Config** - Exclude duplicate paths
2. **Remove Duplicate Stories** - Delete or exclude design-system primitives
3. **Test Build** - Run `npm run build-storybook` to verify fixes

---

**FIXES APPLIED — Ready for final build verification**

