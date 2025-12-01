# FINAL WISSIL RESTRUCTURE PLAN
## Brutal, Unbiased, Coherent Organization

---

## 🔴 CRITICAL ISSUES IDENTIFIED

### 1. DUPLICATION CHAOS
**Status:** ⚠️ PARTIALLY ADDRESSED

**Ignis Components:**
- ❌ `src/ignis/canvas/BPGraphCanvas.tsx` (DUPLICATE - should use `blueprint/canvas/`)
- ❌ `src/ignis/palette/NodePalette.tsx` (DUPLICATE - should use `blueprint/palette/`)
- ❌ `src/ignis/nodes/NodeRenderer.tsx` (DUPLICATE - should use `blueprint/canvas/NodeRenderer.tsx`)
- ❌ `src/ignis/wires/WireRenderer.tsx` (DUPLICATE - should use `blueprint/canvas/WireRenderer.tsx`)
- ❌ `src/ignis/inspector/BlueprintInspector.tsx` (SHOULD BE in `blueprint/inspector/`)
- ❌ `src/ignis/debugger/DebuggerPanel.tsx` (SHOULD BE in `blueprint/debugger/`)
- ❌ `src/ignis/scenes/BlueprintEditorFull.tsx` (SHOULD BE in `blueprint/scenes/`)

**Editor Filesystem:**
- ⚠️ `src/editor/filesystem/FileTabs.tsx` vs `FileTabsEnhanced.tsx` (merge or rename)
- ⚠️ `src/editor/filesystem/FileTree.tsx` vs `FileTreeEnhanced.tsx` (merge or rename)

**Theme Providers:**
- ⚠️ `src/theme/ThemeProvider.tsx` vs `src/design-system/themes/ThemeProvider.tsx` (consolidate)

### 2. INCONSISTENT NAMING
**Status:** ❌ NOT ADDRESSED

- `src/wissil/Ignis/` (PascalCase) → Should be `ignis/`
- `src/wissil/Ignition/` (PascalCase) → Should be `ignition/`
- `src/wissil/Landing/` (PascalCase) → Should be `landing/`
- `src/wissil/luna/` (lowercase) ✅
- `src/wissil/audio/` (lowercase) ✅

**Decision:** ALL folders should be lowercase for consistency.

### 3. MISPLACED COMPONENTS
**Status:** ❌ NOT ADDRESSED

- `src/components/editor/` → Should be `src/editor/`
- `src/components/panels/` → Should be `src/editor/panels/`
- `src/story-components/` → Should be `src/stories/components/`

### 4. SCATTERED STORIES
**Status:** ❌ NOT ADDRESSED

**Current Chaos:**
- WISSIL subsystems: `src/app/landing/`, `src/app/slate/`, etc. (stories in app routes)
- Editor: `src/stories/Editor/` AND `src/stories/EditorShell/` (split unnecessarily)
- Ignis: `src/stories/ignis/` (should be `src/stories/WISSIL/Ignis/`)
- Design System: `src/design-system/**/*.stories.tsx` (should be `src/stories/DesignSystem/`)

**Target Structure:**
```
src/stories/
├── WISSIL/
│   ├── Landing/
│   ├── Slate/
│   ├── Ignition/
│   ├── Spark/
│   ├── Ignis/
│   └── Waypoint/
├── Editor/
│   ├── Shell/          (merge EditorShell here)
│   ├── Monaco/
│   ├── Filesystem/
│   ├── Runtime/
│   ├── Git/
│   └── GameDev/
├── DesignSystem/
│   ├── Primitives/
│   ├── Layouts/
│   └── Icons/
├── Unity/
├── Themes/
└── Simulation/
```

---

## 📋 EXECUTION PLAN

### Phase 1: Ignis Consolidation ✅ (IN PROGRESS)
**Goal:** Single source of truth for all Ignis Blueprint components

**Actions:**
1. ✅ Archive `src/ignis/canvas/` → `archive/ignis-duplicates/canvas/`
2. ✅ Archive `src/ignis/palette/` → `archive/ignis-duplicates/palette/`
3. ✅ Archive `src/ignis/nodes/` → `archive/ignis-duplicates/nodes/`
4. ✅ Archive `src/ignis/wires/` → `archive/ignis-duplicates/wires/`
5. ⚠️ Move `src/ignis/inspector/` → `src/ignis/blueprint/inspector/` (if not exists)
6. ⚠️ Move `src/ignis/debugger/` → `src/ignis/blueprint/debugger/` (if not exists)
7. ⚠️ Move `src/ignis/scenes/` → `src/ignis/blueprint/scenes/` (if not exists)
8. ⚠️ Update all imports

