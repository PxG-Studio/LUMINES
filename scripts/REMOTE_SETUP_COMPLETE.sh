#!/bin/bash
# REMOTE_SETUP_COMPLETE.sh
# Complete remote setup script - runs on SBX02 via SSH

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Remote SBX02 Setup: microk8s + PostgreSQL 11            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Get iSCSI IQN
echo "▶ Step 1: iSCSI Configuration"
echo "   Please create iSCSI LUN via DSM:"
echo "   1. Open: http://$SECONDARY_IP:5000"
echo "   2. Storage Manager → iSCSI LUN → Create"
echo "   3. LUN: postgresql-data (100GB, Thick Provisioning)"
echo "   4. Target: postgresql-target"
echo ""
read -p "   Enter iSCSI Target IQN: " ISCSI_IQN
if [ -z "$ISCSI_IQN" ]; then
  echo "   ❌ IQN required. Exiting."
  exit 1
fi

# Install microk8s
echo ""
echo "▶ Step 2: Installing microk8s..."
if command -v microk8s > /dev/null 2>&1; then
  echo "   ✅ microk8s installed"
else
  if command -v snap > /dev/null 2>&1; then
    snap install microk8s --classic
    usermod -a -G microk8s $USER
    chown -f -R $USER ~/.kube
    echo "   ✅ microk8s installed"
    echo "   ⚠️  Run: newgrp microk8s, then re-run this script"
    exit 0
  else
    echo "   Installing snapd..."
    apt-get update && apt-get install -y snapd
    systemctl enable --now snapd.socket
    ln -sf /var/lib/snapd/snap /snap
    echo "   ✅ snapd installed. Please log out/in, then re-run"
    exit 0
  fi
fi

# Enable addons
echo ""
echo "▶ Step 3: Enabling microk8s addons..."
microk8s enable dns storage rbac
echo "   ✅ Addons enabled"

# Install iSCSI
echo ""
echo "▶ Step 4: Installing iSCSI initiator..."
if command -v iscsiadm > /dev/null 2>&1; then
  echo "   ✅ open-iscsi installed"
else
  apt-get update && apt-get install -y open-iscsi
  echo "   ✅ open-iscsi installed"
fi

# Connect iSCSI
echo ""
echo "▶ Step 5: Connecting to iSCSI target..."
iscsiadm -m discovery -t st -p $SECONDARY_IP
iscsiadm -m node -T "$ISCSI_IQN" -p $SECONDARY_IP -l
sleep 2
ISCSI_DISK=$(lsblk -o NAME,TYPE | grep disk | tail -1 | awk '{print $1}')
echo "   ✅ Connected. Disk: /dev/$ISCSI_DISK"

# Format if needed
if ! blkid /dev/$ISCSI_DISK > /dev/null 2>&1; then
  echo "   Formatting disk..."
  mkfs.ext4 /dev/$ISCSI_DISK
fi

# Create K8s manifests
echo ""
echo "▶ Step 6: Creating Kubernetes manifests..."
mkdir -p ~/k8s

cat > ~/k8s/iscsi-storageclass.yaml <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: iscsi-postgresql
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
EOF

cat > ~/k8s/postgresql-iscsi-pv.yaml <<EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgresql-pv
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

cat > ~/k8s/postgresql-iscsi-pvc.yaml <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgresql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: iscsi-postgresql
  resources:
    requests:
      storage: 100Gi
EOF

cat > ~/k8s/postgresql-replica-deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgresql-replica
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgresql-replica
  template:
    metadata:
      labels:
        app: postgresql-replica
    spec:
      containers:
      - name: postgresql
        image: postgres:11
        env:
        - name: POSTGRES_PASSWORD
          value: "postgres"
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgresql-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
      volumes:
      - name: postgresql-storage
        persistentVolumeClaim:
          claimName: postgresql-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql-replica-service
spec:
  selector:
    app: postgresql-replica
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql-replica-external
spec:
  selector:
    app: postgresql-replica
  ports:
  - port: 5432
    targetPort: 5432
    nodePort: 30432
  type: NodePort
EOF

echo "   ✅ Manifests created"

# Deploy
echo ""
echo "▶ Step 7: Deploying to Kubernetes..."
microk8s kubectl apply -f ~/k8s/
echo "   ✅ Deployed"

# Wait for pod
echo ""
echo "▶ Step 8: Waiting for pod..."
microk8s kubectl wait --for=condition=ready pod -l app=postgresql-replica --timeout=300s
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')
echo "   ✅ Pod ready: $POD_NAME"

# Configure replication
echo ""
echo "▶ Step 9: Configuring replication..."
microk8s kubectl exec $POD_NAME -- bash -c "
  DATA_DIR=\"/var/lib/postgresql/data/pgdata\"
  PRIMARY_IP=\"$PRIMARY_IP\"
  REPLICATION_PASSWORD=\"$REPLICATION_PASSWORD\"
  pg_ctl stop -D \$DATA_DIR 2>/dev/null || true
  rm -rf \$DATA_DIR/*
  PGPASSWORD=\$REPLICATION_PASSWORD pg_basebackup -h \$PRIMARY_IP -D \$DATA_DIR -U replicator -v -P -W -R
  pg_ctl start -D \$DATA_DIR
"

# Verify
echo ""
echo "▶ Step 10: Verifying replication..."
sleep 5
if microk8s kubectl exec $POD_NAME -- psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ Replication ACTIVE!"
else
  echo "   ⚠️  Check replication status"
fi

echo ""
echo "✅ Setup complete! PostgreSQL 11 replica running in microk8s"
