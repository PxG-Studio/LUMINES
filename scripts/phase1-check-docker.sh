#!/bin/bash
# phase1-check-docker.sh
# Phase 1: Check Docker installation on Helios Compute

set -e

HELIOS_COMPUTE="192.168.86.115"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 1: Docker Installation Check                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Step 1.1: Testing connectivity to Helios Compute..."
if ping -c 2 -W 2 $HELIOS_COMPUTE > /dev/null 2>&1; then
  echo "✅ Helios Compute ($HELIOS_COMPUTE) is reachable"
else
  echo "❌ Cannot reach Helios Compute ($HELIOS_COMPUTE)"
  echo "   Please check network connectivity"
  exit 1
fi
echo ""

echo "▶ Step 1.2: Checking Docker installation..."
echo "   Attempting SSH connection..."
echo ""

# Try to check Docker via SSH
DOCKER_CHECK=$(ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $HELIOS_COMPUTE "which docker 2>/dev/null && docker --version 2>/dev/null || echo 'NOT_INSTALLED'" 2>&1)

if echo "$DOCKER_CHECK" | grep -q "NOT_INSTALLED"; then
  echo "❌ Docker is not installed"
  echo ""
  echo "Next step: Install Docker"
  echo "   Run: ./scripts/phase2-install-docker.sh"
elif echo "$DOCKER_CHECK" | grep -q "docker"; then
  echo "✅ Docker is installed!"
  echo "$DOCKER_CHECK" | grep -i docker
  echo ""
  echo "Docker version:"
  ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "docker --version" 2>&1 || echo "Could not get version"
else
  echo "⚠️  Could not determine Docker status"
  echo "   SSH output: $DOCKER_CHECK"
  echo ""
  echo "Please check SSH access manually:"
  echo "   ssh 192.168.86.115"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 1 Complete                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
