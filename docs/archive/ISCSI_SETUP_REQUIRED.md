# iSCSI Setup Required on SBX02

## Current Status

❌ **iSCSI service is not running on SBX02 (192.168.86.28)**

The iSCSI connection is being refused, which means:
- iSCSI Manager may not be installed
- iSCSI service may not be running
- Port 3260 may be blocked by firewall

## Required Steps

### Step 1: Install iSCSI Manager

1. **Access DSM Web Interface:**
   - Open browser: `http://192.168.86.28:5000`
   - Login as `ncadmin` (or admin user)

2. **Install iSCSI Manager:**
   - Go to **Package Center**
   - Search for **"iSCSI Manager"**
   - Click **Install**
   - Wait for installation to complete

### Step 2: Enable iSCSI Service

1. **Open iSCSI Manager:**
   - Go to **Main Menu** → **iSCSI Manager**
   - Or search for "iSCSI" in DSM

2. **Enable Service:**
   - Go to **iSCSI Target** tab
   - Click **Enable iSCSI service** (if not already enabled)
   - Service should start automatically

### Step 3: Create iSCSI Target

1. **Create Target:**
   - Click **Create** → **Create iSCSI Target**
   - **Target Name:** `postgresql-storage`
   - **IQN:** Auto-generated (e.g., `iqn.2000-01.com.synology:sbx02.postgresql-target`)
   - **Authentication:** None (or CHAP if preferred)
   - Click **Next** → **Create**

### Step 4: Create iSCSI LUN

1. **Create LUN:**
   - Go to **LUN** tab
   - Click **Create** → **Create Block-Level LUN**
   - **Name:** `postgresql-data`
   - **Location:** `/volume1` (or preferred volume)
   - **Size:** `100GB` (or as needed)
   - **Thin Provisioning:** Yes (recommended)
   - **Description:** `PostgreSQL 11 DR Storage`
   - Click **Next**

2. **Map to Target:**
   - **iSCSI Target:** Select `postgresql-storage` (created above)
   - Click **Next** → **Create**

### Step 5: Configure Firewall (if needed)

1. **Allow iSCSI Port:**
   - Go to **Control Panel** → **Security** → **Firewall**
   - Create rule:
     - **Port:** `3260`
     - **Protocol:** TCP
     - **Source IP:** `192.168.86.115` (Helios Compute)
     - **Action:** Allow
   - Or allow from entire subnet: `192.168.86.0/24`

### Step 6: Verify Service

After setup, verify from command line:

```bash
# From SBX02
netstat -tln | grep 3260
# Should show: tcp 0 0 0.0.0.0:3260 0.0.0.0:* LISTEN
```

## Verification

Once iSCSI Manager is installed and configured:

1. **From Helios Compute, test discovery:**
   ```bash
   sudo iscsiadm -m discovery -t st -p 192.168.86.28
   ```

2. **Should see output like:**
   ```
   192.168.86.28:3260,1 iqn.2000-01.com.synology:sbx02.postgresql-target
   ```

3. **Then proceed with Phase 4:**
   ```bash
   ./scripts/phase4-setup-iscsi-connection.sh
   ```

## Troubleshooting

### Port 3260 Not Listening

**Check:**
- iSCSI Manager is installed
- iSCSI service is enabled
- Service is running

**Fix:**
- Install iSCSI Manager from Package Center
- Enable service in iSCSI Manager
- Restart service if needed

### Connection Refused

**Check:**
- Firewall allows port 3260
- Service is running
- Network connectivity

**Fix:**
- Configure firewall rules
- Verify service status
- Check network connectivity

### No Targets Found

**Check:**
- Target is created
- LUN is mapped to target
- Service is running

**Fix:**
- Create target and LUN
- Map LUN to target
- Restart service

## Next Steps

After iSCSI Manager is installed and configured:

1. ✅ Verify service is running
2. ✅ Run Phase 4 script: `./scripts/phase4-setup-iscsi-connection.sh`
3. ✅ Run Phase 5 script: `./scripts/phase5-deploy-postgresql11.sh`
4. ✅ Configure replication

## Summary

**Current Blocker:** iSCSI Manager not installed/running on SBX02

**Action Required:** Install and configure iSCSI Manager via DSM web interface

**Time Estimate:** 10-15 minutes

Once iSCSI is set up, the automated scripts will handle the rest!
