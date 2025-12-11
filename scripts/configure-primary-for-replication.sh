#!/bin/bash
# configure-primary-for-replication.sh
# Configure PRIMARY server (192.168.86.27) for PostgreSQL replication
# Run this on the PRIMARY server FIRST before setting up the replica

PRIMARY_IP="192.168.86.27"
REPLICA_IP="192.168.86.28"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Configure PRIMARY Server for Replication                 ║"
echo "║  Server: 192.168.86.27                                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Check if we're on the primary server
CURRENT_IP=$(hostname -I | awk '{print $1}')
if [ "$CURRENT_IP" != "$PRIMARY_IP" ]; then
  echo "⚠️  Warning: This script should run on PRIMARY server ($PRIMARY_IP)"
  echo "   Current IP: $CURRENT_IP"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "▶ Step 1: Checking PostgreSQL installation..."
if ! command -v psql > /dev/null 2>&1; then
  echo "❌ PostgreSQL not found"
  exit 1
fi

# Find PostgreSQL data directory
if [ -f /.dockerenv ]; then
  PG_DATA_DIR="/var/lib/postgresql/data"
  echo "   Detected: Docker container"
else
  PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/lib/postgresql/14/main")
  echo "   Detected: Native installation"
fi

echo "   Data directory: $PG_DATA_DIR"

# Find postgresql.conf location
if [ -f "$PG_DATA_DIR/postgresql.conf" ]; then
  PG_CONF="$PG_DATA_DIR/postgresql.conf"
elif [ -f "/etc/postgresql/14/main/postgresql.conf" ]; then
  PG_CONF="/etc/postgresql/14/main/postgresql.conf"
else
  echo "❌ Could not find postgresql.conf"
  exit 1
fi

echo "   Config file: $PG_CONF"

# Find pg_hba.conf location
if [ -f "$PG_DATA_DIR/pg_hba.conf" ]; then
  PG_HBA="$PG_DATA_DIR/pg_hba.conf"
elif [ -f "/etc/postgresql/14/main/pg_hba.conf" ]; then
  PG_HBA="/etc/postgresql/14/main/pg_hba.conf"
else
  echo "❌ Could not find pg_hba.conf"
  exit 1
fi

echo "   HBA file: $PG_HBA"

echo ""
echo "▶ Step 2: Creating replication user..."
sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='replicator';" | grep -q 1 && {
  echo "   ✅ Replication user already exists"
  read -p "   Update password? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo -u postgres psql -c "ALTER USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
    echo "   ✅ Password updated"
  fi
} || {
  sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
  echo "   ✅ Replication user created"
}

echo ""
echo "▶ Step 3: Configuring postgresql.conf..."
# Backup config
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d)"

# Check and update wal_level
if grep -q "^wal_level" "$PG_CONF"; then
  sed -i "s/^wal_level.*/wal_level = replica/" "$PG_CONF"
  echo "   ✅ Updated wal_level = replica"
else
  echo "wal_level = replica" >> "$PG_CONF"
  echo "   ✅ Added wal_level = replica"
fi

# Check and update max_wal_senders
if grep -q "^max_wal_senders" "$PG_CONF"; then
  sed -i "s/^max_wal_senders.*/max_wal_senders = 3/" "$PG_CONF"
  echo "   ✅ Updated max_wal_senders = 3"
else
  echo "max_wal_senders = 3" >> "$PG_CONF"
  echo "   ✅ Added max_wal_senders = 3"
fi

# Check and update max_replication_slots
if grep -q "^max_replication_slots" "$PG_CONF"; then
  sed -i "s/^max_replication_slots.*/max_replication_slots = 3/" "$PG_CONF"
  echo "   ✅ Updated max_replication_slots = 3"
else
  echo "max_replication_slots = 3" >> "$PG_CONF"
  echo "   ✅ Added max_replication_slots = 3"
fi

echo ""
echo "▶ Step 4: Configuring pg_hba.conf..."
# Backup HBA
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d)"

# Check if replication line already exists
if grep -q "replication.*replicator.*$REPLICA_IP" "$PG_HBA"; then
  echo "   ✅ Replication entry already exists in pg_hba.conf"
else
  # Add replication entry
  echo "host    replication     replicator      $REPLICA_IP/32    md5" >> "$PG_HBA"
  echo "   ✅ Added replication entry for $REPLICA_IP"
fi

echo ""
echo "▶ Step 5: Creating replication slot..."
sudo -u postgres psql -c "SELECT 1 FROM pg_replication_slots WHERE slot_name='replica_slot';" | grep -q 1 && {
  echo "   ✅ Replication slot 'replica_slot' already exists"
} || {
  sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');"
  echo "   ✅ Replication slot 'replica_slot' created"
}

echo ""
echo "▶ Step 6: Restarting PostgreSQL..."
if [ -f /.dockerenv ]; then
  # Docker
  docker restart $(docker ps | grep postgres | awk '{print $1}' | head -1) || echo "   ⚠️  Could not restart container"
else
  # Native
  if command -v systemctl > /dev/null 2>&1; then
    systemctl restart postgresql
  elif [ -f /usr/syno/bin/synopkg ]; then
    /usr/syno/bin/synopkg restart pgsql
  else
    echo "   ⚠️  Please restart PostgreSQL manually"
  fi
fi

sleep 3

echo ""
echo "▶ Step 7: Verifying configuration..."
# Check wal_level
WAL_LEVEL=$(sudo -u postgres psql -t -c "SHOW wal_level;" | xargs)
if [ "$WAL_LEVEL" = "replica" ]; then
  echo "   ✅ wal_level = $WAL_LEVEL"
else
  echo "   ❌ wal_level = $WAL_LEVEL (should be 'replica')"
fi

# Check max_wal_senders
WAL_SENDERS=$(sudo -u postgres psql -t -c "SHOW max_wal_senders;" | xargs)
if [ "$WAL_SENDERS" -ge 3 ]; then
  echo "   ✅ max_wal_senders = $WAL_SENDERS"
else
  echo "   ⚠️  max_wal_senders = $WAL_SENDERS (should be >= 3)"
fi

# Check replication slot
sudo -u postgres psql -c "SELECT slot_name FROM pg_replication_slots WHERE slot_name='replica_slot';" | grep -q replica_slot && {
  echo "   ✅ Replication slot exists"
} || {
  echo "   ❌ Replication slot not found"
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Configuration Complete                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PRIMARY server configured for replication"
echo ""
echo "Next steps:"
echo "1. Go to SECONDARY server (192.168.86.28)"
echo "2. Run the replica setup script"
echo "3. Use replication password: $REPLICATION_PASSWORD"
echo ""
