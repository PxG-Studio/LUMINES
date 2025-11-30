# Remote Server Fix Instructions (192.168.86.114)

## Quick Fix

SSH into the server and run:

```bash
ssh 192.168.86.114
cd ~/LUMINES/infrastructure/k8s/production/helios-v2/gpu-scheduling/custom-wsl2-device-plugin

# Pull latest changes
git pull origin main

# Run the fix script
./fix-security-vulnerabilities.sh
```

## Alternative: Manual Fix

If the script doesn't work, update manually:

```bash
ssh 192.168.86.114
cd ~/LUMINES/infrastructure/k8s/production/helios-v2/gpu-scheduling/custom-wsl2-device-plugin

# Update golang.org/x/net
go get golang.org/x/net@v0.47.0
go mod tidy
go mod verify

# Verify
go list -m golang.org/x/net
# Should show: golang.org/x/net v0.47.0
```

## Verify Fix

After applying the fix, verify:

```bash
go list -m golang.org/x/net
go mod verify
```

Expected output:
- `golang.org/x/net v0.47.0` (or v0.38.0+)
- `all modules verified`

## Security Issues Fixed

- ✅ **Issue #6**: CVE-2025-22872 (XSS vulnerability)
- ✅ **Issue #5**: CVE-2025-22870 (IPv6 Zone ID proxy bypass)

