# PostgreSQL NFS Deployment Issue

## Current Status

✅ **NFS Mount:** Working correctly
✅ **Data Copied:** PostgreSQL data successfully copied to NFS
❌ **PostgreSQL Startup:** Failing due to chown operations on NFS

## Problem

PostgreSQL's Docker entrypoint script attempts to `chown` files in the data directory to ensure proper ownership (UID 999, GID 999). However, NFS exports typically don't allow chown operations unless specifically configured.

The container is restarting because PostgreSQL cannot change file ownership on the NFS mount.

## Solution: Configure NFS Export on SBX02

### Option 1: Via DSM Web Interface (Recommended)

1. **Control Panel** → **Shared Folder** → **pgdata_nfs**
2. **Edit** → **NFS Permissions**
3. Find the rule for `192.168.86.115`
4. **Edit** the rule and change:
   - **Squash:** Change from `Map all users to admin` to `No mapping`
   - OR enable **Allow users to access mounted subfolders**

### Option 2: Via SSH on SBX02

```bash
# Edit NFS exports
sudo vi /etc/exports

# Ensure the line looks like this:
/volume1/pgdata_nfs 192.168.86.115(rw,sync,no_root_squash,no_subtree_check)

# Reload exports
sudo exportfs -ra
```

## Alternative: Use Local Storage First, Then Copy

If NFS configuration cannot be changed, we can:

1. Initialize PostgreSQL on local storage
2. Configure replication
3. Use `pg_basebackup` to create replica on NFS (which doesn't require chown)

## Next Steps

Once NFS export is configured to allow chown:

1. Restart the PostgreSQL container:
   ```bash
   ssh 192.168.86.115 "sudo docker restart postgresql-dr"
   ```

2. Verify PostgreSQL is running:
   ```bash
   ssh 192.168.86.115 "sudo docker exec postgresql-dr pg_isready -U postgres"
   ```

3. Configure replication from PRIMARY (192.168.86.27)

## Current Container Status

- **Container:** `postgresql-dr`
- **Status:** Restarting (chown errors)
- **Data Location:** `/mnt/postgresql-data/pgdata` (NFS)
- **Port:** 5432
