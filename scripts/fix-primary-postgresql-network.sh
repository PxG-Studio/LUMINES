#!/bin/bash
# fix-primary-postgresql-network.sh
# Fix PRIMARY PostgreSQL to accept remote connections
# Run this on PRIMARY (192.168.86.27)

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Fixing PRIMARY PostgreSQL Network Configuration          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Find PostgreSQL data directory
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"

echo "PostgreSQL data directory: $PG_DATA_DIR"
echo "Config file: $PG_CONF"

# Check if PostgreSQL is running
echo ""
echo "▶ Checking PostgreSQL status..."
if /usr/syno/bin/synopkg status pgsql | grep -q "started"; then
  echo "   ✅ PostgreSQL is running"
else
  echo "   ⚠️  PostgreSQL is not running, starting..."
  /usr/syno/bin/synopkg start pgsql
  sleep 3
fi

# Backup config
if [ -f "$PG_CONF" ]; then
  cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "   ✅ Config backed up"
fi

# Configure listen_addresses
echo ""
echo "▶ Configuring listen_addresses..."
if grep -q "^listen_addresses" "$PG_CONF"; then
  # Update existing
  sed -i "s/^listen_addresses.*/listen_addresses = '*'/" "$PG_CONF"
  echo "   ✅ Updated listen_addresses = '*'"
else
  # Add new
  echo "listen_addresses = '*'" >> "$PG_CONF"
  echo "   ✅ Added listen_addresses = '*'"
fi

# Ensure port is set
if ! grep -q "^port" "$PG_CONF"; then
  echo "port = 5432" >> "$PG_CONF"
  echo "   ✅ Added port = 5432"
fi

# Configure pg_hba.conf for network access
echo ""
echo "▶ Configuring pg_hba.conf..."
PG_HBA="$PG_DATA_DIR/pg_hba.conf"
if [ -f "$PG_HBA" ]; then
  cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d-%H%M%S)"

  # Check if we already have entries for local network
  if ! grep -q "192.168.86" "$PG_HBA"; then
    echo "" >> "$PG_HBA"
    echo "# Allow connections from local network" >> "$PG_HBA"
    echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
    echo "   ✅ Added network access rule"
  else
    echo "   ✅ Network access rule already exists"
  fi

  # Ensure replication entry exists
  if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA"; then
    echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
    echo "   ✅ Added replication entry"
  else
    echo "   ✅ Replication entry already exists"
  fi
else
  echo "   ❌ pg_hba.conf not found at $PG_HBA"
fi

# Restart PostgreSQL
echo ""
echo "▶ Restarting PostgreSQL..."
/usr/syno/bin/synopkg restart pgsql
sleep 5

# Verify it's listening
echo ""
echo "▶ Verifying PostgreSQL is listening..."
if netstat -tln | grep -q ":5432"; then
  echo "   ✅ PostgreSQL is listening on port 5432"
else
  echo "   ⚠️  PostgreSQL may not be listening (check manually)"
fi

# Check listen_addresses setting
echo ""
echo "▶ Verifying configuration..."
LISTEN_ADDR=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   listen_addresses: $LISTEN_ADDR"

if [ "$LISTEN_ADDR" = "*" ] || [ "$LISTEN_ADDR" = "0.0.0.0" ]; then
  echo "   ✅ PostgreSQL is configured to listen on all interfaces"
else
  echo "   ⚠️  listen_addresses is: $LISTEN_ADDR"
fi

# Test local connection
echo ""
echo "▶ Testing local connection..."
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Local connection works"
else
  echo "   ❌ Local connection failed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Configuration Complete                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Now test from SECONDARY:"
echo "  psql -h 192.168.86.27 -U replicator -d postgres -c \"SELECT 1;\""
echo ""
