# PHASE 2 — REWRITE ALL STORYBOOK TITLES — COMPLETE

**Date:** December 2024  
**Status:** ✅ Complete  
**Purpose:** All story files have been updated to use canonical Lumenforge.io Design System hierarchy

---

## SUMMARY

All **55 story files** and **7 MDX documentation files** have been successfully updated to follow the canonical hierarchy pattern:

**`Lumenforge.io Design System/<Category>/<Subsystem>/<Component>`**

---

## UPDATES COMPLETED

### ✅ Foundations (2 files)
- `src/stories/Themes/DarkMode/DarkMode.stories.tsx` → `Lumenforge.io Design System/Foundations/Themes/DarkMode`
- `src/stories/Themes/LightMode/LightMode.stories.tsx` → `Lumenforge.io Design System/Foundations/Themes/LightMode`

### ✅ Components (4 files)
- `src/design-system/primitives/Button.stories.tsx` → `Lumenforge.io Design System/Components/Atoms/Button`
- `src/design-system/primitives/Card.stories.tsx` → `Lumenforge.io Design System/Components/Atoms/Card`
- `src/design-system/primitives/Panel.stories.tsx` → `Lumenforge.io Design System/Components/Atoms/Panel`
- `src/design-system/primitives/SplitView.stories.tsx` → `Lumenforge.io Design System/Components/Layouts/SplitView`

### ✅ WISSIL Framework — Landing (2 files)
- `src/app/landing/landing.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Landing/Pages/Main Gateway`
- `src/wissil/Landing/LandingComponents.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Landing/Shared Framework Components/LandingComponents`

### ✅ WISSIL Framework — Slate (3 files)
- `src/app/slate/slate.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Slate/Pages/Workspace & Identity`
- `src/wissil/Slate/SlateComponents.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Slate/Shared Framework Components/SlateComponents`
- `src/wissil/Slate/FullSlate.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Slate/Pages/Full IDE`
- `src/wissil/Slate/components/InspectorTree.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Slate/Shared Framework Components/InspectorTree`

### ✅ WISSIL Framework — Ignition (4 files)
- `src/app/ignition/ignition.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignition/Pages/Project Bootstrap`
- `src/wissil/Ignition/IgnitionComponents.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignition/Shared Framework Components/IgnitionComponents`
- `src/stories/IgnitionRuntime/Events/OnStart.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignition/Runtime/Events/OnStart`
- `src/stories/IgnitionRuntime/Events/OnUpdate.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignition/Runtime/Events/OnUpdate`
- `src/stories/IgnitionRuntime/Events/OnCardPlayed.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignition/Runtime/Events/OnCardPlayed`

### ✅ WISSIL Framework — Spark (2 files)
- `src/app/spark/spark.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Spark/Pages/IDE Experience`
- `src/wissil/Spark/SparkComponents.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Spark/Shared Framework Components/SparkComponents`
- `src/stories/Spark/TemplatePreview/CardGameTemplate.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Spark/Templates/CardGameTemplate`

### ✅ WISSIL Framework — Ignis (7 files)
- `src/app/ignis/ignis.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Pages/API Backend`
- `src/wissil/Ignis/IgnisComponents.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Shared Framework Components/IgnisComponents`
- `src/stories/ignis/BPGraphCanvas.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Blueprint Editor/Canvas/BPGraphCanvas`
- `src/stories/ignis/NodePalette.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Blueprint Editor/Palette/NodePalette`
- `src/stories/ignis/NodeRenderer.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Nodes/NodeRenderer`
- `src/stories/ignis/Nodes/NodeRenderer.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Nodes/NodeRenderer`
- `src/stories/ignis/Scenes/BlueprintEditorFull.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Scenes/BlueprintEditorFull`
- `src/stories/ignis/Wires/WireRenderer.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Wires/WireRenderer`

### ✅ WISSIL Framework — Waypoint (3 files)
- `src/app/waypoint/waypoint.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Waypoint/Pages/Unity Visual Scripting`
- `src/wissil/Waypoint/WaypointComponents.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Waypoint/Shared Framework Components/WaypointComponents`
- `src/stories/Waypoint/AIExplain/AIExplain.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Waypoint/AI Explain/AIExplain`
- `src/stories/Waypoint/AISuggestions/Suggestions.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Waypoint/AI Suggestions/AISuggestions`

### ✅ WISSIL Framework — Simulation (1 file)
- `src/stories/Simulation/CardFrontLoop/CardFrontLoop.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Simulation/CardFrontLoop`