**Status:** Files still exist - need manual verification

### Phase 2: Enhanced Components
**Goal:** Resolve base vs enhanced component confusion

**Actions:**
1. Review `FileTabs.tsx` vs `FileTabsEnhanced.tsx`
   - If enhanced has all features: Merge into base, remove enhanced
   - If different purposes: Rename base to `FileTabsBasic.tsx`
2. Review `FileTree.tsx` vs `FileTreeEnhanced.tsx`
   - Same decision process
3. Update all imports

### Phase 3: ThemeProvider
**Goal:** Single ThemeProvider location

**Actions:**
1. Check if `src/theme/ThemeProvider.tsx` exists
2. Compare with `src/design-system/themes/ThemeProvider.tsx`
3. Keep design-system version (more organized)
4. Archive or merge duplicate
5. Update all imports

### Phase 4: Folder Naming Standardization
**Goal:** All folders lowercase

**Actions:**
1. Rename `src/wissil/Ignis/` → `src/wissil/ignis/`
2. Rename `src/wissil/Ignition/` → `src/wissil/ignition/`
3. Rename `src/wissil/Landing/` → `src/wissil/landing/`
4. Update all imports (grep and replace)
5. Update `.storybook/main.ts` paths
6. Update `tsconfig.json` paths

### Phase 5: Component Relocation
**Goal:** Components in correct directories

**Actions:**
1. Move `src/components/editor/*` → `src/editor/`
2. Move `src/components/panels/*` → `src/editor/panels/`
3. Move `src/story-components/*` → `src/stories/components/`
4. Update all imports

### Phase 6: Story Consolidation
**Goal:** All stories under `src/stories/` with proper hierarchy

**Actions:**
1. Move `src/app/*/` stories → `src/stories/WISSIL/*/`
2. Merge `src/stories/Editor/` and `src/stories/EditorShell/` → `src/stories/Editor/`
3. Move `src/stories/ignis/` → `src/stories/WISSIL/Ignis/`
4. Move `src/design-system/**/*.stories.tsx` → `src/stories/DesignSystem/`
5. Update `.storybook/main.ts` story paths
6. Update all story imports

### Phase 7: Configuration Updates
**Goal:** All configs reflect new structure

**Actions:**
1. Update `.storybook/main.ts`:
   - Remove old story paths
   - Add new organized paths
   - Update webpack aliases if needed
2. Update `tsconfig.json`:
   - Update path aliases
   - Verify all paths resolve
3. Update `package.json` scripts if needed

### Phase 8: Verification
**Goal:** Everything works

**Actions:**
1. Run `npm run storybook` - should build without errors
2. Verify all stories load in Storybook UI
3. Run `npm run typecheck` - should pass
4. Run `npm run lint` - fix any issues
5. Test a few key components manually

---

## 🎯 TARGET STRUCTURE (FINAL)

