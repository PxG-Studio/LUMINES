#!/bin/bash
# phase2-install-docker.sh
# Phase 2: Install Docker on Helios Compute

set -e

HELIOS_COMPUTE="192.168.86.115"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 2: Docker Installation                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Step 2.1: Verifying connectivity..."
if ! ping -c 2 -W 2 $HELIOS_COMPUTE > /dev/null 2>&1; then
  echo "❌ Cannot reach Helios Compute"
  exit 1
fi
echo "✅ Server is reachable"
echo ""

echo "▶ Step 2.2: Checking if Docker is already installed..."
DOCKER_STATUS=$(ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "which docker 2>/dev/null && echo 'INSTALLED' || echo 'NOT_INSTALLED'" 2>&1)

if echo "$DOCKER_STATUS" | grep -q "INSTALLED"; then
  echo "✅ Docker is already installed!"
  ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "docker --version" 2>&1
  exit 0
fi
echo "Docker not found. Proceeding with installation..."
echo ""

echo "▶ Step 2.3: Installing Docker..."
echo "   This will install Docker using the official installation script"
echo ""

# Install Docker using official script
ssh -o ConnectTimeout=5 $HELIOS_COMPUTE << 'REMOTE_SCRIPT'
set -e

echo "Downloading Docker installation script..."
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh

echo "Running Docker installation script..."
sudo sh /tmp/get-docker.sh

echo "Adding current user to docker group..."
sudo usermod -aG docker $USER || echo "User group update (may need logout/login)"

echo "Verifying Docker installation..."
sudo docker --version

echo "Testing Docker..."
sudo docker run hello-world 2>&1 | head -10 || echo "Docker test completed"

echo "✅ Docker installation complete!"
REMOTE_SCRIPT

echo ""
echo "✅ Docker installed successfully!"
echo ""
echo "Note: You may need to logout/login or run 'newgrp docker'"
echo "      to use Docker without sudo"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 2 Complete                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
