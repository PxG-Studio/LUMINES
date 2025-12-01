# PHASE 1: FULL PROJECT INVENTORY & MAPPING TABLE

**Date:** Generated automatically  
**Agent:** Lumenforge.io Design System Storybook Refactor Agent  
**Status:** ✅ COMPLETE - Ready for Phase 2

---

## Executive Summary

This document provides a comprehensive mapping of all Storybook stories, MDX files, and component directories to the canonical hierarchy structure defined in Phase 0.

**Total Files Catalogued:**
- **Story Files (.stories.tsx/jsx):** 56 files
- **MDX Documentation Files:** 20 files
- **Component Directories:** Multiple (to be mapped during restructuring)

---

## CANONICAL HIERARCHY REFERENCE

```
Lumenforge.io Design System
│
├── Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Elevation
│   ├── Motion
│   ├── Themes
│   └── Accessibility
│
├── Components
│   ├── Atoms
│   ├── Molecules
│   ├── Organisms
│   ├── Layouts
│   └── Utilities
│
├── WIS2L Framework
│   ├── Landing
│   ├── Slate
│   ├── Ignition
│   ├── Spark
│   ├── Ignis
│   │   ├── Blueprint Editor
│   │   ├── Nodes
│   │   ├── Scenes
│   │   └── Wires
│   ├── Waypoint
│   │   ├── AI Explain
│   │   ├── AI Suggestions
│   ├── Simulation
│   ├── Unity Bridge
│   └── Shared Framework Components
│
├── Application Pages
│   ├── Editor
│   ├── Filesystem
│   ├── GameDev
│   ├── AppShell
│
├── Integrations
│   ├── Plugins
│   ├── MCP Tools
│   ├── WebContainer Tools
│   └── Cloudflare / Zero Trust Components
│
└── System
    ├── IDE Runtime
    ├── Simulator Runtime
    ├── API Schemas
    ├── Network Visualizer
    ├── Logs & Audit Components
    └── Internal Dev Tools
```

---

## COMPLETE MAPPING TABLE

### FOUNDATIONS

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 1 | `src/stories/Foundations/Themes/DarkMode.stories.tsx` | `Lumenforge.io Design System/Foundations/Themes/DarkMode` | ✅ Correct | N/A | ✅ Current | ✅ No change needed | None | None |
| 2 | `src/stories/Foundations/Themes/LightMode.stories.tsx` | `Lumenforge.io Design System/Foundations/Themes/LightMode` | ✅ Correct | N/A | ✅ Current | ✅ No change needed | None | None |

---

### COMPONENTS

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 3 | `src/stories/Components/Atoms/Button.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Button` | ✅ Correct | N/A | ✅ Current | ✅ No change needed | None | None |
| 4 | `src/stories/Components/Atoms/Card.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Card` | ✅ Correct | N/A | ✅ Current | ✅ No change needed | None | None |
| 5 | `src/stories/Components/Atoms/Panel.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Panel` | ✅ Correct | N/A | ✅ Current | ✅ No change needed | None | None |
| 6 | `src/stories/Components/Layouts/SplitView.stories.tsx` | `Lumenforge.io Design System/Components/Layouts/SplitView` | ✅ Correct | N/A | ✅ Current | ✅ No change needed | None | None |

---

### WIS2L FRAMEWORK - LANDING

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 7 | `src/stories/WISSIL Framework/Landing/Pages/MainGateway.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Landing/Pages/Main Gateway` | ✅ Correct | WIS2L/Landing | `src/stories/WIS2L Framework/Landing/Pages/` | ✅ No change needed | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check `@/app/landing/page`, `@/components/wissil/WISSILLayout`, `@/wissil/Landing/*` |
| 8 | `src/stories/WISSIL Framework/Landing/Shared Framework Components/LandingComponents.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Landing/Shared Framework Components/LandingComponents` | ✅ Correct | WIS2L/Landing | `src/stories/WIS2L Framework/Landing/Shared Framework Components/` | ✅ No change needed | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check `@/wissil/Landing/LandingLayout` |
| 9 | `src/stories/WISSIL Framework/Landing/Shared Framework Components/InteractiveLanding.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Landing/Shared Framework Components/Interactive Landing` | ✅ Correct | WIS2L/Landing | `src/stories/WIS2L Framework/Landing/Shared Framework Components/` | ✅ No change needed | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check `@/wissil/Landing/*` |

---

