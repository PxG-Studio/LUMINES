# Quick Start: microk8s + PostgreSQL 11 with iSCSI Storage

## Overview

This setup deploys PostgreSQL 11 in a Kubernetes container on microk8s, using iSCSI LUNs from SBX02 (Synology NAS) for persistent storage, and configures it as a replica of PRIMARY (192.168.86.27).

## Architecture

```
SBX02 (192.168.86.28)
├── iSCSI LUN: postgresql-data (100GB)
└── microk8s Node
    └── PostgreSQL 11 Pod
        └── Replicating from PRIMARY (192.168.86.27)
```

## Prerequisites

1. ✅ PRIMARY (192.168.86.27) - Already configured and ready
2. ⚠️ SBX02 (192.168.86.28) - Need to set up:
   - iSCSI LUN configured
   - microk8s installed (on SBX02 or separate server)
   - iSCSI initiator installed

## Step 1: Configure iSCSI LUN on SBX02

**Via Synology DSM Web Interface:**

1. Open Storage Manager → iSCSI LUN
2. Create LUN:
   - Name: `postgresql-data`
   - Size: 100GB
   - Thick Provisioning: Yes
3. Create Target:
   - Name: `postgresql-target`
   - Note the IQN (e.g., `iqn.2000-01.com.synology:SBX02.postgresql-target`)
4. Configure Network:
   - Allow access from: `192.168.86.0/24` (or specific IPs)

**See:** `scripts/setup-iscsi-luns-sbx02.md` for detailed instructions

## Step 2: Install microk8s

**On the server where microk8s will run (could be SBX02 or separate server):**

```bash
# Install microk8s
sudo snap install microk8s --classic

# Add user to microk8s group
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube

# Log out and back in, or:
newgrp microk8s

# Enable addons
microk8s enable dns
microk8s enable storage
microk8s enable rbac

# Verify
microk8s status --wait-ready
```

## Step 3: Install iSCSI Initiator

```bash
# Install open-iscsi
sudo apt-get update
sudo apt-get install -y open-iscsi

# Discover iSCSI targets
sudo iscsiadm -m discovery -t st -p 192.168.86.28

# Note the IQN from output, then login
sudo iscsiadm -m node -T <TARGET_IQN> -p 192.168.86.28 -l

# Verify disk
lsblk
```

## Step 4: Update Kubernetes Manifests

**Update the IQN in the PersistentVolume:**

```bash
# Edit k8s/postgresql-iscsi-pv.yaml
# Replace: iqn.2000-01.com.synology:postgresql-target
# With: Your actual IQN from Step 1
```

## Step 5: Deploy PostgreSQL 11

```bash
# Apply all manifests
microk8s kubectl apply -f k8s/iscsi-storageclass.yaml
microk8s kubectl apply -f k8s/postgresql-iscsi-pv.yaml
microk8s kubectl apply -f k8s/postgresql-iscsi-pvc.yaml
microk8s kubectl apply -f k8s/postgresql-replica-deployment.yaml

# Check status
microk8s kubectl get pods -l app=postgresql-replica
microk8s kubectl get pv
microk8s kubectl get pvc
```

## Step 6: Configure Replication

**Wait for pod to be ready, then configure replication:**

```bash
# Get pod name
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')

# Access container
microk8s kubectl exec -it $POD_NAME -- bash

# Inside container, configure replication
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"
DATA_DIR="/var/lib/postgresql/data/pgdata"

# Stop PostgreSQL
pg_ctl stop -D "$DATA_DIR"

# Remove existing data
rm -rf "$DATA_DIR"/*

# Perform base backup from PRIMARY
PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
  -h $PRIMARY_IP \
  -D "$DATA_DIR" \
  -U replicator \
  -v -P -W -R

# Start PostgreSQL
pg_ctl start -D "$DATA_DIR"

# Verify replication
psql -c "SELECT pg_is_in_recovery();"
# Should return: t (true)
```

## Step 7: Verify Setup

```bash
# Check pod status
microk8s kubectl get pods -l app=postgresql-replica

# Check replication
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')
microk8s kubectl exec $POD_NAME -- psql -c "SELECT pg_is_in_recovery();"
microk8s kubectl exec $POD_NAME -- psql -c "SELECT * FROM pg_stat_wal_receiver;"

# Test connection
PGPASSWORD="Replication2024Secure" psql -h 192.168.86.28 -p 30432 -U replicator -d postgres -c "SELECT 1;"
```

## Access PostgreSQL

- **Internal (within cluster):** `postgresql-replica-service:5432`
- **External:** `192.168.86.28:30432` (NodePort)

## Monitoring

```bash
# Pod logs
microk8s kubectl logs -l app=postgresql-replica -f

# Pod status
microk8s kubectl describe pod -l app=postgresql-replica

# Storage status
microk8s kubectl describe pv postgresql-pv
microk8s kubectl describe pvc postgresql-pvc
```

## Troubleshooting

### Pod Not Starting
```bash
# Check events
microk8s kubectl describe pod -l app=postgresql-replica

# Check logs
microk8s kubectl logs -l app=postgresql-replica
```

### iSCSI Connection Issues
```bash
# Check iSCSI session
sudo iscsiadm -m session

# Reconnect if needed
sudo iscsiadm -m node -T <TARGET_IQN> -p 192.168.86.28 -l
```

### Replication Not Working
```bash
# Check PRIMARY is accessible
PGPASSWORD="Replication2024Secure" psql -h 192.168.86.27 -U replicator -d postgres -c "SELECT 1;"

# Check replication status
microk8s kubectl exec $POD_NAME -- psql -c "SELECT pg_is_in_recovery();"
```

## Benefits

✅ **PostgreSQL 11** - No need to upgrade system PostgreSQL
✅ **Persistent Storage** - iSCSI LUNs provide reliable storage
✅ **Containerized** - Easy management and updates
✅ **Kubernetes** - Scaling, monitoring, and orchestration
✅ **Replication Ready** - Can replicate from PRIMARY immediately

## Files Created

- `k8s/iscsi-storageclass.yaml` - Storage class for iSCSI
- `k8s/postgresql-iscsi-pv.yaml` - PersistentVolume for iSCSI LUN
- `k8s/postgresql-iscsi-pvc.yaml` - PersistentVolumeClaim
- `k8s/postgresql-replica-deployment.yaml` - PostgreSQL 11 deployment
- `scripts/setup-microk8s-postgresql.sh` - Automated setup script
- `scripts/setup-iscsi-luns-sbx02.md` - iSCSI LUN setup guide

## Next Steps

1. ✅ Set up iSCSI LUN on SBX02
2. ✅ Install microk8s
3. ✅ Configure iSCSI connection
4. ✅ Deploy PostgreSQL 11
5. ✅ Configure replication
6. ✅ Verify replication is active

**This solves the PostgreSQL version problem elegantly!**
