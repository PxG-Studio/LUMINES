# PHASE 3: PHYSICAL FOLDER RESTRUCTURING PLAN

**Date:** Generated automatically  
**Agent:** Lumenforge.io Design System Storybook Refactor Agent  
**Status:** 🔄 PLANNING - Ready for Execution

---

## Current Structure Analysis

### ✅ Already Correct Locations (No Moves Needed)

1. **Foundations/** - Already matches canonical structure
   - `src/stories/Foundations/Themes/` ✓

2. **Components/** - Already matches canonical structure  
   - `src/stories/Components/Atoms/` ✓
   - `src/stories/Components/Layouts/` ✓

3. **WISSIL Framework/Landing/** - Already well-organized (preserve!)
   - `src/stories/WISSIL Framework/Landing/Pages/MainGateway.stories.tsx` ✓
   - `src/stories/WISSIL Framework/Landing/Shared Framework Components/` ✓
   - `src/stories/WISSIL Framework/Landing/Documentation/Landing.mdx` ✓

### 📦 Files That Need Reorganization

#### A. Ignis Files (Scattered)
- **Current:** `src/stories/ignis/BPGraphCanvas.stories.tsx`
- **Target:** `src/stories/WIS2L Framework/Ignis/Blueprint Editor/Canvas/BPGraphCanvas.stories.tsx`
- **Current:** `src/stories/ignis/NodePalette.stories.tsx`
- **Target:** `src/stories/WIS2L Framework/Ignis/Blueprint Editor/Palette/NodePalette.stories.tsx`
- **Current:** `src/stories/ignis/Nodes/NodeRenderer.stories.tsx` ✓ (already correct path)
- **Current:** `src/stories/ignis/Scenes/BlueprintEditorFull.stories.tsx` ✓ (already correct path)
- **Current:** `src/stories/ignis/Wires/WireRenderer.stories.tsx` ✓ (already correct path)

#### B. Unity Bridge Files
- **Current:** `src/stories/unity/` (all files)
- **Target:** `src/stories/WIS2L Framework/Unity Bridge/`
- Files to move:
  - `MinimalUnity.stories.tsx`
  - `CardFront/CardFrontScene.stories.tsx`
  - `CardFront/Cards/CardFace.stories.tsx`
  - `CardFront/HUD/CardHud.stories.tsx`

#### C. Waypoint Files
- **Current:** `src/stories/Waypoint/` (already mostly correct, just need to move under WIS2L Framework)
- **Target:** `src/stories/WIS2L Framework/Waypoint/`

#### D. Spark Files
- **Current:** `src/stories/Spark/`
- **Target:** `src/stories/WIS2L Framework/Spark/`

#### E. Ignition Runtime Files
- **Current:** `src/stories/IgnitionRuntime/`
- **Target:** `src/stories/WIS2L Framework/Ignition/Runtime/Events/`

#### F. Simulation Files
- **Current:** `src/stories/Simulation/`
- **Target:** `src/stories/WIS2L Framework/Simulation/`

#### G. Application Pages Files
- **Current:** `src/stories/Editor/`, `src/stories/EditorShell/`, `src/stories/Filesystem/`, `src/stories/ide/`
- **Target:** `src/stories/Application Pages/Editor/`

#### H. Integrations Files
- **Current:** `src/stories/plugins/`
- **Target:** `src/stories/Integrations/Plugins/`

---

## CRITICAL: Landing Page Preservation Strategy

### ✅ PRESERVE - DO NOT MOVE:
- `src/stories/WISSIL Framework/Landing/` - **ENTIRE FOLDER STAYS AS-IS**
- All Landing stories, components, and documentation
- All interaction tests and play functions
- All component implementations

### 🔄 Only Update:
- Folder name from `WISSIL Framework` → `WIS2L Framework` (but keep all Landing content intact)
- This is a simple rename, not a destructive move

---

## Execution Plan

### Step 1: Create Canonical Folder Structure
1. Create `src/stories/WIS2L Framework/` (if needed, or rename existing)
2. Create missing subsystem folders:
   - `WIS2L Framework/Ignis/Blueprint Editor/`
   - `WIS2L Framework/Ignis/Blueprint Editor/Canvas/`
   - `WIS2L Framework/Ignis/Blueprint Editor/Palette/`
   - `WIS2L Framework/Unity Bridge/`
   - `WIS2L Framework/Ignition/Runtime/Events/`
   - `Application Pages/Editor/`
   - `Integrations/Plugins/`

### Step 2: Move Files (Non-Landing)
- Move Ignis files to correct locations
- Move Unity files
- Move Waypoint, Spark, Simulation files
- Move Application Pages files
- Move Integrations files

### Step 3: Rename Folder (Landing Preservation)
- Rename `src/stories/WISSIL Framework/` → `src/stories/WIS2L Framework/`
- This preserves all Landing work exactly as-is

### Step 4: Verify
- All Landing files remain intact
- All titles still work
- No broken imports (will fix in Phase 4)

---

## Files That Should NOT Be Moved

- ✅ `src/stories/WISSIL Framework/Landing/` - **PRESERVE ENTIRELY**
- ✅ `src/stories/Foundations/` - Already correct
- ✅ `src/stories/Components/` - Already correct
- ✅ Files in `src/app/` and `src/wissil/` - These are source components, not story files

---

**Next:** Execute Phase 3 moves carefully, preserving all Landing work.

