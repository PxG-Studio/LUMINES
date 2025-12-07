# Fix PostgreSQL Replication on Synology NAS

## Current Issue

PostgreSQL is installed as a Synology package, and the script is failing with permission errors.

## Quick Fix - On the NAS

**On the NAS (192.168.86.28)**, run this fixed script:

```bash
cd ~/scripts

# Create the fixed script
cat > fix-postgresql-synology.sh << 'SCRIPTEND'
#!/bin/bash
PRIMARY_IP="192.168.86.27"
DATA_DIR="/volume1/@database/pgsql"

echo "Fixing PostgreSQL replica setup for Synology..."

# Find actual data directory
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "$DATA_DIR")
echo "Data directory: $ACTUAL_DATA_DIR"

# Stop PostgreSQL
/usr/syno/bin/synopkg stop pgsql
sleep 2

# Backup
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" || cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
fi

# Create directory with proper permissions
PARENT_DIR=$(dirname "$ACTUAL_DATA_DIR")
mkdir -p "$PARENT_DIR"
mkdir -p "$ACTUAL_DATA_DIR"

# Set ownership - try different methods
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
echo "⚠️  May need manual ownership fix"

# Perform base backup
echo "Performing base backup (this may take a while)..."
sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo "❌ Backup failed!"
  echo ""
  echo "⚠️  IMPORTANT: Before this can work, you must configure replication on PRIMARY (192.168.86.27):"
  echo ""
  echo "On PRIMARY server, run:"
  echo "  1. sudo -u postgres psql"
  echo "  2. CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'YOUR_PASSWORD';"
  echo "  3. Edit /var/lib/postgresql/14/main/pg_hba.conf:"
  echo "     Add: host replication replicator 192.168.86.28/32 md5"
  echo "  4. Edit /var/lib/postgresql/14/main/postgresql.conf:"
  echo "     Set: wal_level = replica"
  echo "     Set: max_wal_senders = 3"
  echo "  5. Restart PostgreSQL on primary"
  echo ""
  echo "Then retry this script."
  exit 1
}

# Configure recovery
cat > "$ACTUAL_DATA_DIR/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=CHANGE_ME'
primary_slot_name = 'replica_slot'
EOF

sudo -u postgres touch "$ACTUAL_DATA_DIR/standby.signal"
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null

# Start PostgreSQL
/usr/syno/bin/synopkg start pgsql
sleep 3

# Verify
if sudo -u postgres psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "✅ Replication active!"
else
  echo "⚠️  Check replication status manually"
fi
SCRIPTEND

chmod +x fix-postgresql-synology.sh
sudo ./fix-postgresql-synology.sh
```

## Before Running - Configure Primary Server

**CRITICAL**: Before the replica setup can work, you must configure replication on the PRIMARY server (192.168.86.27).

**On PRIMARY server (192.168.86.27)**, run:

```bash
# 1. Create replication user
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';"

# 2. Edit pg_hba.conf
sudo nano /var/lib/postgresql/14/main/pg_hba.conf
# Add this line:
# host    replication     replicator      192.168.86.28/32    md5

# 3. Edit postgresql.conf
sudo nano /var/lib/postgresql/14/main/postgresql.conf
# Ensure these settings:
# wal_level = replica
# max_wal_senders = 3
# max_replication_slots = 3

# 4. Create replication slot
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');"

# 5. Restart PostgreSQL
sudo systemctl restart postgresql
```

## After Primary is Configured

Then on the SECONDARY (192.168.86.28), run the fix script above.
