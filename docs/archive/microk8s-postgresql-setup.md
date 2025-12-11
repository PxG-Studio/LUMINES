# microk8s + PostgreSQL 11 Setup on SBX02 (192.168.86.28)

## Architecture Overview

```
SBX02 (192.168.86.28)
├── iSCSI LUNs (Storage)
├── microk8s (Kubernetes)
│   └── PostgreSQL 11 Container
│       └── Using iSCSI LUNs for persistent storage
└── Replication to PRIMARY (192.168.86.27)
```

## Step 1: Configure iSCSI LUNs on SBX02 (Synology NAS)

### Via Synology DSM Web Interface

1. **Open Storage Manager**
   - Go to: Storage Manager → iSCSI LUN
   - Click "Create" → "Create LUN"

2. **LUN Configuration**
   - **Name:** `postgresql-data`
   - **Location:** Select volume (e.g., Volume1)
   - **Size:** Recommended 100GB+ (adjust based on needs)
   - **Thick Provisioning:** Yes (for better performance)
   - **Space Allocation:** Thick Provisioning
   - **Description:** PostgreSQL 11 persistent storage

3. **iSCSI Target Configuration**
   - Create new iSCSI Target or use existing
   - **Target Name:** `postgresql-target`
   - **IQN:** Auto-generated (e.g., `iqn.2000-01.com.synology:postgresql-target`)
   - **Authentication:** CHAP (recommended) or None
   - **LUN Mapping:** Map `postgresql-data` LUN to target

4. **Network Configuration**
   - Allow access from: `192.168.86.0/24` (or specific IPs)
   - Port: 3260 (default iSCSI port)

### Via Command Line (Alternative)

```bash
# On SBX02, check iSCSI service
/usr/syno/bin/synopkg status iscsi

# Create LUN via command (if supported)
# Note: Synology typically requires DSM web interface for LUN creation
```

## Step 2: Install microk8s

### On the Server Running microk8s (could be SBX02 or separate server)

```bash
# Install microk8s
sudo snap install microk8s --classic

# Add user to microk8s group
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube
newgrp microk8s

# Enable required addons
microk8s enable dns
microk8s enable storage
microk8s enable rbac

# Check status
microk8s status --wait-ready
```

## Step 3: Configure iSCSI Storage for Kubernetes

### Install iSCSI Initiator on microk8s Node

```bash
# Install open-iscsi
sudo apt-get update
sudo apt-get install -y open-iscsi

# Discover iSCSI targets on SBX02
sudo iscsiadm -m discovery -t st -p 192.168.86.28

# Login to iSCSI target
sudo iscsiadm -m node -T <TARGET_IQN> -p 192.168.86.28 -l

# Verify disk
lsblk
# Should show new disk (e.g., /dev/sdb)
```

### Create StorageClass for iSCSI

```yaml
# iscsi-storageclass.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: iscsi-postgresql
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

```bash
microk8s kubectl apply -f iscsi-storageclass.yaml
```

## Step 4: Deploy PostgreSQL 11 Container

### Create PersistentVolume for iSCSI LUN

```yaml
# postgresql-pv.yaml
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
    targetPortal: 192.168.86.28:3260
    iqn: iqn.2000-01.com.synology:postgresql-target
    lun: 0
    fsType: ext4
    readOnly: false
```

### Create PersistentVolumeClaim

```yaml
# postgresql-pvc.yaml
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
```

### Create PostgreSQL 11 Deployment

```yaml
# postgresql-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgresql-replica
  labels:
    app: postgresql-replica
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
          name: postgresql
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
  - protocol: TCP
    port: 5432
    targetPort: 5432
  type: ClusterIP
```

### Deploy PostgreSQL

```bash
# Apply configurations
microk8s kubectl apply -f postgresql-pv.yaml
microk8s kubectl apply -f postgresql-pvc.yaml
microk8s kubectl apply -f postgresql-deployment.yaml

# Check status
microk8s kubectl get pods
microk8s kubectl get pv
microk8s kubectl get pvc
```

## Step 5: Configure PostgreSQL 11 Replica

### Access PostgreSQL Container

```bash
# Get pod name
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')

# Access PostgreSQL container
microk8s kubectl exec -it $POD_NAME -- bash
```

### Inside Container: Setup Replication

```bash
# Inside PostgreSQL container
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"
DATA_DIR="/var/lib/postgresql/data/pgdata"

# Stop PostgreSQL (if running)
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

## Step 6: Expose PostgreSQL Service

### Create NodePort or LoadBalancer Service

```yaml
# postgresql-service-external.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgresql-replica-external
spec:
  selector:
    app: postgresql-replica
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
    nodePort: 30432
  type: NodePort
```

```bash
microk8s kubectl apply -f postgresql-service-external.yaml

# Test connection
PGPASSWORD="Replication2024Secure" psql -h 192.168.86.28 -p 30432 -U replicator -d postgres -c "SELECT 1;"
```

## Step 7: Monitoring and Maintenance

### Check Replication Status

```bash
# Access container
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')
microk8s kubectl exec -it $POD_NAME -- psql -c "SELECT pg_is_in_recovery();"
microk8s kubectl exec -it $POD_NAME -- psql -c "SELECT * FROM pg_stat_wal_receiver;"
```

### Backup Script

```bash
# postgresql-backup.sh
#!/bin/bash
POD_NAME=$(microk8s kubectl get pods -l app=postgresql-replica -o jsonpath='{.items[0].metadata.name}')
BACKUP_DIR="/volume1/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

microk8s kubectl exec $POD_NAME -- pg_dumpall | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"
```

## Benefits of This Approach

✅ **PostgreSQL 11 in container** - No need to upgrade system PostgreSQL
✅ **Persistent storage** - iSCSI LUNs provide reliable storage
✅ **Kubernetes management** - Easy scaling, updates, monitoring
✅ **Isolation** - Containerized, doesn't affect system services
✅ **Replication ready** - Can replicate from PRIMARY immediately

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│ SBX02 (192.168.86.28)                                    │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────────────┐ │
│  │  Synology DSM    │    │   microk8s Node          │ │
│  │                  │    │                          │ │
│  │  iSCSI Target    │───▶│  ┌────────────────────┐ │ │
│  │  LUN: postgresql │    │  │ PostgreSQL 11 Pod   │ │ │
│  │  -data (100GB)   │    │  │ - Replica Mode      │ │ │
│  └──────────────────┘    │  │ - iSCSI Storage     │ │ │
│                           │  └────────────────────┘ │ │
│                           └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Replication
                            ▼
┌─────────────────────────────────────────────────────────┐
│ PRIMARY (192.168.86.27)                                  │
│  ┌────────────────────┐                                  │
│  │ PostgreSQL 11.11   │                                  │
│  │ - Primary          │                                  │
│  │ - Replication Ready│                                  │
│  └────────────────────┘                                  │
└─────────────────────────────────────────────────────────┘
```

## Next Steps

1. ✅ Set up iSCSI LUNs on SBX02
2. ✅ Install microk8s
3. ✅ Configure iSCSI storage
4. ✅ Deploy PostgreSQL 11 container
5. ✅ Configure replication to PRIMARY
6. ✅ Verify replication is active

**This solves the PostgreSQL version problem elegantly!**
