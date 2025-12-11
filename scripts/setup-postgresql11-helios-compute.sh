#!/bin/bash
# setup-postgresql11-helios-compute.sh
# Sets up PostgreSQL 11 on Helios Compute (192.168.86.115) with SBX02 iSCSI storage

set -e

HELIOS_COMPUTE="192.168.86.115"  # Helios Compute IP
SBX02_IP="192.168.86.28"
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 DR Setup on Helios Compute               ║"
echo "║  With SBX02 iSCSI Storage                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on Helios Compute
run_remote() {
  ssh $HELIOS_COMPUTE "$1"
}

# Step 1: Check Docker
echo "▶ Step 1: Checking Docker..."
if run_remote "which docker" > /dev/null 2>&1; then
  echo "✅ Docker is installed"
  DOCKER_VERSION=$(run_remote "docker --version")
  echo "   $DOCKER_VERSION"
else
  echo "❌ Docker not found. Installing Docker..."
  run_remote "curl -fsSL https://get.docker.com -o /tmp/get-docker.sh && sudo sh /tmp/get-docker.sh"
  echo "✅ Docker installed"
fi
echo ""

# Step 2: Check iSCSI tools
echo "▶ Step 2: Checking iSCSI initiator tools..."
if run_remote "which iscsiadm" > /dev/null 2>&1; then
  echo "✅ iSCSI tools installed"
else
  echo "Installing iSCSI initiator tools..."
  run_remote "sudo apt-get update && sudo apt-get install -y open-iscsi"
  echo "✅ iSCSI tools installed"
fi
echo ""

# Step 3: Discover iSCSI target on SBX02
echo "▶ Step 3: Discovering iSCSI target on SBX02..."
echo "   Note: iSCSI LUN must be created on SBX02 first via DSM"
echo ""
read -p "Have you created the iSCSI LUN on SBX02? (y/n): " ISCSI_READY
if [ "$ISCSI_READY" != "y" ]; then
  echo "Please create iSCSI LUN on SBX02 first:"
  echo "  1. Open DSM: http://192.168.86.28:5000"
  echo "  2. Install iSCSI Manager"
  echo "  3. Create Target: postgresql-storage"
  echo "  4. Create LUN: postgresql-data (100GB)"
  echo "  5. Note the IQN"
  echo ""
  exit 1
fi

echo "Discovering iSCSI targets..."
TARGETS=$(run_remote "sudo iscsiadm -m discovery -t st -p $SBX02_IP 2>&1")
echo "$TARGETS"
echo ""

read -p "Enter iSCSI Target IQN (from above): " TARGET_IQN
echo ""

# Step 4: Connect to iSCSI target
echo "▶ Step 4: Connecting to iSCSI target..."
run_remote "sudo iscsiadm -m node -T $TARGET_IQN -p $SBX02_IP --login"
sleep 3
echo "✅ Connected to iSCSI target"
echo ""

# Step 5: Find iSCSI device
echo "▶ Step 5: Finding iSCSI device..."
ISCSI_DEVICE=$(run_remote "lsblk | grep -i iscsi | awk '{print \$1}' | head -1 || ls -la /dev/disk/by-path/ | grep iscsi | tail -1 | awk '{print \$NF}'")
echo "iSCSI device: $ISCSI_DEVICE"
echo ""

# Step 6: Format and mount (if not already done)
echo "▶ Step 6: Preparing storage..."
read -p "Format iSCSI device? (WARNING: This will erase all data) (y/n): " FORMAT
if [ "$FORMAT" = "y" ]; then
  echo "Formatting as ext4..."
  run_remote "sudo mkfs.ext4 /dev/$ISCSI_DEVICE"
  echo "✅ Formatted"
fi

# Create mount point
run_remote "sudo mkdir -p /mnt/postgresql-data"
run_remote "sudo mount /dev/$ISCSI_DEVICE /mnt/postgresql-data 2>/dev/null || echo 'Already mounted'"
run_remote "sudo chown -R 999:999 /mnt/postgresql-data"
echo "✅ Storage prepared: /mnt/postgresql-data"
echo ""

# Step 7: Create PostgreSQL 11 container
echo "▶ Step 7: Creating PostgreSQL 11 container with minimal memory config..."
run_remote "sudo docker stop postgresql11-dr 2>/dev/null || true"
run_remote "sudo docker rm postgresql11-dr 2>/dev/null || true"

# Create minimal postgresql.conf
run_remote "sudo tee /mnt/postgresql-data/postgresql.conf > /dev/null << 'PG_CONF_EOF'
# PostgreSQL 11 Minimal Configuration for DR/Replica Node
shared_buffers = 64MB
work_mem = 1MB
maintenance_work_mem = 16MB
effective_cache_size = 128MB
wal_level = replica
max_wal_senders = 3
max_replication_slots = 1
archive_mode = on
archive_timeout = 60s
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9
max_worker_processes = 2
max_parallel_workers_per_gather = 0
max_parallel_workers = 1
max_connections = 10
logging_collector = on
log_min_duration_statement = 2000
listen_addresses = '*'
port = 5432
PG_CONF_EOF
"

# Create pg_hba.conf
run_remote "sudo tee /mnt/postgresql-data/pg_hba.conf > /dev/null << 'HBA_EOF'
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    replication     replicator      $PRIMARY_IP/32           md5
host    all             all             192.168.86.0/24          md5
HBA_EOF
"

run_remote "sudo chown -R 999:999 /mnt/postgresql-data"

# Initialize database if needed
if [ ! -d "/mnt/postgresql-data/pgdata" ]; then
  echo "Initializing PostgreSQL 11 database..."
  run_remote "sudo docker run --rm \
    -v /mnt/postgresql-data:/var/lib/postgresql/data \
    -e POSTGRES_PASSWORD=changeme \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    postgres:11 \
    initdb -D /var/lib/postgresql/data/pgdata --locale=en_US.UTF-8"
fi

# Start PostgreSQL 11 container
echo "Starting PostgreSQL 11 container..."
run_remote "sudo docker run -d \
  --name postgresql11-dr \
  --restart unless-stopped \
  -p 5432:5432 \
  -v /mnt/postgresql-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=changeme \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  postgres:11 \
  -c 'config_file=/var/lib/postgresql/data/postgresql.conf'"

sleep 5
echo "✅ PostgreSQL 11 container started"
echo ""

# Step 8: Verify
echo "▶ Step 8: Verifying installation..."
if run_remote "sudo docker ps | grep postgresql11-dr" > /dev/null 2>&1; then
  echo "✅ Container is running"
  VERSION=$(run_remote "sudo docker exec postgresql11-dr psql --version | awk '{print \$3}'")
  echo "PostgreSQL version: $VERSION"

  if [[ "$VERSION" == "11"* ]]; then
    echo "✅ PostgreSQL 11 is running!"
  fi
else
  echo "❌ Container failed to start. Check logs:"
  run_remote "sudo docker logs postgresql11-dr | tail -20"
  exit 1
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 Installation Complete                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL 11 is running on Helios Compute"
echo "✅ Using SBX02 iSCSI storage for persistence"
echo ""
echo "Next steps:"
echo "1. Configure replication from PRIMARY (192.168.86.27)"
echo "2. Set up pg_basebackup"
echo "3. Configure standby.signal"
echo "4. Start replication and verify WAL replay"
echo ""
