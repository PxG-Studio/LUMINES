#!/bin/bash
# Complete configure-192.168.86.28.sh script
# Copy this entire content to the NAS

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"
REDIS_PASSWORD="${REDIS_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Production Configuration: 192.168.86.28 (Secondary NAS)  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

echo "▶ Step 1: Configuring Network..."
if ping -c 3 $PRIMARY_IP > /dev/null 2>&1; then
  echo "   ✅ Primary server ($PRIMARY_IP) is reachable"
else
  echo "   ❌ Cannot reach primary server ($PRIMARY_IP)"
  exit 1
fi

echo ""
echo "▶ Step 2: Checking current directory..."
pwd
ls -la

echo ""
echo "✅ Basic checks complete"
echo ""
echo "Next: Configure services (PostgreSQL, Redis, NATS, Registry)"
echo "Run each configuration step manually or use the full script."
