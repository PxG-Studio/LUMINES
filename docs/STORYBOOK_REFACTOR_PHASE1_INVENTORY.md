# PHASE 1 — FULL PROJECT INVENTORY & MAPPING TABLE

**Date:** December 2024  
**Status:** ✅ Complete  
**Purpose:** Comprehensive mapping of all story files to canonical Lumenforge.io Design System hierarchy

---

## CANONICAL HIERARCHY (Reference)

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
├── WISSIL Framework
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

## MAPPING TABLE

### FOUNDATIONS

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/stories/Themes/DarkMode/DarkMode.stories.tsx` | `DesignSystem/Themes/Dark` | `src/stories/Foundations/Themes/DarkMode.stories.tsx` | `Lumenforge.io Design System/Foundations/Themes/DarkMode` | Foundations → Themes | 🔄 Map |
| `src/stories/Themes/LightMode/LightMode.stories.tsx` | `DesignSystem/Themes/Light` | `src/stories/Foundations/Themes/LightMode.stories.tsx` | `Lumenforge.io Design System/Foundations/Themes/LightMode` | Foundations → Themes | 🔄 Map |
| `src/tokens/slate.tokens.ts` | N/A (token file) | `src/stories/Foundations/Colors/Colors.stories.tsx` | `Lumenforge.io Design System/Foundations/Colors/Slate Tokens` | Foundations → Colors | ➕ Create |
| `src/design-system/tokens/typography.ts` | N/A (token file) | `src/stories/Foundations/Typography/Typography.stories.tsx` | `Lumenforge.io Design System/Foundations/Typography/Typography` | Foundations → Typography | ➕ Create |
| `src/design-system/tokens/spacing.ts` | N/A (token file) | `src/stories/Foundations/Spacing/Spacing.stories.tsx` | `Lumenforge.io Design System/Foundations/Spacing/Spacing` | Foundations → Spacing | ➕ Create |
| `src/design-system/tokens/shadows.ts` | N/A (token file) | `src/stories/Foundations/Elevation/Elevation.stories.tsx` | `Lumenforge.io Design System/Foundations/Elevation/Shadows` | Foundations → Elevation | ➕ Create |
| `src/design-system/tokens/colors.ts` | N/A (token file) | `src/stories/Foundations/Colors/Colors.stories.tsx` | `Lumenforge.io Design System/Foundations/Colors/Color Systems` | Foundations → Colors | ➕ Create |
| N/A | N/A | `src/stories/Foundations/Motion/Motion.stories.tsx` | `Lumenforge.io Design System/Foundations/Motion/Animation` | Foundations → Motion | ➕ Create |
| N/A | N/A | `src/stories/Foundations/Accessibility/Accessibility.stories.tsx` | `Lumenforge.io Design System/Foundations/Accessibility/Accessibility` | Foundations → Accessibility | ➕ Create |

---

### COMPONENTS

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/design-system/primitives/Button.stories.tsx` | `Design System/Primitives/Button` | `src/stories/Components/Atoms/Button.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Button` | Components → Atoms | 🔄 Map |
| `src/design-system/primitives/Card.stories.tsx` | `Design System/Primitives/Card` | `src/stories/Components/Atoms/Card.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Card` | Components → Atoms | 🔄 Map |
| `src/design-system/primitives/Panel.stories.tsx` | `Design System/Primitives/Panel` | `src/stories/Components/Atoms/Panel.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Panel` | Components → Atoms | 🔄 Map |
| `src/design-system/primitives/SplitView.stories.tsx` | `Design System/Primitives/SplitView` | `src/stories/Components/Layouts/SplitView.stories.tsx` | `Lumenforge.io Design System/Components/Layouts/SplitView` | Components → Layouts | 🔄 Map |
| `src/design-system/layouts/Divider.tsx` | N/A (component only) | `src/stories/Components/Atoms/Divider.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Divider` | Components → Atoms | ➕ Create |
| `src/design-system/layouts/FlexCol.tsx` | N/A (component only) | `src/stories/Components/Layouts/FlexCol.stories.tsx` | `Lumenforge.io Design System/Components/Layouts/FlexCol` | Components → Layouts | ➕ Create |
| `src/design-system/layouts/FlexRow.tsx` | N/A (component only) | `src/stories/Components/Layouts/FlexRow.stories.tsx` | `Lumenforge.io Design System/Components/Layouts/FlexRow` | Components → Layouts | ➕ Create |
| `src/design-system/icons/*.tsx` | N/A (components only) | `src/stories/Components/Atoms/Icons/*.stories.tsx` | `Lumenforge.io Design System/Components/Atoms/Icons/*` | Components → Atoms | ➕ Create |

