# Archive Organization Script
# Moves historical documentation files to archive directory

Write-Host "Starting archive organization..." -ForegroundColor Cyan

# Create archive directories
$archiveDirs = @(
    "archive/phases",
    "archive/status", 
    "archive/docs",
    "archive/setup",
    "archive/chromatic"
)

foreach ($dir in $archiveDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Green
    }
}

# Move Phase files
Write-Host "`nMoving Phase files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Filter "PHASE_*.md" | ForEach-Object {
    Move-Item -Path $_.FullName -Destination "archive/phases/" -Force
    Write-Host "  Moved: $($_.Name)" -ForegroundColor Gray
}

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

foreach ($file in $statusFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "archive/status/" -Force
        Write-Host "  Moved: $file" -ForegroundColor Gray
    }
}

# Move Chromatic files
Write-Host "`nMoving Chromatic files..." -ForegroundColor Yellow
$chromaticFiles = @(
    "CHROMATIC_SETUP.md",
    "CURSOR_CHROMATIC_SETUP_PROMPT.md"
)

foreach ($file in $chromaticFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "archive/chromatic/" -Force
        Write-Host "  Moved: $file" -ForegroundColor Gray
    }
}

# Move Setup files
Write-Host "`nMoving Setup files..." -ForegroundColor Yellow
if (Test-Path "SETUP_STORYBOOK.md") {
    Move-Item -Path "SETUP_STORYBOOK.md" -Destination "archive/setup/" -Force
    Write-Host "  Moved: SETUP_STORYBOOK.md" -ForegroundColor Gray
}

# Move superseded docs
Write-Host "`nMoving superseded documentation..." -ForegroundColor Yellow
$supersededDocs = @(
    "ARCHITECTURE.md",
    "WISSIL_ARCHITECTURE_SCAFFOLD.md"
)

foreach ($file in $supersededDocs) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "archive/docs/" -Force
        Write-Host "  Moved: $file" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Archive organization complete!" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  - Phases: $(Get-ChildItem archive/phases -Filter *.md | Measure-Object).Count files"
Write-Host "  - Status: $(Get-ChildItem archive/status -Filter *.md | Measure-Object).Count files"
Write-Host "  - Chromatic: $(Get-ChildItem archive/chromatic -Filter *.md | Measure-Object).Count files"
Write-Host "  - Setup: $(Get-ChildItem archive/setup -Filter *.md | Measure-Object).Count files"
Write-Host "  - Docs: $(Get-ChildItem archive/docs -Filter *.md | Measure-Object).Count files"

