# Move all remaining Phase files to archive/phases/

$archiveDir = "archive/phases"
$rootDir = Get-Location

# Ensure archive directory exists
if (-not (Test-Path $archiveDir)) {
    New-Item -Path $archiveDir -ItemType Directory -Force | Out-Null
}

# List of Phase files to move (H through Z and AE)
$phaseFiles = @(
    "PHASE_H_STATUS.md",
    "PHASE_I_STATUS.md",
    "PHASE_J_STATUS.md",
    "PHASE_K_STATUS.md",
    "PHASE_M_STATUS.md",
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

Write-Host "Starting to move remaining Phase files to $archiveDir..." -ForegroundColor Cyan

foreach ($file in $phaseFiles) {
    $sourcePath = Join-Path $rootDir $file
    $destinationPath = Join-Path $rootDir "$archiveDir\$file"

    if (Test-Path $sourcePath) {
        try {
            Copy-Item -Path $sourcePath -Destination $destinationPath -Force
            Remove-Item -Path $sourcePath -Force
            Write-Host "✓ Moved '$file'" -ForegroundColor Green
            $movedCount++
        } catch {
            Write-Host "✗ Failed to move '$file': $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "- Skipped '$file' (not found)" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host ""
Write-Host "Finished! Moved: $movedCount, Skipped: $skippedCount" -ForegroundColor Cyan

