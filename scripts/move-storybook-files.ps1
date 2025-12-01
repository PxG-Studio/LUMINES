# PHASE 3 - Storybook File Restructuring Script
# Comprehensive file move operations to canonical hierarchy

Write-Host "Starting Storybook file restructuring..." -ForegroundColor Green

# Function to safely move file
function Move-StoryFile {
    param(
        [string]$SourcePath,
        [string]$DestinationPath
    )
    
    if (Test-Path $SourcePath) {
        $destDir = Split-Path $DestinationPath -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Write-Host "Created directory: $destDir" -ForegroundColor Yellow
        }
        Move-Item -Path $SourcePath -Destination $DestinationPath -Force -ErrorAction Stop
        Write-Host "Moved: $SourcePath -> $DestinationPath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "Source not found: $SourcePath" -ForegroundColor Red
        return $false
    }
}

# FOUNDATIONS
Write-Host "`n=== MOVING FOUNDATIONS ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/Themes/DarkMode/DarkMode.stories.tsx" "src/stories/Foundations/Themes/DarkMode.stories.tsx"
Move-StoryFile "src/stories/Themes/LightMode/LightMode.stories.tsx" "src/stories/Foundations/Themes/LightMode.stories.tsx"

# COMPONENTS
Write-Host "`n=== MOVING COMPONENTS ===" -ForegroundColor Cyan
Move-StoryFile "src/design-system/primitives/Button.stories.tsx" "src/stories/Components/Atoms/Button.stories.tsx"
Move-StoryFile "src/design-system/primitives/Card.stories.tsx" "src/stories/Components/Atoms/Card.stories.tsx"
Move-StoryFile "src/design-system/primitives/Panel.stories.tsx" "src/stories/Components/Atoms/Panel.stories.tsx"
Move-StoryFile "src/design-system/primitives/SplitView.stories.tsx" "src/stories/Components/Layouts/SplitView.stories.tsx"

# WISSIL FRAMEWORK - LANDING
Write-Host "`n=== MOVING WISSIL FRAMEWORK - LANDING ===" -ForegroundColor Cyan
Move-StoryFile "src/app/landing/landing.stories.tsx" "src/stories/WISSIL Framework/Landing/Pages/MainGateway.stories.tsx"
Move-StoryFile "src/app/landing/landing.mdx" "src/stories/WISSIL Framework/Landing/Documentation/Landing.mdx"
Move-StoryFile "src/wissil/Landing/LandingComponents.stories.tsx" "src/stories/WISSIL Framework/Landing/Shared Framework Components/LandingComponents.stories.tsx"

# WISSIL FRAMEWORK - SLATE
Write-Host "`n=== MOVING WISSIL FRAMEWORK - SLATE ===" -ForegroundColor Cyan
Move-StoryFile "src/app/slate/slate.stories.tsx" "src/stories/WISSIL Framework/Slate/Pages/WorkspaceIdentity.stories.tsx"
Move-StoryFile "src/app/slate/slate.mdx" "src/stories/WISSIL Framework/Slate/Documentation/Slate.mdx"
Move-StoryFile "src/wissil/Slate/SlateComponents.stories.tsx" "src/stories/WISSIL Framework/Slate/Shared Framework Components/SlateComponents.stories.tsx"
Move-StoryFile "src/wissil/Slate/FullSlate.stories.tsx" "src/stories/WISSIL Framework/Slate/Pages/FullSlateIDE.stories.tsx"
Move-StoryFile "src/wissil/Slate/components/InspectorTree.stories.tsx" "src/stories/WISSIL Framework/Slate/Shared Framework Components/InspectorTree.stories.tsx"

# WISSIL FRAMEWORK - IGNITION
Write-Host "`n=== MOVING WISSIL FRAMEWORK - IGNITION ===" -ForegroundColor Cyan
Move-StoryFile "src/app/ignition/ignition.stories.tsx" "src/stories/WISSIL Framework/Ignition/Pages/ProjectBootstrap.stories.tsx"
Move-StoryFile "src/app/ignition/ignition.mdx" "src/stories/WISSIL Framework/Ignition/Documentation/Ignition.mdx"
Move-StoryFile "src/wissil/Ignition/IgnitionComponents.stories.tsx" "src/stories/WISSIL Framework/Ignition/Shared Framework Components/IgnitionComponents.stories.tsx"
Move-StoryFile "src/stories/IgnitionRuntime/Events/OnStart.stories.tsx" "src/stories/WISSIL Framework/Ignition/Runtime/Events/OnStart.stories.tsx"
Move-StoryFile "src/stories/IgnitionRuntime/Events/OnUpdate.stories.tsx" "src/stories/WISSIL Framework/Ignition/Runtime/Events/OnUpdate.stories.tsx"
Move-StoryFile "src/stories/IgnitionRuntime/Events/OnCardPlayed.stories.tsx" "src/stories/WISSIL Framework/Ignition/Runtime/Events/OnCardPlayed.stories.tsx"

