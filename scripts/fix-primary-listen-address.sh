#!/bin/bash
# fix-primary-listen-address.sh
# Fix PRIMARY PostgreSQL to listen on all interfaces
# Run on PRIMARY (192.168.86.27)

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Fixing PRIMARY PostgreSQL listen_addresses              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find config
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"

echo "Config file: $PG_CONF"

# Check current setting
echo ""
echo "▶ Current listen_addresses setting:"
grep "^listen_addresses" "$PG_CONF" || echo "   (not found)"

# Show what PostgreSQL sees
CURRENT=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   PostgreSQL reports: $CURRENT"

# Fix the config file
echo ""
echo "▶ Fixing listen_addresses in config file..."
# Remove any existing listen_addresses line
sed -i '/^listen_addresses/d' "$PG_CONF"
# Add correct setting
echo "listen_addresses = '*'" >> "$PG_CONF"
echo "   ✅ Set listen_addresses = '*'"

# Verify it was added
echo ""
echo "▶ Verifying config file:"
grep "^listen_addresses" "$PG_CONF"

# Stop PostgreSQL
echo ""
echo "▶ Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Check if it's stopped
if pgrep -u postgres postgres > /dev/null 2>&1; then
  echo "   ⚠️  PostgreSQL processes still running, force stopping..."
  pkill -u postgres postgres || true
  sleep 2
fi

# Start PostgreSQL
echo ""
echo "▶ Starting PostgreSQL..."
/usr/syno/bin/synopkg start pgsql
sleep 5

# Verify it started
if /usr/syno/bin/synopkg status pgsql | grep -q "started"; then
  echo "   ✅ PostgreSQL started"
else
  echo "   ❌ PostgreSQL failed to start"
  echo "   Check logs: tail -f /var/log/postgresql/*.log"
  exit 1
fi

# Wait a bit more for it to fully initialize
sleep 3

# Check what it's listening on
echo ""
echo "▶ Checking what PostgreSQL is listening on:"
netstat -tln | grep ":5432" || ss -tln | grep ":5432"

# Check listen_addresses setting
echo ""
echo "▶ Verifying listen_addresses:"
NEW_SETTING=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   PostgreSQL reports: $NEW_SETTING"

if [ "$NEW_SETTING" = "*" ] || [ "$NEW_SETTING" = "0.0.0.0" ]; then
  echo "   ✅ listen_addresses is correct!"
else
  echo "   ⚠️  listen_addresses is still: $NEW_SETTING"
  echo "   PostgreSQL may need a full restart or the config file location is different"
fi

# Test connection
echo ""
echo "▶ Testing local connection..."
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Local connection works"
else
  echo "   ❌ Local connection failed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Fix Complete                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Now test from SECONDARY:"
echo "  psql -h 192.168.86.27 -U replicator -d postgres -c \"SELECT 1;\""
echo ""
