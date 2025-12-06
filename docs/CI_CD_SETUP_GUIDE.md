# 🚀 CI/CD Pipeline Setup Guide

**Complete setup instructions for WISSIL GitHub Actions CI/CD**

---

## 📋 Prerequisites

1. **GitHub Repository** with Actions enabled
2. **Node.js** 18+ installed locally
3. **Required secrets** configured in GitHub

---

## 🔐 Required GitHub Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

### Required
- `CHROMATIC_PROJECT_TOKEN` — Get from [chromatic.com](https://www.chromatic.com)

### Optional (for deployments)
- `VERCEL_TOKEN` — Vercel deployment token
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` — Vercel project ID
- `SSH_KEY` — SSH private key for custom deployments
- `DEPLOY_HOST` — Deployment server hostname
- `DEPLOY_USER` — Deployment server username
- `DEPLOY_PATH` — Deployment server path

---

## 🎯 Quick Start

### 1. Verify Scripts in package.json

Ensure these scripts exist:
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "format": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test:unit": "vitest --run",
    "test:e2e": "playwright test",
    "build": "next build",
    "build-storybook": "storybook build"
  }
}
```

### 2. Test Workflows Locally

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run unit tests
npm run test:unit

# Run E2E tests (requires Storybook running)
npm run storybook &  # In one terminal
npm run test:e2e     # In another terminal
```

### 3. Create Test PR

```bash
git checkout -b test/ci-pipeline
git commit --allow-empty -m "Test CI/CD pipeline"
git push origin test/ci-pipeline
```

Then create a PR and watch the workflows run!

---

## 📊 Workflow Breakdown

### CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, `feature/**`
- Pull requests to `main`, `develop`

**Jobs:**
1. **Lint** — ESLint + Prettier
2. **Typecheck** — TypeScript validation
3. **Unit Tests** — Vitest (Node 18, 20, 22)
4. **Build** — Production build
5. **Integration Tests** — Integration test suite

**Duration:** ~10-15 minutes (parallel)

---

### Lint Workflow (`lint.yml`)

**Purpose:** Code quality checks

**Steps:**
- Run ESLint
- Check Prettier formatting
- Post PR comment with results

**Duration:** ~2-3 minutes

---

### Typecheck Workflow (`typecheck.yml`)

**Purpose:** Type safety validation

**Steps:**
- Run `tsc --noEmit`
- Annotate TypeScript errors

**Duration:** ~3-5 minutes

---

### Storybook Workflow (`storybook.yml`)

**Purpose:** Build and deploy Storybook

**Steps:**
- Build Storybook
- Deploy preview for PRs
- Deploy to GitHub Pages on `main`

**Output:**
- PR preview URL: `https://[org].github.io/[repo]/preview/pr-[number]/`
- Production URL: `https://[org].github.io/[repo]/`

**Duration:** ~5-8 minutes

---

### E2E Workflow (`e2e.yml`)

**Purpose:** End-to-end testing with Playwright

**Steps:**
- Install Playwright browsers
- Build Storybook
- Run all E2E tests
- Upload artifacts (reports, traces, videos, screenshots)

**Artifacts:**
- HTML reports (30 days)
- Test traces (30 days)
- Videos (30 days)
- Screenshots (30 days)

**Duration:** ~15-20 minutes

---

### Release Workflow (`release.yml`)

**Triggers:** Tag push matching `v*.*.*` (e.g., `v1.0.0`)

**Steps:**
- Extract version from tag
- Build application
- Build Storybook
- Run tests
- Create GitHub release
- Upload artifacts
- Optional: Publish to npm

**Duration:** ~10-12 minutes

---

### Deploy Workflow (`deploy.yml`)

**Triggers:** Push to `main`

**Steps:**
- Build production bundle
- Deploy to Vercel (or GitHub Pages)
- Optional: Deploy via SSH/RSYNC

**Environments:**
- Production (automatic on `main`)
- Staging (manual workflow dispatch)

**Duration:** ~8-10 minutes

---

### Chromatic Workflow (`chromatic.yml`)

**Purpose:** Visual regression testing

**Steps:**
- Build Storybook
- Run Chromatic visual tests
- Auto-accept on `main` branch
- Post PR comment with results

**Duration:** ~5-10 minutes

---

## 🔧 Configuration

### Enable GitHub Pages

1. Go to **Settings → Pages**
2. Source: **GitHub Actions**
3. Branch: **gh-pages** (auto-created)

### Branch Protection Rules

**Recommended for `main` branch:**
- Require status checks:
  - ✅ CI Status
  - ✅ Lint
  - ✅ Typecheck
  - ✅ Unit Tests
  - ✅ E2E Tests (optional)
  - ✅ Chromatic (optional)
- Require pull request reviews
- Require up-to-date branches

---

## 📈 Monitoring

### View Workflow Runs

1. Go to **Actions** tab in GitHub
2. Click on workflow name
3. View logs, artifacts, and test results

### View Artifacts

1. Open workflow run
2. Scroll to **Artifacts** section
3. Download:
   - Build artifacts
   - Test reports
   - Screenshots/videos
   - Storybook builds

---

## 🐛 Troubleshooting

### Workflow Fails on First Run

**Solution:** Check that all required secrets are configured.

### Storybook Build Fails

**Solution:** Ensure Storybook config is correct:
```bash
npm run build-storybook
```

### E2E Tests Timeout

**Solution:** Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60 * 1000, // 60 seconds
```

### Chromatic Fails

**Solution:** Verify `CHROMATIC_PROJECT_TOKEN` is set correctly.

---

## ✅ Success Criteria

Your CI/CD pipeline is working when:

- ✅ All workflows run automatically on PR
- ✅ PR comments appear with preview links
- ✅ Tests pass/fail correctly
- ✅ Storybook deploys to GitHub Pages
- ✅ Production deploys on merge to `main`
- ✅ Releases created from tags

---

**Status: Ready for Production** ✅

*Last Updated: December 2024*

