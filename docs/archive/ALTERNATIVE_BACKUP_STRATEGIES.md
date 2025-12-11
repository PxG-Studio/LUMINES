# Alternative Backup & Replication Strategies

Since streaming replication requires PostgreSQL 11 on SECONDARY (currently has 9.3.25), here are alternative strategies that work with the current setup.

## Strategy 1: Automated pg_dump Backups

### Setup Automated Backups from PRIMARY to SECONDARY

**On PRIMARY (SBX01):**
```bash
# Create backup script
cat > /usr/local/bin/postgres-backup-to-secondary.sh << 'EOF'
#!/bin/bash
PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
BACKUP_DIR="/volume1/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mkdir -p "$BACKUP_DIR"
sudo -u postgres pg_dumpall | gzip > "$BACKUP_DIR/full_backup_$DATE.sql.gz"

# Copy to SECONDARY via SCP
scp "$BACKUP_DIR/full_backup_$DATE.sql.gz" ncadmin@$SECONDARY_IP:/volume1/backups/postgresql/

# Keep only last 7 days locally
find "$BACKUP_DIR" -name "full_backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/postgres-backup-to-secondary.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/postgres-backup-to-secondary.sh") | crontab -
```

**On SECONDARY (SBX02):**
```bash
# Create restore script
cat > /usr/local/bin/postgres-restore.sh << 'EOF'
#!/bin/bash
BACKUP_FILE="$1"
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file.sql.gz>"
  exit 1
fi

# Restore from backup
gunzip -c "$BACKUP_FILE" | sudo -u postgres psql
EOF

chmod +x /usr/local/bin/postgres-restore.sh
```

## Strategy 2: Continuous WAL Archiving

### Archive WAL Files to SECONDARY

**On PRIMARY:**
```bash
# Configure WAL archiving
PG_CONF="/var/services/pgsql/postgresql.conf"

# Add to postgresql.conf
cat >> "$PG_CONF" << 'EOF'
archive_mode = on
archive_command = 'scp %p ncadmin@192.168.86.28:/volume1/wal_archive/%f'
EOF

# Reload configuration
sudo -u postgres psql -c "SELECT pg_reload_conf();"
```

**On SECONDARY:**
```bash
# Create WAL archive directory
mkdir -p /volume1/wal_archive
chown postgres:postgres /volume1/wal_archive
```

## Strategy 3: rsync Data Directory Backup

### Sync PostgreSQL Data Directory

**On PRIMARY:**
```bash
# Create backup script
cat > /usr/local/bin/postgres-rsync-backup.sh << 'EOF'
#!/bin/bash
PRIMARY_DATA="/var/services/pgsql"
SECONDARY_IP="192.168.86.28"
SECONDARY_BACKUP="/volume1/backups/postgresql_data"

# Stop PostgreSQL (briefly for consistent backup)
/usr/syno/bin/synopkg stop pgsql

# Sync data directory
rsync -avz --delete "$PRIMARY_DATA/" ncadmin@$SECONDARY_IP:$SECONDARY_BACKUP/

# Start PostgreSQL
/usr/syno/bin/synopkg start pgsql
EOF

chmod +x /usr/local/bin/postgres-rsync-backup.sh
```

⚠️ **Note:** This requires stopping PRIMARY briefly - use during maintenance windows only.

## Strategy 4: pg_basebackup to Different Location

### Use pg_basebackup to Create Standalone Backup

