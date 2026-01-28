# Production Deployment (Live Environment)

This document describes how to deploy the game build into the **live production environment** using GitLab CI/CD.

## Overview

- **Production server**: SBX04 at `192.168.86.29` (or override via CI/CD variables).
- **Deploy path**: `/var/www/game` (default); content is updated via **rsync over SSH** from the pipeline.
- **Trigger**: Manual **Deploy to production** in the GitLab pipeline (on `main` or tags).

## One-time setup

### 1. Create deploy directory on the server

**Option A — run the script from the repo (recommended):**

```bash
# From your machine (run script on server via SSH)
ssh ncadmin@192.168.86.29 'bash -s' < scripts/setup-production-deploy-path.sh
```

**Option B — run on the server after cloning or copying the script:**

```bash
ssh ncadmin@192.168.86.29
# If you have the repo: bash scripts/setup-production-deploy-path.sh
# Otherwise:
sudo mkdir -p /var/www/game /var/www/staging
sudo chown ncadmin:ncadmin /var/www/game /var/www/staging
```

This creates `/var/www/game` (production) and `/var/www/staging` (staging).

### 2. SSH key for GitLab Runner

The pipeline uses **SSH key authentication** to rsync files to the server.

**Option A — use the helper script (recommended):**

```bash
# From the repo root (generates deploy_key and deploy_key.pub in current dir; both are in .gitignore)
bash scripts/generate-deploy-key.sh
# Then follow the printed instructions:
# 1) ssh-copy-id -i deploy_key.pub ncadmin@192.168.86.29
# 2) Add deploy_key contents to GitLab: Settings → CI/CD → Variables → SSH_PRIVATE_KEY (Mask + Protect)
```

**Option B — manual:**

1. Generate a dedicated deploy key:  
   `ssh-keygen -t ed25519 -C "gitlab-deploy-production" -f deploy_key -N ""`
2. Add the public key to the server:  
   `ssh-copy-id -i deploy_key.pub ncadmin@192.168.86.29`
3. In GitLab: **Settings → CI/CD → Variables** → add **SSH_PRIVATE_KEY** with the contents of `deploy_key`; **Mask variable** and **Protect variable**.

### 3. Optional: CI/CD variables

You can override defaults in **Settings → CI/CD → Variables**:

| Variable             | Default           | Description                    |
|----------------------|-------------------|--------------------------------|
| `PRODUCTION_SERVER`  | `192.168.86.29`   | Production host                |
| `PRODUCTION_USER`    | `ncadmin`         | SSH user on production         |
| `PRODUCTION_PATH`    | `/var/www/game`   | Target directory on the server |

Use **Protect variable** if you only want production jobs to see them.

## Deploying to production

1. Merge (or push) to **`main`**, or create a **tag**.
2. Open **CI/CD → Pipelines** and open the pipeline for that commit/tag.
3. Run the **build** job if it hasn’t run yet.
4. Click **Play** on **deploy:production** (manual job).
5. The job will:
   - Use the **build** artifacts (`dist/`, `build/`).
   - Rsync them to `PRODUCTION_USER@PRODUCTION_SERVER:PRODUCTION_PATH/`.
   - If neither `dist/` nor `build/` exists (e.g. stub build), it deploys a small placeholder so the job still succeeds.

## Staging (optional)

- **Branch**: `develop`
- **Manual job**: **deploy:staging**
- **Default path**: `/var/www/staging` (same server by default).
- Create the directory and SSH access the same way as production; you can use the same `SSH_PRIVATE_KEY` and set `PRODUCTION_PATH` via variable to `/var/www/staging` for the staging job, or rely on the job’s default.

## Serving the deployed content (Nginx)

The repo includes a ready-to-use Nginx config and setup script so the game and staging are served on ports **8080** and **8081** (no conflict with GitLab on 80).

**Option A — use the provided script (recommended):**

1. Copy the config and script to the server, then run the script:

   ```bash
   scp scripts/nginx-game.conf scripts/setup-nginx-game.sh ncadmin@192.168.86.29:~/
   ssh ncadmin@192.168.86.29 'bash ~/setup-nginx-game.sh'
   ```

2. If the server uses UFW, allow the ports:

   ```bash
   ssh ncadmin@192.168.86.29 'sudo ufw allow 8080/tcp && sudo ufw allow 8081/tcp && sudo ufw status'
   ```

3. Open in a browser:
   - **Production**: http://192.168.86.29:8080  
   - **Staging**: http://192.168.86.29:8081  

**Option B — manual inline config:**

```bash
ssh ncadmin@192.168.86.29
sudo tee /etc/nginx/sites-available/game << 'EOF'
server {
    listen 8080;
    server_name 192.168.86.29;
    root /var/www/game;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
EOF
sudo ln -sf /etc/nginx/sites-available/game /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# If using UFW: sudo ufw allow 8080/tcp && sudo ufw status
```

Config file reference: **scripts/nginx-game.conf** (production on 8080, staging on 8081). Setup script: **scripts/setup-nginx-game.sh**.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| **Permission denied (publickey)** | `SSH_PRIVATE_KEY` in GitLab matches the key used in `ssh-copy-id`; target user has `~/.ssh/authorized_keys` with the deploy public key. |
| **No such file or directory** | On the server, create `PRODUCTION_PATH` and set ownership to `PRODUCTION_USER`. |
| **No dist/ or build/** | Build job must run first and emit `dist/` or `build/`. Configure `npm run build` in your app to output there. |
| **Job stuck / no runner** | Register a GitLab Runner (e.g. on SBX04 or another host) with the `docker` tag so the deploy job can run. |

## Security

- Use a **dedicated deploy key** (not your personal SSH key).
- Store **SSH_PRIVATE_KEY** as a **Masked** (and **Protected**) variable.
- Restrict the deploy key on the server (e.g. `command="rsync"` in `authorized_keys`) if you want to limit what the pipeline can do.

## Scripts reference

| Script | Purpose |
|--------|--------|
| `scripts/setup-production-deploy-path.sh` | Create `/var/www/game` and `/var/www/staging` on the server (run on server or via `ssh … 'bash -s' < script`) |
| `scripts/generate-deploy-key.sh` | Generate `deploy_key` / `deploy_key.pub` and print instructions for server + GitLab (run locally) |
| `scripts/nginx-game.conf` | Nginx config: production on :8080, staging on :8081 |
| `scripts/setup-nginx-game.sh` | Install the Nginx config on the server (copy config + script to server, then run) |

## Related

- [URLS_AND_404.md](URLS_AND_404.md) — Why `/pxg-studio/...` returns 404 and which URLs to use (GitLab vs game on :8080/:8081)
- [SBX04_FINAL_STEPS.md](SBX04_FINAL_STEPS.md) — Server access and GitLab setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) — Full deployment checklist
- [.gitlab-ci.yml](../.gitlab-ci.yml) — Pipeline definition
