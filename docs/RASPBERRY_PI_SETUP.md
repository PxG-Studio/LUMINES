# Raspberry Pi 4 Setup for PXG.STUDIO GitLab Server

## Hardware Configuration

- **Device**: Raspberry Pi 4 (8GB RAM)
- **Chassis**: Argon Eon with 4x 2TB SSDs
- **Use Case**: Self-hosted GitLab server for game development

## Operating System: Raspberry Pi OS Lite 64-bit

### Why Raspberry Pi OS Lite 64-bit?

1. **Official Support**: Maintained by Raspberry Pi Foundation
2. **Hardware Optimization**: Optimized for Raspberry Pi 4
3. **Lightweight**: No GUI overhead, more resources for GitLab
4. **Stability**: Well-tested and reliable
5. **Community**: Large support community

### Alternative: Ubuntu Server 22.04 LTS

**Consider Ubuntu if:**
- You plan to use Kubernetes later
- You need enterprise features
- You're more familiar with Ubuntu

**Stick with Raspberry Pi OS if:**
- You want maximum hardware optimization
- You prefer simplicity
- You want official Raspberry Pi support

## Installation Process

### Step 1: Download and Flash OS

1. Download **Raspberry Pi OS Lite (64-bit)** from:
   - Official: https://www.raspberrypi.com/software/operating-systems/
   - Direct link: Look for "Raspberry Pi OS Lite (64-bit)" in the download section

2. Use **Raspberry Pi Imager**:
   - Download from: https://www.raspberrypi.com/software/
   - Insert microSD card
   - Select "Raspberry Pi OS Lite (64-bit)"
   - Click gear icon to configure:
     - Enable SSH
     - Set username/password
     - Configure WiFi (if using)
     - Set hostname: `pxg-gitlab`
   - Write to SD card

### Step 2: Initial Boot and Configuration

```bash
# SSH into Raspberry Pi
ssh ncadmin@192.168.86.29
# Or: ssh ncadmin@sbx04.local

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim htop ufw

# Set timezone
sudo timedatectl set-timezone America/Los_Angeles  # Adjust to your timezone

# Configure firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Step 3: Configure Storage (Argon Eon with 4x 2TB SSDs)

```bash
# Check connected drives
lsblk

# Install RAID tools
sudo apt install -y mdadm

# Create RAID 5 array (3.6TB usable, 1 drive redundancy)
sudo mdadm --create /dev/md0 \
  --level=5 \
  --raid-devices=4 \
  /dev/sda /dev/sdb /dev/sdc /dev/sdd

# Check RAID status
sudo mdadm --detail /dev/md0

# Format with ext4
sudo mkfs.ext4 -F /dev/md0

# Create mount point
sudo mkdir -p /mnt/gitlab-storage

# Mount RAID array
sudo mount /dev/md0 /mnt/gitlab-storage

# Add to fstab for auto-mount
echo '/dev/md0 /mnt/gitlab-storage ext4 defaults,noatime 0 2' | sudo tee -a /etc/fstab

# Verify
df -h /mnt/gitlab-storage
```

### Step 4: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Log out and back in for group changes
exit
# SSH back in
```

### Step 5: Install GitLab CE

