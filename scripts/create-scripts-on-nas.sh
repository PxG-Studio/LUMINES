#!/bin/bash
# create-scripts-on-nas.sh
# This script creates the configuration scripts directly on the NAS
# Run this FROM your local machine to create scripts ON the NAS

NAS_IP="192.168.86.28"
NAS_USER="warden-ssh"
NAS_PORT="2202"

echo "Creating scripts on NAS (192.168.86.28)..."

# Create scripts directory
ssh -p $NAS_PORT $NAS_USER@$NAS_IP "mkdir -p ~/scripts"

# Transfer configure script
cat scripts/configure-192.168.86.28.sh | ssh -p $NAS_PORT $NAS_USER@$NAS_IP "cat > ~/scripts/configure-192.168.86.28.sh && chmod +x ~/scripts/configure-192.168.86.28.sh"

# Transfer verify script
cat scripts/verify-production-readiness.sh | ssh -p $NAS_PORT $NAS_USER@$NAS_IP "cat > ~/scripts/verify-production-readiness.sh && chmod +x ~/scripts/verify-production-readiness.sh"

echo "✅ Scripts created on NAS!"
echo ""
echo "Now SSH to the NAS and run:"
echo "  ssh -p $NAS_PORT $NAS_USER@$NAS_IP"
echo "  cd ~/scripts"
echo "  sudo ./configure-192.168.86.28.sh"