# WISSIL FRAMEWORK - SPARK
Write-Host "`n=== MOVING WISSIL FRAMEWORK - SPARK ===" -ForegroundColor Cyan
Move-StoryFile "src/app/spark/spark.stories.tsx" "src/stories/WISSIL Framework/Spark/Pages/IDEExperience.stories.tsx"
Move-StoryFile "src/app/spark/spark.mdx" "src/stories/WISSIL Framework/Spark/Documentation/Spark.mdx"
Move-StoryFile "src/wissil/Spark/SparkComponents.stories.tsx" "src/stories/WISSIL Framework/Spark/Shared Framework Components/SparkComponents.stories.tsx"
Move-StoryFile "src/stories/Spark/TemplatePreview/CardGameTemplate.stories.tsx" "src/stories/WISSIL Framework/Spark/Templates/CardGameTemplate.stories.tsx"

# WISSIL FRAMEWORK - IGNIS
Write-Host "`n=== MOVING WISSIL FRAMEWORK - IGNIS ===" -ForegroundColor Cyan
Move-StoryFile "src/app/ignis/ignis.stories.tsx" "src/stories/WISSIL Framework/Ignis/Pages/APIBackend.stories.tsx"
Move-StoryFile "src/app/ignis/ignis.mdx" "src/stories/WISSIL Framework/Ignis/Documentation/Ignis.mdx"
Move-StoryFile "src/wissil/Ignis/IgnisComponents.stories.tsx" "src/stories/WISSIL Framework/Ignis/Shared Framework Components/IgnisComponents.stories.tsx"
Move-StoryFile "src/stories/ignis/BPGraphCanvas.stories.tsx" "src/stories/WISSIL Framework/Ignis/Blueprint Editor/Canvas/BPGraphCanvas.stories.tsx"
Move-StoryFile "src/stories/ignis/NodePalette.stories.tsx" "src/stories/WISSIL Framework/Ignis/Blueprint Editor/Palette/NodePalette.stories.tsx"
Move-StoryFile "src/stories/ignis/NodeRenderer.stories.tsx" "src/stories/WISSIL Framework/Ignis/Nodes/NodeRenderer.stories.tsx"
Move-StoryFile "src/stories/ignis/Scenes/BlueprintEditorFull.stories.tsx" "src/stories/WISSIL Framework/Ignis/Scenes/BlueprintEditorFull.stories.tsx"
Move-StoryFile "src/stories/ignis/Wires/WireRenderer.stories.tsx" "src/stories/WISSIL Framework/Ignis/Wires/WireRenderer.stories.tsx"
Move-StoryFile "src/stories/ignis/BlueprintEditor.mdx" "src/stories/WISSIL Framework/Ignis/Documentation/BlueprintEditor.mdx"
# Remove duplicate NodeRenderer
if (Test-Path "src/stories/ignis/Nodes/NodeRenderer.stories.tsx") {
    Remove-Item "src/stories/ignis/Nodes/NodeRenderer.stories.tsx" -Force
    Write-Host "Removed duplicate: src/stories/ignis/Nodes/NodeRenderer.stories.tsx" -ForegroundColor Yellow
}

# WISSIL FRAMEWORK - WAYPOINT
Write-Host "`n=== MOVING WISSIL FRAMEWORK - WAYPOINT ===" -ForegroundColor Cyan
Move-StoryFile "src/app/waypoint/waypoint.stories.tsx" "src/stories/WISSIL Framework/Waypoint/Pages/UnityVisualScripting.stories.tsx"
Move-StoryFile "src/app/waypoint/waypoint.mdx" "src/stories/WISSIL Framework/Waypoint/Documentation/Waypoint.mdx"
Move-StoryFile "src/wissil/Waypoint/WaypointComponents.stories.tsx" "src/stories/WISSIL Framework/Waypoint/Shared Framework Components/WaypointComponents.stories.tsx"
Move-StoryFile "src/stories/Waypoint/AIExplain/AIExplain.stories.tsx" "src/stories/WISSIL Framework/Waypoint/AI Explain/AIExplain.stories.tsx"
Move-StoryFile "src/stories/Waypoint/AISuggestions/Suggestions.stories.tsx" "src/stories/WISSIL Framework/Waypoint/AI Suggestions/AISuggestions.stories.tsx"

# WISSIL FRAMEWORK - SIMULATION
Write-Host "`n=== MOVING WISSIL FRAMEWORK - SIMULATION ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/Simulation/CardFrontLoop/CardFrontLoop.stories.tsx" "src/stories/WISSIL Framework/Simulation/CardFrontLoop.stories.tsx"

