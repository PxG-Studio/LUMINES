# Move all remaining Phase files to archive/phases/

$archiveDir = "archive/phases"
$rootDir = Get-Location

# Ensure archive directory exists
if (-not (Test-Path $archiveDir)) {
    New-Item -Path $archiveDir -ItemType Directory -Force | Out-Null
    Write-Host "Created archive directory: $archiveDir"
}

# All Phase files that should be moved (N through Z and AE)
$phaseFiles = @(
    "PHASE_N_STATUS.md",
    "PHASE_O_STATUS.md",
    "PHASE_P_STATUS.md",
    "PHASE_Q_STATUS.md",
    "PHASE_R_STATUS.md",
    "PHASE_U_STATUS.md",
    "PHASE_V_STATUS.md",
    "PHASE_W_STATUS.md",
    "PHASE_X_STATUS.md",
    "PHASE_Y_STATUS.md",
    "PHASE_Z_STATUS.md",
    "PHASE_AE_EXPANSION_STATUS.md"
)

$movedCount = 0
$skippedCount = 0
$errorCount = 0

Write-Host "`n=== Moving Phase Files to Archive ===" -ForegroundColor Cyan
Write-Host "Target: $archiveDir`n" -ForegroundColor Gray

foreach ($file in $phaseFiles) {
    $sourcePath = Join-Path $rootDir $file
    $destinationPath = Join-Path $rootDir "$archiveDir\$file"

    if (Test-Path $sourcePath) {
        try {
            # Read content
            $content = Get-Content $sourcePath -Raw
            
            # Write to archive
            Set-Content -Path $destinationPath -Value $content -Force -NoNewline
            
            # Delete original
            Remove-Item -Path $sourcePath -Force
            
            Write-Host "✓ Moved: $file" -ForegroundColor Green
            $movedCount++
        } catch {
            Write-Host "✗ Error moving $file`: $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "- Skipped: $file (not found)" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Moved: $movedCount" -ForegroundColor Green
Write-Host "Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "Errors: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })

