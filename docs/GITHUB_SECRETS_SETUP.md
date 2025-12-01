# 🔐 GitHub Secrets Setup Guide

**WISSIL / LUMINES — Setting up CI/CD Secrets**

This guide explains how to set up required secrets for the WISSIL QA pipeline.

---

## Required Secrets

### 1. PERCY_TOKEN

**Purpose**: Percy visual regression testing authentication

**How to Get It**:
1. Sign up at [percy.io](https://percy.io) (free tier available)
2. Create a new project for WISSIL
3. Navigate to Project Settings → API Tokens
4. Copy your project token

**How to Set It**:

**For GitHub Secrets (CI/CD)**:
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `PERCY_TOKEN`
5. Value: `web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7`
6. Click **Add secret**

**For Local Development (PowerShell)**:
```powershell
# Set for current session
$env:PERCY_TOKEN="web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7"

# Or create a .env file (already in .gitignore)
echo "PERCY_TOKEN=web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7" >> .env
```

**Verification**:
- The `.github/workflows/percy.yml` workflow will use this token
- Check workflow logs to verify token is being used

---

### 2. CHROMATIC_PROJECT_TOKEN (if not already set)

**Purpose**: Chromatic visual regression testing authentication

**How to Get It**:
1. Sign up at [chromatic.com](https://www.chromatic.com)
2. Create a new project for WISSIL
3. Navigate to Project Settings → App ID & Token
4. Copy your project token

**How to Set It**:
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CHROMATIC_PROJECT_TOKEN`
5. Value: Paste your Chromatic project token
6. Click **Add secret**

---

## Testing Locally

### Percy

```bash
# Set token in your environment
export PERCY_TOKEN=your_token_here

# Or create a .env file (add to .gitignore!)
echo "PERCY_TOKEN=your_token_here" >> .env

# Run Percy
npm run percy:storybook
```

### Chromatic

```bash
# Set token in your environment
export CHROMATIC_PROJECT_TOKEN=your_token_here

# Run Chromatic
npm run chromatic
```

---

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use GitHub Secrets** for CI/CD
3. **Use .env files** for local development (add to .gitignore)
4. **Rotate tokens** periodically
5. **Limit token permissions** when possible

---

## Troubleshooting

### "PERCY_TOKEN environment variable is not set"

**Solution**: 
- For local: Set `export PERCY_TOKEN=your_token`
- For CI: Add `PERCY_TOKEN` to GitHub Secrets

### "Invalid token" or "Authentication failed"

**Solution**:
- Verify token is correct
- Check token hasn't expired
- Regenerate token if needed

### Workflow fails with "Secret not found"

**Solution**:
- Verify secret name matches exactly (case-sensitive)
- Check secret is set in the correct repository
- Ensure you have permission to view secrets

---

## Next Steps

After setting up secrets:

1. ✅ Push changes to trigger workflows
2. ✅ Check GitHub Actions tab for workflow runs
3. ✅ Verify Percy and Chromatic are running
4. ✅ Review PR comments for visual regression results

---

*Last updated: December 2024*

