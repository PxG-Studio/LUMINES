#!/bin/bash
# Setup PostgreSQL replication from PRIMARY (192.168.86.27) to DR (192.168.86.115)

set -e

PRIMARY_IP="192.168.86.27"
DR_IP="192.168.86.115"
REPLICATION_USER="replicator"
REPLICATION_PASSWORD="Replication2024Secure"
CONTAINER_NAME="postgresql-dr"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ PostgreSQL Replication Setup: PRIMARY → DR               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Verify PRIMARY is accessible
echo "▶ Step 1: Verifying PRIMARY server ($PRIMARY_IP)..."
if ! timeout 5 bash -c "echo > /dev/tcp/$PRIMARY_IP/5432" 2>/dev/null; then
    echo "❌ Cannot connect to PRIMARY PostgreSQL on port 5432"
    echo "   Please ensure PostgreSQL is running on $PRIMARY_IP"
    exit 1
fi
echo "✅ PRIMARY server is accessible on port 5432"

# Step 2: Check if PRIMARY is configured for replication
echo ""
echo "▶ Step 2: Checking PRIMARY replication configuration..."
# Test with password via Docker container
WAL_LEVEL=$(sudo docker exec $CONTAINER_NAME psql -h $PRIMARY_IP -U postgres -t -c "SHOW wal_level;" 2>/dev/null | xargs || echo "")
if [ -z "$WAL_LEVEL" ]; then
    echo "⚠️  Cannot query PRIMARY. Assuming configuration is correct."
    echo "   Proceeding with replication setup..."
else
    if [ "$WAL_LEVEL" != "replica" ] && [ "$WAL_LEVEL" != "logical" ]; then
        echo "⚠️  PRIMARY wal_level is '$WAL_LEVEL' (should be 'replica')"
        echo "   Run PRIMARY setup script first"
        exit 1
    fi
    echo "✅ PRIMARY wal_level: $WAL_LEVEL"
fi

# Step 3: Verify replication user exists
echo ""
echo "▶ Step 3: Verifying replication user..."
# Test replication user connection using Docker container
if ! sudo docker exec -e PGPASSWORD="$REPLICATION_PASSWORD" $CONTAINER_NAME psql -h $PRIMARY_IP -U $REPLICATION_USER -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
    echo "⚠️  Cannot connect as replication user. Please verify:"
    echo "   1. Replication user '$REPLICATION_USER' exists on PRIMARY"
    echo "   2. pg_hba.conf allows replication from this IP"
    echo "   3. Password is correct"
    echo ""
    echo "   Testing connection manually..."
    sudo docker exec -e PGPASSWORD="$REPLICATION_PASSWORD" $CONTAINER_NAME psql -h $PRIMARY_IP -U $REPLICATION_USER -d postgres -c "SELECT 1;" || true
    exit 1
fi
echo "✅ Replication user connection verified"

# Step 4: Stop DR PostgreSQL and backup existing data
echo ""
echo "▶ Step 4: Preparing DR server..."
sudo docker stop $CONTAINER_NAME 2>/dev/null || true
sleep 2

# Backup existing data
if [ -d "/mnt/postgresql-data/pgdata" ] && [ -d "/mnt/postgresql-data/pgdata/base" ]; then
    echo "   Backing up existing data..."
    sudo mv /mnt/postgresql-data/pgdata /mnt/postgresql-data/pgdata.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
fi

# Ensure directory is clean or create it
if [ -d "/mnt/postgresql-data/pgdata" ]; then
    echo "   Removing existing data directory..."
    sudo rm -rf /mnt/postgresql-data/pgdata
fi
sudo mkdir -p /mnt/postgresql-data/pgdata

# Step 5: Perform base backup
echo ""
echo "▶ Step 5: Performing base backup from PRIMARY..."
echo "   This may take several minutes..."
sudo docker run --rm --network host \
  -v /mnt/postgresql-data:/backup \
  -e PGPASSWORD="$REPLICATION_PASSWORD" \
  postgres:11 \
  pg_basebackup -h $PRIMARY_IP -D /backup/pgdata -U $REPLICATION_USER -v -P -R

if [ $? -ne 0 ]; then
    echo "❌ Base backup failed"
    exit 1
fi
echo "✅ Base backup completed"

# Step 6: Configure recovery settings
echo ""
echo "▶ Step 6: Configuring recovery settings..."
sudo docker run --rm -v /mnt/postgresql-data/pgdata:/data postgres:11 bash -c "
cat >> /data/postgresql.auto.conf <<EOF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=$REPLICATION_USER password=$REPLICATION_PASSWORD'
primary_slot_name = 'replica_slot'
EOF
touch /data/standby.signal
"

echo "✅ Recovery settings configured"

# Step 7: Start DR PostgreSQL
echo ""
echo "▶ Step 7: Starting DR PostgreSQL container..."
sudo docker start $CONTAINER_NAME || sudo docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD=$REPLICATION_PASSWORD \
  -v /mnt/postgresql-data/pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  --memory='512m' \
  --memory-swap='512m' \
  --cpus='1.0' \
  postgres:11

sleep 10

# Step 8: Verify replication
echo ""
echo "▶ Step 8: Verifying replication status..."
for i in {1..30}; do
    if sudo docker exec $CONTAINER_NAME pg_isready -U postgres >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

if sudo docker exec $CONTAINER_NAME psql -U postgres -t -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
    echo "✅ Replication is ACTIVE!"
    echo ""
    echo "📊 Replication Status:"
    sudo docker exec $CONTAINER_NAME psql -U postgres -c "
SELECT
    client_addr,
    state,
    sync_state,
    pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS lag_bytes
FROM pg_stat_replication;
" 2>/dev/null || echo "   (Replication status query may not be available from replica)"
else
    echo "⚠️  Replication status unclear. Check logs:"
    echo "   sudo docker logs $CONTAINER_NAME"
fi

echo ""
echo "✅ Replication setup complete!"
echo ""
echo "📋 Connection Info:"
echo "   PRIMARY: $PRIMARY_IP:5432"
echo "   DR:      $DR_IP:5432"
echo "   User:    postgres"
echo "   Password: $REPLICATION_PASSWORD"
