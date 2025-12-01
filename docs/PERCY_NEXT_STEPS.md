# 🚀 Percy Integration — Next Steps

**WISSIL / LUMINES — Complete the Percy Setup**

---

## ✅ What's Complete

- ✅ Percy dependencies installed
- ✅ Percy configuration (`percy.config.js`)
- ✅ Percy Storybook script (`scripts/percy-storybook.js`)
- ✅ Percy GitHub Actions workflow (`.github/workflows/percy.yml`)
- ✅ QA pipeline updated (`.github/workflows/qa.yml`)
- ✅ Critical component stories created/updated
- ✅ PERCY_TOKEN added to GitHub Secrets
- ✅ Documentation created

---

## 🎯 Next Steps

### Step 1: Test Percy Locally (Optional but Recommended)

Verify everything works before pushing:

```powershell
# Ensure PERCY_TOKEN is set (already done)
$env:PERCY_TOKEN="web_68bac1a7016f87c910c3af407d62846f0dc7785981b40692ca87f3789f8facb7"

# Test Percy
npm run percy:storybook
```

**Expected Output:**
- Storybook builds successfully
- Percy snapshots generated
- Upload to Percy dashboard
- View results at percy.io

**If it fails:**
- Check PERCY_TOKEN is correct
- Verify Storybook builds: `npm run build-storybook`
- Check Percy project settings

---

### Step 2: Commit and Push Changes

Commit all the Percy integration files:

```powershell
# Stage all changes
git add .

# Commit
git commit -m "feat: Add Percy visual regression testing

- Install Percy dependencies (@percy/cli, @percy/storybook)
- Add Percy configuration (percy.config.js)
- Create Percy Storybook script (scripts/percy-storybook.js)
- Add Percy GitHub Actions workflow (.github/workflows/percy.yml)
- Update QA pipeline to include Percy
- Create/update critical component stories
- Add Percy documentation (docs/PERCY_SETUP.md)
- Update Chromatic docs to mention Percy integration"

# Push to trigger workflows
git push origin develop
```

---

### Step 3: Verify CI/CD Workflows

After pushing:

1. **Go to GitHub Actions Tab**
   - Navigate to your repository
   - Click "Actions" tab
   - Look for workflow runs

2. **Check Workflow Status**
   - `.github/workflows/percy.yml` should run
   - `.github/workflows/qa.yml` should include Percy
   - Both should show ✅ success

3. **Review Workflow Logs**
   - Click on the workflow run
   - Check "Percy Visual Tests" job
   - Verify snapshots uploaded successfully

---

### Step 4: Create a Test PR (Recommended)

Test the full pipeline:

1. **Create a Feature Branch**
   ```powershell
   git checkout -b test/percy-integration
   ```

2. **Make a Small Change**
   - Update a component story
   - Or add a new story variant

3. **Push and Create PR**
   ```powershell
   git add .
   git commit -m "test: Verify Percy integration"
   git push origin test/percy-integration
   ```

4. **Check PR Comments**
   - Percy should comment on the PR
   - Chromatic should also comment
   - Both should show visual regression results

---

### Step 5: Review Percy Dashboard

1. **Visit Percy Dashboard**
   - Go to [percy.io](https://percy.io)
   - Navigate to your WISSIL project

2. **Check Snapshots**
   - View all generated snapshots
   - Verify viewports (375px, 768px, 1280px, 1920px)
   - Review any visual diffs

3. **Approve/Reject Changes**
   - Approve intentional changes
   - Reject regressions
   - Update baselines as needed

---

## 🔍 Verification Checklist

After completing the steps above, verify:

- [ ] Percy runs locally without errors
- [ ] Percy workflow runs in GitHub Actions
- [ ] Percy snapshots appear in dashboard
- [ ] PR comments show Percy results
- [ ] QA pipeline includes Percy status
- [ ] Chromatic and Percy run in parallel
- [ ] No conflicts between tools

---

## 🐛 Troubleshooting

### Percy Workflow Fails

**Error**: "PERCY_TOKEN not found"
- **Solution**: Verify secret is added to GitHub Secrets
- **Check**: Settings → Secrets and variables → Actions

**Error**: "Storybook build failed"
- **Solution**: Run `npm run build-storybook` locally first
- **Check**: Ensure all dependencies installed

**Error**: "No snapshots generated"
- **Solution**: Verify stories exist in `src/stories/`
- **Check**: Storybook builds successfully

### Percy Dashboard Shows No Snapshots

- **Check**: Workflow logs for upload errors
- **Verify**: PERCY_TOKEN is correct
- **Confirm**: Percy project is active

---

## 📊 Expected Results

After successful setup:

1. **Every PR** triggers Percy visual regression
2. **PR Comments** show Percy results automatically
3. **Percy Dashboard** displays all snapshots
4. **QA Pipeline** includes Percy in summary
5. **Dual Coverage** with Chromatic + Percy

---

## 🎉 Success Criteria

You'll know it's working when:

- ✅ Percy workflow runs on every PR
- ✅ PR comments include Percy links
- ✅ Percy dashboard shows snapshots
- ✅ Visual regressions caught automatically
- ✅ Both Chromatic and Percy report status

---

## 📚 Related Documentation

- [Percy Setup Guide](./PERCY_SETUP.md)
- [Chromatic Complete Guide](./CHROMATIC_COMPLETE.md)
- [GitHub Secrets Setup](./GITHUB_SECRETS_SETUP.md)

---

*Last updated: December 2024*

