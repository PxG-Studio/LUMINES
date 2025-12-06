#!/bin/bash
# setup-microk8s-postgresql.sh
# Complete setup script for microk8s + PostgreSQL 11 with iSCSI storage

set -e

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
REPLICATION_PASSWORD="Replication2024Secure"
ISCSI_TARGET_IQN="${ISCSI_TARGET_IQN:-iqn.2000-01.com.synology:postgresql-target}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  microk8s + PostgreSQL 11 Setup with iSCSI Storage      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check microk8s installation
echo "▶ Step 1: Checking microk8s installation..."
if ! command -v microk8s > /dev/null 2>&1; then
  echo "   microk8s not found. Installing..."
  sudo snap install microk8s --classic
  sudo usermod -a -G microk8s $USER
  sudo chown -f -R $USER ~/.kube
  echo "   ✅ microk8s installed"
  echo "   ⚠️  Please log out and back in, or run: newgrp microk8s"
  exit 0
else
  echo "   ✅ microk8s is installed"
fi

# Step 2: Enable microk8s addons
echo ""
echo "▶ Step 2: Enabling microk8s addons..."
microk8s enable dns
microk8s enable storage
microk8s enable rbac
echo "   ✅ Addons enabled"

# Step 3: Check iSCSI initiator
echo ""
echo "▶ Step 3: Checking iSCSI initiator..."
if ! command -v iscsiadm > /dev/null 2>&1; then
  echo "   Installing open-iscsi..."
  sudo apt-get update
  sudo apt-get install -y open-iscsi
  echo "   ✅ open-iscsi installed"
else
  echo "   ✅ open-iscsi is installed"
fi

# Step 4: Discover and connect to iSCSI target
echo ""
echo "▶ Step 4: Connecting to iSCSI target on $SECONDARY_IP..."
echo "   Discovering targets..."
sudo iscsiadm -m discovery -t st -p $SECONDARY_IP || {
  echo "   ⚠️  Could not discover targets. Please configure iSCSI LUN on SBX02 first."
  exit 1
}

echo "   Logging in to target: $ISCSI_TARGET_IQN"
sudo iscsiadm -m node -T "$ISCSI_TARGET_IQN" -p $SECONDARY_IP -l || {
  echo "   ⚠️  Could not login. Check iSCSI target configuration."
  exit 1
}
echo "   ✅ Connected to iSCSI target"

# Step 5: Find iSCSI disk
echo ""
echo "▶ Step 5: Finding iSCSI disk..."
sleep 2
ISCSI_DISK=$(lsblk -o NAME,TYPE | grep disk | tail -1 | awk '{print $1}')
if [ -z "$ISCSI_DISK" ]; then
  echo "   ❌ Could not find iSCSI disk"
  exit 1
fi
echo "   Found disk: /dev/$ISCSI_DISK"

# Step 6: Format disk if needed
echo ""
echo "▶ Step 6: Checking disk format..."
if ! blkid /dev/$ISCSI_DISK > /dev/null 2>&1; then
  echo "   Formatting disk with ext4..."
  sudo mkfs.ext4 /dev/$ISCSI_DISK
  echo "   ✅ Disk formatted"
else
  echo "   ✅ Disk already formatted"
fi

# Step 7: Update PersistentVolume with correct IQN
echo ""
echo "▶ Step 7: Configuring Kubernetes manifests..."
K8S_DIR="$(dirname $0)/../k8s"
sed -i "s|iqn.2000-01.com.synology:postgresql-target|$ISCSI_TARGET_IQN|g" "$K8S_DIR/postgresql-iscsi-pv.yaml"
echo "   ✅ Manifests configured"

# Step 8: Apply Kubernetes manifests
echo ""
echo "▶ Step 8: Deploying to Kubernetes..."
microk8s kubectl apply -f "$K8S_DIR/iscsi-storageclass.yaml"
microk8s kubectl apply -f "$K8S_DIR/postgresql-iscsi-pv.yaml"
microk8s kubectl apply -f "$K8S_DIR/postgresql-iscsi-pvc.yaml"
microk8s kubectl apply -f "$K8S_DIR/postgresql-replica-deployment.yaml"

echo "   ✅ Deployed to Kubernetes"

# Step 9: Wait for pod to be ready
echo ""
echo "▶ Step 9: Waiting for PostgreSQL pod to be ready..."
microk8s kubectl wait --for=condition=ready pod -l app=postgresql-replica --timeout=300s || {
  echo "   ⚠️  Pod not ready. Check logs:"
  microk8s kubectl get pods -l app=postgresql-replica
  exit 1
}
echo "   ✅ Pod is ready"

# Step 10: Configure replication
echo ""
echo "▶ Step 10: Configuring PostgreSQL replication..."
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')
echo "   Pod name: $POD_NAME"

# Wait a bit for PostgreSQL to initialize
sleep 5

# Configure replication
microk8s kubectl exec $POD_NAME -- bash -c "
  DATA_DIR=\"/var/lib/postgresql/data/pgdata\"
  PRIMARY_IP=\"$PRIMARY_IP\"
  REPLICATION_PASSWORD=\"$REPLICATION_PASSWORD\"

  # Stop PostgreSQL if running
  pg_ctl stop -D \$DATA_DIR 2>/dev/null || true

  # Remove existing data
  rm -rf \$DATA_DIR/*

  # Perform base backup
  PGPASSWORD=\$REPLICATION_PASSWORD pg_basebackup \
    -h \$PRIMARY_IP \
    -D \$DATA_DIR \
    -U replicator \
    -v -P -W -R

  # Start PostgreSQL
  pg_ctl start -D \$DATA_DIR
"

echo "   ✅ Replication configured"

# Step 11: Verify replication
echo ""
echo "▶ Step 11: Verifying replication..."
sleep 5
if microk8s kubectl exec $POD_NAME -- psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ PostgreSQL is in recovery mode"
  echo "   ✅ Replication is ACTIVE!"
else
  echo "   ⚠️  Replication may not be active. Check manually:"
  echo "   microk8s kubectl exec $POD_NAME -- psql -c \"SELECT pg_is_in_recovery();\""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "PostgreSQL 11 replica is running in microk8s!"
echo ""
echo "Access PostgreSQL:"
echo "  Internal: postgresql-replica-service:5432"
echo "  External: $SECONDARY_IP:30432"
echo ""
echo "Check status:"
echo "  microk8s kubectl get pods -l app=postgresql-replica"
echo "  microk8s kubectl exec $POD_NAME -- psql -c \"SELECT pg_is_in_recovery();\""
echo ""
