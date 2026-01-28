# Production Deployment Checklist

Use this checklist to ensure all components are properly configured before going live.

## SBX04 (192.168.86.29) status

For the Raspberry Pi 4 server at **192.168.86.29**, infrastructure is in place: RAID 5, GitLab dirs, firewall, cron backups, and GitLab started via Docker. **Remaining steps** (verify GitLab is up, first-time setup in browser, push repo) are in **[docs/SBX04_FINAL_STEPS.md](SBX04_FINAL_STEPS.md)**. Use that doc for the exact commands and order.

### Completed on SBX04 (as of setup)
- [x] RAID 5 array created and healthy (`/dev/md0` at `/mnt/gitlab-storage`)
- [x] GitLab directories created with correct permissions (1000:1000)
- [x] Static IP configured (192.168.86.29)
- [x] Firewall configured (UFW: 22, 80, 443, 2222)
- [x] Docker installed and user in docker group
- [x] Docker Compose installed (standalone `docker-compose`)
- [x] Nginx installed
- [x] docker-compose.yml, backup script, monitor script, prometheus/grafana config on server
- [x] Cron backup at 02:00; backup script executable
- [x] GitLab started via `docker-compose up -d` (verify with `docker ps`)

## Pre-Deployment

### Infrastructure
- [ ] RAID 5 array created and healthy
- [ ] Storage mounted at `/mnt/gitlab-storage`
- [ ] GitLab directories created with correct permissions
- [ ] Static IP configured (if applicable)
- [ ] Hostname set to `gitlab.pxg.studio`
- [ ] DNS A record pointing to server IP
- [ ] Firewall configured (UFW)
- [ ] Timezone set to UTC

### Software Installation
- [ ] Docker installed and user in docker group
- [ ] Docker Compose installed
- [ ] Nginx installed
- [ ] Certbot installed
- [ ] GitLab Runner installed (if using)
- [ ] All packages up to date

### Configuration Files
- [ ] `docker-compose.yml` created and configured
- [ ] `prometheus.yml` configured
- [ ] Grafana provisioning configured
- [ ] Nginx configuration created
- [ ] Backup script created and executable
- [ ] Monitor script created and executable
- [ ] All setup scripts created

## Deployment Steps

### 1. Storage Setup
- [ ] Run `~/setup-raid.sh`
- [ ] Verify RAID array is building: `watch cat /proc/mdstat`
- [ ] Wait for RAID build to complete (30-60 minutes)
- [ ] Verify mount: `df -h /mnt/gitlab-storage`
- [ ] Verify GitLab directories exist

### 2. Firewall Configuration
- [ ] Run `~/setup-firewall.sh`
- [ ] Verify firewall rules: `sudo ufw status verbose`
- [ ] Test SSH access still works

### 3. GitLab Deployment
- [ ] Start GitLab: `cd ~/gitlab-production && docker-compose up -d` (on SBX04 use `docker-compose`; elsewhere `docker compose` may work)
- [ ] Monitor startup: `docker-compose logs -f gitlab`
- [ ] Wait 5-10 minutes for initialization
- [ ] Verify container is running: `docker compose ps`
- [ ] Check health: `docker compose exec gitlab gitlab-rake gitlab:check`

### 4. SSL Configuration
- [ ] Run `~/setup-ssl.sh`
- [ ] Verify certificate: `sudo certbot certificates`
- [ ] Test SSL: `curl -I https://gitlab.pxg.studio` (or `curl -I http://192.168.86.29` if no SSL)
- [ ] Verify auto-renewal: `sudo certbot renew --dry-run`

### 5. Nginx Configuration
- [ ] Copy Nginx config: `sudo cp ~/gitlab-production/nginx-gitlab.conf /etc/nginx/sites-available/gitlab`
- [ ] Enable site: `sudo ln -sf /etc/nginx/sites-available/gitlab /etc/nginx/sites-enabled/`
- [ ] Test config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`

### 6. Monitoring Setup
- [ ] Verify Prometheus is running: `docker compose ps prometheus`
- [ ] Verify Grafana is running: `docker compose ps grafana`
- [ ] Access Grafana: `http://192.168.86.29:3000`
- [ ] Change default Grafana password
- [ ] Verify Prometheus data source in Grafana
- [ ] Create initial dashboards

