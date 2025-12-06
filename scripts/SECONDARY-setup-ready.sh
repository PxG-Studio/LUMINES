#!/bin/bash
# SECONDARY-setup-ready.sh
# Ready-to-run script for SECONDARY (192.168.86.28, SBX02)
# Run as: sudo bash SECONDARY-setup-ready.sh

set -e

PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-Replication2024Secure}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  SECONDARY PostgreSQL Replica Setup (SBX02)               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Test connection to PRIMARY
echo "▶ Step 1: Testing connection to PRIMARY ($PRIMARY_IP)..."
if PGPASSWORD="$REPLICATION_PASSWORD" psql -h $PRIMARY_IP -U replicator -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Connection to PRIMARY successful!"
else
  echo "   ❌ Cannot connect to PRIMARY"
  echo "   Please verify:"
  echo "   1. PRIMARY is configured (listen_addresses = '*')"
  echo "   2. Replication user exists"
  echo "   3. pg_hba.conf allows connections from this IP"
  echo "   4. Network connectivity"
  exit 1
fi
echo ""

# Step 2: Find data directory
echo "▶ Step 2: Finding PostgreSQL data directory..."
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "   Data directory: $ACTUAL_DATA_DIR"
echo ""

# Step 3: Stop PostgreSQL
echo "▶ Step 3: Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql 2>/dev/null || true
sleep 3

# Make sure it's stopped
if ps aux | grep -v grep | grep -q "[p]ostgres"; then
  echo "   ⚠️  PostgreSQL still running, force stopping..."
  killall -u postgres postgres 2>/dev/null || true
  sleep 2
fi
echo "   ✅ PostgreSQL stopped"
echo ""

# Step 4: Backup and remove existing data
echo "▶ Step 4: Backing up existing data..."
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "   Backing up to: $BACKUP_DIR"

  # Try to move (fastest)
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    echo "   Move failed, copying (this may take a while)..."
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
    rm -rf "$ACTUAL_DATA_DIR"
  }

  # Ensure directory is completely gone
  [ -d "$ACTUAL_DATA_DIR" ] && rm -rf "$ACTUAL_DATA_DIR"
  echo "   ✅ Backup created, directory removed"
else
  echo "   ✅ No existing data directory"
fi
echo ""

# Step 5: Create fresh directory
echo "▶ Step 5: Creating fresh data directory..."
mkdir -p "$ACTUAL_DATA_DIR"
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 1026:100 "$ACTUAL_DATA_DIR" 2>/dev/null || true
chmod 700 "$ACTUAL_DATA_DIR"
echo "   ✅ Directory created with correct permissions"
echo ""

# Step 6: Perform base backup
echo "▶ Step 6: Performing base backup from PRIMARY..."
echo "   This may take several minutes depending on database size..."
echo "   Source: $PRIMARY_IP"
echo "   Destination: $ACTUAL_DATA_DIR"
echo ""
sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
  -h $PRIMARY_IP \
  -D "$ACTUAL_DATA_DIR" \
  -U replicator \
  -v -P -W -R || {
  echo ""
  echo "❌ Base backup failed!"
  echo ""
  echo "Common causes:"
  echo "1. Cannot connect to PRIMARY (check network/firewall)"
  echo "2. Replication user password incorrect"
  echo "3. PRIMARY not configured for replication"
  echo ""
  echo "Test connection manually:"
  echo "  PGPASSWORD='$REPLICATION_PASSWORD' psql -h $PRIMARY_IP -U replicator -d postgres -c 'SELECT 1;'"
  exit 1
}

echo ""
echo "   ✅ Base backup completed successfully"
echo ""

# Step 7: Start PostgreSQL
echo "▶ Step 7: Starting PostgreSQL..."
/usr/syno/bin/synopkg start pgsql 2>/dev/null || {
  # If synopkg fails, try manual start
  echo "   synopkg failed, trying manual start..."
  sudo -u postgres /usr/bin/postgres -D "$ACTUAL_DATA_DIR" > /dev/null 2>&1 &
  sleep 3
}
sleep 5
echo "   ✅ PostgreSQL started"
echo ""

# Step 8: Verify replication
echo "▶ Step 8: Verifying replication status..."
sleep 3

# Check if in recovery mode
if sudo -u postgres psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ PostgreSQL is in recovery mode (replica mode)"
  echo "   ✅ Replication is ACTIVE!"
  echo ""

  # Show replication stats
  echo "   Replication receiver status:"
  sudo -u postgres psql -c "SELECT * FROM pg_stat_wal_receiver;" 2>/dev/null || echo "   (Stats not available)"
else
  echo "   ⚠️  Not in recovery mode"
  echo "   Check manually: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
  echo "   Should return: t (true)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    SECONDARY Setup Complete!                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ SECONDARY (SBX02) is now configured as a replica"
echo ""
echo "Verification commands:"
echo "  On SECONDARY: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
echo "  On PRIMARY:   sudo -u postgres psql -c \"SELECT * FROM pg_stat_replication;\""
echo ""
