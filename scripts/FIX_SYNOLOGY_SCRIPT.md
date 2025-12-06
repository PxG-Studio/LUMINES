# Fix Script for Synology NAS

The script is failing because Synology doesn't use `systemctl`. Here's how to fix it:

## Quick Fix - On the NAS

**On the NAS**, run these commands to check how PostgreSQL is running:

```bash
# Check if PostgreSQL is in Docker
docker ps | grep postgres

# Check if PostgreSQL is installed natively
which psql
psql --version

# Check Synology service management
which synoservicectl
ls /usr/syno/bin/synopkg
```

## Option 1: If PostgreSQL is in Docker

If PostgreSQL is running in Docker, you need to configure replication differently. **On the NAS**, run:

```bash
# Find the PostgreSQL container
POSTGRES_CONTAINER=$(docker ps | grep postgres | awk '{print $1}' | head -1)
echo "PostgreSQL container: $POSTGRES_CONTAINER"

# Check the data directory inside the container
docker exec $POSTGRES_CONTAINER psql -U postgres -c "SHOW data_directory;"

# For Docker-based replication, you'll need to:
# 1. Configure replication on the PRIMARY server first
# 2. Then set up the replica using Docker volumes
```

## Option 2: If PostgreSQL is Native (Package Center)

If PostgreSQL is installed via Package Center, **on the NAS**, run:

```bash
# Check PostgreSQL status
/usr/syno/bin/synopkg status pgsql

# Find PostgreSQL data directory
sudo -u postgres psql -c "SHOW data_directory;"

# The data directory is usually in /volume1/@database or similar
```

## Option 3: Manual PostgreSQL Replica Setup

**On the NAS**, create this fixed version of the PostgreSQL setup:

```bash
cd ~/scripts

# Create a fixed PostgreSQL setup script
cat > setup-postgresql-replica.sh << 'EOF'
#!/bin/bash
PRIMARY_IP="192.168.86.27"

echo "Setting up PostgreSQL replica..."

# Check if in Docker
if docker ps | grep -q postgres; then
  CONTAINER=$(docker ps | grep postgres | awk '{print $1}' | head -1)
  echo "PostgreSQL in Docker container: $CONTAINER"

  # Get data directory from container
  DATA_DIR=$(docker exec $CONTAINER psql -U postgres -t -c "SHOW data_directory;" | xargs)
  echo "Data directory: $DATA_DIR"

  # Stop container
  docker stop $CONTAINER

  # Perform backup (from inside container or using volume)
  echo "Performing base backup..."
  docker run --rm -v $(docker inspect $CONTAINER | grep -i '"Source"' | head -1 | cut -d'"' -f4):/backup postgres:14 pg_basebackup -h $PRIMARY_IP -D /backup -U replicator -v -P -W

  # Configure recovery
  docker exec $CONTAINER sh -c "echo \"primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=CHANGE_ME'\" >> $DATA_DIR/postgresql.auto.conf"
  docker exec $CONTAINER sh -c "echo \"primary_slot_name = 'replica_slot'\" >> $DATA_DIR/postgresql.auto.conf"
  docker exec $CONTAINER touch $DATA_DIR/standby.signal

  # Start container
  docker start $CONTAINER

else
  # Native PostgreSQL
  echo "Native PostgreSQL installation"

  # Find data directory
  DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/volume1/@database/pgsql")
  echo "Using data directory: $DATA_DIR"

  # Stop PostgreSQL (Synology method)
  /usr/syno/bin/synopkg stop pgsql || true

  # Backup existing
  if [ -d "$DATA_DIR" ]; then
    mv "$DATA_DIR" "${DATA_DIR}.backup.$(date +%Y%m%d)"
  fi

  # Create directory with proper permissions
  mkdir -p "$(dirname $DATA_DIR)"
  chown postgres:postgres "$(dirname $DATA_DIR)" 2>/dev/null || true

  # Perform base backup
  sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$DATA_DIR" -U replicator -v -P -W

  # Configure recovery
  cat > "$DATA_DIR/postgresql.auto.conf" <<CONF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=CHANGE_ME'
primary_slot_name = 'replica_slot'
CONF

  sudo -u postgres touch "$DATA_DIR/standby.signal"
  chown -R postgres:postgres "$DATA_DIR" 2>/dev/null || true

  # Start PostgreSQL
  /usr/syno/bin/synopkg start pgsql || true
fi

echo "✅ PostgreSQL replica setup complete"
EOF

chmod +x setup-postgresql-replica.sh
sudo ./setup-postgresql-replica.sh
```

## Next Steps

After fixing PostgreSQL, continue with the other services. The script will handle Redis, NATS, and Registry which are likely in Docker on Synology.
