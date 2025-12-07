#!/bin/bash
# fix-postgresql-replica-synology.sh
# Fixed PostgreSQL replica setup for Synology NAS - handles existing directory

PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL Replica Setup for Synology NAS                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Find actual data directory
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "Data directory: $ACTUAL_DATA_DIR"

# Check if directory exists and has data
if [ -d "$ACTUAL_DATA_DIR" ] && [ "$(ls -A $ACTUAL_DATA_DIR 2>/dev/null)" ]; then
  echo "⚠️  Data directory exists and contains data"
  echo "   This will be backed up before creating replica"
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Stop PostgreSQL
echo ""
echo "▶ Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Backup existing data
if [ -d "$ACTUAL_DATA_DIR" ] && [ "$(ls -A $ACTUAL_DATA_DIR 2>/dev/null)" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "▶ Backing up existing data to: $BACKUP_DIR"

  # Try move first (faster)
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    # If move fails, try copy
    echo "   Move failed, trying copy (this may take a while)..."
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR" || {
      echo "❌ Backup failed. Aborting."
      /usr/syno/bin/synopkg start pgsql
      exit 1
    }
    # Remove original after successful copy
    rm -rf "$ACTUAL_DATA_DIR"
  }
  echo "   ✅ Backup created"
fi

# Create fresh directory
echo ""
echo "▶ Creating fresh data directory..."
PARENT_DIR=$(dirname "$ACTUAL_DATA_DIR")
mkdir -p "$PARENT_DIR"
mkdir -p "$ACTUAL_DATA_DIR"

# Set ownership - try multiple methods
echo "▶ Setting permissions..."
POSTGRES_UID=$(id -u postgres 2>/dev/null || echo "999")
POSTGRES_GID=$(id -g postgres 2>/dev/null || echo "999")

chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R $POSTGRES_UID:$POSTGRES_GID "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 1026:100 "$ACTUAL_DATA_DIR" 2>/dev/null || {
  echo "   ⚠️  Could not set ownership automatically"
  echo "   Directory: $ACTUAL_DATA_DIR"
  echo "   Postgres UID:GID: $POSTGRES_UID:$POSTGRES_GID"
  echo "   You may need to set ownership manually"
}

# Verify directory is empty and writable
if [ "$(ls -A $ACTUAL_DATA_DIR 2>/dev/null)" ]; then
  echo "   ⚠️  Directory is not empty, cleaning..."
  rm -rf "$ACTUAL_DATA_DIR"/*
  rm -rf "$ACTUAL_DATA_DIR"/.* 2>/dev/null || true
fi

# Test write permissions
sudo -u postgres touch "$ACTUAL_DATA_DIR/.test_write" 2>/dev/null && {
  rm -f "$ACTUAL_DATA_DIR/.test_write"
  echo "   ✅ Directory is writable by postgres user"
} || {
  echo "   ⚠️  Directory may not be writable - checking permissions..."
  ls -ld "$ACTUAL_DATA_DIR"
}

# Perform base backup
echo ""
echo "▶ Performing base backup from $PRIMARY_IP..."
echo "   This may take several minutes depending on database size..."
echo "   Source: $PRIMARY_IP:5432"
echo "   Target: $ACTUAL_DATA_DIR"
echo ""
echo "⚠️  IMPORTANT: Ensure PRIMARY server is configured for replication!"
echo "   If this fails, run configure-primary-for-replication.sh on PRIMARY first"
echo ""

sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo ""
  echo "❌ pg_basebackup failed!"
  echo ""
  echo "Common issues:"
  echo "1. Replication not configured on PRIMARY (192.168.86.27)"
  echo "2. Replication user 'replicator' doesn't exist"
  echo "3. pg_hba.conf doesn't allow replication from this IP"
  echo "4. Wrong password"
  echo "5. Network connectivity issue"
  echo ""
  echo "Before retrying:"
  echo "  1. Run configure-primary-for-replication.sh on PRIMARY (192.168.86.27)"
  echo "  2. Verify replication user exists: sudo -u postgres psql -c \"\\du\""
  echo "  3. Check pg_hba.conf on primary allows: host replication replicator 192.168.86.28/32 md5"
  echo ""
  read -p "Restore backup and start PostgreSQL? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]] && [ -d "$BACKUP_DIR" ]; then
    echo "Restoring backup..."
    rm -rf "$ACTUAL_DATA_DIR"
    mv "$BACKUP_DIR" "$ACTUAL_DATA_DIR"
    /usr/syno/bin/synopkg start pgsql
    echo "✅ Original data restored"
  fi
  exit 1
}

echo ""
echo "✅ Base backup completed successfully"

# Configure recovery (pg_basebackup -R should have done this, but verify)
if [ ! -f "$ACTUAL_DATA_DIR/postgresql.auto.conf" ]; then
  echo "▶ Configuring recovery settings..."
  cat > "$ACTUAL_DATA_DIR/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=$REPLICATION_PASSWORD'
primary_slot_name = 'replica_slot'
EOF
fi

# Ensure standby.signal exists
if [ ! -f "$ACTUAL_DATA_DIR/standby.signal" ]; then
  sudo -u postgres touch "$ACTUAL_DATA_DIR/standby.signal" || touch "$ACTUAL_DATA_DIR/standby.signal"
fi

# Ensure correct ownership
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R $POSTGRES_UID:$POSTGRES_GID "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || true

# Start PostgreSQL
echo ""
echo "▶ Starting PostgreSQL..."
/usr/syno/bin/synopkg start pgsql
sleep 5

# Verify replication
echo ""
echo "▶ Verifying replication status..."
sleep 2
if sudo -u postgres psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ PostgreSQL is in recovery mode (replica mode)"
  echo "   ✅ Replication is active!"

  # Check replication lag
  echo ""
  echo "▶ Checking replication lag..."
  sudo -u postgres psql -h $PRIMARY_IP -U postgres -c "SELECT client_addr, state, sync_state, pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS lag_bytes FROM pg_stat_replication WHERE client_addr = '$REPLICA_IP';" 2>/dev/null || {
    echo "   ⚠️  Could not check replication lag from primary"
  }
else
  echo "   ⚠️  PostgreSQL may not be in replica mode"
  echo "   Check manually: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
  echo "   Should return: t (true)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL replica configured"
echo ""
echo "Next steps:"
echo "1. Verify replication: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
echo "2. Check lag from primary: sudo -u postgres psql -h $PRIMARY_IP -U postgres -c \"SELECT * FROM pg_stat_replication;\""
echo "3. Continue with Redis, NATS, and Registry setup"
echo ""
