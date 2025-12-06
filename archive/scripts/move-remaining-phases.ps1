# Move remaining Phase files to archive
$root = "e:\Projects\LUMINES"
$archiveDir = Join-Path $root "archive\phases"

# Ensure archive directory exists
if (-not (Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
}

# Get all Phase files in root (excluding archive and docs)
$phaseFiles = Get-ChildItem -Path $root -Filter "PHASE_*.md" | 
    Where-Object { 
        $_.DirectoryName -eq $root -and
        $_.FullName -notlike "*\archive\*" -and
        $_.FullName -notlike "*\docs\*"
    }

Write-Output "Found $($phaseFiles.Count) Phase files to move"

$moved = 0
foreach ($file in $phaseFiles) {
    $source = $file.FullName
    $dest = Join-Path $archiveDir $file.Name
    
    try {
        # Read content and write to archive
        $content = Get-Content -Path $source -Raw -Encoding UTF8
        Set-Content -Path $dest -Value $content -Encoding UTF8 -Force
        
        # Delete original
        Remove-Item -Path $source -Force
        
        $moved++
        Write-Output "✓ Moved: $($file.Name)"
    }
    catch {
        Write-Output "✗ Failed: $($file.Name) - $_"
    }
}

Write-Output "`nCompleted: Moved $moved files to archive"

