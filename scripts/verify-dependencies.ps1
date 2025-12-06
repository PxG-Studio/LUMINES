# Verify all required dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Cyan

$deps = @(
    "@monaco-editor/react",
    "monaco-editor",
    "simple-git",
    "@mdx-js/mdx",
    "remark-gfm",
    "rehype-highlight",
    "fuse.js",
    "@webcontainer/api",
    "zustand",
    "esbuild-wasm"
)

$missing = @()
foreach ($dep in $deps) {
    $path = "node_modules/$dep"
    if (Test-Path $path) {
        Write-Host "✓ $dep" -ForegroundColor Green
    } else {
        Write-Host "✗ $dep MISSING" -ForegroundColor Red
        $missing += $dep
    }
}

if ($missing.Count -gt 0) {
    Write-Host "`nMissing packages. Run: npm install" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`nAll dependencies installed!" -ForegroundColor Green
    exit 0
}

