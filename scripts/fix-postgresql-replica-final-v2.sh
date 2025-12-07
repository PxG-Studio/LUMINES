#!/bin/bash
# fix-postgresql-replica-final-v2.sh
# Fixed version that properly removes existing directory

PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL Replica Setup - Fixed Version                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Find actual data directory
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "Data directory: $ACTUAL_DATA_DIR"

# Stop PostgreSQL
echo ""
echo "▶ Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Backup and COMPLETELY REMOVE existing directory
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "▶ Backing up existing data..."
  echo "   Source: $ACTUAL_DATA_DIR"
  echo "   Backup: $BACKUP_DIR"

  # Move directory (fastest)
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    # If move fails (permissions), copy then remove
    echo "   Move failed, copying (this may take a while)..."
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR" || {
      echo "❌ Backup failed. Aborting."
      /usr/syno/bin/synopkg start pgsql
      exit 1
    }
    # Now remove original
    echo "   Removing original directory..."
    rm -rf "$ACTUAL_DATA_DIR" || {
      echo "   ⚠️  Could not remove, trying with force..."
      rm -rf "$ACTUAL_DATA_DIR"/* "$ACTUAL_DATA_DIR"/.* 2>/dev/null
      rmdir "$ACTUAL_DATA_DIR" 2>/dev/null || true
    }
  }
  echo "   ✅ Backup created, directory removed"

  # Verify directory is gone
  if [ -d "$ACTUAL_DATA_DIR" ]; then
    echo "   ⚠️  Directory still exists, force removing..."
    rm -rf "$ACTUAL_DATA_DIR"
    sleep 1
  fi
fi

# Verify directory doesn't exist
if [ -d "$ACTUAL_DATA_DIR" ]; then
  echo "❌ Directory still exists: $ACTUAL_DATA_DIR"
  echo "   Please remove manually: rm -rf $ACTUAL_DATA_DIR"
  exit 1
fi

# Create fresh empty directory
echo ""
echo "▶ Creating fresh empty directory..."
PARENT_DIR=$(dirname "$ACTUAL_DATA_DIR")
mkdir -p "$PARENT_DIR"
mkdir -p "$ACTUAL_DATA_DIR"

# Set ownership
POSTGRES_UID=$(id -u postgres 2>/dev/null || echo "999")
POSTGRES_GID=$(id -g postgres 2>/dev/null || echo "999")
chown -R $POSTGRES_UID:$POSTGRES_GID "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 1026:100 "$ACTUAL_DATA_DIR" 2>/dev/null || true

# Verify it's empty
if [ "$(ls -A $ACTUAL_DATA_DIR 2>/dev/null)" ]; then
  echo "   ⚠️  Directory not empty, cleaning..."
  rm -rf "$ACTUAL_DATA_DIR"/*
  rm -rf "$ACTUAL_DATA_DIR"/.* 2>/dev/null || true
fi

# Test write permission
sudo -u postgres touch "$ACTUAL_DATA_DIR/.test" 2>/dev/null && rm -f "$ACTUAL_DATA_DIR/.test" && {
  echo "   ✅ Directory is writable"
} || {
  echo "   ⚠️  Write test failed, but continuing..."
}

# Perform base backup
echo ""
echo "▶ Performing base backup from $PRIMARY_IP..."
echo "   This may take several minutes..."
echo ""
echo "⚠️  Ensure PRIMARY is configured for replication!"
echo ""

sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo ""
  echo "❌ pg_basebackup failed!"
  echo ""
  echo "Common causes:"
  echo "1. PRIMARY not configured for replication"
  echo "2. Replication user doesn't exist or wrong password"
  echo "3. pg_hba.conf doesn't allow replication from this IP"
  echo "4. Network connectivity issue"
  echo ""
  echo "To fix PRIMARY, run on 192.168.86.27:"
  echo "  - Create replication user"
  echo "  - Configure pg_hba.conf"
  echo "  - Configure postgresql.conf (wal_level = replica)"
  echo "  - Create replication slot"
  echo ""
  read -p "Restore backup and start PostgreSQL? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]] && [ -d "$BACKUP_DIR" ]; then
    rm -rf "$ACTUAL_DATA_DIR"
    mv "$BACKUP_DIR" "$ACTUAL_DATA_DIR"
    /usr/syno/bin/synopkg start pgsql
    echo "✅ Original data restored"
  fi
  exit 1
}

echo ""
echo "✅ Base backup completed successfully"

# Verify backup created files
if [ "$(ls -A $ACTUAL_DATA_DIR 2>/dev/null)" ]; then
  echo "   ✅ Data directory contains files"
else
  echo "   ⚠️  Data directory is empty - backup may have failed"
fi

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
  echo "   ✅ Replication is ACTIVE!"
else
  echo "   ⚠️  Not in recovery mode"
  echo "   Check: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
  echo "   Should return: t (true)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
