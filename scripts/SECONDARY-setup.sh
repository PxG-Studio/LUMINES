#!/bin/bash
# SECONDARY-setup.sh
# Run this on SECONDARY (192.168.86.28) as root

set -e

PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-Replication2024!Secure}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  SECONDARY PostgreSQL Replica Setup                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find data directory
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "Data directory: $ACTUAL_DATA_DIR"

# Stop PostgreSQL
echo ""
echo "▶ Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Backup and remove existing directory
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "▶ Backing up existing data to: $BACKUP_DIR"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    echo "   Move failed, copying (this may take a while)..."
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
    rm -rf "$ACTUAL_DATA_DIR"
  }
  # Ensure it's completely gone
  [ -d "$ACTUAL_DATA_DIR" ] && rm -rf "$ACTUAL_DATA_DIR"
  echo "✅ Backup created, directory removed"
fi

# Create fresh directory
echo ""
echo "▶ Creating fresh data directory..."
mkdir -p "$ACTUAL_DATA_DIR"
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 1026:100 "$ACTUAL_DATA_DIR" 2>/dev/null || true
chmod 700 "$ACTUAL_DATA_DIR"
echo "✅ Directory created with correct permissions"

# Perform base backup
echo ""
echo "▶ Performing base backup from $PRIMARY_IP..."
echo "   This may take several minutes..."
echo "   Password: $REPLICATION_PASSWORD"
echo ""
sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo ""
  echo "❌ Base backup failed!"
  echo ""
  echo "Common causes:"
  echo "1. PRIMARY not configured for replication"
  echo "2. Cannot connect to PRIMARY (check network/firewall)"
  echo "3. Wrong replication password"
  echo ""
  echo "Test connection:"
  echo "  PGPASSWORD='$REPLICATION_PASSWORD' psql -h $PRIMARY_IP -U replicator -d postgres -c 'SELECT 1;'"
  exit 1
}

echo ""
echo "✅ Base backup completed successfully"

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
  echo "✅ PostgreSQL is in recovery mode (replica mode)"
  echo "✅ Replication is ACTIVE!"

  # Show replication stats
  echo ""
  echo "Replication status:"
  sudo -u postgres psql -c "SELECT * FROM pg_stat_wal_receiver;" 2>/dev/null || echo "Stats not available"
else
  echo "⚠️  Not in recovery mode"
  echo "   Check: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    SECONDARY Setup Complete                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
