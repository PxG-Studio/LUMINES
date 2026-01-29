# LUMINES Live Production

This document describes how to bring LUMINES to **full live production** on SBX04 (192.168.86.29).

---

## Quick start (when SBX04 is up)

From your Mac, in the LUMINES repo:

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
./scripts/bring-lumines-to-production.sh
```

When prompted (if no token), use GitLab **root** and your root password. The script:

1. Runs server completion (storage, RAID, mount, GitLab start)
2. Waits for GitLab to respond (up to 10 min)
3. Asks you to create group/project in the browser if `GITLAB_TOKEN` is not set
4. Pushes **main**, **develop**, **prototype** to GitLab
5. Adds **SSH_PRIVATE_KEY** via API (if token set) or prints instructions
6. Verifies production URLs

---

## Full automation (no browser prompts)

1. **Create a Personal Access Token in GitLab**
   - Open http://192.168.86.29 and log in as **root**
   - **User Settings** (avatar) → **Access Tokens**
   - Name: `production-script`
   - Scopes: **api**, **write_repository**, **read_repository**
   - Create token and copy it

2. **Run with token**
   ```bash
   cd /Users/hiroyasu/Documents/GitHub/LUMINES
   GITLAB_TOKEN=your-token-here ./scripts/bring-lumines-to-production.sh
   ```

With `GITLAB_TOKEN` set, the script creates the **PXG.STUDIO** group and **game-repo** project (if they do not exist), pushes all branches, and adds the **SSH_PRIVATE_KEY** CI/CD variable via API.

---

## Production URLs (after completion)

| Purpose        | URL |
|----------------|-----|
| GitLab         | http://192.168.86.29 |
| LUMINES project| http://192.168.86.29/pxg-studio/game-repo |
| Game production| http://192.168.86.29:8080 |
| Game staging   | http://192.168.86.29:8081 |

---

## If the server is not reachable

The script exits at Step 1 if SSH to 192.168.86.29 fails. Ensure:

- SBX04 is on the same network as your Mac
- SSH works: `ssh ncadmin@192.168.86.29`
- If the Pi was just rebooted, wait 2–3 minutes and try again

Then run:

```bash
./scripts/bring-lumines-to-production.sh
```

---

## Related docs

- [COMPLETE_OUTSTANDING_TASKS.md](COMPLETE_OUTSTANDING_TASKS.md) – Step-by-step runbook
- [GITLAB_ADD_SSH_KEY.md](GITLAB_ADD_SSH_KEY.md) – Manual CI/CD variable setup
- [GITLAB_CLI_SETUP.md](GITLAB_CLI_SETUP.md) – glab and token setup
