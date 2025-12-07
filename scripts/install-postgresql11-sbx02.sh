#!/bin/bash
# install-postgresql11-sbx02.sh
# Installs PostgreSQL 11 on SBX02 (Synology DS213+) for DR/replica use

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 Installation on SBX02 (DS213+)            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Check current PostgreSQL
echo "▶ Checking current PostgreSQL..."
CURRENT_VERSION=$(run_remote "psql --version 2>/dev/null | awk '{print \$3}' | cut -d. -f1,2 || echo 'none'")
echo "Current version: $CURRENT_VERSION"
echo ""

if [[ "$CURRENT_VERSION" == "11"* ]]; then
  echo "✅ PostgreSQL 11 already installed!"
  exit 0
fi

echo "⚠️  PostgreSQL 11 is required for DR compatibility with PRIMARY (11.11)"
echo "Current version ($CURRENT_VERSION) is incompatible for streaming replication"
echo ""

# Check installation options
echo "▶ Checking installation options..."
echo ""

# Option 1: Docker
echo "1. Checking Docker..."
if run_remote "which docker" > /dev/null 2>&1; then
  echo "   ✅ Docker available"
  DOCKER_AVAILABLE=true
else
  echo "   ❌ Docker not available"
  DOCKER_AVAILABLE=false
fi

# Option 2: Package Center
echo "2. Checking Package Center..."
PKG_LIST=$(run_remote "/usr/syno/bin/synopkg list 2>/dev/null | grep -i postgres || echo 'none'")
if [[ "$PKG_LIST" != "none" ]] && [[ -n "$PKG_LIST" ]]; then
  echo "   ✅ PostgreSQL packages available:"
  echo "$PKG_LIST" | head -3
  PKG_AVAILABLE=true
else
  echo "   ❌ No PostgreSQL 11 packages in Package Center"
  PKG_AVAILABLE=false
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Installation Options                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
  echo "✅ Option 1: Docker Container (Recommended)"
  echo "   - Run PostgreSQL 11 in Docker container"
  echo "   - Minimal overhead, works on 512MB RAM"
  echo "   - Easy to manage and update"
  echo ""
fi

if [ "$PKG_AVAILABLE" = true ]; then
  echo "✅ Option 2: Synology Package Center"
  echo "   - Install PostgreSQL from Package Center"
  echo "   - Native integration with DSM"
  echo "   - Check if PostgreSQL 11 is available"
  echo ""
fi

echo "⚠️  Option 3: Manual Compilation (Complex)"
echo "   - Compile PostgreSQL 11 from source"
echo "   - Requires build tools and dependencies"
echo "   - Time-consuming and complex"
echo ""

# Recommend Docker if available
if [ "$DOCKER_AVAILABLE" = true ]; then
  echo "▶ Recommended: Install PostgreSQL 11 via Docker"
  echo ""
  read -p "Proceed with Docker installation? (y/n): " PROCEED

  if [ "$PROCEED" = "y" ]; then
    echo ""
    echo "▶ Installing PostgreSQL 11 Docker container..."

    # Stop old PostgreSQL if running
    run_remote "sudo /usr/syno/bin/synopkg stop pgsql 2>/dev/null || true"

    # Create data directory
    run_remote "sudo mkdir -p /volume1/docker/postgresql11-data"
    run_remote "sudo chown -R 999:999 /volume1/docker/postgresql11-data 2>/dev/null || sudo chown -R 1026:100 /volume1/docker/postgresql11-data 2>/dev/null || true"

    # Create minimal postgresql.conf
    run_remote "sudo tee /volume1/docker/postgresql11-data/postgresql.conf > /dev/null << 'PG_CONF_EOF'
# PostgreSQL 11 Minimal Configuration for 512MB RAM (DR/Replica Node)
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

    # Run PostgreSQL 11 container
    echo "▶ Starting PostgreSQL 11 container..."
    run_remote "sudo docker run -d \
      --name postgresql11-dr \
      --restart unless-stopped \
      -p 5432:5432 \
      -v /volume1/docker/postgresql11-data:/var/lib/postgresql/data \
      -e POSTGRES_PASSWORD=changeme \
      -e PGDATA=/var/lib/postgresql/data/pgdata \
      postgres:11 \
      -c 'config_file=/var/lib/postgresql/data/postgresql.conf'"

    sleep 5

    # Verify
    if run_remote "sudo docker ps | grep postgresql11-dr" > /dev/null 2>&1; then
      echo "✅ PostgreSQL 11 container is running!"
      run_remote "sudo docker exec postgresql11-dr psql --version"
    else
      echo "❌ Container failed to start. Check logs:"
      run_remote "sudo docker logs postgresql11-dr | tail -20"
      exit 1
    fi

    echo ""
    echo "✅ PostgreSQL 11 installed via Docker!"
    echo ""
    echo "Next steps:"
    echo "1. Configure replication from PRIMARY (192.168.86.27)"
    echo "2. Set up pg_basebackup"
    echo "3. Configure standby.signal"
    echo ""
  fi
else
  echo "⚠️  Docker not available. Please install Docker from Package Center first."
  echo ""
  echo "Alternative: Check if PostgreSQL 11 is available in Package Center"
  echo "Or consider manual installation"
  echo ""
fi