---

### WISSIL FRAMEWORK — LANDING

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/app/landing/landing.stories.tsx` | `WISSIL/Landing/Pages/Main Gateway` | `src/stories/WISSIL Framework/Landing/Pages/MainGateway.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Landing/Pages/Main Gateway` | WISSIL → Landing → Pages | 🔄 Map |
| `src/app/landing/landing.mdx` | `WISSIL/Landing/Documentation` | `src/stories/WISSIL Framework/Landing/Documentation/Landing.mdx` | `Lumenforge.io Design System/WISSIL Framework/Landing/Documentation/Landing` | WISSIL → Landing → Documentation | 🔄 Map |
| `src/wissil/Landing/LandingComponents.stories.tsx` | `WISSIL/Landing/Components` | `src/stories/WISSIL Framework/Landing/Components/LandingComponents.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Landing/Shared Framework Components/LandingComponents` | WISSIL → Landing → Shared | 🔄 Map |

---

### WISSIL FRAMEWORK — SLATE

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/app/slate/slate.stories.tsx` | `WISSIL/Slate/Pages/Workspace & Identity` | `src/stories/WISSIL Framework/Slate/Pages/WorkspaceIdentity.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Slate/Pages/Workspace & Identity` | WISSIL → Slate → Pages | 🔄 Map |
| `src/app/slate/slate.mdx` | `WISSIL/Slate/Documentation` | `src/stories/WISSIL Framework/Slate/Documentation/Slate.mdx` | `Lumenforge.io Design System/WISSIL Framework/Slate/Documentation/Slate` | WISSIL → Slate → Documentation | 🔄 Map |
| `src/wissil/Slate/SlateComponents.stories.tsx` | `WISSIL/Slate/Components` | `src/stories/WISSIL Framework/Slate/Shared Framework Components/SlateComponents.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Slate/Shared Framework Components/SlateComponents` | WISSIL → Slate → Shared | 🔄 Map |
| `src/wissil/Slate/FullSlate.stories.tsx` | `WISSIL/Slate/Full IDE` | `src/stories/WISSIL Framework/Slate/Pages/FullSlateIDE.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Slate/Pages/Full IDE` | WISSIL → Slate → Pages | 🔄 Map |
| `src/wissil/Slate/components/InspectorTree.stories.tsx` | `WISSIL/Slate/InspectorTree` | `src/stories/WISSIL Framework/Slate/Shared Framework Components/InspectorTree.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Slate/Shared Framework Components/InspectorTree` | WISSIL → Slate → Shared | 🔄 Map |

---

