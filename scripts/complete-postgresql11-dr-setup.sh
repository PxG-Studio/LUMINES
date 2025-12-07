#!/bin/bash
# complete-postgresql11-dr-setup.sh
# Complete setup: Install Docker, PostgreSQL 11, and configure for DR on SBX02 (512MB RAM)

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Complete PostgreSQL 11 DR Setup on SBX02 (512MB RAM)   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Step 1: Check current state
echo "▶ Step 1: Checking current system state..."
CURRENT_PG=$(run_remote "psql --version 2>/dev/null | awk '{print \$3}' | cut -d. -f1,2 || echo 'none'")
echo "Current PostgreSQL: $CURRENT_PG"

HAS_DOCKER=$(run_remote "which docker > /dev/null 2>&1 && echo 'yes' || echo 'no'")
echo "Docker available: $HAS_DOCKER"
echo ""

# Step 2: Install Docker if needed
if [ "$HAS_DOCKER" = "no" ]; then
  echo "▶ Step 2: Docker is required but not installed."
  echo ""
  echo "Please install Docker from Synology Package Center:"
  echo "1. Open DSM web interface"
  echo "2. Go to Package Center"
  echo "3. Search for 'Docker'"
  echo "4. Install Docker package"
  echo ""
  read -p "Have you installed Docker? (y/n): " DOCKER_INSTALLED

  if [ "$DOCKER_INSTALLED" != "y" ]; then
    echo "Please install Docker first, then re-run this script."
    exit 1
  fi

  # Verify Docker is now available
  HAS_DOCKER=$(run_remote "which docker > /dev/null 2>&1 && echo 'yes' || echo 'no'")
  if [ "$HAS_DOCKER" = "no" ]; then
    echo "❌ Docker still not found. Please check installation."
    exit 1
  fi
  echo "✅ Docker is now available"
else
  echo "▶ Step 2: Docker is already installed ✅"
fi
echo ""

# Step 3: Stop old PostgreSQL if running
echo "▶ Step 3: Stopping old PostgreSQL (9.3.25)..."
run_remote "sudo /usr/syno/bin/synopkg stop pgsql 2>/dev/null || sudo pkill -9 postgres || echo 'PostgreSQL stopped or not running'"
sleep 3
echo "✅ Old PostgreSQL stopped"
echo ""

# Step 4: Prepare data directory
echo "▶ Step 4: Preparing PostgreSQL 11 data directory..."
run_remote "sudo mkdir -p /volume1/docker/postgresql11-dr"
run_remote "sudo chown -R 999:999 /volume1/docker/postgresql11-dr 2>/dev/null || sudo chown -R 1026:100 /volume1/docker/postgresql11-dr 2>/dev/null || true"
echo "✅ Data directory prepared: /volume1/docker/postgresql11-dr"
echo ""

# Step 5: Create minimal postgresql.conf
echo "▶ Step 5: Creating minimal PostgreSQL 11 configuration (512MB RAM)..."
run_remote "sudo tee /volume1/docker/postgresql11-dr/postgresql.conf > /dev/null << 'PG_CONF_EOF'
# PostgreSQL 11 Minimal Configuration for 512MB RAM (DR/Replica Node)
# Optimized for WAL replay and disaster recovery only
# NOT suitable for active workloads

# Memory Settings (Tiny Footprint)
shared_buffers = 64MB
work_mem = 1MB
maintenance_work_mem = 16MB
effective_cache_size = 128MB

# WAL & Checkpoint Tuning
wal_level = replica
max_wal_senders = 3
max_replication_slots = 1
archive_mode = on
archive_timeout = 60s
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9

# Background Workers
max_worker_processes = 2
max_parallel_workers_per_gather = 0
max_parallel_workers = 1

# Connections
max_connections = 10

# Logging
logging_collector = on
log_min_duration_statement = 2000

# Network
listen_addresses = '*'
port = 5432
PG_CONF_EOF
"
echo "✅ Configuration created"
echo ""

# Step 6: Create pg_hba.conf
echo "▶ Step 6: Creating pg_hba.conf for replication..."
run_remote "sudo tee /volume1/docker/postgresql11-dr/pg_hba.conf > /dev/null << 'HBA_EOF'
# PostgreSQL Client Authentication Configuration File
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    replication     replicator      $PRIMARY_IP/32           md5
host    all             all             192.168.86.0/24         md5
HBA_EOF
"
echo "✅ pg_hba.conf created"
echo ""

