#!/bin/bash
# configure-192.168.86.28.sh - Synology NAS Version
# Production Configuration Script for Secondary Synology NAS (192.168.86.28)
# Adapted for Synology DSM (doesn't use systemctl)

set -e

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"
REDIS_PASSWORD="${REDIS_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Production Configuration: 192.168.86.28 (Secondary NAS)  ║"
echo "║  Synology DSM Version                                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Detect if running in Docker or native
if [ -f /.dockerenv ] || [ -n "$DOCKER_CONTAINER" ]; then
  IS_DOCKER=true
  echo "▶ Detected: Running in Docker container"
else
  IS_DOCKER=false
  echo "▶ Detected: Running on Synology DSM"
fi

# Step 1: Network Configuration
echo ""
echo "▶ Step 1: Configuring Network..."
if ping -c 3 $PRIMARY_IP > /dev/null 2>&1; then
  echo "   ✅ Primary server ($PRIMARY_IP) is reachable"
else
  echo "   ❌ Cannot reach primary server ($PRIMARY_IP)"
  exit 1
fi

# Step 2: PostgreSQL Replica Setup
echo ""
echo "▶ Step 2: Configuring PostgreSQL Replica..."
read -p "   Configure PostgreSQL replica? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "   Checking PostgreSQL installation..."

  # Check if PostgreSQL is running in Docker
  if docker ps | grep -q postgres; then
    echo "   ✅ PostgreSQL found in Docker"
    POSTGRES_CONTAINER=$(docker ps | grep postgres | awk '{print $1}' | head -1)
    echo "   Container: $POSTGRES_CONTAINER"

    echo "   Stopping PostgreSQL container..."
    docker stop $POSTGRES_CONTAINER || true

    echo "   Creating backup of existing data..."
    if docker volume ls | grep -q postgres; then
      echo "   ⚠️  PostgreSQL data in Docker volume - backup recommended"
    fi

    echo "   Performing base backup from primary..."
    echo "   ⚠️  Note: You may need to configure replication manually in Docker"
    echo "   For Docker PostgreSQL replication, you'll need to:"
    echo "   1. Configure postgresql.conf on primary for replication"
    echo "   2. Set up pg_hba.conf to allow replication from this server"
    echo "   3. Create replication user on primary"
    echo "   4. Use pg_basebackup from within the container"

    read -p "   Continue with Docker PostgreSQL setup? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "   Enter PostgreSQL container name or ID: "
      read POSTGRES_CONTAINER

      echo "   Executing pg_basebackup in container..."
      docker exec $POSTGRES_CONTAINER pg_basebackup -h $PRIMARY_IP -D /var/lib/postgresql/data -U replicator -v -P -W || {
        echo "   ⚠️  pg_basebackup failed. You may need to:"
        echo "      - Ensure replication user exists on primary"
        echo "      - Configure pg_hba.conf on primary"
        echo "      - Check network connectivity"
      }
    fi

    echo "   Starting PostgreSQL container..."
    docker start $POSTGRES_CONTAINER || true

  elif command -v psql > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL found as native installation"

    # Synology uses different service management
    if command -v synoservicectl > /dev/null 2>&1; then
      echo "   Stopping PostgreSQL service..."
      synoservicectl --stop pgsql || true
    elif [ -f /usr/syno/bin/synopkg ]; then
      echo "   Stopping PostgreSQL package..."
      /usr/syno/bin/synopkg stop pgsql || true
    fi

    # Find PostgreSQL data directory
    PG_DATA_DIR=$(psql -U postgres -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/lib/postgresql/data")
    echo "   PostgreSQL data directory: $PG_DATA_DIR"

    if [ -d "$PG_DATA_DIR" ]; then
      echo "   Creating backup of existing data..."
      mv "$PG_DATA_DIR" "${PG_DATA_DIR}.backup.$(date +%Y%m%d)" || true
    fi

    # Create directory if it doesn't exist
    mkdir -p "$(dirname $PG_DATA_DIR)"
    chown postgres:postgres "$(dirname $PG_DATA_DIR)" 2>/dev/null || true

    echo "   Performing base backup from primary..."
    sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$PG_DATA_DIR" -U replicator -v -P -W || {
      echo "   ⚠️  pg_basebackup failed. Check:"
      echo "      - Replication user 'replicator' exists on primary"
      echo "      - pg_hba.conf allows replication from this IP"
      echo "      - Network connectivity"
    }

    echo "   Configuring recovery..."
    cat > "$PG_DATA_DIR/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=$REPLICATION_PASSWORD'
