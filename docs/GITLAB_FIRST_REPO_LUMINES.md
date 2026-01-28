# Setting Up LUMINES as the First Repo on GitLab

This guide walks you through setting up the LUMINES repository on your self-hosted GitLab (SBX04 at 192.168.86.29) with the same structure as your GitHub setup: main/develop/prototype branches, CI/CD pipeline, merge request template, AAR/hotwash docs, and production deployment.

---

## What You Get (Same as Current Setup)

- **Branches:** `main`, `develop`, `prototype` (all pushed to GitLab)
- **CI/CD:** Lint → Test → Build → Package → Deploy (manual production deploy)
- **Merge requests:** Template at `.gitlab/merge_request_templates/default.md`
- **Docs:** AAR, hotwash, deployment, SBX04, troubleshooting
- **Deployment:** Production at `http://192.168.86.29:8080`, staging at `:8081`
- **Registry:** Container registry at `http://192.168.86.29:5050`

---

## Prerequisites

- GitLab is up at **http://192.168.86.29** (see [SBX04_FINAL_STEPS.md](SBX04_FINAL_STEPS.md))
- You are logged in as **root** (or an admin) in GitLab
- This repo is cloned locally (e.g. from GitHub)

---

## Option A: Use Existing Project `pxg-studio/game-repo`

If you already created the group **PXG.STUDIO** and project **game-repo** in GitLab:

### 1. Add GitLab as a remote

Keep GitHub as `origin`, add GitLab as `gitlab`:

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES

# List current remotes (origin = GitHub)
git remote -v

# Add GitLab as second remote
git remote add gitlab http://192.168.86.29/pxg-studio/game-repo.git

# Or if you want GitLab as origin and GitHub as github:
# git remote rename origin github
# git remote add origin http://192.168.86.29/pxg-studio/game-repo.git
```

### 2. Push all branches to GitLab

```bash
# Push main, develop, prototype to GitLab
git push gitlab main
git push gitlab develop
git push gitlab prototype

# Set upstream for each branch (optional, for future git push gitlab)
git push -u gitlab main
git push -u gitlab develop
git push -u gitlab prototype
```

When prompted for credentials, use **root** and your GitLab root password (e.g. `C0mp0$e2k3!!`).

### 3. Verify on GitLab

- Open **http://192.168.86.29/pxg-studio/game-repo**
- You should see the same code, branches, and **CI/CD → Pipelines** (after a runner is registered).

---

## Option B: Create a Dedicated LUMINES Project

If you prefer a project named **LUMINES** under the same group:

### 1. Create project in GitLab

1. Open **http://192.168.86.29**
2. **New project** → **Create blank project**
3. **Project name:** `LUMINES`
4. **Project URL:** choose group **pxg-studio**, path **lumines** (so URL is `pxg-studio/lumines`)
5. Visibility: **Private** (or your choice)
6. **Initialize with README:** leave **unchecked** (you already have a repo)
7. **Create project**

### 2. Add GitLab LUMINES as remote and push

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES

git remote add gitlab http://192.168.86.29/pxg-studio/lumines.git

git push gitlab main
git push gitlab develop
git push gitlab prototype
```

Use **root** (and GitLab password) when prompted.

---

## CI/CD on GitLab (Same as Current Repo)

The repo already contains:

- **`.gitlab-ci.yml`** – Lint, test, build, package, deploy (manual production deploy to 192.168.86.29)
- **`.gitlab/merge_request_templates/default.md`** – Merge request template

For pipelines to run you need a **GitLab Runner** registered with your GitLab instance (see [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) or [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)). Until then, the pipeline definition is present but jobs will wait for a runner.

For **production deploy** to work from GitLab CI:

1. Add **SSH_PRIVATE_KEY** in GitLab: **Settings → CI/CD → Variables** (see [GITLAB_ADD_SSH_KEY.md](GITLAB_ADD_SSH_KEY.md))
2. Deploy path and Nginx are already set up on SBX04 (see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md))

---

## Keeping GitHub and GitLab in Sync

If you keep **GitHub as origin** and **GitLab as gitlab**:

```bash
# Push to both remotes when you want to sync
git push origin main develop prototype
git push gitlab main develop prototype
```

Or push to one and mirror to the other (GitLab has **Settings → Repository → Mirroring**; you can mirror from GitHub to GitLab if you prefer).

---

## Summary: “Something Similar” on GitLab

| Item | GitHub (current) | GitLab (after setup) |
|------|-------------------|------------------------|
| Repo URL | github.com/PxG-Studio/LUMINES | 192.168.86.29/pxg-studio/game-repo (or lumines) |
| Branches | main, develop, prototype | Same, pushed to GitLab |
| CI/CD | GitHub Actions | GitLab CI (`.gitlab-ci.yml`) |
| Merge requests | Pull requests | Merge requests + template |
| AAR / Hotwash | In repo | Same docs, in repo on GitLab |
| Deploy | Manual / Actions | Manual deploy job to 192.168.86.29 |

After you add the **gitlab** remote and push **main**, **develop**, and **prototype**, your first LUMINES repo on GitLab will match this structure and be ready for merge requests and CI/CD once a runner is registered.
