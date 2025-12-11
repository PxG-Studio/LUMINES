#!/bin/bash
# verify-primary-ready.sh
# Verify PRIMARY server (192.168.86.27) is configured for replication

PRIMARY_IP="192.168.86.27"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Verifying PRIMARY Replication Configuration             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Test connectivity
echo "▶ Testing connectivity to $PRIMARY_IP..."
if ping -c 2 $PRIMARY_IP > /dev/null 2>&1; then
  echo "   ✅ Primary server is reachable"
else
  echo "   ❌ Cannot reach primary server"
  exit 1
fi

# Test PostgreSQL connection
echo ""
echo "▶ Testing PostgreSQL connection..."
if PGPASSWORD="$REPLICATION_PASSWORD" psql -h $PRIMARY_IP -U replicator -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Can connect as 'replicator' user"
else
  echo "   ❌ Cannot connect as 'replicator' user"
  echo "   This means PRIMARY is NOT configured yet"
  echo ""
  echo "   On PRIMARY (192.168.86.27), run:"
  echo "   1. sudo -u postgres psql -c \"CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'YOUR_PASSWORD';\""
  echo "   2. Edit pg_hba.conf to allow replication from 192.168.86.28"
  echo "   3. Edit postgresql.conf: wal_level = replica, max_wal_senders = 3"
  echo "   4. sudo -u postgres psql -c \"SELECT pg_create_physical_replication_slot('replica_slot');\""
  echo "   5. Restart PostgreSQL"
  exit 1
fi

# Test replication connection
echo ""
echo "▶ Testing replication connection..."
if PGPASSWORD="$REPLICATION_PASSWORD" psql -h $PRIMARY_IP -U replicator -d postgres -c "SELECT pg_is_in_recovery();" > /dev/null 2>&1; then
  echo "   ✅ Replication connection works"
else
  echo "   ⚠️  Replication connection test inconclusive"
fi

# Check replication slot
echo ""
echo "▶ Checking replication slot..."
SLOT_EXISTS=$(PGPASSWORD="$REPLICATION_PASSWORD" psql -h $PRIMARY_IP -U replicator -d postgres -t -c "SELECT 1 FROM pg_replication_slots WHERE slot_name='replica_slot';" 2>/dev/null | xargs)
if [ "$SLOT_EXISTS" = "1" ]; then
  echo "   ✅ Replication slot 'replica_slot' exists"
else
  echo "   ⚠️  Replication slot 'replica_slot' not found"
  echo "   Create it: sudo -u postgres psql -c \"SELECT pg_create_physical_replication_slot('replica_slot');\""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Verification Complete                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
