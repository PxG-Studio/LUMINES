# Copy Mirror Components Script
# Copies components from mirror directory to WISSIL src/ with adaptations

$mirrorPath = "E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS"
$targetPath = "E:\Projects\LUMINES\src"

Write-Host "📦 Copying components from mirror directory..." -ForegroundColor Cyan
Write-Host "Source: $mirrorPath" -ForegroundColor Gray
Write-Host "Target: $targetPath`n" -ForegroundColor Gray

# Find all component files
$components = Get-ChildItem -Path $mirrorPath -Recurse -File -Include "*.tsx","*.ts" | 
    Where-Object { 
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*.cache*" -and
        ($_.DirectoryName -like "*component*" -or 
         $_.Name -like "*Component*" -or
         $_.Name -like "*Editor*" -or
         $_.Name -like "*File*" -or
         $_.Name -like "*Tab*" -or
         $_.Name -like "*Monaco*" -or
         $_.Name -like "*StackBlitz*" -or
         $_.Name -like "*Animated*" -or
         $_.Name -like "*Floating*" -or
         $_.Name -like "*Glass*" -or
         $_.Name -like "*Gradient*" -or
         $_.Name -like "*Hero*" -or
         $_.Name -like "*Rotating*" -or
         $_.Name -like "*Streaming*")
    }

Write-Host "Found $($components.Count) component files`n" -ForegroundColor Green

# Create mapping of source to target paths
$componentMap = @{}

foreach ($component in $components) {
    $relativePath = $component.FullName.Replace($mirrorPath, "").TrimStart('\')
    
    # Determine target path based on component type
    $targetFile = $null
    
    if ($relativePath -like "*editor\FileManagement\*") {
        $targetFile = Join-Path $targetPath "editor\filesystem\$($component.Name)"
    }
    elseif ($relativePath -like "*editor\Monaco\*") {
        $targetFile = Join-Path $targetPath "editor\monaco\$($component.Name)"
    }
    elseif ($relativePath -like "*editor\Git\*") {
        $targetFile = Join-Path $targetPath "editor\git\$($component.Name)"
    }
    elseif ($relativePath -like "*stackblitz\*") {
        $targetFile = Join-Path $targetPath "editor\runtime\$($component.Name)"
    }
    elseif ($relativePath -like "*landing\*") {
        $targetFile = Join-Path $targetPath "components\landing\$($component.Name)"
    }
    else {
        $targetFile = Join-Path $targetPath "components\mirror\$($component.Name)"
    }
    
    $componentMap[$component.FullName] = $targetFile
    Write-Host "  📄 $($component.Name)" -ForegroundColor White
    Write-Host "     From: $relativePath" -ForegroundColor Gray
    Write-Host "     To:   $($targetFile.Replace($targetPath, 'src'))" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  Total Components: $($components.Count)" -ForegroundColor Yellow
Write-Host "`n⚠️  Note: This script only lists components. Actual copying should be done manually" -ForegroundColor Yellow
Write-Host "    after reviewing and adapting each component for WISSIL-FS and SLATE tokens." -ForegroundColor Yellow

# Export mapping to JSON for reference
$componentMap | ConvertTo-Json -Depth 3 | Out-File -FilePath "component-mapping.json" -Encoding utf8
Write-Host "`n✅ Component mapping saved to component-mapping.json" -ForegroundColor Green

