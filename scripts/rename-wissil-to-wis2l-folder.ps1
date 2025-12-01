# Script to rename WISSIL Framework folder to WIS2L Framework
# Run this script when Storybook is NOT running and no files are open

$source = "src/stories/WISSIL Framework"
$dest = "src/stories/WIS2L Framework"

Write-Host "=== Renaming WISSIL Framework folder to WIS2L Framework ===" -ForegroundColor Cyan
Write-Host ""

# Check if source exists
if (!(Test-Path $source)) {
    Write-Host "ERROR: Source folder '$source' not found!" -ForegroundColor Red
    exit 1
}

# Check if destination already exists
if (Test-Path $dest) {
    Write-Host "WARNING: Destination folder '$dest' already exists!" -ForegroundColor Yellow
    Write-Host "Please delete it first, then run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if folder is locked (contains locked files)
Write-Host "Checking if folder can be renamed..." -ForegroundColor Yellow
try {
    $testFile = Get-ChildItem -Path $source -Recurse -File | Select-Object -First 1
    if ($testFile) {
        $testContent = Get-Content $testFile.FullName -ErrorAction Stop
        Write-Host "Folder appears accessible." -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: Cannot access folder files. Is Storybook or an editor using it?" -ForegroundColor Red
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "  1. Close Storybook server" -ForegroundColor Yellow
    Write-Host "  2. Close all IDE/editor windows" -ForegroundColor Yellow
    Write-Host "  3. Run this script again" -ForegroundColor Yellow
    exit 1
}

# Attempt rename using Move-Item
Write-Host ""
Write-Host "Attempting to rename folder..." -ForegroundColor Yellow
try {
    Move-Item -Path $source -Destination $dest -ErrorAction Stop
    Write-Host "✅ SUCCESS: Folder renamed to 'WIS2L Framework'!" -ForegroundColor Green
    
    # Verify
    $fileCount = (Get-ChildItem -Path $dest -Recurse -File).Count
    Write-Host "✅ Verified: $fileCount files preserved in new folder" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart Storybook" -ForegroundColor White
    Write-Host "  2. Hard-refresh browser (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "  3. Verify 'WIS2L Framework' appears in sidebar" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Could not rename folder" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "MANUAL INSTRUCTIONS:" -ForegroundColor Yellow
    Write-Host "  1. Close Storybook server completely" -ForegroundColor White
    Write-Host "  2. Close all IDE/editor windows" -ForegroundColor White
    Write-Host "  3. In Windows File Explorer, navigate to:" -ForegroundColor White
    Write-Host "     E:\Projects\LUMINES\src\stories\" -ForegroundColor Cyan
    Write-Host "  4. Right-click 'WISSIL Framework' folder" -ForegroundColor White
    Write-Host "  5. Select 'Rename'" -ForegroundColor White
    Write-Host "  6. Change to: WIS2L Framework" -ForegroundColor White
    Write-Host "  7. Press Enter" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green

