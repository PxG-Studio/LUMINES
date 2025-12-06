# Storybook Startup Script with Editor Configuration
# Sets STORYBOOK_EDITOR environment variable for "Open in Editor" feature

# Set editor (cursor, code, webstorm, etc.)
Set-Item -Path Env:STORYBOOK_EDITOR -Value "cursor"

# Run storybook sync first
Write-Host "Syncing WIS2L stories..." -ForegroundColor Cyan
npm run storybook:sync-wis2l

# Start Storybook
Write-Host "Starting Storybook..." -ForegroundColor Cyan
Write-Host "Editor configured: $env:STORYBOOK_EDITOR" -ForegroundColor Green
npx storybook dev -p 6006