### WISSIL FRAMEWORK — IGNITION

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/app/ignition/ignition.stories.tsx` | `WISSIL/Ignition/Pages/Project Bootstrap` | `src/stories/WISSIL Framework/Ignition/Pages/ProjectBootstrap.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignition/Pages/Project Bootstrap` | WISSIL → Ignition → Pages | 🔄 Map |
| `src/app/ignition/ignition.mdx` | `WISSIL/Ignition/Documentation` | `src/stories/WISSIL Framework/Ignition/Documentation/Ignition.mdx` | `Lumenforge.io Design System/WISSIL Framework/Ignition/Documentation/Ignition` | WISSIL → Ignition → Documentation | 🔄 Map |
| `src/wissil/Ignition/IgnitionComponents.stories.tsx` | `WISSIL/Ignition/Components` | `src/stories/WISSIL Framework/Ignition/Shared Framework Components/IgnitionComponents.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignition/Shared Framework Components/IgnitionComponents` | WISSIL → Ignition → Shared | 🔄 Map |
| `src/stories/IgnitionRuntime/Events/OnStart.stories.tsx` | `WISSIL/Ignition/Runtime/OnStart` | `src/stories/WISSIL Framework/Ignition/Runtime/Events/OnStart.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignition/Runtime/Events/OnStart` | WISSIL → Ignition → Runtime | 🔄 Map |
| `src/stories/IgnitionRuntime/Events/OnUpdate.stories.tsx` | `WISSIL/Ignition/Runtime/OnUpdate` | `src/stories/WISSIL Framework/Ignition/Runtime/Events/OnUpdate.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignition/Runtime/Events/OnUpdate` | WISSIL → Ignition → Runtime | 🔄 Map |
| `src/stories/IgnitionRuntime/Events/OnCardPlayed.stories.tsx` | `WISSIL/Ignition/Runtime/OnCardPlayed` | `src/stories/WISSIL Framework/Ignition/Runtime/Events/OnCardPlayed.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignition/Runtime/Events/OnCardPlayed` | WISSIL → Ignition → Runtime | 🔄 Map |

---

### WISSIL FRAMEWORK — SPARK

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/app/spark/spark.stories.tsx` | `WISSIL/Spark/Pages/IDE Experience` | `src/stories/WISSIL Framework/Spark/Pages/IDEExperience.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Spark/Pages/IDE Experience` | WISSIL → Spark → Pages | 🔄 Map |
| `src/app/spark/spark.mdx` | `WISSIL/Spark/Documentation` | `src/stories/WISSIL Framework/Spark/Documentation/Spark.mdx` | `Lumenforge.io Design System/WISSIL Framework/Spark/Documentation/Spark` | WISSIL → Spark → Documentation | 🔄 Map |
| `src/wissil/Spark/SparkComponents.stories.tsx` | `WISSIL/Spark/Components` | `src/stories/WISSIL Framework/Spark/Shared Framework Components/SparkComponents.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Spark/Shared Framework Components/SparkComponents` | WISSIL → Spark → Shared | 🔄 Map |
| `src/stories/Spark/TemplatePreview/CardGameTemplate.stories.tsx` | `WISSIL/Spark/Templates/CardGameTemplate` | `src/stories/WISSIL Framework/Spark/Templates/CardGameTemplate.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Spark/Templates/CardGameTemplate` | WISSIL → Spark → Templates | 🔄 Map |

---

