# Inventory Mirror Components Script
# Lists all components in the mirror directory

$mirrorPath = "E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS"

Write-Host "🔍 Scanning for components in mirror directory..." -ForegroundColor Cyan
Write-Host "Path: $mirrorPath`n" -ForegroundColor Gray

# Find all component files
$components = Get-ChildItem -Path $mirrorPath -Recurse -File -Include "*.tsx","*.ts","*.jsx","*.js" | 
    Where-Object { 
        $_.DirectoryName -like "*component*" -or 
        $_.Name -like "*Component*" -or
        $_.Name -like "*Editor*" -or
        $_.Name -like "*File*" -or
        $_.Name -like "*Tab*" -or
        $_.Name -like "*Monaco*" -or
        $_.Name -like "*StackBlitz*"
    }

Write-Host "Found $($components.Count) component files:`n" -ForegroundColor Green

$components | ForEach-Object {
    $relativePath = $_.FullName.Replace($mirrorPath, "").TrimStart('\')
    Write-Host "  📄 $relativePath" -ForegroundColor White
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  Total Components: $($components.Count)" -ForegroundColor Yellow

# Group by directory
$byDirectory = $components | Group-Object { $_.DirectoryName }
Write-Host "`n📁 By Directory:" -ForegroundColor Cyan
$byDirectory | ForEach-Object {
    $dirName = $_.Name.Replace($mirrorPath, "").TrimStart('\')
    Write-Host "  $dirName : $($_.Count) files" -ForegroundColor Gray
}

