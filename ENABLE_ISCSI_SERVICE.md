# Enable iSCSI Service on SBX02

## Current Status

✅ **iSCSI Manager is installed** (per user confirmation)
❌ **iSCSI service is not running** (port 3260 not listening)

## Quick Steps to Enable Service

### Via DSM Web Interface (Recommended)

1. **Open DSM:**
   - URL: `http://192.168.86.28:5000`
   - Login as `ncadmin` (or admin user)

2. **Open iSCSI Manager:**
   - Go to **Main Menu** → **iSCSI Manager**
   - Or search for "iSCSI" in DSM

3. **Enable Service:**
   - Click on **iSCSI Target** tab
   - Look for **"Enable iSCSI service"** button or toggle
   - Click to enable
   - Service should start automatically

4. **Verify Service:**
   - Port 3260 should start listening
   - You should see the iSCSI Manager interface active

### Create Target and LUN

Once service is enabled:

1. **Create iSCSI Target:**
   - Click **Create** → **Create iSCSI Target**
   - **Target Name:** `postgresql-storage`
   - **IQN:** Auto-generated (e.g., `iqn.2000-01.com.synology:sbx02.postgresql-target`)
   - **Authentication:** None (or CHAP if preferred)
   - Click **Next** → **Create**

2. **Create iSCSI LUN:**
   - Go to **LUN** tab
   - Click **Create** → **Create Block-Level LUN**
   - **Name:** `postgresql-data`
   - **Location:** `/volume1` (or preferred volume)
   - **Size:** `100GB` (or as needed)
   - **Thin Provisioning:** Yes (recommended)
   - **Description:** `PostgreSQL 11 DR Storage`
   - Click **Next**
   - **Map to Target:** Select `postgresql-storage`
   - Click **Next** → **Create**

3. **Configure Firewall (if needed):**
   - Go to **Control Panel** → **Security** → **Firewall**
   - Allow port **3260** from `192.168.86.115` (Helios Compute)
   - Or allow from subnet `192.168.86.0/24`

## Verification

After enabling service and creating target/LUN:

```bash
# From Helios Compute, test discovery
ssh 192.168.86.115 "sudo iscsiadm -m discovery -t st -p 192.168.86.28"
```

**Expected output:**
```
192.168.86.28:3260,1 iqn.2000-01.com.synology:sbx02.postgresql-target
```

## Troubleshooting

### Service Won't Start

- Check if iSCSI Manager package is fully installed
- Restart DSM if needed
- Check system logs: **Control Panel** → **Info Center** → **Logs**

### Port 3260 Still Not Listening

- Verify service is enabled in iSCSI Manager
- Check firewall rules
- Restart iSCSI service
- Check for port conflicts

### Cannot Create Target/LUN

- Ensure service is enabled first
- Check available disk space
- Verify user has admin permissions

## Next Steps

Once iSCSI service is running and target/LUN created:

1. ✅ Verify service: `./scripts/check-iscsi-sbx02.sh`
2. ✅ Connect: `./scripts/phase4-setup-iscsi-connection.sh`
3. ✅ Deploy PostgreSQL: `./scripts/phase5-deploy-postgresql11.sh`

## Summary

**Action Required:** Enable iSCSI service via DSM web interface

**Time Estimate:** 2-5 minutes

**After Service Enabled:** Automated scripts will handle the rest!
