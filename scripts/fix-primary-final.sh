#!/bin/bash
# fix-primary-final.sh
# Final fix for PRIMARY - handles PostgreSQL not managed by synopkg

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Final PRIMARY Fix - Find Actual Config & Restart           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find the ACTUAL config file PostgreSQL is using
echo "▶ Finding actual PostgreSQL config file..."
ACTUAL_CONFIG=$(sudo -u postgres psql -t -c "SHOW config_file;" 2>/dev/null | xargs)
ACTUAL_HBA=$(sudo -u postgres psql -t -c "SHOW hba_file;" 2>/dev/null | xargs)

echo "   Actual config_file: $ACTUAL_CONFIG"
echo "   Actual hba_file: $ACTUAL_HBA"

# Check if different from what we edited
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs)
EXPECTED_CONFIG="$PG_DATA_DIR/postgresql.conf"

if [ "$ACTUAL_CONFIG" != "$EXPECTED_CONFIG" ]; then
  echo "   ⚠️  Config file is different! Using: $ACTUAL_CONFIG"
fi

# Backup actual config
cp "$ACTUAL_CONFIG" "${ACTUAL_CONFIG}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
cp "$ACTUAL_HBA" "${ACTUAL_HBA}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# Fix listen_addresses in ACTUAL config
echo ""
echo "▶ Fixing listen_addresses in actual config file..."
sed -i '/listen_addresses/d' "$ACTUAL_CONFIG"
echo "listen_addresses = '*'" >> "$ACTUAL_CONFIG"
echo "   ✅ Updated $ACTUAL_CONFIG"

# Configure WAL in actual config
echo ""
echo "▶ Configuring WAL settings..."
sed -i '/^#*wal_level/d' "$ACTUAL_CONFIG"
echo "wal_level = replica" >> "$ACTUAL_CONFIG"
sed -i '/^#*max_wal_senders/d' "$ACTUAL_CONFIG"
echo "max_wal_senders = 3" >> "$ACTUAL_CONFIG"
sed -i '/^#*max_replication_slots/d' "$ACTUAL_CONFIG"
echo "max_replication_slots = 3" >> "$ACTUAL_CONFIG"
echo "   ✅ WAL settings configured"

# Configure pg_hba.conf
echo ""
echo "▶ Configuring pg_hba.conf..."
if ! grep -q "192.168.86.0/24" "$ACTUAL_HBA" 2>/dev/null; then
  echo "" >> "$ACTUAL_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$ACTUAL_HBA"
  echo "   ✅ Added network access"
fi
if ! grep -q "replication.*replicator.*192.168.86.28" "$ACTUAL_HBA" 2>/dev/null; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$ACTUAL_HBA"
  echo "   ✅ Added replication entry"
fi

# Create replication user (with proper password escaping)
echo ""
echo "▶ Creating replication user..."
REPLICATION_PASSWORD='Replication2024Secure'
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
echo "   ✅ Replication user ready"

# Create replication slot
echo ""
echo "▶ Creating replication slot..."
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || true
echo "   ✅ Replication slot ready"

# Find how PostgreSQL is running
echo ""
echo "▶ Finding PostgreSQL process..."
PG_PID=$(pgrep -u postgres postgres | head -1)
if [ -n "$PG_PID" ]; then
  echo "   PostgreSQL PID: $PG_PID"
  echo "   Process command:"
  ps -p $PG_PID -o args --no-headers | head -1
fi

# Restart PostgreSQL - try multiple methods
echo ""
echo "▶ Restarting PostgreSQL..."

# Method 1: Try synopkg
if /usr/syno/bin/synopkg status pgsql 2>/dev/null | grep -q "started"; then
  echo "   Trying synopkg restart..."
  /usr/syno/bin/synopkg restart pgsql 2>/dev/null && sleep 5 || true
fi

# Method 2: Try systemctl (if available)
if command -v systemctl > /dev/null 2>&1; then
  echo "   Trying systemctl restart..."
  systemctl restart postgresql 2>/dev/null && sleep 5 || true
fi

# Method 3: Reload config (if running)
if [ -n "$PG_PID" ]; then
  echo "   Reloading PostgreSQL configuration..."
  sudo -u postgres psql -c "SELECT pg_reload_conf();" 2>/dev/null || true
  sleep 2
fi

# Method 4: Kill and restart manually if needed
if [ -n "$PG_PID" ]; then
  CURRENT_LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
  if [ "$CURRENT_LISTEN" != "*" ]; then
    echo "   ⚠️  listen_addresses still not '*', attempting full restart..."
    # Find init script or service
    if [ -f /etc/init.d/postgresql ]; then
      /etc/init.d/postgresql restart
    elif [ -f /usr/local/etc/rc.d/postgresql ]; then
      /usr/local/etc/rc.d/postgresql restart
    else
      echo "   ⚠️  Could not find restart method, please restart manually"
    fi
  fi
fi

sleep 5

# Verify
echo ""
echo "▶ Verifying configuration..."
LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   listen_addresses: $LISTEN"

if [ "$LISTEN" = "*" ]; then
  echo "   ✅ listen_addresses is correct!"
else
  echo "   ⚠️  listen_addresses is still: $LISTEN"
  echo "   PostgreSQL may need a full restart (not just reload)"
fi

netstat -tln | grep ":5432" && echo "   ✅ Listening on port 5432" || echo "   ⚠️  Not listening"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Fix Complete                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
