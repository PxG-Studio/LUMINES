# Complete PostgreSQL DR Setup Guide

## Current Status

✅ **NFS Mount:** Configured and working
✅ **PostgreSQL Data:** Initialized and ready
⏳ **NFS Permissions:** Need to configure on SBX02
⏳ **PostgreSQL Container:** Waiting for NFS fix
⏳ **Replication:** Ready to configure once PostgreSQL is running

## Step 1: Fix NFS Export on SBX02

### Via DSM Web Interface (Recommended):

1. **Login to SBX02 DSM:** `http://192.168.86.28:5000`
2. **Control Panel** → **Shared Folder** → **pgdata_nfs**
3. **Edit** → **NFS Permissions**
4. Find or create rule for `192.168.86.115`
5. Configure:
   - **Hostname/IP:** `192.168.86.115`
   - **Privilege:** `Read/Write`
   - **Squash:** `No mapping` ⚠️ **CRITICAL**
   - **Security:** `sys`
   - **Enable asynchronous:** Yes
   - **Allow users to access mounted subfolders:** Yes

### Via SSH (Alternative):

```bash
ssh ncadmin@192.168.86.28
sudo bash /tmp/configure-nfs-export.sh
```

Or manually:
```bash
sudo vi /etc/exports
# Add/update line:
/volume1/pgdata_nfs 192.168.86.115(rw,sync,no_root_squash,no_subtree_check)

sudo exportfs -ra
```

## Step 2: Start PostgreSQL Container

Once NFS export is configured:

```bash
ssh 192.168.86.115 "sudo docker restart postgresql-dr"
```

Or if container doesn't exist:
```bash
ssh 192.168.86.115 "sudo docker run -d \
  --name postgresql-dr \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD=Replication2024Secure \
  -v /mnt/postgresql-data/pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  --memory='512m' \
  --memory-swap='512m' \
  --cpus='1.0' \
  postgres:11"
```

Verify it's running:
```bash
ssh 192.168.86.115 "sudo docker exec postgresql-dr pg_isready -U postgres"
```

## Step 3: Configure Replication

Once PostgreSQL is running, set up replication from PRIMARY:

```bash
# Transfer and run replication setup script
scp scripts/setup-postgresql-replication.sh 192.168.86.115:/tmp/
ssh 192.168.86.115 "chmod +x /tmp/setup-postgresql-replication.sh && bash /tmp/setup-postgresql-replication.sh"
```

Or run locally:
```bash
bash scripts/setup-postgresql-replication.sh
```

## Step 4: Verify Replication

```bash
# Check replication status on DR server
ssh 192.168.86.115 "sudo docker exec postgresql-dr psql -U postgres -c \"
SELECT
    client_addr,
    state,
    sync_state,
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS lag_bytes
FROM pg_stat_replication;
\""

# Check if in recovery mode (should return 't')
ssh 192.168.86.115 "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();'"
```

## Troubleshooting

### PostgreSQL Container Keeps Restarting

**Symptom:** Container status shows "Restarting"

**Solution:** NFS export needs `no_root_squash` option. See Step 1.

### Permission Denied Errors

**Symptom:** `chown: changing ownership: Invalid argument`

**Solution:** Configure NFS export with `no_root_squash` (see Step 1).

### Replication Not Working

**Symptom:** `pg_is_in_recovery()` returns `f`

**Check:**
1. PRIMARY PostgreSQL is running and accessible
2. Replication user exists on PRIMARY
3. `pg_hba.conf` allows replication from DR IP
4. `wal_level = replica` on PRIMARY
5. Replication slot exists on PRIMARY

## Architecture Summary

```
PRIMARY (192.168.86.27)
├── PostgreSQL 11
├── Port: 5432
└── Replication → DR Server

DR Server (192.168.86.115)
├── PostgreSQL 11 Container
├── Port: 5432
├── Storage: NFS from SBX02
└── Replication ← PRIMARY

SBX02 (192.168.86.28)
├── NFS Share: /volume1/pgdata_nfs
└── Exported to: 192.168.86.115
```

## Files Created

- `scripts/deploy-postgresql11-nfs.sh` - Deployment script
- `scripts/setup-postgresql-replication.sh` - Replication setup
- `scripts/configure-nfs-export-sbx02.sh` - NFS configuration
- `NFS_SETUP_STATUS.md` - NFS setup status
- `POSTGRESQL_NFS_ISSUE.md` - NFS issue documentation
- `COMPLETE_SETUP_GUIDE.md` - This guide

## Next Steps After Setup

1. ✅ Configure monitoring for replication lag
2. ✅ Set up automated backups
3. ✅ Test failover procedure
4. ✅ Document recovery procedures
5. ✅ Configure alerts for replication issues
