# Fix WIS2L Framework folder structure by copying from WISSIL Framework correctly
$source = "src/stories/WISSIL Framework"
$dest = "src/stories/WIS2L Framework"

Write-Host "=== Fixing WIS2L Framework folder structure ===" -ForegroundColor Cyan

# Remove incorrectly created structure
if (Test-Path $dest) {
    Remove-Item -Path $dest -Recurse -Force
    Write-Host "Removed incorrect structure" -ForegroundColor Yellow
}

# Create fresh destination
New-Item -ItemType Directory -Path $dest -Force | Out-Null

# Copy all subdirectories correctly
Get-ChildItem -Path $source -Directory | ForEach-Object {
    $subfolderName = $_.Name
    $sourcePath = $_.FullName
    $destPath = Join-Path $dest $subfolderName
    
    Write-Host "Copying $subfolderName..." -ForegroundColor Gray
    
    # Copy the entire subdirectory
    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
}

$fileCount = (Get-ChildItem -Path $dest -Recurse -File).Count
Write-Host ""
Write-Host "✅ SUCCESS: Created WIS2L Framework with $fileCount files" -ForegroundColor Green
Write-Host ""
Write-Host "Structure:" -ForegroundColor Cyan
Get-ChildItem -Path $dest -Directory | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}

