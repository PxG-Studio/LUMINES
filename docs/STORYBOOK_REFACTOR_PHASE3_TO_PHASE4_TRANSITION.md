# PHASE 3 → PHASE 4 TRANSITION PLAN

**Date:** December 2024  
**Status:** 🔄 Transitioning to Phase 4  
**Purpose:** Complete file migration and begin import path fixes

---

## STRATEGY

Instead of completing all file migrations in Phase 3, then fixing all imports in Phase 4, we'll:

1. **Migrate files in batches** while **fixing imports immediately**
2. **Verify each batch** before moving to the next
3. **Ensure Storybook compiles** after each major section

This approach ensures:
- Files work immediately after migration
- Errors are caught early
- Storybook remains functional throughout

---

## BATCH MIGRATION ORDER

### Batch 1: Application Pages - Editor Shell (7 files)
**Status:** ✅ Titles updated, need migration + import fixes

Files:
- `EditorShell/AppShell/AppShell.stories.tsx`
- `EditorShell/AppShell/EditorShell.stories.tsx`
- `EditorShell/TopBar/TopBar.stories.tsx`
- `EditorShell/Sidebar/Sidebar.stories.tsx`
- `EditorShell/Tabs/Tabs.stories.tsx`
- `EditorShell/CommandPalette/CommandPalette.stories.tsx`
- `EditorShell/SplitPane/SplitPane.stories.tsx`

**Target:** `Application Pages/Editor/AppShell/`

**Import Fixes Needed:**
- All imports use `@/editor/shell/*` - these should remain valid (absolute paths)
- Verify imports work from new location

---

### Batch 2: Application Pages - Filesystem (3 files)
**Status:** ✅ Titles updated, need migration + import fixes

Files:
- `Filesystem/Tree/FileTree.stories.tsx`
- `Filesystem/FileTabs/FileTabs.stories.tsx`
- `Filesystem/FilePreview/FilePreview.stories.tsx`

**Target:** `Application Pages/Filesystem/`

**Import Fixes Needed:**
- `@/editor/filesystem/*` imports should remain valid

---

### Batch 3: Application Pages - Editor Components (4 files)
**Status:** ✅ Titles updated, need migration + import fixes

Files:
- `Editor/MonacoEditor/MonacoEditor.stories.tsx`
- `Editor/SearchReplace/SearchReplace.stories.tsx`
- `Editor/Complete/EditorContainer.stories.tsx`
- `Editor/GameDev/*.stories.tsx` (3 files)

**Target:** `Application Pages/Editor/` subdirectories

---

### Batch 4: WISSIL Framework - Remaining Systems (30+ files)
**Status:** 🔄 Need migration + import fixes

Systems to complete:
- Slate (5 files)
- Ignition (6 files)
- Spark (4 files)
- Ignis (9 files)
- Waypoint (5 files)
- Simulation (1 file)
- Unity Bridge (4 files)

---

### Batch 5: Integrations & System (4+ files)
**Status:** ⏭️ Need migration + import fixes

Files:
- `plugins/ExamplePlugin.stories.tsx`
- System components (to be created)

---

## IMPORT PATH MAPPING

### Pattern 1: Absolute Imports (Keep As-Is)
```typescript
// These should work from any location
import { Button } from '@/design-system/primitives/Button';
import { AppShell } from '@/editor/shell/AppShell';
import { FileTree } from '@/editor/filesystem/FileTree';
```

### Pattern 2: Relative Imports (May Need Update)
```typescript
// Old (relative)
import { Panel } from './Panel';

// New (may need absolute or adjusted relative)
import { Panel } from '@/design-system/primitives/Panel';
```

### Pattern 3: Story Component Imports
```typescript
// Pages - import from app directory
import LandingPage from '@/app/landing/page';
import SlatePage from '@/app/slate/page';

// Components - import from component directories
import { LandingLayout } from '@/wissil/Landing/LandingLayout';
import { SlateLayout } from '@/wissil/Slate/SlateLayout';
```

---

## VALIDATION CHECKLIST

After each batch:
- [ ] All files moved to correct location
- [ ] All imports resolve correctly
- [ ] Storybook compiles without errors
- [ ] Stories appear in correct hierarchy
- [ ] No broken relative imports

---

## NEXT: Execute Batch Migration with Import Fixes

Starting with **Batch 1: Application Pages - Editor Shell**



