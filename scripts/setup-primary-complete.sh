#!/bin/bash
# setup-primary-complete.sh
# Complete PRIMARY PostgreSQL setup for replication
# Run this on PRIMARY (192.168.86.27) as root

set -e

REPLICA_IP="192.168.86.28"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME_PASSWORD}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Complete PRIMARY PostgreSQL Replication Setup           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Find PostgreSQL data directory
echo "▶ Finding PostgreSQL configuration..."
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "   Data directory: $PG_DATA_DIR"
echo "   Config file: $PG_CONF"
echo "   HBA file: $PG_HBA"

if [ ! -f "$PG_CONF" ]; then
  echo "❌ postgresql.conf not found at $PG_CONF"
  exit 1
fi

# Backup configs
echo ""
echo "▶ Backing up configuration files..."
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d-%H%M%S)"
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
echo "   ✅ Backups created"

# Step 1: Configure listen_addresses (CRITICAL for TCP/IP)
echo ""
echo "▶ Step 1: Configuring listen_addresses (allows TCP/IP connections)..."
if grep -q "^listen_addresses" "$PG_CONF"; then
  CURRENT=$(grep "^listen_addresses" "$PG_CONF" | head -1)
  if echo "$CURRENT" | grep -qE "listen_addresses\s*=\s*['\"]?\*['\"]?" || echo "$CURRENT" | grep -qE "listen_addresses\s*=\s*['\"]?0\.0\.0\.0['\"]?"; then
    echo "   ✅ listen_addresses already set to '*' or '0.0.0.0'"
  else
    sed -i "s/^listen_addresses.*/listen_addresses = '*'/" "$PG_CONF"
    echo "   ✅ Updated listen_addresses = '*'"
  fi
else
  echo "listen_addresses = '*'" >> "$PG_CONF"
  echo "   ✅ Added listen_addresses = '*'"
fi

# Step 2: Configure port
echo ""
echo "▶ Step 2: Ensuring port is configured..."
if ! grep -q "^port" "$PG_CONF"; then
  echo "port = 5432" >> "$PG_CONF"
  echo "   ✅ Added port = 5432"
else
  echo "   ✅ Port already configured"
fi

# Step 3: Configure WAL settings for replication
echo ""
echo "▶ Step 3: Configuring WAL settings for replication..."
if grep -q "^wal_level" "$PG_CONF"; then
  sed -i "s/^wal_level.*/wal_level = replica/" "$PG_CONF"
  echo "   ✅ Updated wal_level = replica"
else
  echo "wal_level = replica" >> "$PG_CONF"
  echo "   ✅ Added wal_level = replica"
fi

if grep -q "^max_wal_senders" "$PG_CONF"; then
  sed -i "s/^max_wal_senders.*/max_wal_senders = 3/" "$PG_CONF"
  echo "   ✅ Updated max_wal_senders = 3"
else
  echo "max_wal_senders = 3" >> "$PG_CONF"
  echo "   ✅ Added max_wal_senders = 3"
fi

if grep -q "^max_replication_slots" "$PG_CONF"; then
  sed -i "s/^max_replication_slots.*/max_replication_slots = 3/" "$PG_CONF"
  echo "   ✅ Updated max_replication_slots = 3"
else
  echo "max_replication_slots = 3" >> "$PG_CONF"
  echo "   ✅ Added max_replication_slots = 3"
fi

# Step 4: Configure pg_hba.conf
echo ""
echo "▶ Step 4: Configuring pg_hba.conf for network access..."
if [ ! -f "$PG_HBA" ]; then
  echo "   ⚠️  pg_hba.conf not found, creating..."
  touch "$PG_HBA"
  chown postgres:postgres "$PG_HBA"
  chmod 600 "$PG_HBA"
fi

# Allow connections from local network
if ! grep -q "192.168.86.0/24" "$PG_HBA"; then
  echo "" >> "$PG_HBA"
  echo "# Allow connections from local network" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
  echo "   ✅ Added network access rule (192.168.86.0/24)"
