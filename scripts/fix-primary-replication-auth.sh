#!/bin/bash
# fix-primary-replication-auth.sh
# Fix replication authentication on PRIMARY

REPLICATION_PASSWORD="Replication2024Secure"
SECONDARY_IP="192.168.86.28"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Fixing PRIMARY Replication Authentication                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if PostgreSQL is running
if ! sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
  echo "❌ PostgreSQL is not running on PRIMARY"
  exit 1
fi

# Find pg_hba.conf
PG_HBA=$(sudo -u postgres psql -t -c "SHOW hba_file;" 2>/dev/null | xargs)
echo "pg_hba.conf: $PG_HBA"

# Check current pg_hba.conf entries
echo ""
echo "▶ Current pg_hba.conf entries for replication:"
grep -i replication "$PG_HBA" || echo "   No replication entries found"

# Add/update replication entry
echo ""
echo "▶ Configuring pg_hba.conf..."
if ! grep -q "replication.*replicator.*$SECONDARY_IP" "$PG_HBA"; then
  echo "host    replication     replicator      $SECONDARY_IP/32    md5" >> "$PG_HBA"
  echo "   ✅ Added replication entry for $SECONDARY_IP"
else
  echo "   ✅ Replication entry already exists"
fi

# Also add network-wide entry if not present
if ! grep -q "replication.*replicator.*192.168.86" "$PG_HBA"; then
  echo "host    replication     replicator      192.168.86.0/24    md5" >> "$PG_HBA"
  echo "   ✅ Added network-wide replication entry"
fi

# Verify replication user exists and update password
echo ""
echo "▶ Checking replication user..."
if sudo -u postgres psql -c "\du" | grep -q replicator; then
  echo "   ✅ Replication user exists"
  echo "   Updating password..."
  sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
  echo "   ✅ Password updated"
else
  echo "   Creating replication user..."
  sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD '$REPLICATION_PASSWORD';"
  echo "   ✅ Replication user created"
fi

# Reload PostgreSQL configuration
echo ""
echo "▶ Reloading PostgreSQL configuration..."
sudo -u postgres psql -c "SELECT pg_reload_conf();" > /dev/null 2>&1
echo "   ✅ Configuration reloaded"

# Verify listen_addresses
echo ""
echo "▶ Verifying listen_addresses..."
LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "   listen_addresses: $LISTEN"
if [ "$LISTEN" != "*" ]; then
  echo "   ⚠️  listen_addresses is not '*', fixing..."
  PG_CONF=$(sudo -u postgres psql -t -c "SHOW config_file;" 2>/dev/null | xargs)
  sed -i '/listen_addresses/d' "$PG_CONF"
  echo "listen_addresses = '*'" >> "$PG_CONF"
  echo "   ✅ Fixed, restart PostgreSQL for changes to take effect"
fi

# Test connection locally
echo ""
echo "▶ Testing local connection with replication user..."
if PGPASSWORD="$REPLICATION_PASSWORD" psql -h localhost -U replicator -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Local connection works"
else
  echo "   ⚠️  Local connection failed (may need restart)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Fix Complete                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Now test from SECONDARY:"
echo "  PGPASSWORD='$REPLICATION_PASSWORD' psql -h 192.168.86.27 -U replicator -d postgres -c 'SELECT 1;'"
echo ""