```
src/
├── app/                          # Next.js App Router (pages only, NO stories)
│   ├── landing/page.tsx
│   ├── slate/page.tsx
│   ├── ignition/page.tsx
│   ├── spark/page.tsx
│   ├── ignis/page.tsx
│   └── waypoint/page.tsx
│
├── components/                    # Shared components only
│   ├── ui/                       # Base UI primitives
│   └── wissil/                   # WISSIL-specific shared components
│
├── design-system/                 # Design system (Slate)
│   ├── primitives/               # Button, Card, Panel, etc.
│   ├── layouts/                  # FlexCol, FlexRow, etc.
│   ├── icons/                    # Icon components
│   ├── themes/                   # ThemeProvider, themes
│   └── tokens/                   # Design tokens
│
├── editor/                        # Code Editor subsystem
│   ├── shell/                    # AppShell, Sidebar, TopBar, etc.
│   ├── monaco/                   # Monaco Editor integration
│   ├── filesystem/               # FileTree, FileTabs, FilePreview (consolidated)
│   ├── panels/                   # Panel components (moved from components/panels)
│   ├── runtime/                  # Runtime, Console, Terminal
│   ├── git/                      # Git integration
│   ├── gamedev/                  # Unity, SceneGraph, AssetManager
│   ├── accessibility/           # A11y features
│   ├── performance/              # Performance optimizations
│   └── theming/                  # Theme system
│
├── ignis/                         # Ignis Blueprint Editor
│   └── blueprint/                # ALL blueprint components here
│       ├── canvas/               # BPGraphCanvas, NodeRenderer, WireRenderer
│       ├── palette/              # NodePalette
│       ├── inspector/            # BlueprintInspector
│       ├── debugger/             # DebuggerPanel
│       ├── scenes/               # BlueprintEditorFull
│       ├── library/              # NodeLibrary
│       ├── runtime/              # BPInterpreter, CSharpGenerator, RuntimeBinder
│       ├── schema/               # NodeSchema
│       ├── store/                # BPGraphStore
│       └── assets/               # BlueprintAssetAPI
│
├── ignition/                      # Ignition subsystem
├── spark/                         # Spark subsystem
├── waypoint/                      # Waypoint subsystem
│
├── wissil/                        # WISSIL core (ALL lowercase folders)
│   ├── landing/                   # Landing components
│   ├── slate/                     # Slate components
│   ├── ignition/                  # Ignition components
│   ├── spark/                     # Spark components
│   ├── ignis/                     # Ignis components
│   ├── waypoint/                  # Waypoint components
│   ├── runtime/                   # Runtime utilities
│   ├── scene/                     # Scene management
│   ├── scenegraph/                # Scene graph
│   ├── shader/                    # Shader system
│   ├── materials/                 # Material system
│   ├── lighting/                  # Lighting system
│   ├── audio/                     # Audio system
│   ├── animation/                 # Animation system
│   ├── prefabs/                   # Prefab system
│   ├── gizmos/                    # Gizmo system
│   ├── build/                     # Build system
│   ├── ui/                        # UI components
│   ├── luna/                      # LUNA AI system
│   ├── realtime/                  # Real-time collaboration
│   ├── multiplayer/               # Multiplayer system
│   ├── ide-shell/                 # IDE shell
│   ├── ProjectIO/                 # Project I/O
│   └── tests/                     # Test utilities
│
├── stories/                       # ALL Storybook stories (organized)
│   ├── WISSIL/
│   │   ├── Landing/
│   │   ├── Slate/
│   │   ├── Ignition/
│   │   ├── Spark/
│   │   ├── Ignis/
│   │   └── Waypoint/
│   ├── Editor/
│   │   ├── Shell/                # Merged EditorShell
│   │   ├── Monaco/
│   │   ├── Filesystem/
│   │   ├── Runtime/
│   │   ├── Git/
│   │   └── GameDev/
│   ├── DesignSystem/
│   │   ├── Primitives/
│   │   ├── Layouts/
│   │   └── Icons/
│   ├── Unity/
│   ├── Themes/
│   ├── Simulation/
│   └── components/                # Story-specific components (moved from story-components)
│
├── state/                         # State management
├── hooks/                         # React hooks
├── utils/                         # Utility functions
├── styles/                        # Global styles
└── tokens/                        # Design tokens (legacy, use design-system/tokens)
```

---

## ⚠️ BRUTAL HONEST FEEDBACK

### What's Working:
1. ✅ Clear separation of subsystems in `src/app/`
2. ✅ Design system structure is mostly good
3. ✅ Editor components are well-organized (except duplicates)
4. ✅ Blueprint structure in `ignis/blueprint/` is logical

### What's Broken:
1. ❌ **DUPLICATION:** Same components in multiple locations (Ignis, ThemeProvider)
2. ❌ **INCONSISTENCY:** PascalCase vs lowercase folders
3. ❌ **SCATTERED STORIES:** Stories everywhere, no single source of truth
4. ❌ **MISPLACED COMPONENTS:** Components in wrong directories
5. ❌ **NO CLEAR OWNERSHIP:** Hard to know where things belong
6. ❌ **ENHANCED CONFUSION:** Base vs Enhanced components unclear

### What Needs Immediate Action:
1. **URGENT:** Complete Ignis consolidation (files still duplicated)
2. **URGENT:** Consolidate ThemeProvider
3. **HIGH:** Standardize folder naming (all lowercase)
4. **HIGH:** Consolidate all stories under `src/stories/`
5. **MEDIUM:** Move misplaced components
6. **MEDIUM:** Resolve Enhanced vs Base component confusion
7. **MEDIUM:** Update all imports and configurations

---

## 📝 NOTES

- **NO DELETIONS** - Everything archived, not deleted
- Archive location: `archive/restructure-YYYYMMDD-HHMMSS/`
- Each phase should be tested before moving to next
- Import updates critical after each move
- Storybook must build after each phase

---

## 🚀 READY TO EXECUTE

This plan is comprehensive, unbiased, and brutally honest about the current state. All actions preserve existing code (archiving, not deleting) while creating a coherent, maintainable structure.

**Next Step:** Continue with Phase 1 completion (verify files moved, update imports), then proceed through phases systematically.

