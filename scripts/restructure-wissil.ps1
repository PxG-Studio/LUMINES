# WISSIL Restructure Script
# Moves files to proper locations without deleting anything

Write-Host "🚀 Starting WISSIL Restructure..." -ForegroundColor Cyan

# Create archive directory
$archiveDir = "archive/restructure-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
Write-Host "📦 Created archive: $archiveDir" -ForegroundColor Green

# Phase 1: Consolidate duplicate Ignis components
Write-Host "`n📋 Phase 1: Consolidating Ignis components..." -ForegroundColor Yellow

# Check if files exist before moving
$ignisDups = @(
    @{ From = "src/ignis/canvas"; To = "$archiveDir/ignis/canvas" },
    @{ From = "src/ignis/palette"; To = "$archiveDir/ignis/palette" },
    @{ From = "src/ignis/nodes"; To = "$archiveDir/ignis/nodes" },
    @{ From = "src/ignis/wires"; To = "$archiveDir/ignis/wires" }
)

foreach ($dup in $ignisDups) {
    if (Test-Path $dup.From) {
        $destDir = Split-Path $dup.To -Parent
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        Move-Item -Path $dup.From -Destination $dup.To -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Archived: $($dup.From)" -ForegroundColor Gray
    }
}

# Move inspector, debugger, scenes to blueprint if they exist
$ignisMoves = @(
    @{ From = "src/ignis/inspector"; To = "src/ignis/blueprint/inspector"; Archive = "$archiveDir/ignis/inspector" },
    @{ From = "src/ignis/debugger"; To = "src/ignis/blueprint/debugger"; Archive = "$archiveDir/ignis/debugger" },
    @{ From = "src/ignis/scenes"; To = "src/ignis/blueprint/scenes"; Archive = "$archiveDir/ignis/scenes" }
)

foreach ($move in $ignisMoves) {
    if (Test-Path $move.From) {
        # Check if destination already exists
        if (Test-Path $move.To) {
            # Archive the source instead
            $destDir = Split-Path $move.Archive -Parent
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Move-Item -Path $move.From -Destination $move.Archive -Force -ErrorAction SilentlyContinue
            Write-Host "  ⚠ Archived (destination exists): $($move.From)" -ForegroundColor Yellow
        } else {
            New-Item -ItemType Directory -Path (Split-Path $move.To -Parent) -Force | Out-Null
            Move-Item -Path $move.From -Destination $move.To -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ Moved: $($move.From) → $($move.To)" -ForegroundColor Green
        }
    }
}

# Phase 2: Consolidate ThemeProvider
Write-Host "`n📋 Phase 2: Consolidating ThemeProvider..." -ForegroundColor Yellow

if (Test-Path "src/theme") {
    $themeFiles = Get-ChildItem -Path "src/theme" -Recurse
    foreach ($file in $themeFiles) {
        $relativePath = $file.FullName.Replace((Resolve-Path "src/theme").Path + "\", "")
        $destPath = "src/design-system/themes/$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Move-Item -Path $file.FullName -Destination $destPath -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ Moved: $relativePath → design-system/themes/" -ForegroundColor Green
        } else {
            # Archive duplicate
            $archivePath = "$archiveDir/theme/$relativePath"
            $archiveDirPath = Split-Path $archivePath -Parent
            New-Item -ItemType Directory -Path $archiveDirPath -Force | Out-Null
            Move-Item -Path $file.FullName -Destination $archivePath -Force -ErrorAction SilentlyContinue
            Write-Host "  ⚠ Archived (duplicate): $relativePath" -ForegroundColor Yellow
        }
    }
    # Remove empty theme directory
    if ((Get-ChildItem -Path "src/theme" -Recurse -ErrorAction SilentlyContinue).Count -eq 0) {
        Remove-Item -Path "src/theme" -Force -ErrorAction SilentlyContinue
    }
}

# Phase 3: Move misplaced components
Write-Host "`n📋 Phase 3: Moving misplaced components..." -ForegroundColor Yellow

# Move components/editor to editor/
if (Test-Path "src/components/editor") {
    $editorFiles = Get-ChildItem -Path "src/components/editor" -Recurse
    foreach ($file in $editorFiles) {
        $relativePath = $file.FullName.Replace((Resolve-Path "src/components/editor").Path + "\", "")
        $destPath = "src/editor/$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Move-Item -Path $file.FullName -Destination $destPath -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ Moved: components/editor/$relativePath → editor/" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
}

# Move components/panels to editor/panels/
if (Test-Path "src/components/panels") {
    $panelFiles = Get-ChildItem -Path "src/components/panels" -Recurse
    foreach ($file in $panelFiles) {
        $relativePath = $file.FullName.Replace((Resolve-Path "src/components/panels").Path + "\", "")
        $destPath = "src/editor/panels/$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Move-Item -Path $file.FullName -Destination $destPath -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ Moved: components/panels/$relativePath → editor/panels/" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
}

# Move story-components to stories/components/
if (Test-Path "src/story-components") {
    $storyFiles = Get-ChildItem -Path "src/story-components" -Recurse
    foreach ($file in $storyFiles) {
        $relativePath = $file.FullName.Replace((Resolve-Path "src/story-components").Path + "\", "")
        $destPath = "src/stories/components/$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Move-Item -Path $file.FullName -Destination $destPath -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ Moved: story-components/$relativePath → stories/components/" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n✅ Restructure complete! Archive: $archiveDir" -ForegroundColor Green
Write-Host "`n⚠️  Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update all import statements" -ForegroundColor White
Write-Host "  2. Update .storybook/main.ts paths" -ForegroundColor White
Write-Host "  3. Update tsconfig.json paths" -ForegroundColor White
Write-Host "  4. Test Storybook build" -ForegroundColor White