### WISSIL FRAMEWORK — IGNIS

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/app/ignis/ignis.stories.tsx` | `WISSIL/Ignis/Pages/API Backend` | `src/stories/WISSIL Framework/Ignis/Pages/APIBackend.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Pages/API Backend` | WISSIL → Ignis → Pages | 🔄 Map |
| `src/app/ignis/ignis.mdx` | `WISSIL/Ignis/Documentation` | `src/stories/WISSIL Framework/Ignis/Documentation/Ignis.mdx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Documentation/Ignis` | WISSIL → Ignis → Documentation | 🔄 Map |
| `src/wissil/Ignis/IgnisComponents.stories.tsx` | `WISSIL/Ignis/Components` | `src/stories/WISSIL Framework/Ignis/Shared Framework Components/IgnisComponents.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Shared Framework Components/IgnisComponents` | WISSIL → Ignis → Shared | 🔄 Map |
| `src/stories/ignis/BPGraphCanvas.stories.tsx` | `WISSIL/Ignis/Blueprint/Canvas` | `src/stories/WISSIL Framework/Ignis/Blueprint Editor/Canvas/BPGraphCanvas.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Blueprint Editor/Canvas/BPGraphCanvas` | WISSIL → Ignis → Blueprint Editor → Canvas | 🔄 Map |
| `src/stories/ignis/NodePalette.stories.tsx` | `WISSIL/Ignis/Blueprint/Palette` | `src/stories/WISSIL Framework/Ignis/Blueprint Editor/Palette/NodePalette.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Blueprint Editor/Palette/NodePalette` | WISSIL → Ignis → Blueprint Editor → Palette | 🔄 Map |
| `src/stories/ignis/NodeRenderer.stories.tsx` | `WISSIL/Ignis/Blueprint/Nodes/NodeRenderer` | `src/stories/WISSIL Framework/Ignis/Nodes/NodeRenderer.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Nodes/NodeRenderer` | WISSIL → Ignis → Nodes | 🔄 Map |
| `src/stories/ignis/Nodes/NodeRenderer.stories.tsx` | `WISSIL/Ignis/Blueprint/Nodes/NodeRenderer` | `src/stories/WISSIL Framework/Ignis/Nodes/NodeRenderer.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Nodes/NodeRenderer` | WISSIL → Ignis → Nodes | 🔄 Map (duplicate) |
| `src/stories/ignis/Scenes/BlueprintEditorFull.stories.tsx` | `WISSIL/Ignis/Blueprint/Complete` | `src/stories/WISSIL Framework/Ignis/Scenes/BlueprintEditorFull.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Scenes/BlueprintEditorFull` | WISSIL → Ignis → Scenes | 🔄 Map |
| `src/stories/ignis/Wires/WireRenderer.stories.tsx` | `WISSIL/Ignis/Blueprint/Wires/WireRenderer` | `src/stories/WISSIL Framework/Ignis/Wires/WireRenderer.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Wires/WireRenderer` | WISSIL → Ignis → Wires | 🔄 Map |
| `src/stories/ignis/BlueprintEditor.mdx` | `Ignis/Blueprint Editor` | `src/stories/WISSIL Framework/Ignis/Documentation/BlueprintEditor.mdx` | `Lumenforge.io Design System/WISSIL Framework/Ignis/Documentation/Blueprint Editor` | WISSIL → Ignis → Documentation | 🔄 Map |

---

### WISSIL FRAMEWORK — WAYPOINT

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/app/waypoint/waypoint.stories.tsx` | `WISSIL/Waypoint/Pages/Unity Visual Scripting` | `src/stories/WISSIL Framework/Waypoint/Pages/UnityVisualScripting.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Waypoint/Pages/Unity Visual Scripting` | WISSIL → Waypoint → Pages | 🔄 Map |
| `src/app/waypoint/waypoint.mdx` | `WISSIL/Waypoint/Documentation` | `src/stories/WISSIL Framework/Waypoint/Documentation/Waypoint.mdx` | `Lumenforge.io Design System/WISSIL Framework/Waypoint/Documentation/Waypoint` | WISSIL → Waypoint → Documentation | 🔄 Map |
| `src/wissil/Waypoint/WaypointComponents.stories.tsx` | `WISSIL/Waypoint/Components` | `src/stories/WISSIL Framework/Waypoint/Shared Framework Components/WaypointComponents.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Waypoint/Shared Framework Components/WaypointComponents` | WISSIL → Waypoint → Shared | 🔄 Map |
| `src/stories/Waypoint/AIExplain/AIExplain.stories.tsx` | `WISSIL/Waypoint/AI/Explain` | `src/stories/WISSIL Framework/Waypoint/AI Explain/AIExplain.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Waypoint/AI Explain/AIExplain` | WISSIL → Waypoint → AI Explain | 🔄 Map |
| `src/stories/Waypoint/AISuggestions/Suggestions.stories.tsx` | `WISSIL/Waypoint/AI/Suggestions` | `src/stories/WISSIL Framework/Waypoint/AI Suggestions/AISuggestions.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Waypoint/AI Suggestions/AISuggestions` | WISSIL → Waypoint → AI Suggestions | 🔄 Map |

---