# WISSIL FRAMEWORK - UNITY BRIDGE
Write-Host "`n=== MOVING WISSIL FRAMEWORK - UNITY BRIDGE ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/unity/MinimalUnity.stories.tsx" "src/stories/WISSIL Framework/Unity Bridge/MinimalUnity.stories.tsx"
Move-StoryFile "src/stories/unity/CardFront/CardFrontScene.stories.tsx" "src/stories/WISSIL Framework/Unity Bridge/CardFront/CardFrontScene.stories.tsx"
Move-StoryFile "src/stories/unity/CardFront/Cards/CardFace.stories.tsx" "src/stories/WISSIL Framework/Unity Bridge/CardFront/Cards/CardFace.stories.tsx"
Move-StoryFile "src/stories/unity/CardFront/HUD/CardHud.stories.tsx" "src/stories/WISSIL Framework/Unity Bridge/CardFront/HUD/CardHud.stories.tsx"

# APPLICATION PAGES - EDITOR
Write-Host "`n=== MOVING APPLICATION PAGES - EDITOR ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/EditorShell/AppShell/AppShell.stories.tsx" "src/stories/Application Pages/Editor/AppShell/AppShell.stories.tsx"
Move-StoryFile "src/stories/EditorShell/AppShell/EditorShell.stories.tsx" "src/stories/Application Pages/Editor/AppShell/EditorShell.stories.tsx"
Move-StoryFile "src/stories/EditorShell/TopBar/TopBar.stories.tsx" "src/stories/Application Pages/Editor/AppShell/TopBar.stories.tsx"
Move-StoryFile "src/stories/EditorShell/Sidebar/Sidebar.stories.tsx" "src/stories/Application Pages/Editor/AppShell/Sidebar.stories.tsx"
Move-StoryFile "src/stories/EditorShell/Tabs/Tabs.stories.tsx" "src/stories/Application Pages/Editor/AppShell/Tabs.stories.tsx"
Move-StoryFile "src/stories/EditorShell/CommandPalette/CommandPalette.stories.tsx" "src/stories/Application Pages/Editor/AppShell/CommandPalette.stories.tsx"
Move-StoryFile "src/stories/EditorShell/SplitPane/SplitPane.stories.tsx" "src/stories/Application Pages/Editor/AppShell/SplitPane.stories.tsx"
Move-StoryFile "src/stories/Editor/MonacoEditor/MonacoEditor.stories.tsx" "src/stories/Application Pages/Editor/MonacoEditor/MonacoEditor.stories.tsx"
Move-StoryFile "src/stories/Editor/SearchReplace/SearchReplace.stories.tsx" "src/stories/Application Pages/Editor/MonacoEditor/SearchReplace.stories.tsx"
Move-StoryFile "src/stories/Editor/Complete/EditorContainer.stories.tsx" "src/stories/Application Pages/Editor/Complete/EditorContainer.stories.tsx"
Move-StoryFile "src/stories/ide/WissilIDESimulation.stories.tsx" "src/stories/Application Pages/Editor/IDE/WissilIDESimulation.stories.tsx"

# APPLICATION PAGES - FILESYSTEM
Write-Host "`n=== MOVING APPLICATION PAGES - FILESYSTEM ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/Filesystem/Tree/FileTree.stories.tsx" "src/stories/Application Pages/Filesystem/FileTree.stories.tsx"
Move-StoryFile "src/stories/Filesystem/FileTabs/FileTabs.stories.tsx" "src/stories/Application Pages/Filesystem/FileTabs.stories.tsx"
Move-StoryFile "src/stories/Filesystem/FilePreview/FilePreview.stories.tsx" "src/stories/Application Pages/Filesystem/FilePreview.stories.tsx"

# APPLICATION PAGES - GAMEDEV
Write-Host "`n=== MOVING APPLICATION PAGES - GAMEDEV ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/Editor/GameDev/SceneGraph.stories.tsx" "src/stories/Application Pages/GameDev/SceneGraph.stories.tsx"
Move-StoryFile "src/stories/Editor/GameDev/AssetManager.stories.tsx" "src/stories/Application Pages/GameDev/AssetManager.stories.tsx"
Move-StoryFile "src/stories/Editor/GameDev/UnityIntegration.stories.tsx" "src/stories/Application Pages/GameDev/UnityIntegration.stories.tsx"

# INTEGRATIONS
Write-Host "`n=== MOVING INTEGRATIONS ===" -ForegroundColor Cyan
Move-StoryFile "src/stories/plugins/ExamplePlugin.stories.tsx" "src/stories/Integrations/Plugins/ExamplePlugin.stories.tsx"

Write-Host "`n=== FILE RESTRUCTURING COMPLETE ===" -ForegroundColor Green
Write-Host "Please verify all files moved successfully before proceeding to Phase 4" -ForegroundColor Yellow