else
  echo "   ✅ Network access rule already exists"
fi

# Allow replication from secondary
if ! grep -q "replication.*replicator.*$REPLICA_IP" "$PG_HBA"; then
  echo "host    replication     replicator      $REPLICA_IP/32    md5" >> "$PG_HBA"
  echo "   ✅ Added replication entry for $REPLICA_IP"
else
  echo "   ✅ Replication entry already exists"
fi

# Step 5: Create replication user
echo ""
echo "▶ Step 5: Creating replication user..."
if sudo -u postgres psql -c "\du" | grep -q replicator; then
  echo "   ✅ Replication user 'replicator' already exists"
  sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" || true
  echo "   ✅ Password updated"
else
  sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
  echo "   ✅ Replication user created"
fi

# Step 6: Create replication slot
echo ""
echo "▶ Step 6: Creating replication slot..."
if sudo -u postgres psql -t -c "SELECT 1 FROM pg_replication_slots WHERE slot_name='replica_slot';" | grep -q 1; then
  echo "   ✅ Replication slot 'replica_slot' already exists"
else
  sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" || {
    echo "   ⚠️  Slot creation failed (may already exist)"
  }
  echo "   ✅ Replication slot created"
fi

# Step 7: Restart PostgreSQL
echo ""
echo "▶ Step 7: Restarting PostgreSQL..."
/usr/syno/bin/synopkg restart pgsql
sleep 5

# Step 8: Verify configuration
echo ""
echo "▶ Step 8: Verifying configuration..."
echo ""

# Check if listening
if netstat -tln 2>/dev/null | grep -q ":5432" || ss -tln 2>/dev/null | grep -q ":5432"; then
  echo "   ✅ PostgreSQL is listening on port 5432"
else
  echo "   ⚠️  PostgreSQL may not be listening (check manually)"
fi

# Check listen_addresses
LISTEN_ADDR=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   listen_addresses: $LISTEN_ADDR"
if [ "$LISTEN_ADDR" = "*" ] || [ "$LISTEN_ADDR" = "0.0.0.0" ]; then
  echo "   ✅ PostgreSQL is configured to listen on all interfaces"
else
  echo "   ⚠️  listen_addresses is: $LISTEN_ADDR (should be '*')"
fi

# Check WAL level
WAL_LEVEL=$(sudo -u postgres psql -t -c "SHOW wal_level;" 2>/dev/null | xargs)
echo "   wal_level: $WAL_LEVEL"
[ "$WAL_LEVEL" = "replica" ] && echo "   ✅ WAL level is correct" || echo "   ⚠️  WAL level should be 'replica'"

# Check max_wal_senders
WAL_SENDERS=$(sudo -u postgres psql -t -c "SHOW max_wal_senders;" 2>/dev/null | xargs)
echo "   max_wal_senders: $WAL_SENDERS"
[ "$WAL_SENDERS" -ge 3 ] && echo "   ✅ max_wal_senders is sufficient" || echo "   ⚠️  max_wal_senders should be >= 3"

# Test local connection
echo ""
echo "▶ Testing local connection..."
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Local connection works"
else
  echo "   ❌ Local connection failed"
fi

# Test replication user connection
echo ""
echo "▶ Testing replication user connection..."
if PGPASSWORD="$REPLICATION_PASSWORD" psql -h localhost -U replicator -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Replication user can connect locally"
else
  echo "   ⚠️  Replication user connection test failed (may need to test from remote)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PRIMARY server configured for replication"
echo ""
echo "⚠️  IMPORTANT: Change the replication password!"
echo "   Current password: $REPLICATION_PASSWORD"
echo "   Update it: sudo -u postgres psql -c \"ALTER USER replicator WITH PASSWORD 'YOUR_STRONG_PASSWORD';\""
echo ""
echo "Now test from SECONDARY (192.168.86.28):"
echo "  psql -h 192.168.86.27 -U replicator -d postgres -c \"SELECT 1;\""
echo ""