### ✅ WISSIL Framework — Unity Bridge (4 files)
- `src/stories/unity/MinimalUnity.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/MinimalUnity`
- `src/stories/unity/CardFront/CardFrontScene.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/CardFront/CardFrontScene`
- `src/stories/unity/CardFront/Cards/CardFace.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/CardFront/Cards/CardFace`
- `src/stories/unity/CardFront/HUD/CardHud.stories.tsx` → `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/CardFront/HUD/CardHud`

### ✅ Application Pages — Editor (12 files)
- `src/stories/EditorShell/AppShell/AppShell.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/AppShell`
- `src/stories/EditorShell/AppShell/EditorShell.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/EditorShell`
- `src/stories/EditorShell/TopBar/TopBar.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/TopBar`
- `src/stories/EditorShell/Sidebar/Sidebar.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/Sidebar`
- `src/stories/EditorShell/Tabs/Tabs.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/Tabs`
- `src/stories/EditorShell/CommandPalette/CommandPalette.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/CommandPalette`
- `src/stories/EditorShell/SplitPane/SplitPane.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/AppShell/SplitPane`
- `src/stories/Editor/MonacoEditor/MonacoEditor.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/MonacoEditor`
- `src/stories/Editor/SearchReplace/SearchReplace.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/SearchReplace`
- `src/stories/Editor/Complete/EditorContainer.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/Complete/EditorContainer`
- `src/stories/ide/WissilIDESimulation.stories.tsx` → `Lumenforge.io Design System/Application Pages/Editor/IDE/WissilIDESimulation`

### ✅ Application Pages — Filesystem (3 files)
- `src/stories/Filesystem/Tree/FileTree.stories.tsx` → `Lumenforge.io Design System/Application Pages/Filesystem/FileTree`
- `src/stories/Filesystem/FileTabs/FileTabs.stories.tsx` → `Lumenforge.io Design System/Application Pages/Filesystem/FileTabs`
- `src/stories/Filesystem/FilePreview/FilePreview.stories.tsx` → `Lumenforge.io Design System/Application Pages/Filesystem/FilePreview`

### ✅ Application Pages — GameDev (3 files)
- `src/stories/Editor/GameDev/SceneGraph.stories.tsx` → `Lumenforge.io Design System/Application Pages/GameDev/SceneGraph`
- `src/stories/Editor/GameDev/AssetManager.stories.tsx` → `Lumenforge.io Design System/Application Pages/GameDev/AssetManager`
- `src/stories/Editor/GameDev/UnityIntegration.stories.tsx` → `Lumenforge.io Design System/Application Pages/GameDev/UnityIntegration`

### ✅ Integrations (1 file)
- `src/stories/plugins/ExamplePlugin.stories.tsx` → `Lumenforge.io Design System/Integrations/Plugins/ExamplePlugin`

---

## MDX DOCUMENTATION UPDATES (7 files)

All MDX files updated to match new hierarchy:

- `src/app/landing/landing.mdx` → `Lumenforge.io Design System/WISSIL Framework/Landing/Documentation/Landing`
- `src/app/slate/slate.mdx` → `Lumenforge.io Design System/WISSIL Framework/Slate/Documentation/Slate`
- `src/app/ignition/ignition.mdx` → `Lumenforge.io Design System/WISSIL Framework/Ignition/Documentation/Ignition`
- `src/app/spark/spark.mdx` → `Lumenforge.io Design System/WISSIL Framework/Spark/Documentation/Spark`
- `src/app/ignis/ignis.mdx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Documentation/Ignis`
- `src/app/waypoint/waypoint.mdx` → `Lumenforge.io Design System/WISSIL Framework/Waypoint/Documentation/Waypoint`
- `src/stories/ignis/BlueprintEditor.mdx` → `Lumenforge.io Design System/WISSIL Framework/Ignis/Documentation/Blueprint Editor`

---

## TOTAL FILES UPDATED

- **Story Files:** 55 files
- **MDX Files:** 7 files
- **Total:** 62 files updated

---

## NAMING CONVENTIONS APPLIED

✅ All titles now start with: **`Lumenforge.io Design System`**  
✅ PascalCase used for all component names  
✅ Subsystem naming normalized (WISSIL Framework/...)  
✅ Consistent hierarchy structure throughout  
✅ All stories in CSF3 format (already compliant)

---

## NEXT PHASES

✅ **PHASE 1:** Inventory & Mapping (COMPLETE)  
✅ **PHASE 2:** Rewrite All Storybook Titles (COMPLETE)  
⏭️ **PHASE 3:** Physical Folder Restructuring  
⏭️ **PHASE 4:** Fix All Import Paths  
⏭️ **PHASE 5:** MDX + Documentation Alignment  
⏭️ **PHASE 6:** Validate Storybook Build  
⏭️ **PHASE 7:** Final Output  

---

**PHASE 2 COMPLETE — Ready for PHASE 3**
