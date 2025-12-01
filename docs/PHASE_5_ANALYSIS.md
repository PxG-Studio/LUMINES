# Phase 5: Story Consolidation - Analysis

## Current Story Locations (SCATTERED)

### 1. WISSIL Subsystem Stories
**Location:** `src/app/*/` (Next.js App Router)
- `src/app/landing/landing.stories.tsx`
- `src/app/slate/slate.stories.tsx`
- `src/app/ignition/ignition.stories.tsx`
- `src/app/spark/spark.stories.tsx`
- `src/app/ignis/ignis.stories.tsx`
- `src/app/waypoint/waypoint.stories.tsx`

**Problem:** Stories mixed with Next.js pages

### 2. Editor Stories
**Location:** `src/stories/Editor/` AND `src/stories/EditorShell/`
- `src/stories/Editor/Complete/EditorContainer.stories.tsx`
- `src/stories/Editor/GameDev/*.stories.tsx`
- `src/stories/Editor/MonacoEditor/*.stories.tsx`
- `src/stories/Editor/SearchReplace/*.stories.tsx`
- `src/stories/EditorShell/AppShell/*.stories.tsx`
- `src/stories/EditorShell/CommandPalette/*.stories.tsx`
- `src/stories/EditorShell/Sidebar/*.stories.tsx`
- `src/stories/EditorShell/SplitPane/*.stories.tsx`
- `src/stories/EditorShell/Tabs/*.stories.tsx`
- `src/stories/EditorShell/TopBar/*.stories.tsx`

**Problem:** Split into two folders unnecessarily

### 3. Ignis Stories
**Location:** `src/stories/ignis/`
- `src/stories/ignis/BPGraphCanvas.stories.tsx`
- `src/stories/ignis/NodePalette.stories.tsx`
- `src/stories/ignis/NodeRenderer.stories.tsx`
- `src/stories/ignis/Scenes/BlueprintEditorFull.stories.tsx`
- `src/stories/ignis/Wires/WireRenderer.stories.tsx`

**Problem:** Should be under `src/stories/WISSIL/Ignis/`

### 4. Design System Stories
**Location:** `src/design-system/**/*.stories.tsx`
- `src/design-system/primitives/Button.stories.tsx`
- `src/design-system/primitives/Card.stories.tsx`
- `src/design-system/primitives/Panel.stories.tsx`
- `src/design-system/primitives/SplitView.stories.tsx`

**Problem:** Should be under `src/stories/DesignSystem/`

### 5. Other Story Locations
- `src/stories/Filesystem/*.stories.tsx`
- `src/stories/ide/WissilIDESimulation.stories.tsx`
- `src/stories/IgnitionRuntime/*.stories.tsx`
- `src/stories/plugins/*.stories.tsx`
- `src/stories/Simulation/*.stories.tsx`
- `src/stories/Spark/*.stories.tsx`
- `src/stories/Themes/*.stories.tsx`
- `src/stories/unity/*.stories.tsx`
- `src/stories/Waypoint/*.stories.tsx`

## Target Structure

```
src/stories/
├── WISSIL/
│   ├── Landing/
│   │   └── landing.stories.tsx (moved from app/landing/)
│   ├── Slate/
│   │   └── slate.stories.tsx (moved from app/slate/)
│   ├── Ignition/
│   │   └── ignition.stories.tsx (moved from app/ignition/)
│   ├── Spark/
│   │   └── spark.stories.tsx (moved from app/spark/)
│   ├── Ignis/
│   │   ├── BPGraphCanvas.stories.tsx (moved from stories/ignis/)
│   │   ├── NodePalette.stories.tsx
│   │   ├── NodeRenderer.stories.tsx
│   │   ├── Scenes/
│   │   └── Wires/
│   └── Waypoint/
│       └── waypoint.stories.tsx (moved from app/waypoint/)
│
├── Editor/
│   ├── Shell/              (merged EditorShell here)
│   │   ├── AppShell/
│   │   ├── CommandPalette/
│   │   ├── Sidebar/
│   │   ├── SplitPane/
│   │   ├── Tabs/
│   │   └── TopBar/
│   ├── Monaco/
│   ├── Filesystem/
│   ├── Runtime/
│   ├── Git/
│   ├── GameDev/
│   └── Complete/
│
├── DesignSystem/
│   ├── Primitives/
│   ├── Layouts/
│   └── Icons/
│
├── Unity/
│   └── CardFront/
│
├── Themes/
│   ├── DarkMode/
│   └── LightMode/
│
├── Simulation/
│   └── CardFrontLoop/
│
└── IDE/
    └── WissilIDESimulation.stories.tsx
```

## Action Plan

1. Create target directory structure
2. Move WISSIL subsystem stories from `src/app/*/` → `src/stories/WISSIL/*/`
3. Merge `EditorShell/` into `Editor/Shell/`
4. Move `ignis/` stories → `WISSIL/Ignis/`
5. Move design-system stories → `DesignSystem/`
6. Organize remaining stories
7. Update `.storybook/main.ts` paths
8. Update all story imports if needed

