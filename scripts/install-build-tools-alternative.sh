#!/bin/bash
# install-build-tools-alternative.sh
# Alternative methods to get build tools on SBX02

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Alternative Build Tools Installation Methods            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "Since Entware PowerPC repository is not available, let's try alternatives:"
echo ""

# Option 1: Check Synology Package Center
echo "▶ Option 1: Check Synology Package Center"
echo "   Please check DSM web interface > Package Center"
echo "   Look for:"
echo "   - Development Tools"
echo "   - Tool Chain"
echo "   - GCC"
echo "   - Make"
echo ""

# Option 2: Check if tools are in /usr/bin
echo "▶ Option 2: Checking system paths..."
GCC_PATH=$(run_remote "find /usr/bin /bin /opt/bin -name gcc 2>/dev/null | head -1 || echo 'not found'")
MAKE_PATH=$(run_remote "find /usr/bin /bin /opt/bin -name make 2>/dev/null | head -1 || echo 'not found'")
echo "gcc: $GCC_PATH"
echo "make: $MAKE_PATH"
echo ""

# Option 3: Check for cross-compilation tools
echo "▶ Option 3: Check for cross-compilation..."
CROSS_GCC=$(run_remote "find /usr -name '*gcc*' -type f 2>/dev/null | head -5 || echo 'none'")
echo "Found GCC-related files:"
echo "$CROSS_GCC"
echo ""

# Option 4: Manual binary installation
echo "▶ Option 4: Manual binary installation"
echo "   If you have access to another PowerPC system with gcc/make:"
echo "   1. Compile static binaries on that system"
echo "   2. Transfer to SBX02"
echo "   3. Use those binaries to compile PostgreSQL 11"
echo ""

# Option 5: Use different server
echo "▶ Option 5: Use different server (Recommended if build tools unavailable)"
echo "   - Install PostgreSQL 11 on Helios Compute/Control"
echo "   - Use SBX02 for storage only"
echo "   - Connect via network"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Recommendation                                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "If build tools cannot be installed on SBX02:"
echo ""
echo "✅ BEST: Use different server for PostgreSQL 11"
echo "   - Helios Compute (192.168.86.115) or Control (192.168.86.114)"
echo "   - Install Docker/microk8s there"
echo "   - Run PostgreSQL 11 container"
echo "   - Use SBX02 for iSCSI storage"
echo ""
echo "This avoids compilation complexity and uses better resources."
echo ""
