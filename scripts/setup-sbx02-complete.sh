#!/bin/bash
# setup-sbx02-complete.sh
# Complete setup script for SBX02 - iSCSI LUNs + microk8s + PostgreSQL 11
# Run this on SBX02 (192.168.86.28) or transfer and run it

set -e

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Complete SBX02 Setup: iSCSI + microk8s + PostgreSQL 11    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if running on Synology
if [ -f /etc/synoinfo.conf ]; then
  echo "✅ Running on Synology NAS"
  IS_SYNOLOGY=true
else
  echo "⚠️  Not running on Synology - some steps may need adjustment"
  IS_SYNOLOGY=false
fi

# Step 1: Check iSCSI service
echo ""
echo "▶ Step 1: Checking iSCSI service..."
if [ "$IS_SYNOLOGY" = true ]; then
  if /usr/syno/bin/synopkg status iscsi | grep -q "started"; then
    echo "   ✅ iSCSI service is running"
  else
    echo "   ⚠️  iSCSI service not running"
    echo "   Starting iSCSI service..."
    /usr/syno/bin/synopkg start iscsi || {
      echo "   ❌ Could not start iSCSI service"
      echo "   Please start it via DSM: Storage Manager → iSCSI"
      exit 1
    }
  fi
else
  echo "   ⚠️  Not on Synology - please configure iSCSI manually"
fi

# Step 2: Check/create iSCSI LUN (via command if possible, otherwise instructions)
echo ""
echo "▶ Step 2: iSCSI LUN Configuration..."
if [ "$IS_SYNOLOGY" = true ]; then
  echo "   ⚠️  iSCSI LUN creation requires DSM web interface"
  echo ""
  echo "   Please create iSCSI LUN via DSM:"
  echo "   1. Open Storage Manager → iSCSI LUN"
  echo "   2. Create LUN:"
  echo "      - Name: postgresql-data"
  echo "      - Size: 100GB"
  echo "      - Thick Provisioning: Yes"
  echo "   3. Create Target:"
  echo "      - Name: postgresql-target"
  echo "      - Note the IQN (you'll need it!)"
  echo "   4. Configure Network:"
  echo "      - Allow: 192.168.86.0/24"
  echo ""
  read -p "   Have you created the iSCSI LUN? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   ⚠️  Please create the iSCSI LUN first, then re-run this script"
    exit 1
  fi

  # Try to get IQN (may not work via command line)
  echo "   Please provide the iSCSI Target IQN:"
  read -p "   IQN: " ISCSI_IQN
  if [ -z "$ISCSI_IQN" ]; then
    echo "   ⚠️  IQN not provided. You can find it in DSM:"
    echo "      Storage Manager → iSCSI Target → Select target → View IQN"
    echo "   Then update k8s/postgresql-iscsi-pv.yaml with the IQN"
    ISCSI_IQN="iqn.2000-01.com.synology:SBX02.postgresql-target"
    echo "   Using placeholder: $ISCSI_IQN"
  fi
else
  echo "   Please configure iSCSI LUN manually"
  read -p "   iSCSI Target IQN: " ISCSI_IQN
fi

# Step 3: Install microk8s
echo ""
echo "▶ Step 3: Installing microk8s..."
if command -v microk8s > /dev/null 2>&1; then
  echo "   ✅ microk8s is already installed"
  microk8s version
else
  echo "   Installing microk8s..."
  if command -v snap > /dev/null 2>&1; then
    sudo snap install microk8s --classic
    sudo usermod -a -G microk8s $USER
    sudo chown -f -R $USER ~/.kube
    echo "   ✅ microk8s installed"
    echo "   ⚠️  Please log out and back in, or run: newgrp microk8s"
    echo "   Then re-run this script"
    exit 0
  else
    echo "   ❌ snap not available. Please install snap first:"
    echo "      sudo apt-get update && sudo apt-get install -y snapd"
    exit 1
  fi
fi

# Step 4: Enable microk8s addons
echo ""
echo "▶ Step 4: Enabling microk8s addons..."
microk8s enable dns
microk8s enable storage
microk8s enable rbac
echo "   ✅ Addons enabled"

# Step 5: Install iSCSI initiator
echo ""
echo "▶ Step 5: Installing iSCSI initiator..."
if command -v iscsiadm > /dev/null 2>&1; then
  echo "   ✅ open-iscsi is installed"
else
  echo "   Installing open-iscsi..."
  if command -v apt-get > /dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y open-iscsi
  elif command -v yum > /dev/null 2>&1; then
    sudo yum install -y iscsi-initiator-utils
  else
    echo "   ⚠️  Package manager not found. Please install open-iscsi manually"
    exit 1
  fi
  echo "   ✅ open-iscsi installed"
fi

# Step 6: Connect to iSCSI target
echo ""
echo "▶ Step 6: Connecting to iSCSI target..."
echo "   Discovering targets on $SECONDARY_IP..."
sudo iscsiadm -m discovery -t st -p $SECONDARY_IP || {
  echo "   ⚠️  Could not discover targets. Check:"
  echo "      - iSCSI service is running on SBX02"
  echo "      - Network connectivity: ping $SECONDARY_IP"
  echo "      - iSCSI port is open: telnet $SECONDARY_IP 3260"
  exit 1
}

echo "   Logging in to target: $ISCSI_IQN"
sudo iscsiadm -m node -T "$ISCSI_IQN" -p $SECONDARY_IP -l || {
  echo "   ⚠️  Could not login. Check IQN and credentials"
  exit 1
}
echo "   ✅ Connected to iSCSI target"

