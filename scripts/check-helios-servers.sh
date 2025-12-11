#!/bin/bash
# check-helios-servers.sh
# Checks both Helios servers to determine best one for PostgreSQL 11

HELIOS_CONTROL="192.168.86.114"
HELIOS_COMPUTE="192.168.86.115"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Helios Servers Resource Check                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

check_server() {
  local IP=$1
  local NAME=$2

  echo "▶ Checking $NAME ($IP)..."

  # Ping test
  if ping -c 2 -W 2 $IP > /dev/null 2>&1; then
    echo "   ✅ Server is reachable"
  else
    echo "   ❌ Server is not reachable"
    return 1
  fi

  # Try SSH (will prompt for credentials if needed)
  echo "   Attempting SSH connection..."
  ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $IP "echo 'Connected' && uname -a && free -h | head -2 && df -h / | tail -1" 2>&1 | head -10 || {
    echo "   ⚠️  SSH connection failed or requires authentication"
    echo "   Please provide SSH credentials to continue"
  }

  echo ""
}

echo "Checking Helios Control (192.168.86.114)..."
check_server $HELIOS_CONTROL "Helios Control"

echo "Checking Helios Compute (192.168.86.115)..."
check_server $HELIOS_COMPUTE "Helios Compute"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Summary                                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Please provide SSH credentials for the chosen server to proceed."
echo "We need to check:"
echo "  - RAM and CPU resources"
echo "  - Docker/microk8s availability"
echo "  - Disk space"
echo "  - Network connectivity to SBX02 (192.168.86.28)"
echo ""
