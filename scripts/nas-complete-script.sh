#!/bin/bash
# This creates the complete script on the NAS
# Run this from your LOCAL machine

NAS_USER="warden-ssh"
NAS_IP="192.168.86.28"

echo "Transferring complete script to NAS..."

# Try different SSH ports
for PORT in 22 2202; do
  if ssh -p $PORT -o ConnectTimeout=5 $NAS_USER@$NAS_IP "echo 'Connected'" 2>/dev/null; then
    echo "✅ Connected via port $PORT"
    cat scripts/configure-192.168.86.28.sh | ssh -p $PORT $NAS_USER@$NAS_IP "cat > ~/scripts/configure-192.168.86.28.sh && chmod +x ~/scripts/configure-192.168.86.28.sh && echo 'Script transferred successfully'"
    exit 0
  fi
done

echo "❌ Could not connect. Please copy script manually."
echo ""
echo "Alternative: On the NAS, run this command to create the complete script:"
echo ""
echo "cd ~/scripts"
echo "cat > configure-192.168.86.28.sh << 'SCRIPTEND'"
cat scripts/configure-192.168.86.28.sh
echo "SCRIPTEND"
echo "chmod +x configure-192.168.86.28.sh"
