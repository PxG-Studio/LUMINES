# Setting Up iSCSI LUNs on SBX02 (Synology NAS)

## Prerequisites
- Access to Synology DSM web interface
- Admin credentials for SBX02 (192.168.86.28)

## Step-by-Step Guide

### 1. Access Synology DSM
- Open browser: `http://192.168.86.28:5000` (or your configured port)
- Login with admin credentials

### 2. Open Storage Manager
- Go to: **Main Menu** → **Storage Manager**
- Click on **iSCSI LUN** tab

### 3. Create iSCSI LUN

#### Create LUN
1. Click **Create** → **Create LUN**
2. **LUN Settings:**
   - **Name:** `postgresql-data`
   - **Location:** Select volume (e.g., Volume1)
   - **Size:** 100 GB (adjust based on needs)
   - **Thick Provisioning:** ✅ Yes (recommended for performance)
   - **Description:** PostgreSQL 11 persistent storage for Kubernetes

3. Click **Next**

#### Create iSCSI Target
1. **Target Settings:**
   - **Target Name:** `postgresql-target`
   - **IQN:** Auto-generated (note this down - you'll need it!)
     - Example: `iqn.2000-01.com.synology:SBX02.postgresql-target`
   - **Description:** PostgreSQL Kubernetes storage target

2. Click **Next**

#### Configure Authentication
1. **Authentication:**
   - **CHAP:** Recommended for security
   - **CHAP Name:** `postgresql-chap`
   - **CHAP Secret:** Create strong password (note it down)
   - OR **No Authentication:** For testing (less secure)

2. Click **Next**

#### Configure Network
1. **Network:**
   - **Allow access from:**
     - Option 1: `192.168.86.0/24` (entire subnet)
     - Option 2: Specific IPs (microk8s node IPs)
   - **Port:** 3260 (default iSCSI port)

2. Click **Next**

#### Review and Create
1. Review settings
2. Click **Create**

### 4. Note Important Information

After creation, note down:
- **Target IQN:** `iqn.2000-01.com.synology:SBX02.postgresql-target` (example)
- **Target Portal:** `192.168.86.28:3260`
- **LUN Number:** Usually `0` or `1`
- **CHAP Credentials:** (if using CHAP)

### 5. Verify LUN Creation

**In Storage Manager:**
- Go to **iSCSI LUN** tab
- You should see `postgresql-data` LUN
- Status should be **Available**

**In iSCSI Target:**
- Go to **iSCSI Target** tab
- You should see `postgresql-target`
- LUN mapping should show `postgresql-data`

## Command Line Verification (Optional)

```bash
# SSH to SBX02
ssh ncadmin@192.168.86.28

# Check iSCSI service
/usr/syno/bin/synopkg status iscsi

# List iSCSI targets (if command available)
# Note: Synology typically requires DSM for iSCSI management
```

## Next Steps

After creating the iSCSI LUN:

1. **Get the Target IQN:**
   - From DSM: Storage Manager → iSCSI Target → Select target → View IQN
   - Example: `iqn.2000-01.com.synology:SBX02.postgresql-target`

2. **Update Kubernetes manifest:**
   ```bash
   # Edit k8s/postgresql-iscsi-pv.yaml
   # Update the iqn field with your actual IQN
   ```

3. **Proceed with microk8s setup:**
   ```bash
   ./scripts/setup-microk8s-postgresql.sh
   ```

## Troubleshooting

### LUN Not Visible
- Check iSCSI service is running
- Verify network access rules
- Check firewall settings

### Cannot Connect from microk8s Node
- Verify network connectivity: `ping 192.168.86.28`
- Check iSCSI port: `telnet 192.168.86.28 3260`
- Verify IQN is correct
- Check CHAP credentials (if using)

### Permission Issues
- Ensure iSCSI initiator has access
- Check network ACL settings in DSM

## Security Recommendations

1. **Use CHAP Authentication** - More secure than no auth
2. **Restrict Network Access** - Only allow specific IPs if possible
3. **Use Strong Passwords** - For CHAP credentials
4. **Regular Backups** - Backup LUN data regularly

## Summary

✅ Create iSCSI LUN: `postgresql-data` (100GB)
✅ Create iSCSI Target: `postgresql-target`
✅ Note Target IQN for Kubernetes configuration
✅ Configure network access
✅ Ready for microk8s setup!
