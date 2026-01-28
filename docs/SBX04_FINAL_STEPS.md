# SBX04 Final Steps

This document lists what is already done on SBX04 and the remaining steps you need to complete.

## Server Details

| Item | Value |
|------|--------|
| **Host** | SBX04 (Raspberry Pi 4, Argon Eon, 4×2TB SSDs) |
| **IP** | `192.168.86.29` |
| **SSH** | `ssh ncadmin@192.168.86.29` |
| **Password** | `C0mp0$e2k3!!` |
| **GitLab URL** | `http://192.168.86.29` |
| **Registry** | `http://192.168.86.29:5050` |
| **Grafana** | `http://192.168.86.29:3000` |

---

## Already Done on SBX04

- **Packages**: `mdadm`, `docker.io`, `docker-compose`, `nginx` installed; `ncadmin` in `docker` group
- **RAID 5**: `/dev/md0` on sda,sdb,sdc,sdd; ext4; mounted at `/mnt/gitlab-storage` (~5.5TB)
- **GitLab dirs**: `/mnt/gitlab-storage/gitlab/{config,logs,data,backups,registry}` (1000:1000)
- **GitLab config**: `~/gitlab-production/docker-compose.yml` with `external_url` and registry using `http://192.168.86.29`
- **Firewall**: UFW enabled; ports 22, 80, 443, 2222 allowed
- **Cron**: Daily backup at 02:00 via `~/gitlab-production/backup-gitlab.sh` → `/var/log/gitlab-backup-cron.log`
- **GitLab start**: `docker-compose up -d` was run (image pull may have been in progress)

---

## Remaining Steps (Do These Now)

### 1. Confirm GitLab is up

SSH in and check containers and logs:

```bash
ssh ncadmin@192.168.86.29

# Containers running?
docker ps

# If GitLab container is not running or still starting:
cd ~/gitlab-production
docker-compose up -d

# Wait for GitLab to be ready (first boot can take 5–10 minutes)
docker-compose logs -f gitlab
# Ctrl+C when you see "gitlab Reconfigured!" or the web server listening

# Optional: run GitLab check
docker-compose exec gitlab gitlab-rake gitlab:check
```

### 2. First GitLab setup (in browser)

**Use the root URL first** (no path): **http://192.168.86.29**.  
If you go to `/pxg-studio/...` before creating the group and project, you’ll get **404** until they exist. See [URLS_AND_404.md](URLS_AND_404.md) for details.

1. Open **http://192.168.86.29** in a browser.
2. Set the **root** password when prompted.
3. Log in as **root** with that password.
4. Create group **PXG.STUDIO** (path: `pxg-studio`).
5. Create project **game-repo** under that group (path: `pxg-studio/game-repo`).
6. (Optional) Create a normal user and use 2FA.

### 3. Push this repo to GitLab

From your **local machine** (in the LUMINES repo):

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES

# Add GitLab as remote (use the URL from the new project’s “Clone” button if different)
git remote add origin http://192.168.86.29/pxg-studio/game-repo.git
# If 'origin' already exists: git remote set-url origin http://192.168.86.29/pxg-studio/game-repo.git

# Push (replace main with your default branch if different)
git push -u origin main
```

When prompted for credentials, use **root** and the password you set in step 2.

### 4. Optional: SSL and domain

- To use a domain (e.g. `gitlab.pxg.studio`) and HTTPS, run on the server:  
  `~/setup-ssl.sh`  
  (Requires DNS for the domain pointing to `192.168.86.29` and internet on the Pi.)

### 5. Optional: GitLab Runner

- To run CI/CD jobs on the Pi, install and register a runner on SBX04; see [docs/PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) and [docs/DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

---

## Quick verification

| Check | Command or action |
|-------|--------------------|
| SSH | `ssh ncadmin@192.168.86.29` |
| RAID | `ssh ncadmin@192.168.86.29 "cat /proc/mdstat"` |
| Mount | `ssh ncadmin@192.168.86.29 "df -h /mnt/gitlab-storage"` |
| Containers | `ssh ncadmin@192.168.86.29 "docker ps"` |
| GitLab UI | Open http://192.168.86.29 in a browser |
| Backup cron | `ssh ncadmin@192.168.86.29 "crontab -l"` |

---

## Troubleshooting

- **GitLab not loading**: Wait a few more minutes and check `docker-compose logs -f gitlab`. Ensure ports 80/443 are not in use by another service.
- **docker-compose**: On this server use the standalone command `docker-compose` (with hyphen), not `docker compose`.
- **Reset root password**:  
  `docker-compose exec gitlab gitlab-rake "gitlab:password:reset[root]"`

For more detail, see [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) and [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md).
