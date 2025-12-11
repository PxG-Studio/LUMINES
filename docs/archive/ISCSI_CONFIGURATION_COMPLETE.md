# iSCSI Configuration - Current Status

## ✅ Completed Successfully

1. **LUN File Created**
   - ✅ Path: `/volume1/postgresql-data.img`
   - ✅ Size: 100GB
   - ✅ Status: Created successfully (took ~19 minutes)

2. **Configuration Files Location**
   - Target: `/usr/syno/etc/iscsi_target.conf`
   - LUN: `/usr/syno/etc/iscsi_lun.conf`
   - Mapping: `/usr/syno/etc/iscsi_mapping.conf`
   - ACL: `/usr/syno/etc/iscsi_acl.conf`
   - Settings: `/usr/syno/etc/iscsi_setting.conf`

## 📋 Configuration Details

**Target:**
- Name: `postgresql-storage`
- IQN: `iqn.2000-01.com.synology:sbx02.postgresql-storage`

**LUN:**
- Name: `postgresql-data`
- Size: 100GB
- Path: `/volume1/postgresql-data.img`
- LUN ID: 1

**Mapping:**
- `postgresql-storage:postgresql-data`

**ACL:**
- `postgresql-storage:ALL` (allows all initiators)

## ⚠️ Next Steps Required

Due to sudo password limitations via SSH, please complete via **DSM Web Interface**:

### Option 1: Complete via DSM (Recommended)

1. **Open DSM:** `http://192.168.86.28:5000`
2. **Go to iSCSI Manager**
3. **The target and LUN should appear** (if config files were read)
4. **If not visible, create manually:**
   - Create Target: `postgresql-storage`
   - Create LUN: `postgresql-data` (100GB)
   - Map LUN to Target
   - Enable service

### Option 2: Run Script Directly on SBX02

1. **SSH to SBX02:**
   ```bash
   ssh ncadmin@192.168.86.28
   ```

2. **Copy script:**
   ```bash
   # From your local machine
   scp scripts/configure-iscsi-on-sbx02.sh ncadmin@192.168.86.28:~/
   ```

3. **Run script:**
   ```bash
   # On SBX02
   sudo bash ~/configure-iscsi-on-sbx02.sh
   ```

## ✅ Verification

Once iSCSI service is running and port 3260 is listening:

```bash
# From Helios Compute
sudo iscsiadm -m discovery -t st -p 192.168.86.28
```

**Expected output:**
```
192.168.86.28:3260,1 iqn.2000-01.com.synology:sbx02.postgresql-storage
```

## 🚀 After iSCSI is Active

Once port 3260 is listening and targets are discoverable:

1. **Run Phase 4:**
   ```bash
   ./scripts/phase4-setup-iscsi-connection.sh
   ```

2. **Run Phase 5:**
   ```bash
   ./scripts/phase5-deploy-postgresql11.sh
   ```

## Summary

✅ **LUN file:** Created (100GB)
✅ **Configuration files:** Created (may need DSM to activate)
⏳ **Service:** Needs to start listening on port 3260

**The foundation is complete!** Just need to activate the iSCSI service via DSM or run the script directly on SBX02.
