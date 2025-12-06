# Next Steps: Complete iSCSI Setup

## Current Status ✅

- ✅ **iSCSI Service:** Running (`iscsitrg-adapter start/running`)
- ✅ **LUN File:** Created (100GB)
- ⏳ **Target/LUN:** Need to be configured (port 3260 won't listen until configured)

## Why Port 3260 Isn't Listening

The iSCSI service is running, but port 3260 won't listen until:
1. At least one iSCSI target is configured
2. At least one LUN is mapped to a target
3. The configuration is activated

## Quick Solution: Use DSM iSCSI Manager

Since configuration files need proper formatting and the service needs to process them:

1. **Open DSM:** `http://192.168.86.28:5000`
2. **Go to iSCSI Manager**
3. **Create Target:**
   - Name: `postgresql-storage`
   - The LUN file already exists at `/volume1/postgresql-data.img`
4. **Create LUN:**
   - Use **Existing File** option
   - Path: `/volume1/postgresql-data.img`
   - Size: 100GB (auto-detected)
   - Map to target: `postgresql-storage`

This will take **2-3 minutes** and will activate port 3260.

## Verification

After creating target/LUN in DSM:

```bash
# Check port 3260
ssh ncadmin@192.168.86.28 "netstat -tln | grep 3260"

# Discover targets
ssh 192.168.86.115 "sudo iscsiadm -m discovery -t st -p 192.168.86.28"
```

## Then Proceed Automatically

Once port 3260 is listening:

```bash
# Phase 4: Automated iSCSI connection
./scripts/phase4-setup-iscsi-connection.sh

# Phase 5: Automated PostgreSQL deployment
./scripts/phase5-deploy-postgresql11.sh
```

## Summary

✅ **Service:** Running
✅ **LUN File:** Ready (100GB)
⏳ **Action:** Create target/LUN via DSM (2-3 minutes)
🚀 **Then:** Automated scripts complete everything else

The hard work is done - just need DSM to create the target/LUN mapping!
