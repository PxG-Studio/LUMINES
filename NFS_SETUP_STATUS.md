# NFS Setup Status - Helios Compute → SBX02

## Completed Steps ✅

1. ✅ **NFS Client Tools Installed**
   - `nfs-common` installed on Helios Compute (192.168.86.115)
   - Already present, no installation needed

2. ✅ **Mount Point Created**
   - Path: `/mnt/postgresql-data`
   - Created successfully

3. ✅ **NFS Share Mounted**
   - Remote: `192.168.86.28:/volume1/pgdata_nfs`
   - Local: `/mnt/postgresql-data`
   - Filesystem: NFS4
   - Status: **Mounted successfully**
   - Available Space: **1.8T** (121G used, 1.7T free)

4. ✅ **Persistent Mount Configured**
   - Added to `/etc/fstab`
   - Options: `nfs4 rw,hard,intr,noatime,vers=4.0`

## Current Issue ⚠️

**Permission Denied** - The NFS export on SBX02 needs to be configured to allow:
- Client IP: `192.168.86.115`
- PostgreSQL container user: UID 999, GID 999

## Next Steps

### On SBX02 (192.168.86.28) - Configure NFS Export:

1. **Via DSM Web Interface:**
   - Control Panel → Shared Folder → `pgdata_nfs`
   - Edit → NFS Permissions
   - Add rule:
     - Hostname/IP: `192.168.86.115`
     - Privilege: `Read/Write`
     - Squash: `No mapping` (or `Map all users to admin`)
     - Security: `sys` (or `krb5` if using Kerberos)

2. **Via SSH (if needed):**
   ```bash
   # Check current NFS exports
   cat /etc/exports

   # Edit exports (if manual configuration needed)
   sudo vi /etc/exports
   # Add: /volume1/pgdata_nfs 192.168.86.115(rw,sync,no_root_squash,no_subtree_check)

   # Reload NFS exports
   sudo exportfs -ra
   ```

### On Helios Compute (192.168.86.115) - Verify Access:

```bash
# Test access as PostgreSQL user (UID 999)
sudo -u \#999 touch /mnt/postgresql-data/test-write.txt
sudo -u \#999 ls -la /mnt/postgresql-data

# If successful, remove test file
sudo -u \#999 rm /mnt/postgresql-data/test-write.txt
```

## PostgreSQL Container Deployment

Once NFS permissions are configured, deploy PostgreSQL 11 container:

```bash
docker run -d \
  --name postgresql-dr \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_INITDB_ARGS="--data-checksums" \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /mnt/postgresql-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  --memory="512m" \
  --memory-swap="512m" \
  postgres:11
```

## Summary

✅ **NFS Client:** Installed and configured
✅ **Mount:** Active and persistent
✅ **Storage:** 1.8T available
⏳ **Permissions:** Need NFS export configuration on SBX02
⏳ **PostgreSQL:** Ready to deploy once permissions are fixed
