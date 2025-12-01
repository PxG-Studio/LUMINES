# 🚀 QA Services Quick Start Guide

**WISSIL / LUMINES — Start Storybook, Chromatic, Percy, and Playwright**

---

## ⚡ Quick Start

### Option 1: Run All Services (Automated)

```powershell
# Run the startup script
.\scripts\start-qa-services.ps1
```

### Option 2: Run Individually (Manual)

---

## 📚 1. Storybook (Dev Server)

**Purpose**: Component documentation and development

```powershell
# Start Storybook dev server
npm run storybook
```

**Access**: http://localhost:6006

**Status**: Runs continuously (press Ctrl+C to stop)

---

## 🎨 2. Chromatic (Visual Regression)

**Purpose**: Primary visual regression testing

```powershell
# Set token (if not already set)
$env:CHROMATIC_PROJECT_TOKEN="your_token_here"

# Run Chromatic
npm run chromatic
```

**Note**: Requires `CHROMATIC_PROJECT_TOKEN` environment variable or GitHub Secret

**Output**: Results uploaded to Chromatic dashboard

---

## 📸 3. Percy (Visual Regression)

**Purpose**: Cross-browser visual regression testing

```powershell
# Set token (if not already set)
$env:PERCY_TOKEN="web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7"

# Build Storybook first
npm run build-storybook

# Run Percy
npm run percy:storybook
```

**Note**: Requires `PERCY_TOKEN` environment variable

**Output**: Results uploaded to Percy dashboard

---

## 🧪 4. Playwright (E2E Tests)

**Purpose**: End-to-end testing

```powershell
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/ignis/nodeEditor.spec.ts
```

**Output**: Test results, videos, traces, screenshots

---

## 🔄 Complete Workflow

### Step-by-Step:

1. **Start Storybook** (for development):
   ```powershell
   npm run storybook
   ```
   - Opens at http://localhost:6006
   - Keep this running

2. **Build Storybook** (for visual regression):
   ```powershell
   npm run build-storybook
   ```

3. **Run Chromatic**:
   ```powershell
   npm run chromatic
   ```

4. **Run Percy**:
   ```powershell
   $env:PERCY_TOKEN="web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7"
   npm run percy:storybook
   ```

5. **Run Playwright**:
   ```powershell
   npm run test:e2e
   ```

---

## 📊 Service Status Check

### Check if Storybook is Running:

```powershell
# Check port 6006
netstat -ano | Select-String ":6006"

# Or open browser
Start-Process "http://localhost:6006"
```

### Check Environment Variables:

```powershell
# Check PERCY_TOKEN
if ($env:PERCY_TOKEN) { Write-Host "✅ PERCY_TOKEN is set" } else { Write-Host "❌ PERCY_TOKEN not set" }

# Check CHROMATIC_PROJECT_TOKEN
if ($env:CHROMATIC_PROJECT_TOKEN) { Write-Host "✅ CHROMATIC_PROJECT_TOKEN is set" } else { Write-Host "❌ CHROMATIC_PROJECT_TOKEN not set" }
```

---

## 🛠️ Troubleshooting

### Storybook Won't Start

```powershell
# Clear cache and restart
Remove-Item -Recurse -Force node_modules/.cache
npm run storybook
```

### Chromatic/Percy Fail

- **Check tokens are set**: `echo $env:PERCY_TOKEN`
- **Verify Storybook built**: `Test-Path storybook-static`
- **Check network connection**: Both services need internet

### Playwright Tests Fail

```powershell
# Install browsers
npx playwright install --with-deps

# Run with debug output
npx playwright test --debug
```

---

## 📝 Environment Variables

### For Local Development:

Create a `.env` file (already in `.gitignore`):

```env
PERCY_TOKEN=web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7
CHROMATIC_PROJECT_TOKEN=your_chromatic_token_here
```

### For PowerShell Session:

```powershell
$env:PERCY_TOKEN="web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7"
$env:CHROMATIC_PROJECT_TOKEN="your_chromatic_token_here"
```

---

## 🎯 Recommended Workflow

1. **Development**: Keep Storybook running (`npm run storybook`)
2. **Before Committing**: Run Chromatic + Percy
3. **Before Merging**: Run Playwright E2E tests
4. **CI/CD**: All services run automatically on PRs

---

## 📚 Related Documentation

- [Percy Setup Guide](./PERCY_SETUP.md)
- [Chromatic Complete Guide](./CHROMATIC_COMPLETE.md)
- [GitHub Secrets Setup](./GITHUB_SECRETS_SETUP.md)

---

*Last updated: December 2024*

