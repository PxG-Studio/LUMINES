# Phase 4: iSCSI Connection Automation

## Overview

The `phase4-setup-iscsi-connection.sh` script automates the complete iSCSI connection process from Helios Compute to SBX02.

## What It Does

### Step-by-Step Process

1. **Verifies Prerequisites**
   - Checks connectivity to Helios Compute
   - Checks connectivity to SBX02
   - Verifies iSCSI tools are installed

2. **Discovers iSCSI Targets**
   - Searches for targets on SBX02 (192.168.86.28)
   - Extracts Target IQN automatically
   - Handles manual input if needed

3. **Manages Existing Connections**
   - Checks for existing iSCSI sessions
   - Optionally disconnects and reconnects

4. **Connects to iSCSI Target**
   - Logs into the iSCSI target
   - Waits for device to appear

5. **Finds iSCSI Device**
   - Automatically detects the device
   - Uses multiple detection methods
   - Handles manual input if needed

6. **Checks Mount Status**
   - Detects if device is already mounted
   - Optionally unmounts and remounts

7. **Formats Device (if needed)**
   - Checks for existing filesystem
   - Prompts before formatting
   - Formats as ext4 if needed

8. **Creates Mount Point**
   - Creates `/mnt/postgresql-data`
   - Sets proper permissions

9. **Mounts Device**
   - Mounts iSCSI device to mount point
   - Verifies mount success

10. **Sets Permissions**
    - Sets ownership for PostgreSQL (UID 999)
    - Configures proper permissions

11. **Configures Auto-Mount**
    - Adds entry to `/etc/fstab`
    - Uses UUID for reliability
    - Configures `_netdev` option

12. **Configures Auto-Login**
    - Sets iSCSI to auto-login on boot
    - Ensures connection survives reboots

13. **Verifies Setup**
    - Checks mount status
    - Verifies disk space
    - Confirms permissions

## Usage

### Prerequisites

1. **iSCSI LUN must be created on SBX02:**
   - Target: `postgresql-storage`
   - LUN: `postgresql-data` (100GB)
   - See: `scripts/setup-iscsi-sbx02.md`

2. **iSCSI tools installed:**
   - Run: `./scripts/phase3-install-iscsi.sh`

### Run the Script

```bash
./scripts/phase4-setup-iscsi-connection.sh
```

### Interactive Prompts

The script will prompt you for:
- **Format device?** - Only if no filesystem detected
- **Disconnect existing?** - If already connected
- **Unmount existing?** - If already mounted
- **Target IQN** - If auto-discovery fails
- **Device name** - If auto-detection fails

## Output

### Success Output

```
✅ iSCSI storage is ready for PostgreSQL 11!

Summary:
  - Target IQN: iqn.2000-01.com.synology:sbx02.postgresql-target
  - Device: /dev/sdb
  - Mount point: /mnt/postgresql-data
  - Filesystem: ext4
  - Auto-mount: Configured
  - Auto-login: Configured
```

### Error Handling

The script handles:
- Missing iSCSI targets
- Connection failures
- Device detection issues
- Mount failures
- Permission problems

## Troubleshooting

### No Targets Found

```
❌ No iSCSI targets found on SBX02
```

**Solution:**
1. Verify iSCSI Manager is installed on SBX02
2. Check Target is created and LUN is mapped
3. Verify firewall allows port 3260
4. Check network connectivity

### Connection Failed

```
❌ Failed to connect to iSCSI target
```

**Solution:**
1. Verify Target IQN is correct
2. Check LUN is mapped to target
3. Verify firewall rules
4. Check iSCSI service on SBX02

### Device Not Found

```
❌ Could not find iSCSI device
```

**Solution:**
1. Wait a few seconds after connection
2. Check `lsblk` output manually
3. Verify device appears in `/dev/disk/by-path/`
4. Provide device name manually when prompted

## Next Steps

After successful iSCSI connection:

1. **Deploy PostgreSQL 11:**
   ```bash
   ./scripts/phase5-deploy-postgresql11.sh
   ```

2. **Configure Replication:**
   ```bash
   ./scripts/phase6-configure-replication.sh
   ```

## Files

- **Script:** `scripts/phase4-setup-iscsi-connection.sh`
- **Guide:** `scripts/setup-iscsi-sbx02.md`
- **Master Script:** `scripts/MASTER_SETUP_SCRIPT.sh`

## Summary

✅ **Fully automated** iSCSI connection setup
✅ **Error handling** for common issues
✅ **Auto-configuration** for boot persistence
✅ **Interactive prompts** for safety
✅ **Comprehensive verification** at each step

This script makes the iSCSI setup process completely automated and reliable!