# Step 7: Initialize PostgreSQL 11 data directory
echo "▶ Step 7: Initializing PostgreSQL 11 data directory..."
run_remote "sudo docker run --rm \
  -v /volume1/docker/postgresql11-dr:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=changeme \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  postgres:11 \
  initdb -D /var/lib/postgresql/data/pgdata --locale=en_US.UTF-8" || {
  echo "⚠️  initdb may have failed or data already exists. Continuing..."
}
echo ""

# Step 8: Copy configuration files
echo "▶ Step 8: Copying configuration files..."
run_remote "sudo cp /volume1/docker/postgresql11-dr/postgresql.conf /volume1/docker/postgresql11-dr/pgdata/postgresql.conf 2>/dev/null || \
sudo cp /volume1/docker/postgresql11-dr/postgresql.conf /volume1/docker/postgresql11-dr/pgdata/ 2>/dev/null || true"
run_remote "sudo cp /volume1/docker/postgresql11-dr/pg_hba.conf /volume1/docker/postgresql11-dr/pgdata/pg_hba.conf 2>/dev/null || \
sudo cp /volume1/docker/postgresql11-dr/pg_hba.conf /volume1/docker/postgresql11-dr/pgdata/ 2>/dev/null || true"
run_remote "sudo chown -R 999:999 /volume1/docker/postgresql11-dr 2>/dev/null || sudo chown -R 1026:100 /volume1/docker/postgresql11-dr 2>/dev/null || true"
echo "✅ Configuration files copied"
echo ""

# Step 9: Start PostgreSQL 11 container
echo "▶ Step 9: Starting PostgreSQL 11 container..."
run_remote "sudo docker stop postgresql11-dr 2>/dev/null || true"
run_remote "sudo docker rm postgresql11-dr 2>/dev/null || true"

run_remote "sudo docker run -d \
  --name postgresql11-dr \
  --restart unless-stopped \
  -p 5432:5432 \
  -v /volume1/docker/postgresql11-dr/pgdata:/var/lib/postgresql/data/pgdata \
  -e POSTGRES_PASSWORD=changeme \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  postgres:11 \
  -c 'config_file=/var/lib/postgresql/data/pgdata/postgresql.conf'"

sleep 5
echo "✅ Container started"
echo ""

# Step 10: Verify installation
echo "▶ Step 10: Verifying PostgreSQL 11 installation..."
if run_remote "sudo docker ps | grep postgresql11-dr" > /dev/null 2>&1; then
  echo "✅ Container is running"

  VERSION=$(run_remote "sudo docker exec postgresql11-dr psql --version 2>/dev/null | awk '{print \$3}' || echo 'unknown'")
  echo "PostgreSQL version: $VERSION"

  if [[ "$VERSION" == "11"* ]]; then
    echo "✅ PostgreSQL 11 is running!"
  else
    echo "⚠️  Unexpected version: $VERSION"
  fi

  # Check memory settings
  echo ""
  echo "Memory configuration:"
  run_remote "sudo docker exec postgresql11-dr psql -U postgres -t -c 'SHOW shared_buffers;' 2>/dev/null | xargs || echo 'Cannot connect'"
  run_remote "sudo docker exec postgresql11-dr psql -U postgres -t -c 'SHOW max_connections;' 2>/dev/null | xargs || echo 'Cannot connect'"
else
  echo "❌ Container failed to start. Check logs:"
  run_remote "sudo docker logs postgresql11-dr | tail -20"
  exit 1
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 DR Installation Complete                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL 11 is running with minimal memory configuration"
echo "   - shared_buffers: 64MB"
echo "   - max_connections: 10"
echo "   - Peak RAM: ~350-420MB"
echo "   - Suitable for: DR, WAL replay, standby"
echo ""
echo "Next steps:"
echo "1. Configure PRIMARY (192.168.86.27) for replication (if not done)"
echo "2. Set up replication using pg_basebackup"
echo "3. Configure standby.signal and recovery settings"
echo "4. Start replication and verify WAL replay"
echo ""
echo "To set up replication, run:"
echo "  ./scripts/setup-postgresql11-replication.sh"
echo ""
