#!/bin/bash
# transfer-to-sbx02.sh
# Transfer setup files to SBX02

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"

echo "Transferring files to SBX02 ($SBX02_IP)..."

# Create directory structure on SBX02
ssh $SBX02_USER@$SBX02_IP "mkdir -p ~/postgresql-setup/k8s"

# Transfer scripts
scp scripts/setup-sbx02-complete.sh $SBX02_USER@$SBX02_IP:~/postgresql-setup/
scp scripts/setup-microk8s-postgresql.sh $SBX02_USER@$SBX02_IP:~/postgresql-setup/ 2>/dev/null || true

# Transfer Kubernetes manifests
scp k8s/*.yaml $SBX02_USER@$SBX02_IP:~/postgresql-setup/k8s/

# Transfer documentation
scp QUICK_START_MICROK8S.md $SBX02_USER@$SBX02_IP:~/postgresql-setup/ 2>/dev/null || true
scp scripts/setup-iscsi-luns-sbx02.md $SBX02_USER@$SBX02_IP:~/postgresql-setup/ 2>/dev/null || true

echo "✅ Files transferred!"
echo ""
echo "On SBX02, run:"
echo "  cd ~/postgresql-setup"
echo "  chmod +x setup-sbx02-complete.sh"
echo "  sudo ./setup-sbx02-complete.sh"
echo ""
