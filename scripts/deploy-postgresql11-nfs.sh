#!/bin/bash
# Deploy PostgreSQL 11 container on Helios Compute with NFS storage

set -e

CONTAINER_NAME="postgresql-dr"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-Replication2024Secure}"
NFS_MOUNT="/mnt/postgresql-data"
PGDATA_DIR="$NFS_MOUNT/pgdata"
HOST_PORT=5432

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ PostgreSQL 11 DR Deployment - NFS Storage                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "⚠️  Container '$CONTAINER_NAME' already exists"
    read -p "Remove existing container? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping and removing existing container..."
        docker stop "$CONTAINER_NAME" 2>/dev/null || true
        docker rm "$CONTAINER_NAME" 2>/dev/null || true
    else
        echo "Aborted."
        exit 1
    fi
fi

# Verify NFS mount
if ! mountpoint -q "$NFS_MOUNT"; then
    echo "❌ NFS not mounted at $NFS_MOUNT"
    echo "   Mounting..."
    sudo mount "$NFS_MOUNT" || {
        echo "   ❌ Mount failed"
        exit 1
    }
fi

echo "✅ NFS mount verified"

# Create PGDATA directory if it doesn't exist
if [ ! -d "$PGDATA_DIR" ]; then
    echo "Creating PGDATA directory..."
    sudo mkdir -p "$PGDATA_DIR"
    sudo chown -R 999:999 "$PGDATA_DIR"
fi

echo "✅ PGDATA directory ready: $PGDATA_DIR"

# Deploy PostgreSQL 11 container
echo ""
echo "🚀 Deploying PostgreSQL 11 container..."
echo "   Container: $CONTAINER_NAME"
echo "   Image: postgres:11"
echo "   Memory: 512MB (DR optimized)"
echo "   Storage: NFS ($NFS_MOUNT)"
echo ""

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
  -e POSTGRES_INITDB_ARGS="--data-checksums" \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v "$PGDATA_DIR:/var/lib/postgresql/data" \
  -p "$HOST_PORT:5432" \
  --memory="512m" \
  --memory-swap="512m" \
  --cpus="1.0" \
  postgres:11

echo ""
echo "⏳ Waiting for PostgreSQL to initialize..."
sleep 5

# Wait for PostgreSQL to be ready
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker exec "$CONTAINER_NAME" pg_isready -U postgres >/dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo "   Waiting... ($ATTEMPT/$MAX_ATTEMPTS)"
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "⚠️  PostgreSQL may still be initializing. Check logs:"
    echo "   docker logs $CONTAINER_NAME"
fi

# Display status
echo ""
echo "📊 Container Status:"
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Connection Info:"
echo "   Host: 192.168.86.115"
echo "   Port: $HOST_PORT"
echo "   User: postgres"
echo "   Password: $POSTGRES_PASSWORD"
echo "   Database: postgres"

echo ""
echo "🔍 Useful Commands:"
echo "   View logs:    docker logs $CONTAINER_NAME"
echo "   Follow logs:  docker logs -f $CONTAINER_NAME"
echo "   Connect:     docker exec -it $CONTAINER_NAME psql -U postgres"
echo "   Stop:         docker stop $CONTAINER_NAME"
echo "   Start:        docker start $CONTAINER_NAME"

echo ""
echo "✅ Deployment complete!"
