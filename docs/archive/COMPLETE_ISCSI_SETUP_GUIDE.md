# Complete iSCSI Setup Guide - Final Steps

## Current Status ✅

- ✅ **LUN File:** Created (100GB at `/volume1/postgresql-data.img`)
- ✅ **Configuration Files:** Structure ready
- ⏳ **Service:** Needs activation

## Complete Setup via DSM (Recommended)

Since sudo password authentication via SSH has limitations, complete via DSM:

### Step 1: Access DSM
1. Open browser: `http://192.168.86.28:5000`
2. Login as `ncadmin`

### Step 2: Open iSCSI Manager
1. Go to **Main Menu** → **iSCSI Manager**
2. Or search for "iSCSI" in DSM

### Step 3: Create iSCSI Target
1. Click **iSCSI Target** tab
2. Click **Create** → **Create iSCSI Target**
3. **Target Name:** `postgresql-storage`
4. **IQN:** Will auto-generate (or use: `iqn.2000-01.com.synology:sbx02.postgresql-storage`)
5. **Authentication:** None
6. Click **Next** → **Create**

### Step 4: Create iSCSI LUN
1. Go to **LUN** tab
2. Click **Create** → **Create Block-Level LUN**
3. **Name:** `postgresql-data`
4. **Location:** `/volume1`
5. **Size:** `100GB`
6. **Thin Provisioning:** Yes
7. Click **Next**
8. **Map to Target:** Select `postgresql-storage`
9. Click **Next** → **Create**

### Step 5: Enable Service
1. Ensure iSCSI service is enabled
2. Service should start automatically

### Step 6: Verify
From Helios Compute:
```bash
sudo iscsiadm -m discovery -t st -p 192.168.86.28
```

Should show:
```
192.168.86.28:3260,1 iqn.2000-01.com.synology:sbx02.postgresql-storage
```

## Alternative: Use Existing LUN File

If you want to use the LUN file we already created:

1. In DSM iSCSI Manager → **LUN** tab
2. Click **Create** → **Create Block-Level LUN**
3. **Name:** `postgresql-data`
4. **Location:** Choose **Existing File**
5. **Path:** `/volume1/postgresql-data.img`
6. **Size:** Will auto-detect (100GB)
7. Map to target `postgresql-storage`

## After iSCSI is Active

Once port 3260 is listening and targets are discoverable:

### Phase 4: Connect to iSCSI
```bash
./scripts/phase4-setup-iscsi-connection.sh
```

This will:
- Discover target
- Connect to iSCSI
- Format device (if needed)
- Mount to `/mnt/postgresql-data`
- Configure auto-mount

### Phase 5: Deploy PostgreSQL 11
```bash
./scripts/phase5-deploy-postgresql11.sh
```

This will:
- Create PostgreSQL 11 container
- Configure minimal memory settings
- Mount iSCSI storage
- Start PostgreSQL 11

### Phase 6: Configure Replication
```bash
./scripts/phase6-configure-replication.sh
```

This will:
- Set up replication from PRIMARY
- Configure WAL replay
- Verify replication

## Quick Verification Commands

```bash
# Check if port 3260 is listening
ssh ncadmin@192.168.86.28 "netstat -tln | grep 3260"

# Discover targets from Helios Compute
ssh 192.168.86.115 "sudo iscsiadm -m discovery -t st -p 192.168.86.28"

# Check iSCSI service status
ssh ncadmin@192.168.86.28 "/usr/syno/bin/synoservice --status iscsitrg"
```

## Summary

✅ **Foundation Complete:**
- LUN file: 100GB created
- Scripts: All ready
- Documentation: Complete

⏳ **Action Required:**
- Complete iSCSI setup via DSM (5-10 minutes)
- Or run script directly on SBX02 with sudo

🚀 **Then Proceed:**
- Phase 4: iSCSI connection (automated)
- Phase 5: PostgreSQL deployment (automated)
- Phase 6: Replication setup (automated)

All automated scripts are ready - just need iSCSI service active!
