# WISSIL QA Services Startup Script
# Starts Storybook, Chromatic, Percy, and Playwright

Write-Host "🚀 Starting WISSIL QA Services" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Set PERCY_TOKEN if not already set
if (-not $env:PERCY_TOKEN) {
    $env:PERCY_TOKEN = "web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7"
    Write-Host "✅ PERCY_TOKEN set" -ForegroundColor Green
}

# 1. Start Storybook (background)
Write-Host "1️⃣  Starting Storybook dev server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run storybook" -WindowStyle Minimized
Start-Sleep -Seconds 3
Write-Host "   ✅ Storybook starting on http://localhost:6006" -ForegroundColor Green
Write-Host ""

# 2. Build Storybook for Chromatic/Percy
Write-Host "2️⃣  Building Storybook for visual regression..." -ForegroundColor Yellow
npm run build-storybook
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Storybook built successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Storybook build failed" -ForegroundColor Red
}
Write-Host ""

# 3. Run Chromatic
Write-Host "3️⃣  Running Chromatic visual regression..." -ForegroundColor Magenta
npm run chromatic
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Chromatic completed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Chromatic completed with warnings" -ForegroundColor Yellow
}
Write-Host ""

# 4. Run Percy
Write-Host "4️⃣  Running Percy visual regression..." -ForegroundColor Blue
npm run percy:storybook
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Percy completed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Percy completed with warnings" -ForegroundColor Yellow
}
Write-Host ""

# 5. Run Playwright
Write-Host "5️⃣  Running Playwright E2E tests..." -ForegroundColor Green
npm run test:e2e
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Playwright tests passed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Some Playwright tests failed" -ForegroundColor Red
}
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ QA Services Summary:" -ForegroundColor Green
Write-Host ""
Write-Host "   📚 Storybook: http://localhost:6006" -ForegroundColor Cyan
Write-Host "   🎨 Chromatic: Check dashboard for results" -ForegroundColor Magenta
Write-Host "   📸 Percy: Check dashboard for results" -ForegroundColor Blue
Write-Host "   🧪 Playwright: Check test results above" -ForegroundColor Green
Write-Host ""

