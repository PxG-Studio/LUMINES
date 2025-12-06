#!/bin/bash
# install-postgresql11-binary-sbx02.sh
# Attempts to install PostgreSQL 11 using pre-built binaries or packages

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 Binary Installation on SBX02             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "▶ Checking for PostgreSQL 11 binary packages..."
echo ""

# Check if Entware is available
echo "1. Checking Entware..."
if run_remote "test -d /opt/bin && echo 'yes' || echo 'no'" | grep -q "yes"; then
  echo "   ✅ Entware may be available"
  echo "   Attempting to install PostgreSQL via Entware..."
  run_remote "sudo /opt/bin/opkg update && sudo /opt/bin/opkg install postgresql11-server postgresql11-client 2>&1 | tail -10" || {
    echo "   ⚠️  PostgreSQL not available in Entware repositories"
  }
else
  echo "   ❌ Entware not installed"
fi
echo ""

# Check for Synology packages
echo "2. Checking Synology Package Center..."
PKG_LIST=$(run_remote "/usr/syno/bin/synopkg list 2>/dev/null | grep -i postgres || echo 'none'")
if [[ "$PKG_LIST" != "none" ]]; then
  echo "   Available PostgreSQL packages:"
  echo "$PKG_LIST"
  echo ""
  echo "   ⚠️  Check if PostgreSQL 11 is available in Package Center"
  echo "   If yes, install it manually via DSM web interface"
else
  echo "   ❌ No PostgreSQL packages in Package Center"
fi
echo ""

# Check for manual binary installation
echo "3. Checking for pre-built PowerPC binaries..."
echo "   PostgreSQL 11 pre-built binaries for PowerPC are rare."
echo "   Most likely need to compile from source."
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Installation Options                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Since Docker is not available, options are:"
echo ""
echo "1. ✅ Compile PostgreSQL 11 from source (recommended)"
echo "   - Requires: gcc, make, build tools"
echo "   - Time: 30-60 minutes on PowerPC"
echo "   - Run: ./scripts/install-postgresql11-direct-sbx02.sh"
echo ""
echo "2. ⚠️  Use existing PostgreSQL 9.3.25 (NOT compatible)"
echo "   - Cannot replicate from PostgreSQL 11"
echo "   - Only works for backups, not streaming replication"
echo ""
echo "3. 💡 Alternative: Use different server for PostgreSQL 11"
echo "   - Run PostgreSQL 11 on Helios Compute/Control"
echo "   - Use SBX02 for storage only (iSCSI/NFS)"
echo ""
echo "Which option would you like to pursue?"
echo ""
