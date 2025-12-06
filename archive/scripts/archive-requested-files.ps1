# Archive the requested files systematically

$rootDir = Get-Location

# Ensure archive directories exist
$archiveDirs = @('archive/docs', 'archive/status', 'archive/chromatic')
foreach ($dir in $archiveDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

Write-Host "`n=== Archiving Requested Files ===" -ForegroundColor Cyan

# Status files to archive/status/
$statusFiles = @(
    'ARCHIVE_COMPLETE.md',
    'ARCHIVE_EXECUTION_STATUS.md',
    'ARCHIVE_INSTRUCTIONS.md',
    'ARCHIVE_PROGRESS.md',
    'AUTOMATED_QA_SUITE_COMPLETE.md',
    'CLEANUP_SUMMARY.md',
    'COMPREHENSIVE_UPDATE_SUMMARY.md',
    'IGNIS_BLUEPRINT_STATUS.md',
    'IGNIS_EXPANSION_COMPLETE.md',
    'MOVE_FILES_NOW.md'
)

# Chromatic files to archive/chromatic/
$chromaticFiles = @(
    'CHROMATIC_DELIVERY_COMPLETE.md',
    'CHROMATIC_INTEGRATION_COMPLETE.md',
    'CHROMATIC_SETUP.md',
    'CURSOR_CHROMATIC_SETUP_PROMPT.md'
)

# Move status files
$movedStatus = 0
Write-Host "`nMoving status files..." -ForegroundColor Yellow
foreach ($file in $statusFiles) {
    $source = Join-Path $rootDir $file
    $dest = Join-Path $rootDir "archive\status\$file"
    
    if (Test-Path $source) {
        try {
            $content = Get-Content $source -Raw
            Set-Content -Path $dest -Value $content -Force -NoNewline
            Remove-Item -Path $source -Force
            Write-Host "  ✓ $file" -ForegroundColor Green
            $movedStatus++
        } catch {
            Write-Host "  ✗ Error moving $file`: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  - Skipped: $file (not found)" -ForegroundColor Gray
    }
}

# Move Chromatic files
$movedChromatic = 0
Write-Host "`nMoving Chromatic files..." -ForegroundColor Yellow
foreach ($file in $chromaticFiles) {
    $source = Join-Path $rootDir $file
    $dest = Join-Path $rootDir "archive\chromatic\$file"
    
    if (Test-Path $source) {
        try {
            $content = Get-Content $source -Raw
            Set-Content -Path $dest -Value $content -Force -NoNewline
            Remove-Item -Path $source -Force
            Write-Host "  ✓ $file" -ForegroundColor Green
            $movedChromatic++
        } catch {
            Write-Host "  ✗ Error moving $file`: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  - Skipped: $file (not found)" -ForegroundColor Gray
    }
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Status files moved: $movedStatus" -ForegroundColor Green
Write-Host "Chromatic files moved: $movedChromatic" -ForegroundColor Green
Write-Host "Total files moved: $($movedStatus + $movedChromatic)" -ForegroundColor Yellow

