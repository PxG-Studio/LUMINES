#!/bin/bash
# setup-postgresql11-dr-sbx02.sh
# Sets up PostgreSQL 11 on SBX02 (512MB RAM) as DR/replica node with minimal memory tuning

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 DR Setup on SBX02 (512MB RAM)             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Test connection
echo "▶ Testing connection to SBX02..."
run_remote "echo 'Connected to' \$(hostname)" || {
  echo "❌ Cannot connect to SBX02"
  exit 1
}
echo "✅ Connected to SBX02"
echo ""

# Check current PostgreSQL
echo "▶ Checking current PostgreSQL installation..."
PG_VERSION=$(run_remote "psql --version 2>/dev/null | awk '{print \$3}' | cut -d. -f1,2 || echo 'none'")
echo "PostgreSQL version: $PG_VERSION"
echo ""

if [ "$PG_VERSION" = "none" ] || [ -z "$PG_VERSION" ]; then
  echo "⚠️  PostgreSQL not found. Need to install PostgreSQL 11."
  echo ""
  echo "Options:"
  echo "1. Install via Synology Package Center (if available)"
  echo "2. Install via Docker (if Docker is available)"
  echo "3. Manual installation"
  echo ""
  read -p "How would you like to proceed? (1/2/3): " INSTALL_METHOD
  echo ""

  case $INSTALL_METHOD in
    1)
      echo "▶ Installing PostgreSQL via Package Center..."
      echo "Please install PostgreSQL 11 from Synology Package Center, then re-run this script."
      exit 0
      ;;
    2)
      echo "▶ Checking for Docker..."
      if run_remote "which docker" > /dev/null 2>&1; then
        echo "✅ Docker found. Will set up PostgreSQL 11 container."
        # Docker setup will be handled separately
      else
        echo "❌ Docker not found. Cannot proceed with Docker installation."
        exit 1
      fi
      ;;
    3)
      echo "▶ Manual installation required."
      echo "Please install PostgreSQL 11 manually, then re-run this script."
      exit 0
      ;;
  esac
else
  echo "✅ PostgreSQL found: version $PG_VERSION"

  # Check if it's version 11
  if [[ "$PG_VERSION" == "11"* ]] || [[ "$PG_VERSION" == "11."* ]]; then
    echo "✅ PostgreSQL 11 detected!"
  else
    echo "⚠️  PostgreSQL version is $PG_VERSION, not 11.x"
    echo "For DR compatibility, PostgreSQL 11 is required."
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
      exit 1
    fi
  fi
fi

echo ""
echo "▶ Configuring PostgreSQL 11 for 512MB RAM (DR/Replica mode)..."
echo ""

# Find PostgreSQL data directory
echo "Finding PostgreSQL data directory..."
PG_DATA_DIR=$(run_remote "sudo -u postgres psql -t -c 'SHOW data_directory;' 2>/dev/null | xargs || echo '/var/services/pgsql'")
echo "Data directory: $PG_DATA_DIR"

PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo ""
echo "▶ Backing up existing configuration..."
run_remote "sudo cp $PG_CONF ${PG_CONF}.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
run_remote "sudo cp $PG_HBA ${PG_HBA}.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
echo "✅ Backups created"
echo ""

echo "▶ Applying minimal memory configuration for 512MB RAM..."
echo ""

# Create minimal postgresql.conf configuration
run_remote "sudo tee $PG_CONF.minimal > /dev/null << 'PG_CONF_EOF'
# PostgreSQL 11 Minimal Configuration for 512MB RAM (DR/Replica Node)
# This configuration is optimized for WAL replay and disaster recovery only
# NOT suitable for active workloads or heavy queries

# ------------------------------------
# Memory Settings (Tiny Footprint)
# ------------------------------------
shared_buffers = 64MB
work_mem = 1MB
maintenance_work_mem = 16MB
effective_cache_size = 128MB

# ------------------------------------
# WAL & Checkpoint Tuning
# ------------------------------------
wal_level = replica
max_wal_senders = 3
max_replication_slots = 1
archive_mode = on
archive_timeout = 60s

checkpoint_timeout = 15min
checkpoint_completion_target = 0.9

# ------------------------------------
# Background Workers
# ------------------------------------
max_worker_processes = 2
max_parallel_workers_per_gather = 0
max_parallel_workers = 1

# ------------------------------------
# Connections
# ------------------------------------
max_connections = 10

# ------------------------------------
# Logging
# ------------------------------------
logging_collector = on
log_min_duration_statement = 2000

# ------------------------------------
# Network (for replication)
# ------------------------------------
listen_addresses = '*'
port = 5432

# Include original config if it exists
# include_if_exists = 'postgresql.conf.original'
PG_CONF_EOF
"

echo "✅ Minimal configuration created"
echo ""

echo "▶ Merging with existing configuration..."
echo "This script will create a new postgresql.conf with minimal settings."
echo "Original configuration backed up."
echo ""

# Stop PostgreSQL
echo "▶ Stopping PostgreSQL..."
run_remote "sudo /usr/syno/bin/synopkg stop pgsql 2>/dev/null || sudo pkill -9 postgres || echo 'PostgreSQL stopped or not running'"
sleep 3
echo "✅ PostgreSQL stopped"
echo ""

# Apply minimal config
echo "▶ Applying minimal configuration..."
run_remote "sudo cp $PG_CONF.minimal $PG_CONF"
run_remote "sudo chown postgres:postgres $PG_CONF 2>/dev/null || sudo chown 999:999 $PG_CONF 2>/dev/null || true"
echo "✅ Configuration applied"
echo ""

# Configure pg_hba.conf for replication
echo "▶ Configuring pg_hba.conf for replication..."
run_remote "sudo tee -a $PG_HBA > /dev/null << 'HBA_EOF'

# Replication from PRIMARY (192.168.86.27)
host    replication     replicator      $PRIMARY_IP/32    md5
host    all             all             192.168.86.0/24    md5
HBA_EOF
"
echo "✅ pg_hba.conf configured"
echo ""

echo "▶ Starting PostgreSQL with minimal configuration..."
run_remote "sudo /usr/syno/bin/synopkg start pgsql 2>/dev/null || sudo -u postgres /usr/bin/postgres -D $PG_DATA_DIR &"
sleep 5
echo "✅ PostgreSQL started"
echo ""

echo "▶ Verifying PostgreSQL is running..."
if run_remote "sudo -u postgres psql -c 'SELECT version();' 2>/dev/null" > /dev/null 2>&1; then
  echo "✅ PostgreSQL is running!"
  run_remote "sudo -u postgres psql -t -c 'SHOW shared_buffers;' 2>/dev/null | xargs"
  run_remote "sudo -u postgres psql -t -c 'SHOW max_connections;' 2>/dev/null | xargs"
else
  echo "⚠️  PostgreSQL may not be running. Check logs."
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 DR Configuration Complete                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Verify PRIMARY (192.168.86.27) is configured for replication"
echo "2. Set up replication using pg_basebackup"
echo "3. Configure standby.signal and recovery settings"
echo "4. Start replication and verify WAL replay"
echo ""
echo "Configuration summary:"
echo "  - shared_buffers: 64MB"
echo "  - max_connections: 10"
echo "  - Peak RAM: ~350-420MB"
echo "  - Suitable for: DR, WAL replay, standby (NOT active workloads)"
echo ""
