# 🚀 Execute This to Move All Files

## Quick Command (Copy & Paste into PowerShell)

Run this entire block in PowerShell from the LUMINES directory:

```powershell
# Navigate to project root
cd e:\Projects\LUMINES

# Create archive directories
$dirs = @('phases', 'status', 'chromatic', 'setup', 'docs')
foreach ($dir in $dirs) {
    $path = "archive\$dir"
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created: $path" -ForegroundColor Green
    }
}

# Move Phase files
Write-Host "`nMoving Phase files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Filter "PHASE_*.md" -File | ForEach-Object {
    $dest = "archive\phases\$($_.Name)"
    Move-Item -Path $_.FullName -Destination $dest -Force
    Write-Host "  Moved: $($_.Name)" -ForegroundColor Gray
}

# Move Status files
Write-Host "`nMoving Status files..." -ForegroundColor Yellow
@('AUTOMATED_QA_SUITE_COMPLETE.md','CHROMATIC_DELIVERY_COMPLETE.md','CHROMATIC_INTEGRATION_COMPLETE.md','COMPREHENSIVE_UPDATE_SUMMARY.md','IGNIS_BLUEPRINT_STATUS.md','IGNIS_EXPANSION_COMPLETE.md','STORYBOOK_STATUS.md') | ForEach-Object {
    if (Test-Path $_) {
        Move-Item -Path $_ -Destination "archive\status\" -Force
        Write-Host "  Moved: $_" -ForegroundColor Gray
    }
}

# Move Chromatic files
Write-Host "`nMoving Chromatic files..." -ForegroundColor Yellow
@('CHROMATIC_SETUP.md','CURSOR_CHROMATIC_SETUP_PROMPT.md') | ForEach-Object {
    if (Test-Path $_) {
        Move-Item -Path $_ -Destination "archive\chromatic\" -Force
        Write-Host "  Moved: $_" -ForegroundColor Gray
    }
}

# Move Setup files
Write-Host "`nMoving Setup files..." -ForegroundColor Yellow
if (Test-Path "SETUP_STORYBOOK.md") {
    Move-Item -Path "SETUP_STORYBOOK.md" -Destination "archive\setup\" -Force
    Write-Host "  Moved: SETUP_STORYBOOK.md" -ForegroundColor Gray
}

# Move superseded docs
Write-Host "`nMoving superseded documentation..." -ForegroundColor Yellow
@('ARCHITECTURE.md','WISSIL_ARCHITECTURE_SCAFFOLD.md') | ForEach-Object {
    if (Test-Path $_) {
        Move-Item -Path $_ -Destination "archive\docs\" -Force
        Write-Host "  Moved: $_" -ForegroundColor Gray
    }
}

# Summary
Write-Host "`n✅ Complete! Summary:" -ForegroundColor Green
$phaseCount = (Get-ChildItem "archive\phases" -Filter "*.md" -ErrorAction SilentlyContinue | Measure-Object).Count
$statusCount = (Get-ChildItem "archive\status" -Filter "*.md" -ErrorAction SilentlyContinue | Measure-Object).Count
$chromaticCount = (Get-ChildItem "archive\chromatic" -Filter "*.md" -ErrorAction SilentlyContinue | Measure-Object).Count
$setupCount = (Get-ChildItem "archive\setup" -Filter "*.md" -ErrorAction SilentlyContinue | Measure-Object).Count
$docCount = (Get-ChildItem "archive\docs" -Filter "*.md" -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host "  Phases: $phaseCount files" -ForegroundColor Cyan
Write-Host "  Status: $statusCount files" -ForegroundColor Cyan
Write-Host "  Chromatic: $chromaticCount files" -ForegroundColor Cyan
Write-Host "  Setup: $setupCount files" -ForegroundColor Cyan
Write-Host "  Docs: $docCount files" -ForegroundColor Cyan
Write-Host "  Total: $($phaseCount + $statusCount + $chromaticCount + $setupCount + $docCount) files" -ForegroundColor Yellow
```

---

## Alternative: Use the Node.js Script

```bash
cd e:\Projects\LUMINES
node scripts/move-to-archive.js
```

---

**This will move all ~68 files to the archive and clean up your root directory!**

