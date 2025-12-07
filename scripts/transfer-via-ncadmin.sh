#!/bin/bash
# Transfer script via ncadmin user (since warden-ssh SSH keys aren't set up)

echo "Transferring scripts to 192.168.86.28 via ncadmin user..."

# Since you're already logged in as ncadmin on the NAS, you can:
# 1. Copy the script content and paste it directly
# 2. Or use this method if you can access from local machine

NAS_IP="192.168.86.28"
NAS_USER="ncadmin"

# Try SSH with ncadmin
if ssh -o ConnectTimeout=5 $NAS_USER@$NAS_IP "echo 'Connected'" 2>/dev/null; then
  echo "✅ Connected as $NAS_USER"

  # Transfer configure script
  cat scripts/configure-192.168.86.28.sh | ssh $NAS_USER@$NAS_IP "mkdir -p ~/scripts && cat > ~/scripts/configure-192.168.86.28.sh && chmod +x ~/scripts/configure-192.168.86.28.sh"

  # Transfer verify script
  cat scripts/verify-production-readiness.sh | ssh $NAS_USER@$NAS_IP "cat > ~/scripts/verify-production-readiness.sh && chmod +x ~/scripts/verify-production-readiness.sh"

  echo "✅ Scripts transferred!"
else
  echo "❌ Cannot connect. Since you're already on the NAS, create the script there:"
  echo ""
  echo "On the NAS, run:"
  echo "  cd ~/scripts"
  echo "  # Then copy the complete script content"
fi
