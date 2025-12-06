# 🎨 Percy Visual Regression Testing — Complete Guide

**WISSIL / LUMINES — Percy Setup & Configuration**

*Last updated: December 2024*

---

## 📘 Overview

Percy provides **cross-browser visual regression testing** for WISSIL, complementing Chromatic with:

- ✅ **Cross-browser snapshots** (Chromium, Firefox, WebKit)
- ✅ **Responsive viewport testing** (Mobile, Tablet, Desktop, Wide)
- ✅ **Animation freezing** for consistent snapshots
- ✅ **Parallel execution** with Chromatic for comprehensive coverage

Percy works alongside Chromatic in WISSIL's dual visual regression strategy.

---

## 🚀 Quick Start

### Installation

Percy is already installed in the project:

```bash
# Dependencies are in package.json
npm install

# Verify installation
npx percy --version
```

### Configuration

Percy is configured via `percy.config.js` in the project root:

```javascript
module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 768, 1280, 1920], // Responsive viewports
    percyCSS: `/* Animation freezing CSS */`,
  },
};
```

### Running Percy Locally

```bash
# Build Storybook and run Percy snapshots
npm run percy:storybook

# Requires PERCY_TOKEN environment variable
export PERCY_TOKEN=your_token_here
npm run percy:storybook
```

---

## 📋 Setup Instructions

### 1. Get Percy Token

1. Sign up at [percy.io](https://percy.io)
2. Create a new project for WISSIL
3. Copy your project token
4. Add to GitHub Secrets as `PERCY_TOKEN`

### 2. Configure GitHub Secrets

Add to your repository secrets:

```
PERCY_TOKEN=your_percy_project_token
```

### 3. Verify Configuration

Check `percy.config.js` exists and is properly configured:

```bash
cat percy.config.js
```

### 4. Test Locally

```bash
# Set token
export PERCY_TOKEN=your_token_here

# Run Percy
npm run percy:storybook
```

---

## 🔧 Configuration Details

### Percy Config (`percy.config.js`)

```javascript
module.exports = {
  version: 2,
  
  discovery: {
    allowedHostnames: ['localhost', '127.0.0.1'],
    networkIdleTimeout: 750,
    disableCache: true,
  },
  
  snapshot: {
    widths: [375, 768, 1280, 1920], // Mobile, Tablet, Desktop, Wide
    minHeight: 1024,
    percyCSS: `
      /* Freeze animations */
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `,
    enableJavaScript: true,
    waitForTimeout: 1000,
  },
};
```

### Storybook Script (`scripts/percy-storybook.js`)

The script:
1. Builds Storybook static files
2. Injects Percy CSS for animation freezing
3. Runs Percy snapshots across all viewports
4. Uploads results to Percy dashboard

---

## 🎯 Usage

### CI/CD Integration

Percy runs automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

Workflow: `.github/workflows/percy.yml`

### Manual Execution

```bash
# Local development
npm run percy:storybook

# CI environment (uses PERCY_TOKEN from secrets)
npm run percy:storybook
```

### Viewing Results

1. **Percy Dashboard**: https://percy.io
2. **PR Comments**: Automatic comments on pull requests
3. **GitHub Actions**: Check workflow logs

---

## 🔄 Approval Workflow

### When Percy Detects Changes

1. **Review the Diff**
   - Click Percy link in PR comment
   - View before/after screenshots
   - Check all viewports (Mobile, Tablet, Desktop, Wide)

2. **Approve or Reject**
   - **Approve**: Changes are intentional and correct
   - **Reject**: Changes are regressions, fix and re-run

3. **Auto-Approval**
   - Percy can auto-approve on `main` branch (configured in workflow)
   - Manual approval required for PRs

### Approval Rules

- ✅ **Approve**: Intentional design changes, new features, bug fixes
- ❌ **Reject**: Unintended layout shifts, broken components, visual bugs

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Missing PERCY_TOKEN

**Error**: `PERCY_TOKEN environment variable is not set`

**Solution**:
```bash
export PERCY_TOKEN=your_token_here
# Or add to .env file
```

#### 2. Storybook Build Fails

**Error**: `Storybook build output not found`

**Solution**:
```bash
# Build Storybook first
npm run build-storybook

# Then run Percy
npm run percy:storybook
```

#### 3. Snapshots Not Uploading

**Error**: `Failed to upload snapshots`

**Solution**:
- Check PERCY_TOKEN is valid
- Verify network connection
- Check Percy project settings

#### 4. Animation Issues

**Problem**: Snapshots show animations mid-transition

**Solution**:
- Verify `percyCSS` in `percy.config.js` is injected
- Check `scripts/percy-storybook.js` CSS injection step
- Increase `waitForTimeout` if needed

---

## 📊 Percy vs Chromatic

### When to Use Each

| Feature | Chromatic | Percy |
|---------|-----------|-------|
| **Primary Use** | Primary visual regression | Cross-browser testing |
| **Storybook Integration** | Tight integration | Good integration |
| **TurboSnap** | ✅ Yes | ❌ No |
| **Cross-Browser** | Limited | ✅ Full support |
| **Responsive Testing** | ✅ Yes | ✅ Yes |
| **CI Speed** | Fast (TurboSnap) | Moderate |

### Dual Strategy Benefits

- **Chromatic**: Fast, Storybook-native, TurboSnap optimization
- **Percy**: Cross-browser coverage, additional validation
- **Together**: Comprehensive visual regression coverage

---

## 🔗 Related Documentation

- [Chromatic Complete Guide](./CHROMATIC_COMPLETE.md)
- [Storybook Complete Guide](./STORYBOOK_COMPLETE.md)
- [QA Pipeline Documentation](../.github/workflows/qa-unified.yml)

---

## 📝 Best Practices

1. **Review All Viewports**: Check mobile, tablet, desktop, wide
2. **Approve Intentionally**: Never auto-approve without review
3. **Fix Regressions**: Reject and fix unintended changes
4. **Update Baselines**: Approve intentional design updates
5. **Monitor CI**: Check Percy status in PR comments

---

## 🎯 Success Criteria

✅ Percy installed and configured  
✅ Percy workflow runs on PRs  
✅ Snapshots generated for all stories  
✅ PR comments show Percy results  
✅ Cross-browser coverage working  
✅ Responsive viewports tested  

---

## 📞 Support

- **Percy Docs**: https://docs.percy.io
- **Percy Dashboard**: https://percy.io
- **GitHub Issues**: Report issues in repository

---

*Last updated: December 2024*