### 7. Backup Configuration
- [ ] Run `~/setup-cron.sh`
- [ ] Verify cron jobs: `crontab -l`
- [ ] Test backup script: `~/gitlab-production/backup-gitlab.sh`
- [ ] Verify backup created: `ls -lh /mnt/gitlab-storage/gitlab/backups/`

### 8. GitLab Initial Setup
- [ ] Access GitLab: `http://192.168.86.29` (or `https://gitlab.pxg.studio` if domain configured)
- [ ] Set root password
- [ ] Create admin user
- [ ] Configure two-factor authentication
- [ ] Create PXG.STUDIO group
- [ ] Configure group settings
- [ ] Create game-repo project
- [ ] Configure project settings

### 9. GitLab Runner Setup
- [ ] Register runner: `sudo gitlab-runner register`
- [ ] Verify runner: `sudo gitlab-runner list`
- [ ] Test runner: Create test pipeline
- [ ] Verify pipeline executes successfully

### 10. Repository Migration
- [ ] Configure git remote: `git remote add origin http://192.168.86.29/pxg-studio/game-repo.git`
- [ ] Push repository: `git push -u origin main`
- [ ] Verify all files uploaded
- [ ] Test clone: `git clone http://192.168.86.29/pxg-studio/game-repo.git /tmp/test-clone`
- [ ] Verify CI/CD pipeline runs

### 11. Live production deployment
- [ ] On server: create deploy path: `ssh ncadmin@192.168.86.29 'bash -s' < scripts/setup-production-deploy-path.sh` (or see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md))
- [ ] Generate deploy key: `bash scripts/generate-deploy-key.sh`; add public key to server, add `SSH_PRIVATE_KEY` in GitLab (Settings → CI/CD → Variables)
- [ ] Run **deploy:production** (manual) from pipeline on `main` or a tag
- [ ] Optional — Nginx: copy `scripts/nginx-game.conf` and `scripts/setup-nginx-game.sh` to server, run `bash ~/setup-nginx-game.sh`; open firewall: `sudo ufw allow 8080/tcp && sudo ufw allow 8081/tcp` (see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md))

## Post-Deployment

### Verification
- [ ] GitLab web interface accessible
- [ ] SSH access working: `git clone git@192.168.86.29:pxg-studio/game-repo.git` (port 2222)
- [ ] Container registry accessible
- [ ] CI/CD pipelines executing
- [ ] Monitoring dashboards showing data
- [ ] Backups running successfully
- [ ] SSL certificate valid and auto-renewing

### Security
- [ ] Two-factor authentication enabled for admin
- [ ] Strong password policies configured
- [ ] Firewall rules verified
- [ ] Security headers configured in Nginx
- [ ] Regular security updates enabled
- [ ] SSH key authentication recommended

### Performance
- [ ] System resources within limits
- [ ] GitLab response times acceptable
- [ ] CI/CD pipeline execution times reasonable
- [ ] No memory leaks or resource exhaustion
- [ ] RAID array performing well

### Documentation
- [ ] All documentation updated
- [ ] Team members have access
- [ ] Backup procedures documented
- [ ] Recovery procedures tested
- [ ] Maintenance schedule established

## Ongoing Maintenance

### Daily
- [ ] Check backup logs
- [ ] Monitor system alerts
- [ ] Review error logs

### Weekly
- [ ] Review system logs
- [ ] Check disk space
- [ ] Verify RAID health
- [ ] Review performance metrics

### Monthly
- [ ] Apply security updates
- [ ] Update GitLab if needed
- [ ] Review and optimize performance
- [ ] Test backup restore

### Quarterly
- [ ] Full system review
- [ ] Disaster recovery test
- [ ] Security audit
- [ ] Performance optimization review

## Rollback Plan

If deployment fails:

1. Stop all services: `docker compose -f ~/gitlab-production/docker-compose.yml down`
2. Review logs to identify issue
3. Fix configuration issues
4. Restore from backup if data corruption
5. Restart services
6. Verify functionality

## Support Contacts

- System Administrator: Update with your contact (e.g. email or team handle).
- GitLab Issues: https://gitlab.com/gitlab-org/gitlab/-/issues
- Documentation: [docs/PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)
