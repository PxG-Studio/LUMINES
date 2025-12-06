# Storybook Startup Script
# Run this in PowerShell: .\start-storybook.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Storybook for LUMINES WISSIL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not installed. Installing now..." -ForegroundColor Yellow
    Write-Host "This may take 2-5 minutes..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Storybook..." -ForegroundColor Cyan
Write-Host "Storybook will be available at: http://localhost:6006" -ForegroundColor Cyan
Write-Host ""

# Start Storybook
npm run storybook

