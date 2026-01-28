# GitLab Production Maintenance Guide

## Daily Maintenance

### Check Backup Status
```bash
tail -20 /var/log/gitlab-backup.log
```

### Monitor System Health
```bash
~/gitlab-production/monitor-gitlab.sh
```

### Check Container Status
```bash
docker compose -f ~/gitlab-production/docker-compose.yml ps
```

## Weekly Maintenance

### Review Logs
```bash
# GitLab logs
docker compose -f ~/gitlab-production/docker-compose.yml logs --tail=100

# System logs
sudo journalctl -u docker --since "1 week ago"
```

### Check Disk Usage
```bash
df -h
du -sh /mnt/gitlab-storage/gitlab/*
```

### Verify RAID Array
```bash
cat /proc/mdstat
sudo mdadm --detail /dev/md0
```

### Check Backup Retention
```bash
ls -lh /mnt/gitlab-storage/gitlab/backups/
```

## Monthly Maintenance

### Security Updates
```bash
sudo apt update
sudo apt upgrade -y
```

### GitLab Updates
```bash
cd ~/gitlab-production
docker compose pull
docker compose up -d
```

### Review Performance Metrics
- Check Grafana dashboards
- Review Prometheus metrics
- Identify bottlenecks

### Test Backup Restore
1. Create test backup
2. Restore to test environment
3. Verify data integrity

## Quarterly Maintenance

### Full System Review
- Review all logs
- Check security settings
- Verify firewall rules
- Review user access

### Disaster Recovery Test
1. Simulate failure scenario
2. Test restore procedure
3. Document lessons learned

### Performance Optimization
- Review resource usage
- Optimize GitLab settings
- Consider hardware upgrades

## Backup Procedures

### Manual Backup
```bash
~/gitlab-production/backup-gitlab.sh
```

### Verify Backup
```bash
ls -lh /mnt/gitlab-storage/gitlab/backups/
```

### Restore Backup
```bash
# Stop GitLab
docker compose -f ~/gitlab-production/docker-compose.yml stop gitlab

# Restore backup
docker compose -f ~/gitlab-production/docker-compose.yml exec -T gitlab gitlab-backup restore BACKUP=<timestamp>

# Restart GitLab
docker compose -f ~/gitlab-production/docker-compose.yml start gitlab
```

## Update Procedures

### System Updates
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

### Docker Updates
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### GitLab Updates
```bash
cd ~/gitlab-production
docker compose pull gitlab
docker compose up -d
```

### Nginx Updates
```bash
sudo apt update
sudo apt upgrade nginx
sudo systemctl reload nginx
```

## Monitoring Alerts

### Set Up Email Alerts
1. Configure SMTP in GitLab
2. Set up Grafana notification channels
3. Configure Prometheus alerting rules

### Common Alerts
- High CPU usage (>80%)
- Low disk space (<20%)
- RAID array degraded
- GitLab service down
- Backup failures

## Troubleshooting Common Issues

### GitLab Won't Start
```bash
# Check logs
docker compose -f ~/gitlab-production/docker-compose.yml logs gitlab

# Check resources
free -h
df -h

# Restart
docker compose -f ~/gitlab-production/docker-compose.yml restart gitlab
```

### High Memory Usage
- Reduce GitLab worker processes
- Increase swap space
- Review running containers

### Slow Performance
- Check disk I/O: `iostat -x 1`
- Review CPU usage: `htop`
- Check network: `iftop`

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Maintenance Schedule

| Task | Frequency | Time Required |
|------|-----------|---------------|
| Check backups | Daily | 5 minutes |
| Monitor system | Daily | 5 minutes |
| Review logs | Weekly | 15 minutes |
| Check disk space | Weekly | 5 minutes |
| Security updates | Monthly | 30 minutes |
| GitLab updates | Monthly | 30 minutes |
| Full system review | Quarterly | 2 hours |
| Disaster recovery test | Quarterly | 1 hour |

## Emergency Procedures

### GitLab Service Down
1. Check container status
2. Review logs
3. Restart services
4. Check system resources

### RAID Array Degraded
1. Identify failed drive
2. Replace drive
3. Rebuild array
4. Monitor rebuild progress

### Data Loss
1. Stop GitLab immediately
2. Identify last good backup
3. Restore from backup
4. Verify data integrity

### Security Breach
1. Isolate system
2. Review access logs
3. Change all passwords
4. Update security settings
5. Notify stakeholders
