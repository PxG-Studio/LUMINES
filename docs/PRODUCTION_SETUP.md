# Production-Ready GitLab Setup for PXG.STUDIO

## Overview

This document provides the complete setup guide for a production-ready GitLab CE platform on Raspberry Pi 4 for indie game development.

## Prerequisites

- Raspberry Pi 4 (8GB RAM)
- Argon Eon chassis with 4x 1.8TB SSDs
- Debian 13 (Trixie) or Raspberry Pi OS Lite 64-bit
- Internet connectivity
- Domain name (optional but recommended for SSL)

## Quick Start

All setup scripts have been pre-configured on the server. Follow these steps:

### 1. Install Required Packages

```bash
ssh ncadmin@192.168.86.29
# Or: ssh ncadmin@sbx04.local
~/install-packages.sh
```

**Important**: Log out and back in after installation for Docker group changes to take effect.

### 2. Configure RAID 5 Storage

```bash
~/setup-raid.sh
```

This will:
- Create RAID 5 array on 4 SSDs (sda, sdb, sdc, sdd)
- Format with ext4 filesystem
- Mount at `/mnt/gitlab-storage`
- Create GitLab directory structure

**Note**: RAID build takes 30-60 minutes. Monitor progress with:
```bash
watch cat /proc/mdstat
```

### 3. Configure Firewall

```bash
~/setup-firewall.sh
```

This configures UFW with:
- SSH (22)
- HTTP (80)
- HTTPS (443)
- GitLab SSH (2222)
- Monitoring ports (restricted to local network)

### 4. Start GitLab Services

On **SBX04 (Debian)** use the standalone command (with hyphen):

```bash
cd ~/gitlab-production
docker-compose up -d
```

On systems with the Docker Compose plugin you may use `docker compose up -d` instead.

Wait 5-10 minutes for GitLab to initialize. Monitor with:
```bash
docker-compose logs -f gitlab
# or: docker compose logs -f gitlab
```

### 5. Configure Nginx and SSL

```bash
~/setup-ssl.sh
```

This will:
- Copy Nginx configuration
- Obtain Let's Encrypt SSL certificate
- Configure auto-renewal

**Note**: Update domain name in the script if different from `gitlab.pxg.studio`.

### 6. Set Up Automated Backups

```bash
~/setup-cron.sh
```

This configures:
- Daily backups at 2 AM
- System monitoring every 5 minutes

### 7. Access GitLab

1. Open `http://192.168.86.29` (or `https://gitlab.pxg.studio` if domain configured)
2. Set root password on first login
3. Create PXG.STUDIO group
4. Create game-repo project

### 8. Configure GitLab Runner

```bash
sudo gitlab-runner register
```

Follow prompts to register with your GitLab instance.

## Configuration Files

All configuration files are located in `~/gitlab-production/`:

- `docker-compose.yml` - Main orchestration file
- `backup-gitlab.sh` - Automated backup script
- `monitor-gitlab.sh` - System monitoring script
- `prometheus.yml` - Prometheus configuration
- `grafana/provisioning/` - Grafana datasources and dashboards
- `nginx-gitlab.conf` - Nginx reverse proxy configuration

## Monitoring

### Grafana
- URL: `http://192.168.86.29:3000`
- Default credentials: `admin` / `admin` (change on first login)

### Prometheus
- URL: `http://192.168.86.29:9090`

### GitLab
- URL: `http://192.168.86.29` (or `https://gitlab.pxg.studio` if domain configured)

## Backup and Recovery

### Automated Backups

Backups run daily at 2 AM via cron. Check logs:
```bash
tail -f /var/log/gitlab-backup.log
```

Backups are stored in: `/mnt/gitlab-storage/gitlab/backups`

### Manual Backup

```bash
~/gitlab-production/backup-gitlab.sh
```

### Restore from Backup

```bash
docker compose -f ~/gitlab-production/docker-compose.yml exec -T gitlab gitlab-backup restore BACKUP=<backup-timestamp>
```

## Troubleshooting

### Check Container Status
```bash
docker compose -f ~/gitlab-production/docker-compose.yml ps
```

### View Logs
```bash
docker compose -f ~/gitlab-production/docker-compose.yml logs -f
```

### Monitor System
```bash
~/gitlab-production/monitor-gitlab.sh
```

### Check RAID Status
```bash
cat /proc/mdstat
sudo mdadm --detail /dev/md0
```

### Check Disk Space
```bash
df -h
du -sh /mnt/gitlab-storage/gitlab/*
```

### Restart Services
```bash
docker compose -f ~/gitlab-production/docker-compose.yml restart
```

## Performance Optimization

### System Settings

1. **Swap Configuration**: Already set to 2GB
2. **CPU Governor**: Set to performance mode
   ```bash
   echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
   ```

3. **I/O Scheduler**: Optimize for SSDs
   ```bash
   echo noop | sudo tee /sys/block/sda/queue/scheduler
   ```

### GitLab Settings

GitLab is pre-configured with Raspberry Pi optimizations:
- Puma workers: 2
- Sidekiq concurrency: 5
- Monitoring disabled (to save resources)
- Git LFS enabled for large game assets

## Security

### SSL/TLS
- Let's Encrypt certificates with auto-renewal
- TLS 1.2+ only
- Strong cipher suites
- Security headers configured

### Firewall
- UFW configured with minimal required ports
- Monitoring ports restricted to local network

### GitLab Security
- Two-factor authentication recommended
- Strong password policies
- Session timeout configured
- Regular security updates via unattended-upgrades

## Maintenance

### Daily
- Check backup logs
- Monitor system alerts

### Weekly
- Review system logs
- Check disk space usage
- Verify RAID array health

### Monthly
- Apply security updates
- Review performance metrics
- Test backup restore procedure

### Quarterly
- Full system review
- Disaster recovery test
- Performance optimization review

## Support

For issues or questions:
1. Check troubleshooting section
2. Review GitLab logs
3. Check system monitoring dashboards
4. Consult GitLab documentation: https://docs.gitlab.com/ce/

## Next Steps

1. Push your repository to GitLab
2. Configure CI/CD pipelines
3. Set up project templates
4. Configure webhooks (if needed)
5. Set up repository mirroring (optional)