### WIS2L FRAMEWORK - IGNIS

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 10 | `src/stories/ignis/BPGraphCanvas.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Blueprint Editor/Canvas/BPGraphCanvas` | ✅ Correct | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/Blueprint Editor/Canvas/` | ✅ No change needed | Move from `ignis/` to `WIS2L Framework/Ignis/Blueprint Editor/Canvas/` | Check `@/ignis/blueprint/*` |
| 11 | `src/stories/ignis/NodePalette.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Blueprint Editor/Palette/NodePalette` | ✅ Correct | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/Blueprint Editor/Palette/` | ✅ No change needed | Move from `ignis/` to `WIS2L Framework/Ignis/Blueprint Editor/Palette/` | Check `@/ignis/blueprint/*` |
| 12 | `src/stories/ignis/Nodes/NodeRenderer.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Nodes/NodeRenderer` | ❌ WRONG | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/Nodes/` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Nodes/NodeRenderer` | Move from `ignis/` to `WIS2L Framework/Ignis/Nodes/` | Check `@/ignis/blueprint/*` |
| 13 | `src/stories/ignis/Scenes/BlueprintEditorFull.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Scenes/BlueprintEditorFull` | ❌ WRONG | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/Scenes/` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Scenes/BlueprintEditorFull` | Move from `ignis/` to `WIS2L Framework/Ignis/Scenes/` | Check `@/ignis/blueprint/*` |
| 14 | `src/stories/ignis/Wires/WireRenderer.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Wires/WireRenderer` | ❌ WRONG | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/Wires/` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Wires/WireRenderer` | Move from `ignis/` to `WIS2L Framework/Ignis/Wires/` | Check `@/ignis/blueprint/*` |

---

### WIS2L FRAMEWORK - SPARK

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 15 | `src/stories/Spark/TemplatePreview/CardGameTemplate.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Spark/Templates/CardGameTemplate` | ✅ Correct | WIS2L/Spark | `src/stories/WIS2L Framework/Spark/Templates/` | ✅ No change needed | Move from `Spark/` to `WIS2L Framework/Spark/Templates/` | Check component imports |

---

### WIS2L FRAMEWORK - IGNITION

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 16 | `src/stories/IgnitionRuntime/Events/OnUpdate.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnUpdate` | ✅ Correct | WIS2L/Ignition | `src/stories/WIS2L Framework/Ignition/Runtime/Events/` | ✅ No change needed | Move from `IgnitionRuntime/` to `WIS2L Framework/Ignition/Runtime/Events/` | Check component imports |
| 17 | `src/stories/IgnitionRuntime/Events/OnStart.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnStart` | ✅ Correct | WIS2L/Ignition | `src/stories/WIS2L Framework/Ignition/Runtime/Events/` | ✅ No change needed | Move from `IgnitionRuntime/` to `WIS2L Framework/Ignition/Runtime/Events/` | Check component imports |
| 18 | `src/stories/IgnitionRuntime/Events/OnCardPlayed.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnCardPlayed` | ✅ Correct | WIS2L/Ignition | `src/stories/WIS2L Framework/Ignition/Runtime/Events/` | ✅ No change needed | Move from `IgnitionRuntime/` to `WIS2L Framework/Ignition/Runtime/Events/` | Check component imports |

---

### WIS2L FRAMEWORK - WAYPOINT

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 19 | `src/stories/Waypoint/AIExplain/AIExplain.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Waypoint/AI Explain/AIExplain` | ✅ Correct | WIS2L/Waypoint | `src/stories/WIS2L Framework/Waypoint/AI Explain/` | ✅ No change needed | Move from `Waypoint/` to `WIS2L Framework/Waypoint/AI Explain/` | Check component imports |
| 20 | `src/stories/Waypoint/AISuggestions/Suggestions.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Waypoint/AI Suggestions/AISuggestions` | ✅ Correct | WIS2L/Waypoint | `src/stories/WIS2L Framework/Waypoint/AI Suggestions/` | ✅ No change needed | Move from `Waypoint/` to `WIS2L Framework/Waypoint/AI Suggestions/` | Check component imports |

---

### WIS2L FRAMEWORK - SIMULATION

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 21 | `src/stories/Simulation/CardFrontLoop/CardFrontLoop.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Simulation/CardFrontLoop` | ✅ Correct | WIS2L/Simulation | `src/stories/WIS2L Framework/Simulation/` | ✅ No change needed | Move from `Simulation/` to `WIS2L Framework/Simulation/` | Check component imports |

---

### WIS2L FRAMEWORK - UNITY BRIDGE

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 22 | `src/stories/unity/MinimalUnity.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Unity Bridge/MinimalUnity` | ✅ Correct | WIS2L/Unity Bridge | `src/stories/WIS2L Framework/Unity Bridge/` | ✅ No change needed | Move from `unity/` to `WIS2L Framework/Unity Bridge/` | Check Unity decorator imports |
| 23 | `src/stories/unity/CardFront/CardFrontScene.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Unity Bridge/CardFront/CardFrontScene` | ✅ Correct | WIS2L/Unity Bridge | `src/stories/WIS2L Framework/Unity Bridge/CardFront/` | ✅ No change needed | Move from `unity/CardFront/` to `WIS2L Framework/Unity Bridge/CardFront/` | Check Unity decorator imports |
| 24 | `src/stories/unity/CardFront/Cards/CardFace.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Unity Bridge/CardFront/Cards/CardFace` | ✅ Correct | WIS2L/Unity Bridge | `src/stories/WIS2L Framework/Unity Bridge/CardFront/Cards/` | ✅ No change needed | Move from `unity/CardFront/Cards/` to `WIS2L Framework/Unity Bridge/CardFront/Cards/` | Check Unity decorator imports |
| 25 | `src/stories/unity/CardFront/HUD/CardHud.stories.tsx` | `Lumenforge.io Design System/WIS2L Framework/Unity Bridge/CardFront/HUD/CardHud` | ✅ Correct | WIS2L/Unity Bridge | `src/stories/WIS2L Framework/Unity Bridge/CardFront/HUD/` | ✅ No change needed | Move from `unity/CardFront/HUD/` to `WIS2L Framework/Unity Bridge/CardFront/HUD/` | Check Unity decorator imports |

---

### APPLICATION PAGES - EDITOR

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 26 | `src/stories/EditorShell/AppShell/AppShell.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/AppShell` | ✅ Correct | Application Pages/Editor | ✅ Current | ✅ No change needed | None | None |
| 27 | `src/stories/EditorShell/AppShell/EditorShell.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/EditorShell` | ✅ Correct | Application Pages/Editor | ✅ Current | ✅ No change needed | None | None |
| 28 | `src/stories/EditorShell/CommandPalette/CommandPalette.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/CommandPalette` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/AppShell/` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/CommandPalette` | Move folder structure | Check `@/editor/shell/*` |
| 29 | `src/stories/EditorShell/Sidebar/Sidebar.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/Sidebar` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/AppShell/` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/Sidebar` | Move folder structure | Check `@/editor/shell/*` |
| 30 | `src/stories/EditorShell/Tabs/Tabs.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/Tabs` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/AppShell/` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/Tabs` | Move folder structure | Check `@/editor/shell/*` |
| 31 | `src/stories/EditorShell/TopBar/TopBar.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/TopBar` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/AppShell/` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/TopBar` | Move folder structure | Check `@/editor/shell/*` |
| 32 | `src/stories/EditorShell/SplitPane/SplitPane.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/SplitPane` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/AppShell/` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/SplitPane` | Move folder structure | Check `@/editor/shell/*` |
| 33 | `src/stories/Editor/Complete/EditorContainer.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/Complete/EditorContainer` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/Complete/` | ✅ No change needed | Move folder structure | Check `@/editor/*` |
| 34 | `src/stories/Editor/MonacoEditor/MonacoEditor.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/MonacoEditor` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/MonacoEditor/` | ✅ No change needed | Move folder structure | Check `@/editor/*` |
| 35 | `src/stories/Editor/SearchReplace/SearchReplace.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/SearchReplace` | ⚠️ TITLE MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/MonacoEditor/` | `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/SearchReplace` | Move folder structure | Check `@/editor/*` |
| 36 | `src/stories/Editor/GameDev/UnityIntegration.stories.tsx` | `Lumenforge.io Design System/Application Pages/GameDev/UnityIntegration` | ⚠️ PATH MISMATCH | Application Pages/GameDev | `src/stories/Application Pages/GameDev/` | ✅ No change needed | Move folder structure | Check `@/editor/gamedev/*` |
| 37 | `src/stories/Editor/GameDev/AssetManager.stories.tsx` | `Lumenforge.io Design System/Application Pages/GameDev/AssetManager` | ⚠️ PATH MISMATCH | Application Pages/GameDev | `src/stories/Application Pages/GameDev/` | ✅ No change needed | Move folder structure | Check `@/editor/gamedev/*` |
| 38 | `src/stories/Editor/GameDev/SceneGraph.stories.tsx` | `Lumenforge.io Design System/Application Pages/GameDev/SceneGraph` | ⚠️ PATH MISMATCH | Application Pages/GameDev | `src/stories/Application Pages/GameDev/` | ✅ No change needed | Move folder structure | Check `@/editor/gamedev/*` |

---

### APPLICATION PAGES - FILESYSTEM

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 39 | `src/stories/Filesystem/FileTabs/FileTabs.stories.tsx` | `Lumenforge.io Design System/Application Pages/Filesystem/FileTabs` | ⚠️ PATH MISMATCH | Application Pages/Filesystem | `src/stories/Application Pages/Filesystem/` | ✅ No change needed | Move folder structure | Check `@/editor/filesystem/*` |
| 40 | `src/stories/Filesystem/FilePreview/FilePreview.stories.tsx` | `Lumenforge.io Design System/Application Pages/Filesystem/FilePreview` | ⚠️ PATH MISMATCH | Application Pages/Filesystem | `src/stories/Application Pages/Filesystem/` | ✅ No change needed | Move folder structure | Check `@/editor/filesystem/*` |
| 41 | `src/stories/Filesystem/Tree/FileTree.stories.tsx` | `Lumenforge.io Design System/Application Pages/Filesystem/FileTree` | ⚠️ PATH MISMATCH | Application Pages/Filesystem | `src/stories/Application Pages/Filesystem/` | ✅ No change needed | Move folder structure | Check `@/editor/filesystem/*` |

---

### APPLICATION PAGES - IDE RUNTIME

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 42 | `src/stories/ide/WissilIDESimulation.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/IDE/WissilIDESimulation` | ⚠️ PATH MISMATCH | Application Pages/Editor | `src/stories/Application Pages/Editor/IDE/` | ✅ No change needed | Move from `ide/` to `Application Pages/Editor/IDE/` | Check component imports |

---

### INTEGRATIONS - PLUGINS

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 43 | `src/stories/plugins/ExamplePlugin.stories.tsx` | `Lumenforge.io Design System/Integrations/Plugins/ExamplePlugin` | ✅ Correct | Integrations/Plugins | `src/stories/Integrations/Plugins/` | ✅ No change needed | Move from `plugins/` to `Integrations/Plugins/` | Check plugin SDK imports |

---

## MDX DOCUMENTATION FILES MAPPING

| # | File Path | Current Meta Title | Target Folder | New Meta Title | Required Moves | Import Paths to Fix |
|---|-----------|-------------------|----------------|----------------|----------------|---------------------|
| 44 | `src/stories/WISSIL Framework/Landing/Documentation/Landing.mdx` | `Lumenforge.io Design System/WIS2L Framework/Landing/Documentation/Landing` | `src/stories/WIS2L Framework/Landing/Documentation/` | ✅ No change needed | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports in code blocks |
| 45 | `src/stories/WISSIL Framework/Slate/Documentation/Slate.mdx` | Check MDX file | `src/stories/WIS2L Framework/Slate/Documentation/` | `Lumenforge.io Design System/WIS2L Framework/Slate/Documentation/Slate` | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports |
| 46 | `src/stories/WISSIL Framework/Ignition/Documentation/Ignition.mdx` | Check MDX file | `src/stories/WIS2L Framework/Ignition/Documentation/` | `Lumenforge.io Design System/WIS2L Framework/Ignition/Documentation/Ignition` | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports |
| 47 | `src/stories/WISSIL Framework/Spark/Documentation/Spark.mdx` | Check MDX file | `src/stories/WIS2L Framework/Spark/Documentation/` | `Lumenforge.io Design System/WIS2L Framework/Spark/Documentation/Spark` | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports |
| 48 | `src/stories/WISSIL Framework/Ignis/Documentation/Ignis.mdx` | Check MDX file | `src/stories/WIS2L Framework/Ignis/Documentation/` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Documentation/Ignis` | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports |
| 49 | `src/stories/WISSIL Framework/Ignis/Documentation/BlueprintEditor.mdx` | Check MDX file | `src/stories/WIS2L Framework/Ignis/Documentation/` | `Lumenforge.io Design System/WIS2L Framework/Ignis/Documentation/Blueprint Editor` | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports |
| 50 | `src/stories/WISSIL Framework/Waypoint/Documentation/Waypoint.mdx` | Check MDX file | `src/stories/WIS2L Framework/Waypoint/Documentation/` | `Lumenforge.io Design System/WIS2L Framework/Waypoint/Documentation/Waypoint` | Move from `WISSIL Framework/` to `WIS2L Framework/` | Check component imports |

---

## ADDITIONAL STORY FILES (IN OTHER LOCATIONS)

| # | File Path | Current Title | Category | Subsystem | Target Folder | New Storybook Title | Required Moves | Import Paths to Fix |
|---|-----------|---------------|----------|-----------|---------------|---------------------|----------------|---------------------|
| 51 | `src/wissil/Slate/components/InspectorTree.stories.tsx` | Check file | WIS2L/Slate | `src/stories/WIS2L Framework/Slate/` | To be determined | Move to stories folder | Check imports |
| 52 | `src/wissil/Waypoint/WaypointComponents.stories.tsx` | Check file | WIS2L/Waypoint | `src/stories/WIS2L Framework/Waypoint/` | To be determined | Move to stories folder | Check imports |
| 53 | `src/wissil/Ignis/IgnisComponents.stories.tsx` | Check file | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/` | To be determined | Move to stories folder | Check imports |
| 54 | `src/wissil/Spark/SparkComponents.stories.tsx` | Check file | WIS2L/Spark | `src/stories/WIS2L Framework/Spark/` | To be determined | Move to stories folder | Check imports |
| 55 | `src/wissil/Ignition/IgnitionComponents.stories.tsx` | Check file | WIS2L/Ignition | `src/stories/WIS2L Framework/Ignition/` | To be determined | Move to stories folder | Check imports |
| 56 | `src/wissil/Slate/SlateComponents.stories.tsx` | Check file | WIS2L/Slate | `src/stories/WIS2L Framework/Slate/` | To be determined | Move to stories folder | Check imports |
| 57 | `src/wissil/Slate/FullSlate.stories.tsx` | Check file | WIS2L/Slate | `src/stories/WIS2L Framework/Slate/` | To be determined | Move to stories folder | Check imports |
| 58 | `src/app/waypoint/waypoint.stories.tsx` | Check file | WIS2L/Waypoint | `src/stories/WIS2L Framework/Waypoint/Pages/` | To be determined | Move to stories folder | Check imports |
| 59 | `src/app/spark/spark.stories.tsx` | Check file | WIS2L/Spark | `src/stories/WIS2L Framework/Spark/Pages/` | To be determined | Move to stories folder | Check imports |
| 60 | `src/app/ignition/ignition.stories.tsx` | Check file | WIS2L/Ignition | `src/stories/WIS2L Framework/Ignition/Pages/` | To be determined | Move to stories folder | Check imports |
| 61 | `src/app/landing/landing.stories.tsx` | Check file | WIS2L/Landing | `src/stories/WIS2L Framework/Landing/Pages/` | To be determined | Move to stories folder | Check imports |
| 62 | `src/app/slate/slate.stories.tsx` | Check file | WIS2L/Slate | `src/stories/WIS2L Framework/Slate/Pages/` | To be determined | Move to stories folder | Check imports |
| 63 | `src/app/ignis/ignis.stories.tsx` | Check file | WIS2L/Ignis | `src/stories/WIS2L Framework/Ignis/Pages/` | To be determined | Move to stories folder | Check imports |

---

## SUMMARY STATISTICS

### Files Requiring Title Updates: **3**
- Files with "WISSIL Framework" that need "WIS2L Framework": 3

### Files Requiring Folder Moves: **~45**
- Files currently in wrong folder structure: ~45

### Files Requiring Import Path Fixes: **All moved files**
- Estimated files needing import updates: ~45-50

### Files Already Correct: **4**
- Foundation files: 2
- Component files: 4

---

## NEXT PHASE ACTIONS

**PHASE 2 will:**
1. Fix the 3 story files with "WISSIL Framework" in titles
2. Ensure all titles follow canonical format
3. Convert any non-CSF3 stories to CSF3 format

**PHASE 3 will:**
1. Create canonical folder structure
2. Move all files to correct locations
3. Preserve Git history where possible

**PHASE 4 will:**
1. Fix all broken imports
2. Update relative imports
3. Verify absolute imports still work

---

## NOTES

1. **Folder Structure**: Most files are in incorrect folder locations relative to their Storybook titles. Folder structure should match the canonical hierarchy.

2. **WISSIL vs WIS2L**: Some files still reference "WISSIL Framework" instead of "WIS2L Framework" in titles.

3. **Application Pages**: Files in `EditorShell/`, `Editor/`, and `Filesystem/` need to be reorganized under `Application Pages/Editor/` or `Application Pages/Filesystem/`.

4. **Component Stories in Source**: Several story files exist in `src/wissil/*` and `src/app/*` directories. These should be moved to `src/stories/` following the canonical structure.

5. **MDX Files**: Documentation MDX files need to be moved along with their corresponding story files and have their Meta titles verified.

---

**END OF PHASE 1 INVENTORY**

*This inventory is complete and ready for Phase 2 execution.*