**On SECONDARY (using PRIMARY's pg_basebackup via SSH):**
```bash
# SSH to PRIMARY and run pg_basebackup, save to SECONDARY
ssh ncadmin@192.168.86.27 "sudo -u postgres PGPASSWORD='Replication2024Secure' pg_basebackup -D /tmp/pg_backup -U replicator -v -P -W -F tar -z"

# Copy backup to SECONDARY
scp -r ncadmin@192.168.86.27:/tmp/pg_backup /volume1/backups/postgresql_basebackup
```

## Strategy 5: Logical Backup with pg_dump (Continuous)

### Continuous Logical Backups

**On PRIMARY:**
```bash
# Create continuous backup script
cat > /usr/local/bin/postgres-continuous-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/volume1/backups/postgresql"
SECONDARY_IP="192.168.86.28"
DATE=$(date +%Y%m%d_%H%M%S)

# Get list of databases
DATABASES=$(sudo -u postgres psql -t -c "SELECT datname FROM pg_database WHERE datistemplate = false;")

# Backup each database
for DB in $DATABASES; do
  sudo -u postgres pg_dump -Fc "$DB" > "$BACKUP_DIR/${DB}_${DATE}.dump"
  scp "$BACKUP_DIR/${DB}_${DATE}.dump" ncadmin@$SECONDARY_IP:/volume1/backups/postgresql/
done

# Cleanup old backups (keep 7 days)
find "$BACKUP_DIR" -name "*.dump" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/postgres-continuous-backup.sh

# Run every 6 hours
(crontab -l 2>/dev/null; echo "0 */6 * * * /usr/local/bin/postgres-continuous-backup.sh") | crontab -
```

## Strategy 6: Use SECONDARY for Manual Backups Only

### Simple Manual Backup Strategy

**On PRIMARY:**
```bash
# Manual backup command
sudo -u postgres pg_dumpall | gzip > /volume1/backups/postgresql_manual_$(date +%Y%m%d).sql.gz

# Copy to SECONDARY manually when needed
scp /volume1/backups/postgresql_manual_*.sql.gz ncadmin@192.168.86.28:/volume1/backups/
```

## Comparison

| Strategy | RTO* | RPO** | Complexity | Automation |
|----------|------|-------|------------|------------|
| pg_dump (automated) | Hours | 24 hours | Low | High |
| WAL Archiving | Minutes | Minutes | Medium | High |
| rsync Data Dir | Minutes | Minutes | Low | Medium |
| pg_basebackup (SSH) | Minutes | Minutes | Medium | Medium |
| Continuous pg_dump | Hours | 6 hours | Low | High |
| Manual Backups | Hours | Days | Very Low | None |

*RTO = Recovery Time Objective (how long to restore)
**RPO = Recovery Point Objective (how much data might be lost)

## Recommended Approach

**For Current Setup:**
1. **Primary:** Automated daily pg_dump backups to SECONDARY
2. **Secondary:** Keep backups for 30 days
3. **Manual:** Weekly full backup verification

**When SECONDARY gets PostgreSQL 11:**
- Switch to streaming replication (already configured on PRIMARY)

## Implementation Script

**Complete backup solution:**
```bash
#!/bin/bash
# /usr/local/bin/postgres-backup-complete.sh
# Comprehensive backup strategy

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
BACKUP_DIR="/volume1/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# 1. Full logical backup
echo "Creating full backup..."
sudo -u postgres pg_dumpall | gzip > "$BACKUP_DIR/full_${DATE}.sql.gz"

# 2. Per-database backups
echo "Creating per-database backups..."
for DB in $(sudo -u postgres psql -t -c "SELECT datname FROM pg_database WHERE datistemplate = false;"); do
  sudo -u postgres pg_dump -Fc "$DB" > "$BACKUP_DIR/${DB}_${DATE}.dump"
done

# 3. Copy to SECONDARY
echo "Copying to SECONDARY..."
scp "$BACKUP_DIR"/*_${DATE}.* ncadmin@$SECONDARY_IP:/volume1/backups/postgresql/

# 4. Cleanup (keep 7 days)
find "$BACKUP_DIR" -name "*_${DATE}.*" -mtime +7 -delete

echo "Backup complete: $DATE"
```

## Summary

✅ **Multiple backup strategies available**
✅ **Can work with current PostgreSQL 9.3 on SECONDARY**
✅ **PRIMARY ready for streaming replication when SECONDARY is upgraded**
✅ **Automated solutions available**

**Choose the strategy that best fits your RTO/RPO requirements!**
