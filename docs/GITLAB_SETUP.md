# GitLab Setup Guide for PXG.STUDIO

## Overview

This guide covers setting up GitLab on a Raspberry Pi 4 with Argon Eon chassis and 4x 2TB SSDs for hosting the PXG.STUDIO game development repository.

## Hardware Requirements

- **Raspberry Pi 4** (8GB RAM recommended)
- **Argon Eon Chassis** with 4x 2TB SSDs
- **Power Supply**: Official Raspberry Pi 4 power supply (5V, 3A minimum)
- **Storage**: 4x 2TB SSDs in RAID configuration (recommended)

## Operating System Selection

### Recommended: Raspberry Pi OS Lite (64-bit)

**Why Raspberry Pi OS Lite 64-bit:**
- Official, well-supported OS
- Optimized for Raspberry Pi hardware
- Lightweight (no desktop GUI)
- Good compatibility with GitLab
- Active community support

**Alternative: Ubuntu Server 22.04 LTS (64-bit)**
- More enterprise-focused
- Better for Kubernetes if needed later
- Larger package repository
- More RAM usage

**Recommendation**: Start with **Raspberry Pi OS Lite 64-bit** for simplicity and better hardware optimization.

## Installation Steps

### 1. Install Raspberry Pi OS Lite (64-bit)

1. Download Raspberry Pi OS Lite (64-bit) from [raspberrypi.org](https://www.raspberrypi.com/software/)
2. Flash to microSD card using Raspberry Pi Imager
3. Enable SSH and configure WiFi (if needed) during imaging
4. Boot Raspberry Pi

### 2. Initial System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim htop

# Configure hostname
sudo hostnamectl set-hostname pxg-gitlab

# Reboot
sudo reboot
```

### 3. Configure Storage (4x 2TB SSDs)

```bash
# Check connected drives
lsblk

# Create RAID array (RAID 5 for redundancy and performance)
sudo apt install -y mdadm
sudo mdadm --create /dev/md0 --level=5 --raid-devices=4 /dev/sda /dev/sdb /dev/sdc /dev/sdd

# Format RAID array
sudo mkfs.ext4 /dev/md0

# Mount storage
sudo mkdir -p /mnt/gitlab-storage
sudo mount /dev/md0 /mnt/gitlab-storage

# Add to fstab for auto-mount
echo '/dev/md0 /mnt/gitlab-storage ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

### 4. Install Docker and Docker Compose

GitLab requires Docker for easy installation:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install -y docker-compose

# Reboot to apply group changes
sudo reboot
```

### 5. Install GitLab CE

```bash
# Create GitLab data directory on RAID storage
sudo mkdir -p /mnt/gitlab-storage/gitlab/{config,logs,data}

# Set permissions
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
        external_url 'http://YOUR_IP_OR_DOMAIN'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
    ports:
      - '80:80'
      - '443:443'
      - '2222:22'
    volumes:
      - /mnt/gitlab-storage/gitlab/config:/etc/gitlab
      - /mnt/gitlab-storage/gitlab/logs:/var/log/gitlab
      - /mnt/gitlab-storage/gitlab/data:/var/opt/gitlab
    shm_size: '256m'
EOF

# Start GitLab
cd ~
docker-compose -f gitlab-docker-compose.yml up -d
```

### 6. Initial GitLab Configuration

1. Wait 5-10 minutes for GitLab to start
2. Access GitLab at `http://192.168.86.29`
3. Set root password on first login
4. Create PXG.STUDIO group
5. Create repository for game codebase

## GitLab vs GitHub Comparison

### Similarities
- Both support Git repositories
- Both have CI/CD pipelines (GitHub Actions vs GitLab CI/CD)
- Both support merge requests (GitLab) / pull requests (GitHub)
- Both have issue tracking
- Both support webhooks and integrations

### GitLab Advantages for Game Development
- **Self-hosted option** (GitLab CE is free)
- **Built-in CI/CD** (no need for separate services)
- **Container Registry** included
- **Package Registry** for game assets
- **Better for private repositories** (unlimited free private repos)
- **Integrated DevOps** tools

### GitHub Advantages
- Larger community
- More third-party integrations
- Better for open-source projects
- GitHub Actions marketplace

## GitLab CI/CD vs GitHub Actions

**GitLab CI/CD:**
- Configured via `.gitlab-ci.yml` in repository
- Runs on GitLab runners (can be self-hosted)
- Integrated into GitLab interface
- No separate service needed

**GitHub Actions:**
- Configured via `.github/workflows/*.yml`
- Runs on GitHub-hosted or self-hosted runners
- Large marketplace of actions
- Separate from repository management

**For your use case**: GitLab CI/CD is better since you're self-hosting and want everything integrated.

## Communication Between GitLab and GitHub

Yes, they can communicate:

1. **Mirror repositories**: GitLab can mirror to/from GitHub
2. **Webhooks**: Send events between platforms
3. **Git operations**: Standard Git protocol works with both
4. **API integration**: Both have REST APIs

## Recommended Setup for PXG.STUDIO

1. **Primary**: GitLab on Raspberry Pi (self-hosted)
2. **Backup/Mirror**: Optional GitHub mirror for redundancy
3. **CI/CD**: Use GitLab CI/CD (already configured in this repo)
4. **Storage**: RAID 5 on 4x 2TB SSDs for redundancy

## Next Steps

1. Complete GitLab installation
2. Create PXG.STUDIO group on GitLab
3. Push this repository to GitLab
4. Configure CI/CD runners
5. Set up backup strategy

## Troubleshooting

### GitLab takes too long to start
- Increase swap space: `sudo dphys-swapfile swapoff && sudo dphys-swapfile swapon`
- Check available RAM: `free -h`
- Consider using GitLab Lite or reducing services

### Storage issues
- Verify RAID array: `sudo mdadm --detail /dev/md0`
- Check disk health: `sudo smartctl -a /dev/sda`

### Performance issues
- Use SSD storage (you have this!)
- Consider overclocking Raspberry Pi (with proper cooling)
- Monitor resource usage: `htop`

## Resources

- [GitLab CE Documentation](https://docs.gitlab.com/ce/)
- [Raspberry Pi OS Documentation](https://www.raspberrypi.com/documentation/)
- [Docker on Raspberry Pi](https://docs.docker.com/engine/install/debian/)
