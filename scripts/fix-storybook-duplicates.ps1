# Fix Storybook Duplicate Files
# Removes duplicate story files and updates Storybook config

$ErrorActionPreference = 'Continue'

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Storybook Duplicate Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Remove duplicate stories from design-system/primitives (canonical versions exist in stories/Components)
Write-Host "Removing duplicate story files from design-system/primitives..." -ForegroundColor Yellow

$duplicateStories = @(
    "src/design-system/primitives/Button.stories.tsx",
    "src/design-system/primitives/Card.stories.tsx",
    "src/design-system/primitives/Panel.stories.tsx",
    "src/design-system/primitives/SplitView.stories.tsx"
)

foreach ($file in $duplicateStories) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    } else {
        Write-Host "  - Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Removing duplicate MDX files from src/app (canonical versions exist in stories/...)..." -ForegroundColor Yellow

# Note: We'll keep MDX files in src/app for Next.js but exclude them from Storybook config
# The Storybook config has been updated to exclude src/app/**/*.mdx

Write-Host ""
Write-Host "Removing old Themes directories..." -ForegroundColor Yellow

$oldDirs = @(
    "src/stories/Themes/DarkMode",
    "src/stories/Themes/LightMode"
)

foreach ($dir in $oldDirs) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "  ✓ Removed: $dir" -ForegroundColor Green
    }
}

# Remove empty Themes directory if it exists
if (Test-Path "src/stories/Themes") {
    $items = Get-ChildItem "src/stories/Themes" -ErrorAction SilentlyContinue
    if (-not $items -or $items.Count -eq 0) {
        Remove-Item -Path "src/stories/Themes" -Force
        Write-Host "  ✓ Removed empty directory: src/stories/Themes" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Duplicate file cleanup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Storybook config has been updated to exclude duplicates" -ForegroundColor White
Write-Host "2. Run 'npm run build-storybook' to verify build" -ForegroundColor White
Write-Host ""