### WISSIL FRAMEWORK — SIMULATION

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/stories/Simulation/CardFrontLoop/CardFrontLoop.stories.tsx` | `WISSIL/Simulation/CardFrontLoop` | `src/stories/WISSIL Framework/Simulation/CardFrontLoop.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Simulation/CardFrontLoop` | WISSIL → Simulation | 🔄 Map |

---

### WISSIL FRAMEWORK — UNITY BRIDGE

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/stories/unity/MinimalUnity.stories.tsx` | `WISSIL/Unity/Minimal` | `src/stories/WISSIL Framework/Unity Bridge/MinimalUnity.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/MinimalUnity` | WISSIL → Unity Bridge | 🔄 Map |
| `src/stories/unity/CardFront/CardFrontScene.stories.tsx` | `WISSIL/Unity/CardFront/Scene` | `src/stories/WISSIL Framework/Unity Bridge/CardFront/CardFrontScene.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/CardFront/CardFrontScene` | WISSIL → Unity Bridge | 🔄 Map |
| `src/stories/unity/CardFront/Cards/CardFace.stories.tsx` | `WISSIL/Unity/CardFront/Cards/CardFace` | `src/stories/WISSIL Framework/Unity Bridge/CardFront/Cards/CardFace.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/CardFront/Cards/CardFace` | WISSIL → Unity Bridge | 🔄 Map |
| `src/stories/unity/CardFront/HUD/CardHud.stories.tsx` | `WISSIL/Unity/CardFront/HUD/CardHud` | `src/stories/WISSIL Framework/Unity Bridge/CardFront/HUD/CardHud.stories.tsx` | `Lumenforge.io Design System/WISSIL Framework/Unity Bridge/CardFront/HUD/CardHud` | WISSIL → Unity Bridge | 🔄 Map |

---

