# Clear Storybook and Vite Caches
# Run this script to fix HMR issues

Write-Host "Clearing Storybook and Vite caches..." -ForegroundColor Yellow

# Clear Storybook cache
if (Test-Path "node_modules\.cache\storybook") {
    Remove-Item -Recurse -Force "node_modules\.cache\storybook"
    Write-Host "✓ Cleared Storybook cache" -ForegroundColor Green
} else {
    Write-Host "⚠ Storybook cache not found" -ForegroundColor Yellow
}

# Clear Vite cache
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Cleared Vite cache" -ForegroundColor Green
} else {
    Write-Host "⚠ Vite cache not found" -ForegroundColor Yellow
}

# Clear Storybook static build
if (Test-Path "storybook-static") {
    Remove-Item -Recurse -Force "storybook-static"
    Write-Host "✓ Cleared Storybook static build" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cache cleared! Please restart Storybook with: npm run storybook" -ForegroundColor Cyan

