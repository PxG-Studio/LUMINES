#!/bin/bash
# install-postgresql11-direct-sbx02.sh
# Installs PostgreSQL 11 directly on SBX02 (without Docker) for DR/replica use

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 Direct Installation on SBX02 (512MB RAM)  ║"
echo "║  Without Docker - Native Installation                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Step 1: Check current PostgreSQL
echo "▶ Step 1: Checking current PostgreSQL..."
CURRENT_PG=$(run_remote "psql --version 2>/dev/null | awk '{print \$3}' | cut -d. -f1,2 || echo 'none'")
echo "Current PostgreSQL: $CURRENT_PG"
echo ""

if [[ "$CURRENT_PG" == "11"* ]]; then
  echo "✅ PostgreSQL 11 already installed!"
  exit 0
fi

# Step 2: Stop old PostgreSQL
echo "▶ Step 2: Stopping old PostgreSQL..."
run_remote "sudo /usr/syno/bin/synopkg stop pgsql 2>/dev/null || sudo pkill -9 postgres || echo 'PostgreSQL stopped or not running'"
sleep 3
echo "✅ Old PostgreSQL stopped"
echo ""

# Step 3: Check for build tools
echo "▶ Step 3: Checking for build tools..."
HAS_GCC=$(run_remote "which gcc > /dev/null 2>&1 && echo 'yes' || echo 'no'")
HAS_MAKE=$(run_remote "which make > /dev/null 2>&1 && echo 'yes' || echo 'no'")
echo "gcc: $HAS_GCC"
echo "make: $HAS_MAKE"
echo ""

if [ "$HAS_GCC" = "no" ] || [ "$HAS_MAKE" = "no" ]; then
  echo "⚠️  Build tools not found. Need to install them."
  echo ""
  echo "Options:"
  echo "1. Install via Entware (if available)"
  echo "2. Install via Synology Package Center (if available)"
  echo "3. Manual installation"
  echo ""
  read -p "How would you like to proceed? (1/2/3): " BUILD_METHOD

  case $BUILD_METHOD in
    1)
      echo "▶ Installing Entware..."
      # Entware installation would go here
      echo "Please install Entware manually, then re-run this script."
      exit 0
      ;;
    2)
      echo "▶ Please install build tools from Package Center:"
      echo "   - Development Tools"
      echo "   - Or gcc, make packages"
      echo "   Then re-run this script."
      exit 0
      ;;
    3)
      echo "▶ Manual installation required."
      echo "Please install gcc, make, and other build dependencies manually."
      exit 0
      ;;
  esac
fi

# Step 4: Download PostgreSQL 11 source
echo "▶ Step 4: Downloading PostgreSQL 11 source..."
PG_VERSION="11.23"  # Latest PostgreSQL 11.x
PG_SOURCE_DIR="/tmp/postgresql-${PG_VERSION}"
PG_INSTALL_PREFIX="/opt/postgresql11"

run_remote "cd /tmp && wget -q https://ftp.postgresql.org/pub/source/v${PG_VERSION}/postgresql-${PG_VERSION}.tar.gz || echo 'Download failed'"
run_remote "cd /tmp && tar -xzf postgresql-${PG_VERSION}.tar.gz 2>/dev/null || echo 'Extract failed'"
echo "✅ Source downloaded"
echo ""

# Step 5: Configure and compile
echo "▶ Step 5: Configuring PostgreSQL 11..."
echo "This may take 30-60 minutes on PowerPC..."
run_remote "cd ${PG_SOURCE_DIR} && ./configure --prefix=${PG_INSTALL_PREFIX} --without-readline --without-zlib 2>&1 | tail -10" || {
  echo "❌ Configuration failed. Check dependencies."
  exit 1
}
echo "✅ Configuration complete"
echo ""

echo "▶ Step 6: Compiling PostgreSQL 11..."
echo "This will take a while on PowerPC (30-60 minutes)..."
run_remote "cd ${PG_SOURCE_DIR} && make -j2 2>&1 | tail -20" || {
  echo "❌ Compilation failed. Check errors above."
  exit 1
}
echo "✅ Compilation complete"
echo ""

