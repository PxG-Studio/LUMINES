# Network Configuration for GitLab Server

## Server IP Address

**Primary IP**: `192.168.86.29`

## SSH Access

```bash
ssh ncadmin@192.168.86.29
# Or using hostname:
ssh ncadmin@sbx04.local
```

**Password**: `C0mp0$e2k3!!`

## Static IP Configuration

To configure a static IP address on the Raspberry Pi:

### Method 1: Using netplan (if available)

```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

Add configuration:
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.86.29/24
      gateway4: 192.168.86.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

Apply:
```bash
sudo netplan apply
```

### Method 2: Using dhcpcd (Debian/Raspberry Pi OS)

```bash
sudo nano /etc/dhcpcd.conf
```

Add at the end:
```
interface eth0
static ip_address=192.168.86.29/24
static routers=192.168.86.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

Restart networking:
```bash
sudo systemctl restart dhcpcd
```

## Network Services Ports

| Service | Port | Protocol | Access |
|---------|------|----------|--------|
| SSH | 22 | TCP | Local network |
| HTTP | 80 | TCP | Local network |
| HTTPS | 443 | TCP | Local network (if SSL configured) |
| GitLab SSH | 2222 | TCP | Local network |
| Prometheus | 9090 | TCP | Local network (192.168.0.0/16) |
| Grafana | 3000 | TCP | Local network (192.168.0.0/16) |

## URLs

- **GitLab Web**: `http://192.168.86.29`
- **GitLab SSH**: `git@192.168.86.29` (port 2222)
- **Prometheus**: `http://192.168.86.29:9090`
- **Grafana**: `http://192.168.86.29:3000`

## DNS Configuration (Optional)

If you want to use `gitlab.pxg.studio` instead of IP:

1. Add to `/etc/hosts` on client machines:
   ```
   192.168.86.29 gitlab.pxg.studio
   ```

2. Or configure DNS server to point `gitlab.pxg.studio` to `192.168.86.29`

## Firewall Configuration

UFW firewall rules (configured via `~/setup-firewall.sh`):

- Allow SSH (22)
- Allow HTTP (80)
- Allow HTTPS (443)
- Allow GitLab SSH (2222)
- Allow Prometheus (9090) - restricted to 192.168.0.0/16
- Allow Grafana (3000) - restricted to 192.168.0.0/16

## Network Troubleshooting

### Check IP Configuration
```bash
ip addr show
hostname -I
```

### Test Connectivity
```bash
ping -c 3 192.168.86.1  # Gateway
ping -c 3 8.8.8.8        # Internet
```

### Check DNS Resolution
```bash
nslookup gitlab.pxg.studio
```

### View Network Interfaces
```bash
ip link show
```

### Restart Networking
```bash
sudo systemctl restart networking
# Or
sudo systemctl restart NetworkManager
```

## Git Remote Configuration

When pushing to GitLab, use:

```bash
# HTTP
git remote add origin http://192.168.86.29/pxg-studio/game-repo.git

# SSH (port 2222)
git remote add origin ssh://git@192.168.86.29:2222/pxg-studio/game-repo.git
```

## Next Steps

1. Configure static IP (if not already done)
2. Test SSH access
3. Verify all services are accessible
4. Configure DNS if using domain name
5. Set up port forwarding if accessing from outside local network