# Step 7: Find and format iSCSI disk
echo ""
echo "▶ Step 7: Setting up iSCSI disk..."
sleep 2
ISCSI_DISK=$(lsblk -o NAME,TYPE | grep disk | tail -1 | awk '{print $1}')
if [ -z "$ISCSI_DISK" ]; then
  echo "   ❌ Could not find iSCSI disk"
  exit 1
fi
echo "   Found disk: /dev/$ISCSI_DISK"

if ! blkid /dev/$ISCSI_DISK > /dev/null 2>&1; then
  echo "   Formatting disk with ext4..."
  sudo mkfs.ext4 /dev/$ISCSI_DISK
  echo "   ✅ Disk formatted"
else
  echo "   ✅ Disk already formatted"
fi

# Step 8: Update Kubernetes manifests
echo ""
echo "▶ Step 8: Configuring Kubernetes manifests..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$SCRIPT_DIR/../k8s"

if [ ! -d "$K8S_DIR" ]; then
  echo "   ⚠️  k8s directory not found. Creating it..."
  mkdir -p "$K8S_DIR"
fi

# Update PV with correct IQN
if [ -f "$K8S_DIR/postgresql-iscsi-pv.yaml" ]; then
  sed -i "s|iqn.2000-01.com.synology:postgresql-target|$ISCSI_IQN|g" "$K8S_DIR/postgresql-iscsi-pv.yaml"
  echo "   ✅ Updated PersistentVolume with IQN: $ISCSI_IQN"
else
  echo "   ⚠️  postgresql-iscsi-pv.yaml not found. Creating it..."
  cat > "$K8S_DIR/postgresql-iscsi-pv.yaml" <<EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgresql-pv
  labels:
    type: iscsi
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: iscsi-postgresql
  iscsi:
    targetPortal: $SECONDARY_IP:3260
    iqn: $ISCSI_IQN
    lun: 0
    fsType: ext4
    readOnly: false
EOF
fi

# Step 9: Deploy to Kubernetes
echo ""
echo "▶ Step 9: Deploying to Kubernetes..."
microk8s kubectl apply -f "$K8S_DIR/iscsi-storageclass.yaml" 2>/dev/null || {
  echo "   Creating StorageClass..."
  cat > "$K8S_DIR/iscsi-storageclass.yaml" <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: iscsi-postgresql
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
EOF
  microk8s kubectl apply -f "$K8S_DIR/iscsi-storageclass.yaml"
}

microk8s kubectl apply -f "$K8S_DIR/postgresql-iscsi-pv.yaml"
microk8s kubectl apply -f "$K8S_DIR/postgresql-iscsi-pvc.yaml"
microk8s kubectl apply -f "$K8S_DIR/postgresql-replica-deployment.yaml"

echo "   ✅ Deployed to Kubernetes"

# Step 10: Wait for pod
echo ""
echo "▶ Step 10: Waiting for PostgreSQL pod to be ready..."
microk8s kubectl wait --for=condition=ready pod -l app=postgresql-replica --timeout=300s || {
  echo "   ⚠️  Pod not ready. Checking status..."
  microk8s kubectl get pods -l app=postgresql-replica
  microk8s kubectl describe pod -l app=postgresql-replica | tail -20
  exit 1
}
echo "   ✅ Pod is ready"

# Step 11: Configure replication
echo ""
echo "▶ Step 11: Configuring PostgreSQL replication..."
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')
echo "   Pod name: $POD_NAME"

sleep 5

# Configure replication inside container
microk8s kubectl exec $POD_NAME -- bash -c "
  DATA_DIR=\"/var/lib/postgresql/data/pgdata\"
  PRIMARY_IP=\"$PRIMARY_IP\"
  REPLICATION_PASSWORD=\"$REPLICATION_PASSWORD\"

  # Stop PostgreSQL if running
  pg_ctl stop -D \$DATA_DIR 2>/dev/null || true

  # Remove existing data
  rm -rf \$DATA_DIR/*

  # Perform base backup
  echo \"Performing base backup from PRIMARY...\"
  PGPASSWORD=\$REPLICATION_PASSWORD pg_basebackup \
    -h \$PRIMARY_IP \
    -D \$DATA_DIR \
    -U replicator \
    -v -P -W -R || {
    echo \"Base backup failed. Check PRIMARY connectivity.\"
    exit 1
  }

  # Start PostgreSQL
  pg_ctl start -D \$DATA_DIR
  sleep 3
"

echo "   ✅ Replication configured"

# Step 12: Verify replication
echo ""
echo "▶ Step 12: Verifying replication..."
sleep 5
if microk8s kubectl exec $POD_NAME -- psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ PostgreSQL is in recovery mode"
  echo "   ✅ Replication is ACTIVE!"

  echo ""
  echo "   Replication status:"
  microk8s kubectl exec $POD_NAME -- psql -c "SELECT * FROM pg_stat_wal_receiver;" 2>/dev/null || echo "   Stats not available"
else
  echo "   ⚠️  Replication may not be active. Check manually:"
  echo "   microk8s kubectl exec $POD_NAME -- psql -c \"SELECT pg_is_in_recovery();\""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL 11 replica is running in microk8s!"
echo ""
echo "Access PostgreSQL:"
echo "  Internal: postgresql-replica-service:5432"
echo "  External: $SECONDARY_IP:30432"
echo ""
echo "Useful commands:"
echo "  microk8s kubectl get pods -l app=postgresql-replica"
echo "  microk8s kubectl exec $POD_NAME -- psql -c \"SELECT pg_is_in_recovery();\""
echo "  microk8s kubectl logs -l app=postgresql-replica -f"
echo ""
