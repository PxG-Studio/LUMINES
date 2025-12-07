#!/bin/bash
# Run this script on PRIMARY server (192.168.86.27) to configure replication

set -e

REPLICATION_USER="replicator"
REPLICATION_PASSWORD="Replication2024Secure"
SECONDARY_IP="192.168.86.115"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ Configure PRIMARY PostgreSQL for Replication             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find PostgreSQL data directory
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "PostgreSQL Data Directory: $PG_DATA_DIR"
echo "Config File: $PG_CONF"
echo "HBA File: $PG_HBA"
echo ""

# Backup config files
sudo cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
sudo cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# Configure listen_addresses
echo "▶ Configuring listen_addresses..."
if grep -q "^listen_addresses" "$PG_CONF"; then
    sudo sed -i "s/^listen_addresses.*/listen_addresses = '*'/" "$PG_CONF"
else
    echo "listen_addresses = '*'" | sudo tee -a "$PG_CONF"
fi

# Configure WAL for replication
echo "▶ Configuring WAL settings..."
sudo sed -i '/^#*wal_level/d' "$PG_CONF"
echo "wal_level = replica" | sudo tee -a "$PG_CONF"

sudo sed -i '/^#*max_wal_senders/d' "$PG_CONF"
echo "max_wal_senders = 3" | sudo tee -a "$PG_CONF"

sudo sed -i '/^#*max_replication_slots/d' "$PG_CONF"
echo "max_replication_slots = 3" | sudo tee -a "$PG_CONF"

# Configure pg_hba.conf
echo "▶ Configuring pg_hba.conf..."
if ! grep -q "192.168.86.0/24" "$PG_HBA" 2>/dev/null; then
    echo "" | sudo tee -a "$PG_HBA"
    echo "host    all             all             192.168.86.0/24         md5" | sudo tee -a "$PG_HBA"
fi

if ! grep -q "replication.*replicator.*192.168.86.115" "$PG_HBA" 2>/dev/null; then
    echo "host    replication     replicator      192.168.86.115/32    md5" | sudo tee -a "$PG_HBA"
fi

# Create replication user
echo "▶ Creating replication user..."
sudo -u postgres psql -c "CREATE USER $REPLICATION_USER WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER $REPLICATION_USER WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" 2>/dev/null || true

# Create replication slot
echo "▶ Creating replication slot..."
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || true

# Restart PostgreSQL
echo "▶ Restarting PostgreSQL..."
/usr/syno/bin/synopkg restart pgsql || {
    echo "⚠️  synopkg restart failed, trying manual restart..."
    sudo pkill -9 postgres || true
    sleep 2
    sudo -u postgres /usr/bin/postgres -D "$PG_DATA_DIR" >/dev/null 2>&1 &
}

sleep 5

# Verify
echo ""
echo "▶ Verifying configuration..."
LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
WAL_LEVEL=$(sudo -u postgres psql -t -c "SHOW wal_level;" 2>/dev/null | xargs)

echo "listen_addresses: $LISTEN"
echo "wal_level: $WAL_LEVEL"

if netstat -tln | grep -q ":5432" || ss -tln | grep -q ":5432"; then
    echo "✅ PostgreSQL is listening on port 5432"
else
    echo "⚠️  PostgreSQL may not be listening on network port"
fi

echo ""
echo "✅ PRIMARY configuration complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify PRIMARY is accessible: psql -h 192.168.86.27 -U postgres"
echo "   2. Run replication setup on DR server:"
echo "      ssh 192.168.86.115 'bash /tmp/setup-postgresql-replication.sh'"