### APPLICATION PAGES — EDITOR

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/stories/EditorShell/AppShell/AppShell.stories.tsx` | `Editor/Shell/AppShell` | `src/stories/Application Pages/Editor/AppShell/AppShell.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/AppShell` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/EditorShell/AppShell/EditorShell.stories.tsx` | `Editor/Shell/EditorShell` | `src/stories/Application Pages/Editor/AppShell/EditorShell.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/EditorShell` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/EditorShell/TopBar/TopBar.stories.tsx` | `Editor/Shell/TopBar` | `src/stories/Application Pages/Editor/AppShell/TopBar.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/TopBar` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/EditorShell/Sidebar/Sidebar.stories.tsx` | `Editor/Shell/Sidebar` | `src/stories/Application Pages/Editor/AppShell/Sidebar.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/Sidebar` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/EditorShell/Tabs/Tabs.stories.tsx` | `Editor/Shell/Tabs` | `src/stories/Application Pages/Editor/AppShell/Tabs.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/Tabs` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/EditorShell/CommandPalette/CommandPalette.stories.tsx` | `Editor/Shell/CommandPalette` | `src/stories/Application Pages/Editor/AppShell/CommandPalette.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/CommandPalette` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/EditorShell/SplitPane/SplitPane.stories.tsx` | `Editor/Shell/SplitPane` | `src/stories/Application Pages/Editor/AppShell/SplitPane.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/AppShell/SplitPane` | Application Pages → Editor → AppShell | 🔄 Map |
| `src/stories/Filesystem/Tree/FileTree.stories.tsx` | `Editor/Filesystem/FileTree` | `src/stories/Application Pages/Filesystem/FileTree.stories.tsx` | `Lumenforge.io Design System/Application Pages/Filesystem/FileTree` | Application Pages → Filesystem | 🔄 Map |
| `src/stories/Filesystem/FileTabs/FileTabs.stories.tsx` | `Editor/Filesystem/FileTabs` | `src/stories/Application Pages/Filesystem/FileTabs.stories.tsx` | `Lumenforge.io Design System/Application Pages/Filesystem/FileTabs` | Application Pages → Filesystem | 🔄 Map |
| `src/stories/Filesystem/FilePreview/FilePreview.stories.tsx` | `Editor/Filesystem/FilePreview` | `src/stories/Application Pages/Filesystem/FilePreview.stories.tsx` | `Lumenforge.io Design System/Application Pages/Filesystem/FilePreview` | Application Pages → Filesystem | 🔄 Map |
| `src/stories/Editor/MonacoEditor/MonacoEditor.stories.tsx` | `Editor/MonacoEditor` | `src/stories/Application Pages/Editor/MonacoEditor/MonacoEditor.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/MonacoEditor` | Application Pages → Editor → MonacoEditor | 🔄 Map |
| `src/stories/Editor/SearchReplace/SearchReplace.stories.tsx` | `Editor/SearchReplace` | `src/stories/Application Pages/Editor/MonacoEditor/SearchReplace.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/SearchReplace` | Application Pages → Editor → MonacoEditor | 🔄 Map |
| `src/stories/Editor/GameDev/SceneGraph.stories.tsx` | `Editor/GameDev/SceneGraph` | `src/stories/Application Pages/GameDev/SceneGraph.stories.tsx` | `Lumenforge.io Design System/Application Pages/GameDev/SceneGraph` | Application Pages → GameDev | 🔄 Map |
| `src/stories/Editor/GameDev/AssetManager.stories.tsx` | `Editor/GameDev/AssetManager` | `src/stories/Application Pages/GameDev/AssetManager.stories.tsx` | `Lumenforge.io Design System/Application Pages/GameDev/AssetManager` | Application Pages → GameDev | 🔄 Map |
| `src/stories/Editor/GameDev/UnityIntegration.stories.tsx` | `Editor/GameDev/UnityIntegration` | `src/stories/Application Pages/GameDev/UnityIntegration.stories.tsx` | `Lumenforge.io Design System/Application Pages/GameDev/UnityIntegration` | Application Pages → GameDev | 🔄 Map |
| `src/stories/Editor/Complete/EditorContainer.stories.tsx` | `Editor/Complete/EditorContainer` | `src/stories/Application Pages/Editor/Complete/EditorContainer.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/Complete/EditorContainer` | Application Pages → Editor → Complete | 🔄 Map |
| `src/stories/ide/WissilIDESimulation.stories.tsx` | `Editor/IDE/Simulation` | `src/stories/Application Pages/Editor/IDE/WissilIDESimulation.stories.tsx` | `Lumenforge.io Design System/Application Pages/Editor/IDE/WissilIDESimulation` | Application Pages → Editor → IDE | 🔄 Map |

---

### INTEGRATIONS

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| `src/stories/plugins/ExamplePlugin.stories.tsx` | `Editor/Plugins/Example` | `src/stories/Integrations/Plugins/ExamplePlugin.stories.tsx` | `Lumenforge.io Design System/Integrations/Plugins/ExamplePlugin` | Integrations → Plugins | 🔄 Map |
| N/A | N/A | `src/stories/Integrations/MCP Tools/MCPTools.stories.tsx` | `Lumenforge.io Design System/Integrations/MCP Tools/MCPTools` | Integrations → MCP Tools | ➕ Create |
| N/A | N/A | `src/stories/Integrations/WebContainer Tools/WebContainerTools.stories.tsx` | `Lumenforge.io Design System/Integrations/WebContainer Tools/WebContainerTools` | Integrations → WebContainer Tools | ➕ Create |
| N/A | N/A | `src/stories/Integrations/Cloudflare Zero Trust Components/ZeroTrustComponents.stories.tsx` | `Lumenforge.io Design System/Integrations/Cloudflare / Zero Trust Components/ZeroTrustComponents` | Integrations → Cloudflare | ➕ Create |

---

### SYSTEM

| Current Path | Current Title | Target Path | Target Title | Category | Status |
|-------------|---------------|-------------|--------------|----------|--------|
| N/A | N/A | `src/stories/System/IDE Runtime/IDERuntime.stories.tsx` | `Lumenforge.io Design System/System/IDE Runtime/IDERuntime` | System → IDE Runtime | ➕ Create |
| N/A | N/A | `src/stories/System/Simulator Runtime/SimulatorRuntime.stories.tsx` | `Lumenforge.io Design System/System/Simulator Runtime/SimulatorRuntime` | System → Simulator Runtime | ➕ Create |
| N/A | N/A | `src/stories/System/API Schemas/APISchemas.stories.tsx` | `Lumenforge.io Design System/System/API Schemas/APISchemas` | System → API Schemas | ➕ Create |
| N/A | N/A | `src/stories/System/Network Visualizer/NetworkVisualizer.stories.tsx` | `Lumenforge.io Design System/System/Network Visualizer/NetworkVisualizer` | System → Network Visualizer | ➕ Create |
| N/A | N/A | `src/stories/System/Logs & Audit Components/LogsAudit.stories.tsx` | `Lumenforge.io Design System/System/Logs & Audit Components/LogsAudit` | System → Logs & Audit | ➕ Create |
| N/A | N/A | `src/stories/System/Internal Dev Tools/InternalDevTools.stories.tsx` | `Lumenforge.io Design System/System/Internal Dev Tools/InternalDevTools` | System → Internal Dev Tools | ➕ Create |

---

## SUMMARY STATISTICS

### Total Files Mapped: **55 story files + 14 MDX files = 69 files**

- **🔄 To Map (Existing):** 50 files
- **➕ To Create (New):** 19 files
- **Total Operations:** 69 files

### Breakdown by Category:

1. **Foundations:** 2 existing → 7 new = **9 files**
2. **Components:** 4 existing → 6 new = **10 files**
3. **WISSIL Framework:** 33 existing → 0 new = **33 files**
4. **Application Pages:** 18 existing → 0 new = **18 files**
5. **Integrations:** 1 existing → 3 new = **4 files**
6. **System:** 0 existing → 6 new = **6 files**
7. **MDX Documentation:** 14 files to reorganize = **14 files**

---

## FILE MOVES REQUIRED

### Major Moves:

1. **Foundations** (`src/stories/Themes/` → `src/stories/Foundations/Themes/`)
2. **Components** (`src/design-system/primitives/*.stories.tsx` → `src/stories/Components/Atoms/`)
3. **WISSIL Pages** (`src/app/*/` → `src/stories/WISSIL Framework/*/Pages/`)
4. **WISSIL Components** (`src/wissil/*/` → `src/stories/WISSIL Framework/*/Shared Framework Components/`)
5. **Editor Stories** (`src/stories/EditorShell/` → `src/stories/Application Pages/Editor/AppShell/`)
6. **Filesystem** (`src/stories/Filesystem/` → `src/stories/Application Pages/Filesystem/`)
7. **GameDev** (`src/stories/Editor/GameDev/` → `src/stories/Application Pages/GameDev/`)
8. **Plugins** (`src/stories/plugins/` → `src/stories/Integrations/Plugins/`)

---

## IMPORT PATH CHANGES

All moved files will require import path updates. Examples:

- `@/editor/shell/AppShell` → May change depending on final structure
- `@/design-system/primitives/Button` → `@/components/atoms/Button` (if components move)
- `@/wissil/Landing/LandingLayout` → `@/wissil/Landing/LandingLayout` (imports may stay same if components don't move)
- Relative imports will need updating based on new folder structure

---

## NEXT PHASES

✅ **PHASE 1:** Inventory & Mapping (COMPLETE)  
⏭️ **PHASE 2:** Rewrite All Storybook Titles  
⏭️ **PHASE 3:** Physical Folder Restructuring  
⏭️ **PHASE 4:** Fix All Import Paths  
⏭️ **PHASE 5:** MDX + Documentation Alignment  
⏭️ **PHASE 6:** Validate Storybook Build  
⏭️ **PHASE 7:** Final Output  

---

**PHASE 1 COMPLETE — Ready for PHASE 2**
