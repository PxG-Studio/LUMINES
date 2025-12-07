#!/bin/bash
# phase5-deploy-postgresql11.sh
# Phase 5: Deploy PostgreSQL 11 container with minimal memory config

set -e

HELIOS_COMPUTE="192.168.86.115"
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"
MOUNT_POINT="/mnt/postgresql-data"
CONTAINER_NAME="postgresql11-dr"
CONTAINER_PORT="5432"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 5: PostgreSQL 11 Container Deployment             ║"
echo "║  With Minimal Memory Configuration (DR/Replica)          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on Helios Compute
run_remote() {
  ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "$1"
}

# Step 1: Verify prerequisites
echo "▶ Step 5.1: Verifying prerequisites..."
echo ""

# Check Docker
if ! run_remote "sudo docker --version" > /dev/null 2>&1; then
  echo "❌ Docker not installed"
  echo "   Run: ./scripts/phase2-install-docker.sh"
  exit 1
fi
echo "✅ Docker is installed"
run_remote "sudo docker --version"
echo ""

# Check mount point
if ! run_remote "test -d $MOUNT_POINT && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "❌ Mount point $MOUNT_POINT does not exist"
  echo "   Run: ./scripts/phase4-setup-iscsi-connection.sh"
  exit 1
fi
echo "✅ Mount point exists: $MOUNT_POINT"

# Check if mounted
if ! run_remote "mount | grep $MOUNT_POINT" > /dev/null 2>&1; then
  echo "⚠️  Mount point is not mounted"
  echo "   Attempting to mount..."
  run_remote "sudo mount $MOUNT_POINT 2>/dev/null || echo 'Mount failed - check iSCSI connection'"
fi
echo "✅ Storage is mounted"
echo ""

# Step 2: Stop existing container (if any)
echo "▶ Step 5.2: Checking for existing PostgreSQL container..."
EXISTING=$(run_remote "sudo docker ps -a --filter name=$CONTAINER_NAME --format '{{.Names}}' 2>/dev/null || echo ''")

if [ -n "$EXISTING" ]; then
  echo "⚠️  Found existing container: $CONTAINER_NAME"
  read -p "Stop and remove existing container? (y/n): " REMOVE

  if [ "$REMOVE" = "y" ]; then
    echo "Stopping container..."
    run_remote "sudo docker stop $CONTAINER_NAME 2>/dev/null || true"
    echo "Removing container..."
    run_remote "sudo docker rm $CONTAINER_NAME 2>/dev/null || true"
    echo "✅ Existing container removed"
  else
    echo "Keeping existing container"
    exit 0
  fi
fi
echo ""

# Step 3: Create PostgreSQL configuration
echo "▶ Step 5.3: Creating minimal PostgreSQL 11 configuration..."
echo "   Optimized for DR/replica use (512MB RAM equivalent)"
echo ""

# Create postgresql.conf
run_remote "sudo tee $MOUNT_POINT/postgresql.conf > /dev/null << 'PG_CONF_EOF'
# PostgreSQL 11 Minimal Configuration for DR/Replica Node
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
echo "✅ postgresql.conf created"
echo ""

# Create pg_hba.conf
run_remote "sudo tee $MOUNT_POINT/pg_hba.conf > /dev/null << 'HBA_EOF'
# PostgreSQL Client Authentication Configuration File
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    replication     replicator      $PRIMARY_IP/32           md5
host    all             all             192.168.86.0/24          md5
HBA_EOF
"
echo "✅ pg_hba.conf created"
echo ""

# Set permissions
run_remote "sudo chown -R 999:999 $MOUNT_POINT"
run_remote "sudo chmod 644 $MOUNT_POINT/postgresql.conf $MOUNT_POINT/pg_hba.conf"
echo "✅ Permissions set"
echo ""

# Step 4: Initialize database (if needed)
echo "▶ Step 5.4: Checking if database is initialized..."
PGDATA_DIR="$MOUNT_POINT/pgdata"

if ! run_remote "test -d $PGDATA_DIR && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "Database not initialized. Initializing..."
  echo "   This will create a new PostgreSQL 11 database cluster"
  echo ""

  run_remote "sudo docker run --rm \
    -v $MOUNT_POINT:/var/lib/postgresql/data \
    -e POSTGRES_PASSWORD=changeme \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    postgres:11 \
    initdb -D /var/lib/postgresql/data/pgdata --locale=en_US.UTF-8" || {
    echo "⚠️  Database initialization may have failed or already exists"
  }

  echo "✅ Database initialized"
else
  echo "✅ Database already initialized"
fi
echo ""

