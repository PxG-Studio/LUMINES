# Phase 4: Folder Naming Standardization - Analysis

## Current State

### PascalCase Folders in `src/wissil/`:
- `Ignis/` → Should be `ignis/`
- `Ignition/` → Should be `ignition/`
- `Landing/` → Should be `landing/`

### Already Lowercase (Correct):
- `luna/` ✅
- `audio/` ✅
- `animation/` ✅
- `build/` ✅
- `gizmos/` ✅
- `lighting/` ✅
- `materials/` ✅
- `multiplayer/` ✅
- `prefabs/` ✅
- `ProjectIO/` ⚠️ (PascalCase - but might be intentional)
- `realtime/` ✅
- `runtime/` ✅
- `scene/` ✅
- `scenegraph/` ✅
- `shader/` ✅
- `sim/` ✅
- `Slate/` ⚠️ (PascalCase - should check)
- `Spark/` ⚠️ (PascalCase - should check)
- `tests/` ✅
- `ui/` ✅
- `Unity/` ⚠️ (PascalCase - should check)
- `UnityBrowser/` ⚠️ (PascalCase - should check)
- `UnityIO/` ⚠️ (PascalCase - should check)
- `Waypoint/` ⚠️ (PascalCase - should check)

## Decision

**Standardize ALL folders to lowercase** for consistency:
- `Ignis/` → `ignis/`
- `Ignition/` → `ignition/`
- `Landing/` → `landing/`
- `Slate/` → `slate/`
- `Spark/` → `spark/`
- `Waypoint/` → `waypoint/`
- `Unity/` → `unity/`
- `UnityBrowser/` → `unity-browser/` or `unitybrowser/`
- `UnityIO/` → `unity-io/` or `unityio/`
- `ProjectIO/` → `project-io/` or `projectio/`

## Action Plan

1. Rename folders systematically
2. Update all imports (grep and replace)
3. Update `.storybook/main.ts` paths
4. Update `tsconfig.json` paths (if any)
5. Verify no broken imports

## Files to Update

- All files importing from PascalCase folders
- `.storybook/main.ts` (webpack aliases)
- `tsconfig.json` (path aliases if any)

