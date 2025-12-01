# 🛡️ Storybook Branch Protection Configuration

**GitHub Branch Protection Rules for WISSIL**

*Last updated: December 2024*

---

## 📋 Branch Protection Settings

### `main` Branch (Production)

**Required Status Checks:**
- ✅ `Chromatic UI Review` (required)
- ✅ `Build Storybook` (required)
- ✅ `TypeScript` (required)
- ✅ `Lint` (required)
- ✅ `Unit Tests` (required)
- ✅ `E2E Tests` (recommended)
- ✅ `CODEOWNERS review` (required)

**Protection Rules:**
- ✅ Require pull request reviews before merging
- ✅ Require CODEOWNERS approval
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- ✅ Require linear history (no merge commits)
- ✅ Include administrators

**Restrictions:**
- ❌ No force pushes
- ❌ No deletions
- ❌ No direct commits (PRs only)

---

### `develop` Branch (Integration)

**Required Status Checks:**
- ✅ `Build Storybook` (required)
- ✅ `TypeScript` (required)
- ✅ `Lint` (required)
- ✅ `Unit Tests` (required)
- ⚠️ `Chromatic UI Review` (optional, but recommended)

**Protection Rules:**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ⚠️ CODEOWNERS approval (optional)

**Restrictions:**
- ❌ No force pushes
- ❌ No deletions

---

### `feature/*` Branches

**No protection** (development branches)

**Recommended:**
- Run Chromatic on PRs
- TurboSnap enabled (only changed stories)
- Auto-reject on visual diffs

---

## 🔧 GitHub Settings Configuration

### Step 1: Enable Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule** for `main`
3. Configure as above

### Step 2: Configure Required Checks

1. Go to **Settings** → **Branches**
2. Under **Branch protection rules**, select `main`
3. Scroll to **Require status checks to pass before merging**
4. Check all required checks

### Step 3: Enable CODEOWNERS

1. Ensure `.github/CODEOWNERS` exists
2. GitHub automatically uses it for PR reviews
3. Owners will be automatically requested for reviews

---

## 📊 Protection Status

| Branch | Protection Level | Visual Regression | CODEOWNERS |
|--------|------------------|-------------------|------------|
| `main` | **Full** | Required | Required |
| `develop` | **Medium** | Recommended | Optional |
| `feature/*` | **None** | On PR | Optional |

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

