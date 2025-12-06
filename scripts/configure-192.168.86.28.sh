#!/bin/bash
# configure-192.168.86.28.sh
# Production Configuration Script for Secondary Synology NAS (192.168.86.28)

set -e

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-CHANGE_ME}"
REDIS_PASSWORD="${REDIS_PASSWORD:-CHANGE_ME}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Production Configuration: 192.168.86.28 (Secondary NAS)  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Step 1: Network Configuration
echo "▶ Step 1: Configuring Network..."
echo "   Verifying connectivity to primary server..."
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
  echo "   Stopping PostgreSQL..."
  systemctl stop postgresql || true

  echo "   Creating backup of existing data..."
  if [ -d /var/lib/postgresql/14/main ]; then
    mv /var/lib/postgresql/14/main /var/lib/postgresql/14/main.backup.$(date +%Y%m%d)
  fi

  echo "   Performing base backup from primary..."
  sudo -u postgres pg_basebackup -h $PRIMARY_IP -D /var/lib/postgresql/14/main -U replicator -v -P -W

  echo "   Configuring recovery..."
  cat > /var/lib/postgresql/14/main/postgresql.auto.conf <<EOF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=$REPLICATION_PASSWORD'
primary_slot_name = 'replica_slot'
EOF

  sudo -u postgres touch /var/lib/postgresql/14/main/standby.signal

  echo "   Starting PostgreSQL..."
  systemctl start postgresql
  systemctl enable postgresql

  echo "   ✅ PostgreSQL replica configured"
fi

# Step 3: Redis Sentinel Setup
echo ""
echo "▶ Step 3: Configuring Redis Sentinel..."
read -p "   Configure Redis Sentinel? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "   Installing Redis Sentinel..."
  apt-get update
  apt-get install -y redis-sentinel

  echo "   Configuring Sentinel..."
  cat > /etc/redis/sentinel.conf <<EOF
port 26379
sentinel monitor wissil-master $PRIMARY_IP 6379 2
sentinel auth-pass wissil-master $REDIS_PASSWORD
sentinel down-after-milliseconds wissil-master 5000
sentinel failover-timeout wissil-master 10000
sentinel parallel-syncs wissil-master 1
EOF

  echo "   Starting Sentinel..."
  systemctl start redis-sentinel
  systemctl enable redis-sentinel

  echo "   ✅ Redis Sentinel configured"
fi

# Step 4: NATS Cluster Setup
echo ""
echo "▶ Step 4: Configuring NATS Cluster..."
read -p "   Configure NATS cluster? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "   Installing NATS Server..."
  # Add NATS installation steps here

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

  echo "   Starting NATS..."
  systemctl start nats-server
  systemctl enable nats-server

  echo "   ✅ NATS cluster configured"
fi

# Step 5: Registry Mirror Setup
echo ""
echo "▶ Step 5: Configuring Registry Mirror..."
read -p "   Configure Registry mirror? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "   Creating registry mirror container..."
  docker run -d \
    --name registry-mirror \
    --restart unless-stopped \
    -p 5000:5000 \
    -v /docker/registry-mirror:/var/lib/registry \
    -e REGISTRY_PROXY_REMOTEURL=https://$PRIMARY_IP:5000 \
    registry:2

  echo "   ✅ Registry mirror configured"
fi

# Step 6: Firewall Configuration
echo ""
echo "▶ Step 6: Configuring Firewall..."
echo "   Allowing required ports..."
ufw allow from 192.168.86.0/24 to any port 5432 comment 'PostgreSQL'
ufw allow from 192.168.86.0/24 to any port 26379 comment 'Redis Sentinel'
ufw allow from 192.168.86.0/24 to any port 4222 comment 'NATS'
ufw allow from 192.168.86.0/24 to any port 5000 comment 'Registry'
ufw allow from 192.168.86.0/24 to any port 6222 comment 'NATS Cluster'

echo "   ✅ Firewall configured"

# Step 7: Health Check Script
echo ""
echo "▶ Step 7: Installing Health Check Script..."
cat > /usr/local/bin/health-check-192.168.86.28.sh <<'HEALTHCHECK'
#!/bin/bash
# Health check for 192.168.86.28

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"

echo "=== Health Check - $(date) ==="

# PostgreSQL Replica
if psql -h $SECONDARY_IP -U wissil -d wissil -c "SELECT 1" > /dev/null 2>&1; then
  echo "✅ PostgreSQL Replica: UP"
else
  echo "❌ PostgreSQL Replica: DOWN"
fi

# Redis Sentinel
if redis-cli -h $SECONDARY_IP -p 26379 PING > /dev/null 2>&1; then
  echo "✅ Redis Sentinel: UP"
else
  echo "❌ Redis Sentinel: DOWN"
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
echo "✅ Secondary server (192.168.86.28) configured"
echo ""
echo "Next steps:"
echo "1. Run health check: /usr/local/bin/health-check-192.168.86.28.sh"
echo "2. Verify replication: psql -h $PRIMARY_IP -U postgres -c 'SELECT * FROM pg_stat_replication;'"
echo "3. Test failover procedures"
echo "4. Configure monitoring"
echo ""
echo "⚠️  Remember to:"
echo "   - Change default passwords"
echo "   - Configure SSL certificates"
echo "   - Set up automated backups"
echo "   - Enable monitoring"
echo ""
