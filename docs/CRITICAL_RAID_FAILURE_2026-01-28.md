# CRITICAL: RAID Array Failure on SBX04
**Date:** January 28, 2026  
**Time:** 16:32 UTC  
**Status:** 🔴 CRITICAL - Storage Unavailable

---

## Issue Summary

The RAID 5 array `/dev/md0` on SBX04 is **BROKEN** with all 4 drives marked as **FAILED (F)**. This is causing:
- GitLab container cannot write to storage (Input/output errors)
- GitLab cannot start properly (FATAL: log_location configuration errors)
- All storage operations failing

---

## Current RAID Status

```
md0 : broken raid5 sdd[4](F) sdc[2](F) sdb[1](F) sda[0](F)
      5860147200 blocks super 1.2 level 5, 512k chunk, algorithm 2 [4/0] [____]
```

**All 4 drives marked as FAILED:**
- sda[0](F)
- sdb[1](F)  
- sdc[2](F)
- sdd[4](F)

**Mount Status:**
- Mounted at: `/mnt/gitlab-storage`
- Filesystem: ext4 (rw,relatime,stripe=128)
- Write test: **FAILED** (Input/output error)

---

## Impact

- ❌ GitLab cannot write logs or data
- ❌ GitLab container in restart loop
- ❌ All GitLab operations blocked
- ❌ Storage appears mounted but is not writable

---

## Immediate Actions Required

### 1. Stop GitLab Container
```bash
ssh ncadmin@192.168.86.29
cd ~/gitlab-production
docker-compose stop gitlab
```

### 2. Investigate Drive Status
```bash
# Check if drives are actually accessible
lsblk

# Check SMART status (if available)
sudo smartctl -H /dev/sda
sudo smartctl -H /dev/sdb
sudo smartctl -H /dev/sdc
sudo smartctl -H /dev/sdd

# Check RAID detail
sudo mdadm --detail /dev/md0
```

### 3. Possible Causes

**A) Drive Hardware Failure**
- One or more SSDs actually failed
- Check SMART status and dmesg for hardware errors

**B) Connection Issues**
- USB/SATA cables loose
- Power issues to drives
- Check physical connections

**C) RAID Metadata Corruption**
- RAID superblock corrupted
- May be recoverable with `mdadm --assemble --force`

**D) Kernel/Driver Issues**
- USB storage modules not loaded properly
- Check: `lsmod | grep -E "usb|sata"`

---

## Recovery Options

### Option 1: If Drives Are Actually OK (Metadata Issue)

```bash
# Stop the array
sudo mdadm --stop /dev/md0

# Force assemble (if metadata is recoverable)
sudo mdadm --assemble --force /dev/md0 /dev/sda /dev/sdb /dev/sdc /dev/sdd

# Check status
cat /proc/mdstat
```

### Option 2: If One Drive Failed (RAID 5 Can Recover)

```bash
# Remove failed drive
sudo mdadm --manage /dev/md0 --remove /dev/sdX

# Re-add drive (if it's actually OK)
sudo mdadm --manage /dev/md0 --add /dev/sdX

# Monitor rebuild
watch cat /proc/mdstat
```

### Option 3: If Multiple Drives Failed (Data Loss)

- RAID 5 can only tolerate 1 drive failure
- If 2+ drives failed, data may be lost
- May need to rebuild array from scratch
- **Check backups first!**

---

## Prevention

1. **Monitor RAID health regularly:**
   ```bash
   watch cat /proc/mdstat
   sudo mdadm --detail /dev/md0
   ```

2. **Set up RAID monitoring alerts** (recommended in hotwash)

3. **Regular backups** (already configured, but verify they're working)

---

## Investigation Results

**USB Devices Status:**
- SATA controllers (Pinas) **NOT DETECTED** in `lsusb`
- Only root USB hubs visible
- dmesg shows USB disconnect events for devices 2-2.2, 2-2.4, 1-1

**Root Cause:**
- **Hardware disconnection** - USB devices physically disconnected or power lost
- SATA controllers not receiving power or USB connection broken
- This is a **physical hardware issue**, not software

**Required Actions:**
1. **Physical inspection:**
   - Check USB cables from Pi to Argon Eon chassis
   - Check power supply to Argon Eon
   - Verify all 4 SSDs are properly seated
   - Check for loose connections

2. **After reconnection:**
   - Reboot Pi to re-detect USB devices
   - Verify drives appear: `lsblk`
   - Reassemble RAID: `sudo mdadm --assemble --force /dev/md0 /dev/sda /dev/sdb /dev/sdc /dev/sdd`
   - Check RAID status: `cat /proc/mdstat`
   - Test write: `sudo touch /mnt/gitlab-storage/test && sudo rm /mnt/gitlab-storage/test`

## Next Steps

1. ⏳ **PHYSICAL:** Inspect and reconnect USB/power connections to Argon Eon
2. ⏳ **REBOOT:** Reboot Pi to re-detect USB devices
3. ⏳ **REASSEMBLE:** Reassemble RAID array after drives are detected
4. ⏳ **VERIFY:** Test storage write capability
5. ⏳ **RESTART:** Restart GitLab only after storage is confirmed working

---

**This is a HARDWARE issue requiring physical intervention. GitLab operations are blocked until storage is restored.**
