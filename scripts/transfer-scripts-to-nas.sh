#!/bin/bash
# transfer-scripts-to-nas.sh
# Transfer configuration scripts to Synology NAS (192.168.86.28)

set -e

NAS_IP="192.168.86.28"
NAS_USER="warden-ssh"
NAS_PORT="2202"
SCRIPT_DIR="scripts"
NAS_SCRIPT_DIR="~/scripts"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Transfer Scripts to Synology NAS (192.168.86.28)         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if SSH key is loaded
if ! ssh-add -l > /dev/null 2>&1; then
  echo "▶ Loading SSH key..."
  ssh-add ~/.ssh/id_ed25519
fi

# Create scripts directory on NAS
echo "▶ Creating scripts directory on NAS..."
ssh -p $NAS_PORT $NAS_USER@$NAS_IP "mkdir -p $NAS_SCRIPT_DIR"

# Transfer scripts
echo "▶ Transferring scripts..."
echo "   - configure-192.168.86.28.sh"
cat scripts/configure-192.168.86.28.sh | ssh -p $NAS_PORT $NAS_USER@$NAS_IP "cat > $NAS_SCRIPT_DIR/configure-192.168.86.28.sh"

echo "   - verify-production-readiness.sh"
cat scripts/verify-production-readiness.sh | ssh -p $NAS_PORT $NAS_USER@$NAS_IP "cat > $NAS_SCRIPT_DIR/verify-production-readiness.sh"

# Make scripts executable
echo "▶ Making scripts executable..."
ssh -p $NAS_PORT $NAS_USER@$NAS_IP "chmod +x $NAS_SCRIPT_DIR/*.sh"

echo ""
echo "✅ Scripts transferred successfully!"
echo ""
echo "To run on the NAS:"
echo "  ssh -p $NAS_PORT $NAS_USER@$NAS_IP"
echo "  cd ~/scripts"
echo "  sudo ./configure-192.168.86.28.sh"
echo ""
