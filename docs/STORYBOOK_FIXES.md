# Storybook Compilation Fixes

## Issues Fixed

### 1. Case-Sensitive Path Mismatches ✅
**Problem:** Windows file system is case-insensitive, but imports were using lowercase while folders are PascalCase on disk.

**Fixed Imports:**
- `@/wissil/ignis-webgl/` → `@/wissil/IgnisWebGL/`
- `@/wissil/unity-browser/` → `@/wissil/UnityBrowser/`
- `@/wissil/unity-io/` → `@/wissil/UnityIO/`
- `@/wissil/project-io/` → `@/wissil/ProjectIO/`
- `@/wissil/ignition/` → `@/wissil/Ignition/`
- `@/wissil/ignis/` → `@/wissil/Ignis/`
- `@/wissil/slate/` → `@/wissil/Slate/`
- `@/wissil/landing/` → `@/wissil/Landing/`

### 2. Files Updated

**WISSIL Components:**
- `src/wissil/Ignis/IgnisContainer.tsx`
- `src/wissil/Slate/SlateLayout.tsx`
- `src/wissil/Slate/components/ConsolePanel.tsx`
- `src/wissil/Slate/components/EditorToolbar.tsx`
- `src/wissil/Slate/components/PreviewPanel.tsx`
- `src/wissil/Spark/loader/sparkLoader.ts`
- `src/wissil/runtime/ignition/ignitionController.ts`
- `src/wissil/runtime/live/MaterialInjector.ts`
- `src/wissil/UnityIO/*.ts` (multiple files)
- `src/wissil/Unity/UnityPanel.tsx`
- `src/wissil/ProjectIO/importProject.ts`
- `src/wissil/SparkUnity/loadUnityTemplate.ts`
- `src/wissil/multiplayer/BreakpointSync.ts`

**Story Files:**
- `src/stories/unity/CardFront/HUD/CardHud.stories.tsx`
- `src/stories/unity/CardFront/Cards/CardFace.stories.tsx`
- `src/story-components/UnityAssetStory.tsx`

**App Files:**
- `src/app/landing/page.tsx`

**Configuration:**
- `.storybook/main.ts` - Removed non-existent story paths

### 3. Storybook Configuration ✅
- Removed references to non-existent `WISSIL` and `DesignSystem` story directories
- Stories will be discovered through the main `../src/stories/**/*.stories.*` pattern

## Note on Folder Naming

**Current State:**
- Folders on disk are **PascalCase** (e.g., `Ignis`, `Ignition`, `Slate`)
- This is due to Windows case-insensitivity
- Imports now match the actual folder names on disk

**Future Consideration:**
- To properly rename folders to lowercase, use Git on a case-sensitive system (Linux/Mac)
- Or use a two-step rename process (rename to temp name, then to final name)

## Verification

After these fixes:
- ✅ All imports match actual folder names
- ✅ Case-sensitive path errors should be resolved
- ✅ Storybook should compile successfully
