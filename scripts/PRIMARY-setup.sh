#!/bin/bash
# PRIMARY-setup.sh
# Run this on PRIMARY (192.168.86.27) as root

set -e

REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-Replication2024!Secure}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PRIMARY PostgreSQL Replication Setup                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find config
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "Config: $PG_CONF"
echo "HBA: $PG_HBA"

# Backup
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# Fix listen_addresses
echo ""
echo "▶ Configuring listen_addresses..."
sed -i '/listen_addresses/d' "$PG_CONF"
echo "listen_addresses = '*'" >> "$PG_CONF"
echo "✅ Set listen_addresses = '*'"

# Configure WAL
echo ""
echo "▶ Configuring WAL settings..."
sed -i '/^#*wal_level/d' "$PG_CONF"
echo "wal_level = replica" >> "$PG_CONF"
sed -i '/^#*max_wal_senders/d' "$PG_CONF"
echo "max_wal_senders = 3" >> "$PG_CONF"
sed -i '/^#*max_replication_slots/d' "$PG_CONF"
echo "max_replication_slots = 3" >> "$PG_CONF"
echo "✅ WAL settings configured"

# Configure pg_hba.conf
echo ""
echo "▶ Configuring pg_hba.conf..."
if ! grep -q "192.168.86.0/24" "$PG_HBA" 2>/dev/null; then
  echo "" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
  echo "✅ Added network access"
fi
if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA" 2>/dev/null; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
  echo "✅ Added replication entry"
fi

# Create replication user
echo ""
echo "▶ Creating replication user..."
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
echo "✅ Replication user ready"

# Create replication slot
echo ""
echo "▶ Creating replication slot..."
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || echo "Slot may already exist"
echo "✅ Replication slot ready"

# Restart PostgreSQL
echo ""
echo "▶ Restarting PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3
/usr/syno/bin/synopkg start pgsql
sleep 8

# Verify
echo ""
echo "▶ Verifying configuration..."
LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "listen_addresses: $LISTEN"
if [ "$LISTEN" = "*" ]; then
  echo "✅ listen_addresses is correct"
else
  echo "⚠️  listen_addresses is: $LISTEN (should be *)"
fi

netstat -tln | grep ":5432" && echo "✅ Listening on port 5432" || echo "⚠️  Not listening"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    PRIMARY Setup Complete                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
