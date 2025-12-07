# Setting Up iSCSI LUN on SBX02 (192.168.86.28)

## Overview

We need to create an iSCSI LUN on SBX02 that will be used as persistent storage for PostgreSQL 11 running on Helios Control/Compute.

## Steps via DSM Web Interface

### Step 1: Access DSM

1. Open web browser
2. Navigate to: `http://192.168.86.28:5000` (or your DSM port)
3. Login as `ncadmin` (or admin user)

### Step 2: Install iSCSI Manager (if not installed)

1. Go to **Package Center**
2. Search for **"iSCSI Manager"**
3. Install if not already installed

### Step 3: Create iSCSI Target

1. Open **iSCSI Manager**
2. Go to **iSCSI Target** tab
3. Click **Create**
4. Configure:
   - **Target Name:** `postgresql-storage`
   - **IQN:** `iqn.2000-01.com.synology:sbx02.postgresql-target` (auto-generated)
   - **Authentication:** None (or CHAP if needed)
5. Click **Next** → **Create**

### Step 4: Create iSCSI LUN

1. Go to **LUN** tab
2. Click **Create** → **Create Block-Level LUN**
3. Configure:
   - **Name:** `postgresql-data`
   - **Location:** `/volume1` (or preferred volume)
   - **Size:** `100GB` (or as needed)
   - **Thin Provisioning:** Yes (recommended)
   - **Description:** `PostgreSQL 11 DR Storage`
4. Click **Next**
5. **iSCSI Target:** Select `postgresql-storage` (created above)
6. Click **Next** → **Create**

### Step 5: Note iSCSI Details

After creation, note:
- **Target IQN:** `iqn.2000-01.com.synology:sbx02.postgresql-target`
- **LUN ID:** Usually `0` or `1`
- **Target Portal:** `192.168.86.28:3260` (default iSCSI port)

### Step 6: Configure Firewall (if needed)

1. Go to **Control Panel** → **Security** → **Firewall**
2. Ensure port **3260** (iSCSI) is allowed
3. Or allow connections from Helios server IPs

## Verification

After setup, verify from Helios server:

```bash
# Install iSCSI initiator tools
sudo apt-get update
sudo apt-get install -y open-iscsi

# Discover targets
sudo iscsiadm -m discovery -t st -p 192.168.86.28

# Should show:
# 192.168.86.28:3260,1 iqn.2000-01.com.synology:sbx02.postgresql-target
```

## Next Steps

Once iSCSI LUN is created:
1. Connect from Helios server
2. Format and mount
3. Use as PersistentVolume in Kubernetes
4. Deploy PostgreSQL 11 container

## Alternative: NFS Share

If iSCSI is not available, we can use NFS instead:
1. Create shared folder on SBX02
2. Enable NFS service
3. Export share to Helios server
4. Mount as NFS volume in Kubernetes