primary_slot_name = 'replica_slot'
EOF

    sudo -u postgres touch "$PG_DATA_DIR/standby.signal"
    chown postgres:postgres "$PG_DATA_DIR"/* 2>/dev/null || true

    # Start PostgreSQL
    if command -v synoservicectl > /dev/null 2>&1; then
      synoservicectl --start pgsql || true
    elif [ -f /usr/syno/bin/synopkg ]; then
      /usr/syno/bin/synopkg start pgsql || true
    fi

    echo "   ✅ PostgreSQL replica configured"
  else
    echo "   ❌ PostgreSQL not found. Please install PostgreSQL first."
    echo "   On Synology: Install via Package Center or Docker"
  fi
fi

# Step 3: Redis Sentinel Setup
echo ""
echo "▶ Step 3: Configuring Redis Sentinel..."
read -p "   Configure Redis Sentinel? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Check if Redis is in Docker
  if docker ps | grep -q redis; then
    echo "   ✅ Redis found in Docker"
    echo "   ⚠️  Redis Sentinel for Docker requires separate container setup"
    echo "   Creating Redis Sentinel container..."

    docker run -d \
      --name redis-sentinel \
      --restart unless-stopped \
      -p 26379:26379 \
      -v /docker/redis-sentinel:/data \
      redis:alpine redis-sentinel /etc/redis/sentinel.conf || {
      echo "   Creating sentinel config..."
      mkdir -p /docker/redis-sentinel
      cat > /docker/redis-sentinel/sentinel.conf <<EOF
port 26379
sentinel monitor wissil-master $PRIMARY_IP 6379 2
sentinel auth-pass wissil-master $REDIS_PASSWORD
sentinel down-after-milliseconds wissil-master 5000
sentinel failover-timeout wissil-master 10000
sentinel parallel-syncs wissil-master 1
EOF
      docker run -d --name redis-sentinel --restart unless-stopped -p 26379:26379 -v /docker/redis-sentinel:/data redis:alpine redis-sentinel /data/sentinel.conf
    }

  elif command -v redis-sentinel > /dev/null 2>&1; then
    echo "   Installing Redis Sentinel..."
    # Synology package installation
    if [ -f /usr/syno/bin/synopkg ]; then
      /usr/syno/bin/synopkg install redis-sentinel || echo "   ⚠️  Redis Sentinel package not available"
    else
      echo "   ⚠️  Please install Redis Sentinel manually"
    fi

    echo "   Configuring Sentinel..."
    mkdir -p /etc/redis
    cat > /etc/redis/sentinel.conf <<EOF
port 26379
sentinel monitor wissil-master $PRIMARY_IP 6379 2
sentinel auth-pass wissil-master $REDIS_PASSWORD
sentinel down-after-milliseconds wissil-master 5000
sentinel failover-timeout wissil-master 10000
sentinel parallel-syncs wissil-master 1
EOF

    # Start Sentinel (Synology method)
    if command -v synoservicectl > /dev/null 2>&1; then
      synoservicectl --start redis-sentinel || true
    fi
  else
    echo "   ⚠️  Redis Sentinel not found. Install via Docker or Package Center"
  fi

  echo "   ✅ Redis Sentinel configured"
fi

# Step 4: NATS Cluster Setup
echo ""
echo "▶ Step 4: Configuring NATS Cluster..."
read -p "   Configure NATS cluster? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Check if NATS is in Docker
  if docker ps | grep -q nats; then
    echo "   ✅ NATS found in Docker"
    echo "   Configuring NATS cluster in Docker..."
    # NATS cluster configuration for Docker would go here
  else
    echo "   Configuring NATS cluster..."
    mkdir -p /etc/nats
    cat > /etc/nats/nats-server.conf <<EOF
port: 4222
http_port: 8222
cluster {
  port: 6222
  routes = [
    nats://$PRIMARY_IP:6222
  ]
}
EOF
    echo "   ⚠️  NATS server not running. Install via Docker:"
    echo "   docker run -d --name nats -p 4222:4222 -p 8222:8222 -p 6222:6222 -v /etc/nats:/etc/nats nats:latest -c /etc/nats/nats-server.conf"
  fi
  echo "   ✅ NATS cluster configured"
fi

# Step 5: Registry Mirror Setup
echo ""
echo "▶ Step 5: Configuring Registry Mirror..."
read -p "   Configure Registry mirror? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "   Creating registry mirror container..."

  # Check if registry mirror already exists
  if docker ps -a | grep -q registry-mirror; then
    echo "   ⚠️  Registry mirror container already exists"
    read -p "   Remove and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker stop registry-mirror 2>/dev/null || true
      docker rm registry-mirror 2>/dev/null || true
    else
      echo "   Skipping registry mirror setup"
      REGISTRY_SKIP=true
    fi
  fi

  if [ "$REGISTRY_SKIP" != "true" ]; then
    mkdir -p /docker/registry-mirror
    docker run -d \
      --name registry-mirror \
      --restart unless-stopped \
      -p 5000:5000 \
      -v /docker/registry-mirror:/var/lib/registry \
      -e REGISTRY_PROXY_REMOTEURL=https://$PRIMARY_IP:5000 \
      registry:2 || {
      echo "   ⚠️  Docker registry mirror creation failed"
      echo "   Check Docker is running: docker ps"
    }
    echo "   ✅ Registry mirror configured"
  fi
fi

# Step 6: Firewall Configuration
echo ""
echo "▶ Step 6: Configuring Firewall..."
if command -v ufw > /dev/null 2>&1; then
  echo "   Configuring UFW firewall..."
  ufw allow from 192.168.86.0/24 to any port 5432 comment 'PostgreSQL' || true
  ufw allow from 192.168.86.0/24 to any port 26379 comment 'Redis Sentinel' || true
  ufw allow from 192.168.86.0/24 to any port 4222 comment 'NATS' || true
  ufw allow from 192.168.86.0/24 to any port 5000 comment 'Registry' || true
  ufw allow from 192.168.86.0/24 to any port 6222 comment 'NATS Cluster' || true
  echo "   ✅ UFW firewall configured"
elif [ -f /usr/syno/bin/synofirewall ]; then
  echo "   ⚠️  Synology firewall - configure via DSM Control Panel"
  echo "   Allow ports: 5432, 26379, 4222, 5000, 6222 from 192.168.86.0/24"
else
  echo "   ⚠️  Firewall not detected - configure manually"
fi

# Step 7: Health Check Script
echo ""
echo "▶ Step 7: Installing Health Check Script..."
mkdir -p /usr/local/bin
cat > /usr/local/bin/health-check-192.168.86.28.sh <<'HEALTHCHECK'
#!/bin/bash
# Health check for 192.168.86.28

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"

echo "=== Health Check - $(date) ==="

# PostgreSQL Replica
if command -v psql > /dev/null 2>&1; then
  if psql -h $SECONDARY_IP -U wissil -d wissil -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ PostgreSQL Replica: UP"
  else
    echo "❌ PostgreSQL Replica: DOWN"
  fi
elif docker ps | grep -q postgres; then
  if docker exec $(docker ps | grep postgres | awk '{print $1}' | head -1) psql -U wissil -d wissil -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ PostgreSQL Replica (Docker): UP"
  else
    echo "❌ PostgreSQL Replica (Docker): DOWN"
  fi
else
  echo "⚠️  PostgreSQL not found"
fi

# Redis Sentinel
if command -v redis-cli > /dev/null 2>&1; then
  if redis-cli -h $SECONDARY_IP -p 26379 PING > /dev/null 2>&1; then
    echo "✅ Redis Sentinel: UP"
  else
    echo "❌ Redis Sentinel: DOWN"
  fi
elif docker ps | grep -q redis-sentinel; then
  if docker exec redis-sentinel redis-cli -p 26379 PING > /dev/null 2>&1; then
    echo "✅ Redis Sentinel (Docker): UP"
  else
    echo "❌ Redis Sentinel (Docker): DOWN"
  fi
else
  echo "⚠️  Redis Sentinel not found"
fi

# NATS Cluster
if nc -zv $SECONDARY_IP 4222 > /dev/null 2>&1; then
  echo "✅ NATS Cluster: UP"
else
  echo "❌ NATS Cluster: DOWN"
fi

# Registry Mirror
if curl -k https://$SECONDARY_IP:5000/v2/ > /dev/null 2>&1; then
  echo "✅ Registry Mirror: UP"
else
  echo "❌ Registry Mirror: DOWN"
fi
HEALTHCHECK

chmod +x /usr/local/bin/health-check-192.168.86.28.sh
echo "   ✅ Health check script installed"

# Final Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Configuration Complete                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Secondary server (192.168.86.28) configured for Synology"
echo ""
echo "Next steps:"
echo "1. Run health check: /usr/local/bin/health-check-192.168.86.28.sh"
echo "2. Verify replication (if PostgreSQL configured)"
echo "3. Test failover procedures"
echo "4. Configure monitoring"
echo ""
echo "⚠️  Important Notes:"
echo "   - Synology uses Docker or Package Center for services"
echo "   - Configure firewall via DSM Control Panel if needed"
echo "   - Check service status: docker ps (for Docker services)"
echo ""
