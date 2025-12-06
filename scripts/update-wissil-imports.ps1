# Update all WISSIL imports to use lowercase folder names

$replacements = @{
    '@/wissil/Ignis/' = '@/wissil/ignis/'
    '@/wissil/Ignition/' = '@/wissil/ignition/'
    '@/wissil/Landing/' = '@/wissil/landing/'
    '@/wissil/Slate/' = '@/wissil/slate/'
    '@/wissil/Spark/' = '@/wissil/spark/'
    '@/wissil/Waypoint/' = '@/wissil/waypoint/'
    '@/wissil/Unity/' = '@/wissil/unity/'
    '@/wissil/UnityBrowser/' = '@/wissil/unity-browser/'
    '@/wissil/UnityIO/' = '@/wissil/unity-io/'
    '@/wissil/ProjectIO/' = '@/wissil/project-io/'
    '@/wissil/IgnisWebGL/' = '@/wissil/ignis-webgl/'
    '@/wissil/SparkUnity/' = '@/wissil/spark-unity/'
    '../wissil/UnityBrowser/' = '../wissil/unity-browser/'
    '../wissil/UnityIO/' = '../wissil/unity-io/'
    '../wissil/ProjectIO/' = '../wissil/project-io/'
    '../wissil/Slate/' = '../wissil/slate/'
    '../wissil/Spark/' = '../wissil/spark/'
    '../wissil/Ignis/' = '../wissil/ignis/'
    '../wissil/Ignition/' = '../wissil/ignition/'
    '../wissil/Landing/' = '../wissil/landing/'
    '../wissil/Waypoint/' = '../wissil/waypoint/'
    '../wissil/Unity/' = '../wissil/unity/'
    '../wissil/IgnisWebGL/' = '../wissil/ignis-webgl/'
    '../wissil/SparkUnity/' = '../wissil/spark-unity/'
}

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts,*.tsx,*.js,*.jsx | Where-Object { $_.FullName -notmatch 'node_modules' }

$updatedCount = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updatedCount++
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nUpdated $updatedCount files"

