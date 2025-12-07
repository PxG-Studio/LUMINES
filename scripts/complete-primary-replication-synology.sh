#!/bin/bash
# complete-primary-replication-synology.sh
# Complete PRIMARY server replication setup for Synology
# Run this on PRIMARY (192.168.86.27)

REPLICA_IP="192.168.86.28"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Complete PRIMARY Replication Setup (Synology)           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find PostgreSQL data directory
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "PostgreSQL data directory: $PG_DATA_DIR"

PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "Config file: $PG_CONF"
echo "HBA file: $PG_HBA"

# Step 1: Verify replication user exists
echo ""
echo "▶ Step 1: Checking replication user..."
sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='replicator';" | grep -q 1 && {
  echo "   ✅ Replication user exists"
} || {
  echo "   Creating replication user..."
  sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
  echo "   ✅ Replication user created"
}

# Step 2: Configure postgresql.conf
echo ""
echo "▶ Step 2: Configuring postgresql.conf..."
if [ ! -f "$PG_CONF" ]; then
  echo "   ❌ postgresql.conf not found at $PG_CONF"
  exit 1
fi

# Backup
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d)"

# Update wal_level
if grep -q "^wal_level" "$PG_CONF"; then
  sed -i "s/^wal_level.*/wal_level = replica/" "$PG_CONF"
  echo "   ✅ Updated wal_level = replica"
else
  echo "wal_level = replica" >> "$PG_CONF"
  echo "   ✅ Added wal_level = replica"
fi

# Update max_wal_senders
if grep -q "^max_wal_senders" "$PG_CONF"; then
  sed -i "s/^max_wal_senders.*/max_wal_senders = 3/" "$PG_CONF"
  echo "   ✅ Updated max_wal_senders = 3"
else
  echo "max_wal_senders = 3" >> "$PG_CONF"
  echo "   ✅ Added max_wal_senders = 3"
fi

# Update max_replication_slots
if grep -q "^max_replication_slots" "$PG_CONF"; then
  sed -i "s/^max_replication_slots.*/max_replication_slots = 3/" "$PG_CONF"
  echo "   ✅ Updated max_replication_slots = 3"
else
  echo "max_replication_slots = 3" >> "$PG_CONF"
  echo "   ✅ Added max_replication_slots = 3"
fi

# Step 3: Configure pg_hba.conf
echo ""
echo "▶ Step 3: Configuring pg_hba.conf..."
if [ ! -f "$PG_HBA" ]; then
  echo "   ❌ pg_hba.conf not found at $PG_HBA"
  exit 1
fi

# Backup
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d)"

# Check if entry already exists
if grep -q "replication.*replicator.*$REPLICA_IP" "$PG_HBA"; then
  echo "   ✅ Replication entry already exists"
else
  # Add replication entry
  echo "host    replication     replicator      $REPLICA_IP/32    md5" >> "$PG_HBA"
  echo "   ✅ Added replication entry for $REPLICA_IP"
fi

# Step 4: Verify replication slot
echo ""
echo "▶ Step 4: Checking replication slot..."
sudo -u postgres psql -c "SELECT 1 FROM pg_replication_slots WHERE slot_name='replica_slot';" | grep -q 1 && {
  echo "   ✅ Replication slot 'replica_slot' exists"
} || {
  sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');"
  echo "   ✅ Replication slot created"
}

# Step 5: Restart PostgreSQL (Synology method)
echo ""
echo "▶ Step 5: Restarting PostgreSQL..."
if [ -f /usr/syno/bin/synopkg ]; then
  /usr/syno/bin/synopkg restart pgsql
  sleep 3
  echo "   ✅ PostgreSQL restarted"
else
  echo "   ⚠️  Please restart PostgreSQL manually"
fi

# Step 6: Verify configuration
echo ""
echo "▶ Step 6: Verifying configuration..."
WAL_LEVEL=$(sudo -u postgres psql -t -c "SHOW wal_level;" | xargs)
if [ "$WAL_LEVEL" = "replica" ]; then
  echo "   ✅ wal_level = $WAL_LEVEL"
else
  echo "   ❌ wal_level = $WAL_LEVEL (should be 'replica')"
fi

WAL_SENDERS=$(sudo -u postgres psql -t -c "SHOW max_wal_senders;" | xargs)
if [ "$WAL_SENDERS" -ge 3 ]; then
  echo "   ✅ max_wal_senders = $WAL_SENDERS"
else
  echo "   ⚠️  max_wal_senders = $WAL_SENDERS"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Configuration Complete                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PRIMARY server configured for replication"
echo ""
echo "Next: Go to SECONDARY (192.168.86.28) and run replica setup"
echo ""
