#!/bin/bash
# create-on-nas-direct.sh
# Run this from your local machine to create scripts directly on the NAS
# This uses a different method that should work even if port 2202 is blocked

NAS_IP="192.168.86.28"
NAS_USER="warden-ssh"

echo "Creating scripts on NAS using standard SSH port..."

# Try standard SSH port first
if ssh $NAS_USER@$NAS_IP "mkdir -p ~/scripts" 2>/dev/null; then
  echo "✅ Connected via standard SSH port"
  PORT_FLAG=""
elif ssh -p 22 $NAS_USER@$NAS_IP "mkdir -p ~/scripts" 2>/dev/null; then
  echo "✅ Connected via port 22"
  PORT_FLAG="-p 22"
else
  echo "❌ Cannot connect to NAS. Please check:"
  echo "   1. You're on the correct network"
  echo "   2. SSH is enabled on the NAS"
  echo "   3. The IP address is correct"
  exit 1
fi

# Transfer configure script
echo "Transferring configure-192.168.86.28.sh..."
cat scripts/configure-192.168.86.28.sh | ssh $PORT_FLAG $NAS_USER@$NAS_IP "cat > ~/scripts/configure-192.168.86.28.sh && chmod +x ~/scripts/configure-192.168.86.28.sh"

# Transfer verify script
echo "Transferring verify-production-readiness.sh..."
cat scripts/verify-production-readiness.sh | ssh $PORT_FLAG $NAS_USER@$NAS_IP "cat > ~/scripts/verify-production-readiness.sh && chmod +x ~/scripts/verify-production-readiness.sh"

echo ""
echo "✅ Scripts created on NAS!"
echo ""
echo "Now on the NAS, run:"
echo "  cd ~/scripts"
echo "  sudo ./configure-192.168.86.28.sh"
