#!/bin/bash
# phase3-install-iscsi.sh
# Phase 3: Install iSCSI initiator tools on Helios Compute

set -e

HELIOS_COMPUTE="192.168.86.115"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 3: iSCSI Initiator Tools Installation             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Step 3.1: Verifying connectivity..."
if ! ping -c 2 -W 2 $HELIOS_COMPUTE > /dev/null 2>&1; then
  echo "❌ Cannot reach Helios Compute"
  exit 1
fi
echo "✅ Server is reachable"
echo ""

echo "▶ Step 3.2: Checking if iSCSI tools are already installed..."
ISCSI_STATUS=$(ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "which iscsiadm 2>/dev/null && echo 'INSTALLED' || echo 'NOT_INSTALLED'" 2>&1)

if echo "$ISCSI_STATUS" | grep -q "INSTALLED"; then
  echo "✅ iSCSI tools are already installed!"
  ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "iscsiadm --version 2>&1 | head -1" || echo "Version check"
  exit 0
fi
echo "iSCSI tools not found. Proceeding with installation..."
echo ""

echo "▶ Step 3.3: Installing iSCSI initiator tools..."
ssh -o ConnectTimeout=5 $HELIOS_COMPUTE << 'REMOTE_SCRIPT'
set -e

echo "Updating package list..."
sudo apt-get update -qq

echo "Installing open-iscsi..."
sudo apt-get install -y open-iscsi

echo "Starting iSCSI service..."
sudo systemctl enable iscsid
sudo systemctl start iscsid

echo "Verifying installation..."
iscsiadm --version

echo "✅ iSCSI tools installed successfully!"
REMOTE_SCRIPT

echo ""
echo "✅ iSCSI initiator tools installed!"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 3 Complete                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
