#!/bin/bash
# PRIMARY-setup-ready.sh
# Ready-to-run script for PRIMARY (192.168.86.27, SBX01)
# Run as: sudo bash PRIMARY-setup-ready.sh

set -e

REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-Replication2024!Secure}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PRIMARY PostgreSQL Replication Setup (SBX01)             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find config
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "▶ PostgreSQL Configuration:"
echo "   Data directory: $PG_DATA_DIR"
echo "   Config file: $PG_CONF"
echo "   HBA file: $PG_HBA"
echo ""

# Verify files exist
if [ ! -f "$PG_CONF" ]; then
  echo "❌ postgresql.conf not found at $PG_CONF"
  exit 1
fi

# Backup
echo "▶ Creating backups..."
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
echo "   ✅ Backups created"
echo ""

# Fix listen_addresses (CRITICAL)
echo "▶ Step 1: Configuring listen_addresses..."
sed -i '/listen_addresses/d' "$PG_CONF"
echo "listen_addresses = '*'" >> "$PG_CONF"
echo "   ✅ Set listen_addresses = '*'"
echo ""

# Configure WAL settings
echo "▶ Step 2: Configuring WAL settings for replication..."
sed -i '/^#*wal_level/d' "$PG_CONF"
echo "wal_level = replica" >> "$PG_CONF"
sed -i '/^#*max_wal_senders/d' "$PG_CONF"
echo "max_wal_senders = 3" >> "$PG_CONF"
sed -i '/^#*max_replication_slots/d' "$PG_CONF"
echo "max_replication_slots = 3" >> "$PG_CONF"
echo "   ✅ WAL settings configured"
echo ""

# Configure pg_hba.conf
echo "▶ Step 3: Configuring pg_hba.conf..."
if ! grep -q "192.168.86.0/24" "$PG_HBA" 2>/dev/null; then
  echo "" >> "$PG_HBA"
  echo "# Allow connections from local network" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
  echo "   ✅ Added network access (192.168.86.0/24)"
fi
if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA" 2>/dev/null; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
  echo "   ✅ Added replication entry for 192.168.86.28"
fi
echo ""

# Create replication user
echo "▶ Step 4: Creating replication user..."
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
echo "   ✅ Replication user 'replicator' ready"
echo "   Password: $REPLICATION_PASSWORD"
echo ""

# Create replication slot
echo "▶ Step 5: Creating replication slot..."
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || {
  echo "   ⚠️  Slot may already exist (this is OK)"
}
echo "   ✅ Replication slot 'replica_slot' ready"
echo ""

# Restart PostgreSQL
echo "▶ Step 6: Restarting PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3
echo "   ✅ PostgreSQL stopped"

/usr/syno/bin/synopkg start pgsql
sleep 8
echo "   ✅ PostgreSQL started"
echo ""

# Verify configuration
echo "▶ Step 7: Verifying configuration..."
LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   listen_addresses: $LISTEN"
if [ "$LISTEN" = "*" ]; then
  echo "   ✅ listen_addresses is correct"
else
  echo "   ⚠️  listen_addresses is: $LISTEN (should be *)"
fi

WAL_LEVEL=$(sudo -u postgres psql -t -c "SHOW wal_level;" 2>/dev/null | xargs)
echo "   wal_level: $WAL_LEVEL"
[ "$WAL_LEVEL" = "replica" ] && echo "   ✅ wal_level is correct" || echo "   ⚠️  wal_level should be 'replica'"

# Check if listening
if netstat -tln 2>/dev/null | grep -q ":5432" || ss -tln 2>/dev/null | grep -q ":5432"; then
  echo "   ✅ PostgreSQL is listening on port 5432"
  netstat -tln | grep ":5432" || ss -tln | grep ":5432"
else
  echo "   ⚠️  PostgreSQL may not be listening"
fi

# Test local connection
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Local connection works"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    PRIMARY Setup Complete!                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PRIMARY (SBX01) is now configured for replication"
echo ""
echo "Next steps:"
echo "1. Test connection from SECONDARY:"
echo "   PGPASSWORD='$REPLICATION_PASSWORD' psql -h 192.168.86.27 -U replicator -d postgres -c 'SELECT 1;'"
echo ""
echo "2. If connection works, proceed to configure SECONDARY (192.168.86.28)"
echo ""
echo "⚠️  IMPORTANT: Change the replication password after setup:"
echo "   sudo -u postgres psql -c \"ALTER USER replicator WITH PASSWORD 'YOUR_STRONG_PASSWORD';\""
echo ""
