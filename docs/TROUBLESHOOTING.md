# GitLab Troubleshooting Guide

## Common Issues and Solutions

### Network Connectivity Issues

**Problem**: Cannot access GitLab web interface

**Solutions**:
1. Check if GitLab container is running:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml ps
   ```

2. Check Nginx status:
   ```bash
   sudo systemctl status nginx
   ```

3. Check firewall rules:
   ```bash
   sudo ufw status
   ```

4. Test port connectivity:
   ```bash
   curl -I http://localhost
   ```

### GitLab Container Won't Start

**Problem**: GitLab container exits immediately or won't start

**Solutions**:
1. Check logs:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml logs gitlab
   ```

2. Check disk space:
   ```bash
   df -h
   ```

3. Check memory:
   ```bash
   free -h
   ```

4. Verify storage mount:
   ```bash
   ls -la /mnt/gitlab-storage/gitlab/
   ```

5. Check permissions:
   ```bash
   sudo chown -R 1000:1000 /mnt/gitlab-storage/gitlab
   ```

### RAID Array Issues

**Problem**: RAID array not mounting or degraded

**Solutions**:
1. Check RAID status:
   ```bash
   cat /proc/mdstat
   sudo mdadm --detail /dev/md0
   ```

2. If degraded, check drive health:
   ```bash
   sudo smartctl -a /dev/sda
   ```

3. Rebuild array if needed:
   ```bash
   sudo mdadm --manage /dev/md0 --add /dev/sda
   ```

4. Check fstab entry:
   ```bash
   cat /etc/fstab | grep md0
   ```

### SSL Certificate Issues

**Problem**: SSL certificate expired or not working

**Solutions**:
1. Renew certificate:
   ```bash
   sudo certbot renew
   ```

2. Test renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

3. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```

4. Check certificate:
   ```bash
   sudo certbot certificates
   ```

### High Memory Usage

**Problem**: System running out of memory

**Solutions**:
1. Check memory usage:
   ```bash
   free -h
   docker stats
   ```

2. Increase swap:
   ```bash
   sudo nano /etc/dphys-swapfile
   # Change CONF_SWAPSIZE=2048
   sudo dphys-swapfile swapoff
   sudo dphys-swapfile swapon
   ```

3. Reduce GitLab workers:
   Edit `~/gitlab-production/docker-compose.yml`:
   ```yaml
   puma["worker_processes"] = 1
   ```

4. Restart GitLab:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml restart gitlab
   ```

### Slow Performance

**Problem**: GitLab is slow or unresponsive

**Solutions**:
1. Check system resources:
   ```bash
   htop
   iostat -x 1
   ```

2. Check disk I/O:
   ```bash
   iotop
   ```

3. Review GitLab logs for errors:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml logs gitlab | grep -i error
   ```

4. Optimize database:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml exec gitlab gitlab-rake db:optimize
   ```

### Backup Failures

**Problem**: Automated backups failing

**Solutions**:
1. Check backup logs:
   ```bash
   tail -50 /var/log/gitlab-backup.log
   ```

2. Check disk space:
   ```bash
   df -h /mnt/gitlab-storage/gitlab/backups
   ```

3. Test manual backup:
   ```bash
   ~/gitlab-production/backup-gitlab.sh
   ```

4. Verify permissions:
   ```bash
   ls -la /mnt/gitlab-storage/gitlab/backups
   ```

### Docker Issues

**Problem**: Docker commands failing

**Solutions**:
1. Check Docker service:
   ```bash
   sudo systemctl status docker
   ```

2. Restart Docker:
   ```bash
   sudo systemctl restart docker
   ```

3. Check Docker logs:
   ```bash
   sudo journalctl -u docker
   ```

4. Verify user in docker group:
   ```bash
   groups
   ```

### GitLab Runner Issues

**Problem**: CI/CD pipelines not running

**Solutions**:
1. Check runner status:
   ```bash
   sudo gitlab-runner status
   ```

2. Check runner logs:
   ```bash
   sudo gitlab-runner --debug run
   ```

3. Verify runner registration:
   ```bash
   sudo gitlab-runner list
   ```

4. Restart runner:
   ```bash
   sudo systemctl restart gitlab-runner
   ```

### Database Issues

**Problem**: Database connection errors

**Solutions**:
1. Check GitLab database:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml exec gitlab gitlab-rake db:migrate:status
   ```

2. Run database check:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml exec gitlab gitlab-rake gitlab:check
   ```

3. Rebuild database if needed:
   ```bash
   docker compose -f ~/gitlab-production/docker-compose.yml exec gitlab gitlab-rake db:reset
   ```

### Permission Issues

**Problem**: Permission denied errors

**Solutions**:
1. Fix GitLab directory permissions:
   ```bash
   sudo chown -R 1000:1000 /mnt/gitlab-storage/gitlab
   ```

2. Check file permissions:
   ```bash
   ls -la /mnt/gitlab-storage/gitlab/
   ```

3. Fix Docker socket permissions:
   ```bash
   sudo chmod 666 /var/run/docker.sock
   ```

## Diagnostic Commands

### System Health Check
```bash
~/gitlab-production/monitor-gitlab.sh
```

### Full System Check
```bash
# Container status
docker compose -f ~/gitlab-production/docker-compose.yml ps

# System resources
free -h && df -h

# RAID status
cat /proc/mdstat

# Network connectivity
ping -c 3 8.8.8.8

# Service status
sudo systemctl status docker nginx
```

### GitLab Health Check
```bash
docker compose -f ~/gitlab-production/docker-compose.yml exec gitlab gitlab-rake gitlab:check
```

## Getting Help

1. Check GitLab logs: `docker compose logs gitlab`
2. Review system logs: `sudo journalctl -xe`
3. Check monitoring dashboards
4. Consult GitLab documentation: https://docs.gitlab.com/ce/
5. Review troubleshooting guides in GitLab docs

## Emergency Recovery

### Complete System Restore
1. Stop all services
2. Restore from latest backup
3. Verify data integrity
4. Restart services
5. Test functionality

### Partial Restore
1. Identify affected component
2. Restore specific backup
3. Verify component functionality
4. Monitor for issues
