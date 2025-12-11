# Base Backup Issue - Permission Error

## Problem

The `pg_basebackup` command is failing with:
```
ERROR: could not open file "./pg_hba.conf.backup.20251206-015344": Permission denied
```

This happens because the PRIMARY setup script created backup files that PostgreSQL cannot read during the base backup process.

## Solution

**Run this on PRIMARY server (SBX01):**

```bash
# Option 1: Fix permissions
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" | xargs)
sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -exec chmod 600 {} \;
sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -exec chown postgres:postgres {} \;

# Option 2: Remove backup files (if safe to do so)
# sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -delete
```

**Or use the script:**
```bash
# Copy script to PRIMARY
cat > /tmp/fix-primary-backup-permissions.sh << 'EOF'
#!/bin/bash
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" | xargs)
sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -exec chmod 600 {} \; 2>/dev/null || true
sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -exec chown postgres:postgres {} \; 2>/dev/null || true
echo "✅ Fixed"
EOF

chmod +x /tmp/fix-primary-backup-permissions.sh
sudo bash /tmp/fix-primary-backup-permissions.sh
```

## After Fixing

Retry the base backup on DR server:
```bash
ssh 192.168.86.115 "sudo docker run --rm --network host -v /mnt/postgresql-data:/backup -e PGPASSWORD='Replication2024Secure' postgres:11 pg_basebackup -h 192.168.86.27 -D /backup/pgdata -U replicator -v -P -Fp -Xs"
```
