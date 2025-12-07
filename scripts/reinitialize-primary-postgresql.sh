#!/bin/bash
# reinitialize-primary-postgresql.sh
# Reinitialize PRIMARY PostgreSQL data directory

PG_DATA_DIR="/var/services/pgsql"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Reinitializing PRIMARY PostgreSQL                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check error log first
if [ -f /tmp/postgres_error.log ]; then
  echo "▶ Previous error log:"
  cat /tmp/postgres_error.log
  echo ""
fi

# Stop any running PostgreSQL
echo "▶ Stopping any running PostgreSQL processes..."
killall -u postgres postgres 2>/dev/null || true
sleep 2

# Backup current directory if it has anything
if [ -d "$PG_DATA_DIR" ] && [ "$(ls -A $PG_DATA_DIR 2>/dev/null)" ]; then
  echo "▶ Backing up existing directory..."
  mv "$PG_DATA_DIR" "${PG_DATA_DIR}.empty.$(date +%Y%m%d-%H%M%S)"
fi

# Create fresh directory
echo "▶ Creating fresh data directory..."
mkdir -p "$PG_DATA_DIR"
chown -R postgres:postgres "$PG_DATA_DIR"
chmod 700 "$PG_DATA_DIR"

# Find initdb
echo ""
echo "▶ Finding initdb..."
INITDB=$(which initdb 2>/dev/null || find /usr -name initdb 2>/dev/null | head -1)
if [ -z "$INITDB" ]; then
  echo "   ⚠️  initdb not found, trying pg_ctl initdb..."
  PG_CTL=$(which pg_ctl 2>/dev/null || find /usr -name pg_ctl 2>/dev/null | head -1)
  if [ -n "$PG_CTL" ]; then
    echo "   Using: $PG_CTL"
    sudo -u postgres "$PG_CTL" initdb -D "$PG_DATA_DIR" || {
      echo "   ❌ pg_ctl initdb failed"
      exit 1
    }
  else
    echo "   ❌ Cannot find initdb or pg_ctl"
    exit 1
  fi
else
  echo "   Using: $INITDB"
  sudo -u postgres "$INITDB" -D "$PG_DATA_DIR" || {
    echo "   ❌ initdb failed"
    exit 1
  }
fi

echo "   ✅ PostgreSQL initialized"

# Configure for replication
echo ""
echo "▶ Configuring for replication..."

PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

# Configure listen_addresses
sed -i '/listen_addresses/d' "$PG_CONF"
echo "listen_addresses = '*'" >> "$PG_CONF"

# Configure WAL
sed -i '/^#*wal_level/d' "$PG_CONF"
echo "wal_level = replica" >> "$PG_CONF"
sed -i '/^#*max_wal_senders/d' "$PG_CONF"
echo "max_wal_senders = 3" >> "$PG_CONF"
sed -i '/^#*max_replication_slots/d' "$PG_CONF"
echo "max_replication_slots = 3" >> "$PG_CONF"

# Configure pg_hba.conf
if ! grep -q "192.168.86.0/24" "$PG_HBA"; then
  echo "" >> "$PG_HBA"
  echo "# Allow connections from local network" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
fi
if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA"; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
fi

echo "   ✅ Replication settings configured"

# Start PostgreSQL
echo ""
echo "▶ Starting PostgreSQL..."
sudo -u postgres /bin/postgres -D "$PG_DATA_DIR" > /tmp/postgres.log 2>&1 &
sleep 5

# Verify
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ PostgreSQL is running!"

  # Create replication user
  echo ""
  echo "▶ Creating replication user..."
  REPLICATION_PASSWORD="Replication2024Secure"
  sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" 2>/dev/null || \
  sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"

  # Create replication slot
  sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || true

  echo "   ✅ Replication user and slot created"

  # Verify listen_addresses
  LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" | xargs)
  echo ""
  echo "   listen_addresses: $LISTEN"
  netstat -tln | grep ":5432" && echo "   ✅ Listening on port 5432"
else
  echo "   ❌ PostgreSQL failed to start"
  echo "   Check logs: cat /tmp/postgres.log"
  exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Reinitialization Complete                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
