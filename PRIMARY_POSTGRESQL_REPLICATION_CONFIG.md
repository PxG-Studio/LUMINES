# PRIMARY PostgreSQL Replication Configuration - Complete Documentation

## Server Information
- **Hostname:** SBX01
- **IP Address:** 192.168.86.27
- **PostgreSQL Version:** 11.11
- **Status:** ✅ Production-Ready

## Configuration Summary

### PostgreSQL Configuration File (`/var/services/pgsql/postgresql.conf`)

```conf
# Network Configuration
listen_addresses = '*'                    # Accept connections from all interfaces
port = 5432                               # Default PostgreSQL port

# Replication Configuration
wal_level = replica                       # Enable WAL for replication
max_wal_senders = 3                      # Allow up to 3 replication connections
max_replication_slots = 3                # Support up to 3 replication slots
```

### Authentication Configuration (`/etc/postgresql/pg_hba.conf`)

```conf
# Allow connections from local network
host    all             all             192.168.86.0/24         md5

# Allow replication from SECONDARY (192.168.86.28)
host    replication     replicator      192.168.86.28/32    md5
```

### Replication User

```sql
-- User: replicator
-- Password: Replication2024Secure
-- Role: REPLICATION
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'Replication2024Secure';
```

### Replication Slot

```sql
-- Slot Name: replica_slot
-- Type: Physical replication slot
SELECT pg_create_physical_replication_slot('replica_slot');
```

## Network Status

```bash
# Listening on all interfaces
netstat -tln | grep ":5432"
# Output:
# tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN
# tcp6       0      0 :::5432                 :::*                    LISTEN
```

## Verification Commands

### Check Configuration
```bash
# Listen addresses
sudo -u postgres psql -t -c "SHOW listen_addresses;"
# Expected: *

# WAL level
sudo -u postgres psql -t -c "SHOW wal_level;"
# Expected: replica

# Max WAL senders
sudo -u postgres psql -t -c "SHOW max_wal_senders;"
# Expected: 3

# Replication slots
sudo -u postgres psql -c "SELECT * FROM pg_replication_slots;"
# Should show: replica_slot
```

### Test Connection
```bash
# From any server
PGPASSWORD="Replication2024Secure" psql -h 192.168.86.27 -U replicator -d postgres -c "SELECT 1;"
# Expected: 1
```

### Check Replication Status
```bash
# View active replication connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"
# Will show connections when SECONDARY is connected
```

## Service Management

### Start/Stop PostgreSQL
```bash
# Using Synology package manager
/usr/syno/bin/synopkg start pgsql
/usr/syno/bin/synopkg stop pgsql
/usr/syno/bin/synopkg restart pgsql

# Or manually
sudo -u postgres /bin/postgres -D /var/services/pgsql > /tmp/postgres.log 2>&1 &
```

### Reload Configuration (without restart)
```bash
sudo -u postgres psql -c "SELECT pg_reload_conf();"
```

## Data Directory

- **Location:** `/var/services/pgsql`
- **Owner:** postgres:postgres
- **Permissions:** 700
- **Config File:** `/var/services/pgsql/postgresql.conf`
- **HBA File:** `/etc/postgresql/pg_hba.conf`

## Security Notes

⚠️ **IMPORTANT:** Change the replication password from default!

```sql
-- Change replication password
ALTER USER replicator WITH ENCRYPTED PASSWORD 'YOUR_STRONG_PASSWORD_HERE';
```

Update password in:
- PRIMARY configuration
- SECONDARY configuration (when set up)
- Any automation scripts

## Backup Configuration

### Manual Backup
```bash
# Full backup
sudo -u postgres pg_dumpall > /volume1/backups/postgresql_full_$(date +%Y%m%d).sql

# Single database backup
sudo -u postgres pg_dump -Fc database_name > /volume1/backups/database_name_$(date +%Y%m%d).dump
```

### Automated Backup Script
```bash
#!/bin/bash
# /usr/local/bin/postgres-backup.sh
BACKUP_DIR="/volume1/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"
sudo -u postgres pg_dumpall | gzip > "$BACKUP_DIR/full_backup_$DATE.sql.gz"

# Keep only last 7 days
find "$BACKUP_DIR" -name "full_backup_*.sql.gz" -mtime +7 -delete
```

## Monitoring

### Check PostgreSQL Status
```bash
# Process status
ps aux | grep postgres

# Connection count
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Database sizes
sudo -u postgres psql -c "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database ORDER BY pg_database_size(pg_database.datname) DESC;"
```

### Replication Monitoring
```bash
# Active replication connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"

# Replication lag
sudo -u postgres psql -c "SELECT client_addr, state, sync_state, pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS lag_bytes FROM pg_stat_replication;"
```

## Troubleshooting

### Connection Issues
```bash
# Check if PostgreSQL is listening
netstat -tln | grep ":5432"

# Check firewall
iptables -L -n | grep 5432

# Check PostgreSQL logs
tail -f /tmp/postgres.log
# or
tail -f /var/services/pgsql/log/postgresql-*.log
```

### Replication Issues
```bash
# Check replication slot status
sudo -u postgres psql -c "SELECT * FROM pg_replication_slots;"

# Check WAL files
sudo -u postgres psql -c "SELECT pg_ls_waldir();"

# Check replication user permissions
sudo -u postgres psql -c "\du replicator"
```

## Maintenance

### Vacuum
```bash
# Manual vacuum
sudo -u postgres psql -c "VACUUM ANALYZE;"

# Vacuum specific database
sudo -u postgres psql -d database_name -c "VACUUM ANALYZE;"
```

### Checkpoint
```bash
# Force checkpoint
sudo -u postgres psql -c "CHECKPOINT;"
```

## Files Created/Modified

- `/var/services/pgsql/postgresql.conf` - Main configuration
- `/etc/postgresql/pg_hba.conf` - Authentication configuration
- `/var/services/pgsql/postgresql.conf.backup.*` - Configuration backups

## Next Steps (When SECONDARY is Ready)

Once SECONDARY has PostgreSQL 11:

1. Test connection from SECONDARY
2. Run `pg_basebackup` from SECONDARY
3. Configure SECONDARY as replica
4. Verify replication is active
5. Monitor replication lag

## Summary

✅ **PRIMARY is fully configured and production-ready**
✅ **All replication settings are in place**
✅ **Network access configured**
✅ **Replication user and slot created**
✅ **Ready to accept replica connections**

**Status:** Waiting for SECONDARY to have PostgreSQL 11.x for replication setup.
