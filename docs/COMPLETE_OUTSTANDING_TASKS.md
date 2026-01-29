# Complete All Outstanding Tasks

This runbook finishes all remaining LUMINES/GitLab tasks when SBX04 (192.168.86.29) is reachable.

---

## One-command production bring-up (recommended)

When the server is reachable, run from repo root:

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
./scripts/bring-lumines-to-production.sh
```

This script runs: server completion (storage + GitLab) → wait for GitLab → ensure group/project → push main/develop/prototype → add SSH_PRIVATE_KEY (or print instructions) → verify URLs.

**Optional (full automation):** Create a GitLab Personal Access Token (root → Settings → Access Tokens, scopes: `api`, `write_repository`), then:

```bash
GITLAB_TOKEN=your-token ./scripts/bring-lumines-to-production.sh
```

With `GITLAB_TOKEN` set, the script creates the group and project via API (if missing), pushes using the token, and adds `SSH_PRIVATE_KEY` via API.

---

## Prerequisites

- SBX04 is on the same network and reachable: `ssh ncadmin@192.168.86.29` works
- Root password for GitLab: `C0mp0$e2k3!!` (or the one you set)
- Local repo has `gitlab` remote: `git remote -v` shows `gitlab → http://192.168.86.29/pxg-studio/game-repo.git`
- `deploy_key` exists in repo root (for CI/CD variable)

---

## Part A: Server-Side (SBX04)

Run **one** of these when the server is up.

### Option 1: One command from your Mac

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
ssh ncadmin@192.168.86.29 'bash -s' < scripts/complete-outstanding-tasks-server.sh
```

### Option 2: Step by step on the server

```bash
ssh ncadmin@192.168.86.29
# Then on the server:
bash -s < /path/to/complete-outstanding-tasks-server.sh
# Or run steps manually from docs/STATUS_2026-01-28.md
```

The script will:

1. Verify Argon Eon storage (SATA controllers and disks)
2. Reassemble RAID if broken: `sudo mdadm --assemble --force /dev/md0 /dev/sda /dev/sdb /dev/sdc /dev/sdd`
3. Mount storage: `sudo mount /dev/md0 /mnt/gitlab-storage`
4. Ensure GitLab dirs exist and start GitLab: `cd ~/gitlab-production && docker-compose up -d gitlab`

Wait **5–10 minutes** for GitLab to start, then continue with Part B.

---

## Part B: Verify GitLab Web UI

1. Open **http://192.168.86.29** in a browser.
2. You should see the GitLab login page (HTTP 200/302).
3. Log in as **root** with password `C0mp0$e2k3!!` (or your root password).

If the page does not load, on the server run:

```bash
ssh ncadmin@192.168.86.29 'docker ps; curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/'
```

---

## Part C: GitLab Initial Setup (Browser)

Do this only if the group/project do not exist yet.

1. In GitLab: **Create group** (or **New group**).
   - Name: **PXG.STUDIO**
   - Group URL: **pxg-studio**
   - Create group.

2. **Create project** under that group.
   - **New project** → **Create blank project**
   - Project name: **game-repo** (or **LUMINES** if you prefer)
   - Project URL: **pxg-studio** / **game-repo** (so URL is `pxg-studio/game-repo`)
   - Visibility: Private (or your choice)
   - **Create project**.

3. If you created **LUMINES** instead of **game-repo**, add the GitLab remote with the URL GitLab shows (e.g. `http://192.168.86.29/pxg-studio/lumines.git`) and use that in the push commands below.

---

## Part D: Push LUMINES to GitLab (Local)

From your Mac, in the LUMINES repo:

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES

# Ensure gitlab remote exists
git remote -v | grep gitlab || git remote add gitlab http://192.168.86.29/pxg-studio/game-repo.git

# Push main, develop, prototype
git push gitlab main
git push gitlab develop
git push gitlab prototype

# Optional: set upstream for future pushes
git push -u gitlab main
git push -u gitlab develop
git push -u gitlab prototype
```

When prompted for credentials, use **root** and your GitLab root password.

---

## Part E: Add SSH_PRIVATE_KEY to GitLab (Browser)

Required for CI/CD deploy jobs.

1. In GitLab: open **pxg-studio/game-repo** (or your project).
2. **Settings** → **CI/CD** → **Variables** → **Expand**.
3. **Add variable**:
   - **Key:** `SSH_PRIVATE_KEY`
   - **Value:** entire contents of `deploy_key` (including `-----BEGIN ... KEY-----` and `-----END ... KEY-----`).
   - **Type:** Variable  
   - **Flags:** check **Mask variable** and **Protect variable**.
4. **Add variable**.

To get the value:

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
cat deploy_key
```

Paste that into the **Value** field. Do not commit or share this key.

If `deploy_key` is missing:

```bash
bash scripts/generate-deploy-key.sh
ssh-copy-id -i ./deploy_key.pub ncadmin@192.168.86.29
# Then add the contents of deploy_key to GitLab as above.
```

See [GITLAB_ADD_SSH_KEY.md](GITLAB_ADD_SSH_KEY.md) for more detail.

---

## Checklist Summary

| # | Task | Where | Status |
|---|------|--------|--------|
| 1 | Run server completion script (storage + GitLab) | Mac → SSH | ☐ |
| 2 | Wait 5–10 min for GitLab to start | — | ☐ |
| 3 | Open http://192.168.86.29 and log in as root | Browser | ☐ |
| 4 | Create group PXG.STUDIO and project game-repo | Browser | ☐ |
| 5 | Push main, develop, prototype to GitLab | Mac (repo) | ☐ |
| 6 | Add SSH_PRIVATE_KEY in CI/CD Variables | Browser | ☐ |

---

## Quick Reference

- **Server:** `ssh ncadmin@192.168.86.29` (password: `C0mp0$e2k3!!`)
- **GitLab:** http://192.168.86.29  
- **Project (after create):** http://192.168.86.29/pxg-studio/game-repo  
- **Game production:** http://192.168.86.29:8080  
- **Game staging:** http://192.168.86.29:8081  

---

## Related Docs

- [SBX04_FINAL_STEPS.md](SBX04_FINAL_STEPS.md) – First-time GitLab setup
- [GITLAB_FIRST_REPO_LUMINES.md](GITLAB_FIRST_REPO_LUMINES.md) – Repo setup options
- [GITLAB_ADD_SSH_KEY.md](GITLAB_ADD_SSH_KEY.md) – CI/CD SSH key
- [STATUS_2026-01-28.md](STATUS_2026-01-28.md) – Current status and recovery steps