```bash
# Create GitLab directories on RAID storage
sudo mkdir -p /mnt/gitlab-storage/gitlab/{config,logs,data}
sudo chown -R 1000:1000 /mnt/gitlab-storage/gitlab

# Create docker-compose.yml
cat > ~/gitlab-docker-compose.yml << 'EOF'
version: '3.8'
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    container_name: gitlab
    restart: always
    hostname: 'pxg-gitlab.local'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://192.168.86.29'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        # Optimize for Raspberry Pi
        puma['worker_processes'] = 2
        sidekiq['max_concurrency'] = 5
    ports:
      - '80:80'
      - '443:443'
      - '2222:22'
    volumes:
      - /mnt/gitlab-storage/gitlab/config:/etc/gitlab
      - /mnt/gitlab-storage/gitlab/logs:/var/log/gitlab
      - /mnt/gitlab-storage/gitlab/data:/var/opt/gitlab
    shm_size: '256m'
    networks:
      - gitlab-network

networks:
  gitlab-network:
    driver: bridge
EOF

# The IP is already configured as 192.168.86.29
# Edit if you need to change it: nano ~/gitlab-docker-compose.yml

# Start GitLab (this will take 5-10 minutes on first start)
cd ~
docker compose -f gitlab-docker-compose.yml up -d

# Monitor logs
docker compose -f gitlab-docker-compose.yml logs -f
```

### Step 6: Access GitLab

1. Wait 5-10 minutes for GitLab to fully start
2. Open browser: `http://192.168.86.29`
3. Set root password on first login
4. Login with username: `root` and your password

### Step 7: Create PXG.STUDIO Repository

1. Create a new group: **PXG.STUDIO**
2. Create a new project: **game-repo** (or your preferred name)
3. Push this repository to GitLab:

```bash
# In your local LUMINES directory
git remote remove origin  # if exists
git remote add origin https://gitlab.com/pxg-studio/game-repo.git
# Or if self-hosted:
git remote add origin http://192.168.86.29/pxg-studio/game-repo.git

git add .
git commit -m "Initial commit: PXG.STUDIO game repository"
git push -u origin main
```

## Performance Optimization for Raspberry Pi 4

### 1. Increase Swap Space

```bash
# Edit swap configuration
sudo nano /etc/dphys-swapfile

# Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=2048
# Save and exit

# Restart swap
sudo dphys-swapfile swapoff
sudo dphys-swapfile swapon
```

### 2. Overclock (Optional, with proper cooling)

```bash
# Edit config
sudo nano /boot/config.txt

# Add these lines (if not present):
over_voltage=2
arm_freq=2000
gpu_freq=750

# Reboot
sudo reboot
```

### 3. GitLab Performance Tuning

Edit `gitlab-docker-compose.yml` and add to `GITLAB_OMNIBUS_CONFIG`:

```yaml
# Reduce worker processes for Raspberry Pi
puma['worker_processes'] = 2
sidekiq['max_concurrency'] = 5
# Disable unnecessary services
prometheus_monitoring['enable'] = false
grafana['enable'] = false
```

## Monitoring

```bash
# Check system resources
htop

# Check Docker containers
docker ps

# Check GitLab logs
docker compose -f ~/gitlab-docker-compose.yml logs -f gitlab

# Check disk usage
df -h
du -sh /mnt/gitlab-storage/gitlab/*
```

## Backup Strategy

```bash
# Create backup script
cat > ~/backup-gitlab.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/mnt/gitlab-storage/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# GitLab backup
docker compose -f ~/gitlab-docker-compose.yml exec -T gitlab gitlab-backup create

# Copy backups
cp -r /mnt/gitlab-storage/gitlab/data/backups/* $BACKUP_DIR/

echo "Backup completed: $DATE"
EOF

chmod +x ~/backup-gitlab.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/pi/backup-gitlab.sh") | crontab -
```

## Troubleshooting

### GitLab won't start
- Check logs: `docker compose -f ~/gitlab-docker-compose.yml logs`
- Verify storage: `df -h /mnt/gitlab-storage`
- Check RAM: `free -h`

### Slow performance
- Increase swap space
- Reduce GitLab worker processes
- Check for disk I/O issues: `iostat -x 1`

### Storage issues
- Verify RAID: `sudo mdadm --detail /dev/md0`
- Check disk health: `sudo smartctl -a /dev/sda`

## Next Steps

1. Complete GitLab setup
2. Configure CI/CD runners
3. Set up repository mirroring (if using GitHub as backup)
4. Configure automated backups
5. Set up monitoring alerts