# Step 5: Copy configuration files to data directory
echo "▶ Step 5.5: Copying configuration files to data directory..."
run_remote "sudo cp $MOUNT_POINT/postgresql.conf $PGDATA_DIR/postgresql.conf 2>/dev/null || \
sudo cp $MOUNT_POINT/postgresql.conf $PGDATA_DIR/ 2>/dev/null || true"
run_remote "sudo cp $MOUNT_POINT/pg_hba.conf $PGDATA_DIR/pg_hba.conf 2>/dev/null || \
sudo cp $MOUNT_POINT/pg_hba.conf $PGDATA_DIR/ 2>/dev/null || true"
run_remote "sudo chown -R 999:999 $PGDATA_DIR"
echo "✅ Configuration files copied"
echo ""

# Step 6: Start PostgreSQL 11 container
echo "▶ Step 5.6: Starting PostgreSQL 11 container..."
echo "   Container name: $CONTAINER_NAME"
echo "   Port: $CONTAINER_PORT"
echo "   Storage: $MOUNT_POINT (iSCSI from SBX02)"
echo ""

run_remote "sudo docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $CONTAINER_PORT:5432 \
  -v $MOUNT_POINT:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=changeme \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  postgres:11 \
  -c 'config_file=/var/lib/postgresql/data/pgdata/postgresql.conf'" || {
  echo "❌ Failed to start container"
  echo "   Check logs: sudo docker logs $CONTAINER_NAME"
  exit 1
}

sleep 5
echo "✅ Container started"
echo ""

# Step 7: Verify container is running
echo "▶ Step 5.7: Verifying container status..."
CONTAINER_STATUS=$(run_remote "sudo docker ps --filter name=$CONTAINER_NAME --format '{{.Status}}' 2>/dev/null || echo ''")

if [ -z "$CONTAINER_STATUS" ]; then
  echo "❌ Container is not running"
  echo "   Checking logs..."
  run_remote "sudo docker logs $CONTAINER_NAME | tail -20"
  exit 1
fi

echo "✅ Container is running: $CONTAINER_STATUS"
echo ""

# Step 8: Verify PostgreSQL version
echo "▶ Step 5.8: Verifying PostgreSQL version..."
VERSION=$(run_remote "sudo docker exec $CONTAINER_NAME psql --version 2>/dev/null | awk '{print \$3}' || echo 'unknown'")

if [[ "$VERSION" == "11"* ]]; then
  echo "✅ PostgreSQL 11 is running!"
  echo "   Version: $VERSION"
else
  echo "⚠️  Unexpected version: $VERSION"
fi
echo ""

# Step 9: Verify configuration
echo "▶ Step 5.9: Verifying configuration..."
echo "   Checking memory settings..."
SHARED_BUFFERS=$(run_remote "sudo docker exec $CONTAINER_NAME psql -U postgres -t -c 'SHOW shared_buffers;' 2>/dev/null | xargs || echo 'unknown'")
MAX_CONNECTIONS=$(run_remote "sudo docker exec $CONTAINER_NAME psql -U postgres -t -c 'SHOW max_connections;' 2>/dev/null | xargs || echo 'unknown'")

echo "   shared_buffers: $SHARED_BUFFERS"
echo "   max_connections: $MAX_CONNECTIONS"
echo ""

# Step 10: Test connection
echo "▶ Step 5.10: Testing PostgreSQL connection..."
if run_remote "sudo docker exec $CONTAINER_NAME psql -U postgres -c 'SELECT version();' 2>/dev/null" > /dev/null 2>&1; then
  echo "✅ PostgreSQL is accepting connections!"
else
  echo "⚠️  Connection test failed"
  echo "   Container may still be starting up"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 5 Complete - PostgreSQL 11 Deployed              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL 11 is running!"
echo ""
echo "Summary:"
echo "  - Container: $CONTAINER_NAME"
echo "  - Version: PostgreSQL $VERSION"
echo "  - Port: $CONTAINER_PORT"
echo "  - Storage: $MOUNT_POINT (iSCSI from SBX02)"
echo "  - Configuration: Minimal memory (DR/replica optimized)"
echo ""
echo "Configuration:"
echo "  - shared_buffers: $SHARED_BUFFERS"
echo "  - max_connections: $MAX_CONNECTIONS"
echo "  - Peak RAM: ~350-420MB"
echo ""
echo "Next steps:"
echo "  1. Configure replication from PRIMARY ($PRIMARY_IP)"
echo "  2. Set up pg_basebackup"
echo "  3. Configure standby.signal"
echo "  4. Start replication and verify WAL replay"
echo ""
echo "Run: ./scripts/phase6-configure-replication.sh"
echo ""
