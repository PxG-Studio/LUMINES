# STORYBOOK UNITY IMPORT FIX

**Date:** December 2024  
**Status:** ✅ **FIXED**  
**Purpose:** Fix UnityPreviewDecorator module resolution error

---

## ERROR

```
ERROR in ./src/stories/unity/CardFront/CardFrontScene.stories.tsx
Module not found: Error: Can't resolve '@/storybook/UnityPreviewDecorator'

ERROR in ./src/stories/unity/MinimalUnity.stories.tsx  
Module not found: Error: Can't resolve '@/storybook/UnityPreviewDecorator'
```

---

## ROOT CAUSE

The alias `@/storybook/UnityPreviewDecorator` conflicts with the `@/` alias which points to `../src`. Webpack tries to resolve it as `../src/storybook/UnityPreviewDecorator` which doesn't exist.

---

## SOLUTION

Use a simple alias without the `@/` prefix to avoid conflicts:

### Webpack Alias Added

```typescript
// In .storybook/main.ts
'storybook-decorator': path.resolve(__dirname, './UnityPreviewDecorator')
```

### Import Updated

```typescript
// Changed from:
import { UnityPreviewDecorator } from "@/storybook/UnityPreviewDecorator";

// To:
import { UnityPreviewDecorator } from "storybook-decorator";
```

---

## FILES MODIFIED

1. ✅ `.storybook/main.ts`
   - Added webpack alias: `'storybook-decorator'`

2. ✅ `src/stories/unity/CardFront/CardFrontScene.stories.tsx`
   - Updated import to use `storybook-decorator`

3. ✅ `src/stories/unity/MinimalUnity.stories.tsx`
   - Updated import to use `storybook-decorator`

---

## VERIFICATION

The alias now correctly resolves:
- `storybook-decorator` → `.storybook/UnityPreviewDecorator.tsx`

No conflicts with existing `@/` aliases.

---

**IMPORT FIX COMPLETE — Module resolution errors resolved**