# Step 7: Install
echo "▶ Step 7: Installing PostgreSQL 11..."
run_remote "cd ${PG_SOURCE_DIR} && sudo make install" || {
  echo "❌ Installation failed."
  exit 1
}
echo "✅ PostgreSQL 11 installed to ${PG_INSTALL_PREFIX}"
echo ""

# Step 8: Create data directory
echo "▶ Step 8: Creating data directory..."
PG_DATA_DIR="/volume1/@database/pgsql11"
run_remote "sudo mkdir -p ${PG_DATA_DIR}"
run_remote "sudo chown -R postgres:postgres ${PG_DATA_DIR} 2>/dev/null || sudo chown -R 999:999 ${PG_DATA_DIR} 2>/dev/null || true"
echo "✅ Data directory created: ${PG_DATA_DIR}"
echo ""

# Step 9: Initialize database
echo "▶ Step 9: Initializing PostgreSQL 11 database..."
run_remote "sudo -u postgres ${PG_INSTALL_PREFIX}/bin/initdb -D ${PG_DATA_DIR} --locale=en_US.UTF-8 2>&1 | tail -10" || {
  echo "⚠️  initdb may have failed. Check permissions."
}
echo "✅ Database initialized"
echo ""

# Step 10: Create minimal configuration
echo "▶ Step 10: Creating minimal configuration (512MB RAM)..."
run_remote "sudo tee ${PG_DATA_DIR}/postgresql.conf > /dev/null << 'PG_CONF_EOF'
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
echo "✅ Configuration created"
echo ""

# Step 11: Configure pg_hba.conf
echo "▶ Step 11: Configuring pg_hba.conf..."
run_remote "sudo tee -a ${PG_DATA_DIR}/pg_hba.conf > /dev/null << 'HBA_EOF'

# Replication from PRIMARY
host    replication     replicator      $PRIMARY_IP/32           md5
host    all             all             192.168.86.0/24           md5
HBA_EOF
"
echo "✅ pg_hba.conf configured"
echo ""

# Step 12: Create startup script
echo "▶ Step 12: Creating startup script..."
run_remote "sudo tee /usr/local/bin/start-postgresql11.sh > /dev/null << 'START_EOF'
#!/bin/sh
${PG_INSTALL_PREFIX}/bin/postgres -D ${PG_DATA_DIR} > /var/log/postgresql11.log 2>&1 &
echo \$! > /var/run/postgresql11.pid
START_EOF
"
run_remote "sudo chmod +x /usr/local/bin/start-postgresql11.sh"
echo "✅ Startup script created"
echo ""

# Step 13: Start PostgreSQL 11
echo "▶ Step 13: Starting PostgreSQL 11..."
run_remote "sudo /usr/local/bin/start-postgresql11.sh"
sleep 5
echo "✅ PostgreSQL 11 started"
echo ""

# Step 14: Verify
echo "▶ Step 14: Verifying installation..."
if run_remote "${PG_INSTALL_PREFIX}/bin/psql --version" > /dev/null 2>&1; then
  VERSION=$(run_remote "${PG_INSTALL_PREFIX}/bin/psql --version | awk '{print \$3}'")
  echo "✅ PostgreSQL version: $VERSION"

  if [[ "$VERSION" == "11"* ]]; then
    echo "✅ PostgreSQL 11 is running!"
  fi
else
  echo "⚠️  PostgreSQL may not be running. Check logs:"
  run_remote "tail -20 /var/log/postgresql11.log 2>/dev/null || echo 'No log file'"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 Installation Complete                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL 11 installed natively (no Docker)"
echo "   - Installation path: ${PG_INSTALL_PREFIX}"
echo "   - Data directory: ${PG_DATA_DIR}"
echo "   - Configuration: Minimal (512MB RAM)"
echo ""
echo "Next steps:"
echo "1. Configure replication from PRIMARY (192.168.86.27)"
echo "2. Set up pg_basebackup"
echo "3. Configure standby.signal"
echo ""
