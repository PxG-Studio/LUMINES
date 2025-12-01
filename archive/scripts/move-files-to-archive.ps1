# Move Files to Archive - Explicit Script
$ErrorActionPreference = "Continue"

Write-Host "Starting file archive process..." -ForegroundColor Cyan
$rootPath = Get-Location
$archiveBase = Join-Path $rootPath "archive"

# Ensure archive directories exist
$dirs = @("phases", "status", "docs", "setup", "chromatic")
foreach ($dir in $dirs) {
    $fullPath = Join-Path $archiveBase $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created: $fullPath" -ForegroundColor Green
    }
}

# Move Phase files
Write-Host "`nMoving Phase files..." -ForegroundColor Yellow
$phaseFiles = Get-ChildItem -Path $rootPath -Filter "PHASE_*.md" -File
$phaseCount = 0
foreach ($file in $phaseFiles) {
    $dest = Join-Path (Join-Path $archiveBase "phases") $file.Name
    try {
        Move-Item -Path $file.FullName -Destination $dest -Force
        $phaseCount++
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Gray
    } catch {
        Write-Host "  ✗ Failed: $($file.Name) - $_" -ForegroundColor Red
    }
}
Write-Host "Moved $phaseCount Phase files" -ForegroundColor Green

# Move Status files
Write-Host "`nMoving Status files..." -ForegroundColor Yellow
$statusFiles = @(
    "AUTOMATED_QA_SUITE_COMPLETE.md",
    "CHROMATIC_DELIVERY_COMPLETE.md",
    "CHROMATIC_INTEGRATION_COMPLETE.md",
    "COMPREHENSIVE_UPDATE_SUMMARY.md",
    "IGNIS_BLUEPRINT_STATUS.md",
    "IGNIS_EXPANSION_COMPLETE.md",
    "STORYBOOK_STATUS.md"
)
$statusCount = 0
$statusDest = Join-Path $archiveBase "status"
foreach ($file in $statusFiles) {
    $filePath = Join-Path $rootPath $file
    if (Test-Path $filePath) {
        try {
            Move-Item -Path $filePath -Destination $statusDest -Force
            $statusCount++
            Write-Host "  ✓ $file" -ForegroundColor Gray
        } catch {
            Write-Host "  ✗ Failed: $file - $_" -ForegroundColor Red
        }
    }
}
Write-Host "Moved $statusCount Status files" -ForegroundColor Green

# Move Chromatic files
Write-Host "`nMoving Chromatic files..." -ForegroundColor Yellow
$chromaticFiles = @("CHROMATIC_SETUP.md", "CURSOR_CHROMATIC_SETUP_PROMPT.md")
$chromaticCount = 0
$chromaticDest = Join-Path $archiveBase "chromatic"
foreach ($file in $chromaticFiles) {
    $filePath = Join-Path $rootPath $file
    if (Test-Path $filePath) {
        try {
            Move-Item -Path $filePath -Destination $chromaticDest -Force
            $chromaticCount++
            Write-Host "  ✓ $file" -ForegroundColor Gray
        } catch {
            Write-Host "  ✗ Failed: $file - $_" -ForegroundColor Red
        }
    }
}
Write-Host "Moved $chromaticCount Chromatic files" -ForegroundColor Green

# Move Setup files
Write-Host "`nMoving Setup files..." -ForegroundColor Yellow
$setupFiles = @("SETUP_STORYBOOK.md")
$setupCount = 0
$setupDest = Join-Path $archiveBase "setup"
foreach ($file in $setupFiles) {
    $filePath = Join-Path $rootPath $file
    if (Test-Path $filePath) {
        try {
            Move-Item -Path $filePath -Destination $setupDest -Force
            $setupCount++
            Write-Host "  ✓ $file" -ForegroundColor Gray
        } catch {
            Write-Host "  ✗ Failed: $file - $_" -ForegroundColor Red
        }
    }
}
Write-Host "Moved $setupCount Setup files" -ForegroundColor Green

# Move superseded docs
Write-Host "`nMoving superseded documentation..." -ForegroundColor Yellow
$docFiles = @("ARCHITECTURE.md", "WISSIL_ARCHITECTURE_SCAFFOLD.md")
$docCount = 0
$docDest = Join-Path $archiveBase "docs"
foreach ($file in $docFiles) {
    $filePath = Join-Path $rootPath $file
    if (Test-Path $filePath) {
        try {
            Move-Item -Path $filePath -Destination $docDest -Force
            $docCount++
            Write-Host "  ✓ $file" -ForegroundColor Gray
        } catch {
            Write-Host "  ✗ Failed: $file - $_" -ForegroundColor Red
        }
    }
}
Write-Host "Moved $docCount Documentation files" -ForegroundColor Green

# Summary
Write-Host "`n✅ Archive Complete!" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Phases: $phaseCount files"
Write-Host "  Status: $statusCount files"
Write-Host "  Chromatic: $chromaticCount files"
Write-Host "  Setup: $setupCount files"
Write-Host "  Docs: $docCount files"
Write-Host "  Total: $($phaseCount + $statusCount + $chromaticCount + $setupCount + $docCount) files"

