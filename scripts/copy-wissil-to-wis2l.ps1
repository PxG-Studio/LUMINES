# Copy WISSIL Framework folder to WIS2L Framework
$source = "src/stories/WISSIL Framework"
$dest = "src/stories/WIS2L Framework"

Write-Host "=== Copying WISSIL Framework to WIS2L Framework ===" -ForegroundColor Cyan

if (!(Test-Path $source)) {
    Write-Host "ERROR: Source folder not found!" -ForegroundColor Red
    exit 1
}

# Create destination folder
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Write-Host "Created destination folder" -ForegroundColor Green
}

# Copy all files recursively
Get-ChildItem -Path $source -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($source.Length + 1)
    $destPath = Join-Path $dest $relativePath
    $destDir = Split-Path $destPath -Parent
    
    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    Copy-Item $_.FullName $destPath -Force
    Write-Host "Copied: $relativePath" -ForegroundColor Gray
}

$fileCount = (Get-ChildItem -Path $dest -Recurse -File).Count
Write-Host ""
Write-Host "✅ SUCCESS: Copied $fileCount files to WIS2L Framework" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Update .storybook/main.ts to exclude WISSIL Framework folder"

