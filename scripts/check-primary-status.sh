#!/bin/bash
# check-primary-status.sh
# Check PRIMARY PostgreSQL status

PRIMARY_IP="192.168.86.27"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Checking PRIMARY (SBX01) Status                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Testing network connectivity..."
if ping -c 2 $PRIMARY_IP > /dev/null 2>&1; then
  echo "   ✅ PRIMARY is reachable"
else
  echo "   ❌ Cannot reach PRIMARY"
  exit 1
fi

echo ""
echo "▶ Testing PostgreSQL port..."
if nc -z $PRIMARY_IP 5432 2>/dev/null || timeout 2 bash -c "</dev/tcp/$PRIMARY_IP/5432" 2>/dev/null; then
  echo "   ✅ Port 5432 is open"
else
  echo "   ❌ Port 5432 is not accessible"
  echo "   PRIMARY PostgreSQL may not be running"
fi

echo ""
echo "▶ Testing PostgreSQL connection..."
if PGPASSWORD="Replication2024Secure" psql -h $PRIMARY_IP -U replicator -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Can connect to PRIMARY PostgreSQL"
else
  echo "   ❌ Cannot connect to PRIMARY PostgreSQL"
  echo ""
  echo "   On PRIMARY (SBX01), check:"
  echo "   1. Is PostgreSQL running?"
  echo "   2. Is listen_addresses = '*'?"
  echo "   3. Is pg_hba.conf configured?"
fi

echo ""
