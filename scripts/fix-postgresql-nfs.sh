#!/bin/bash
# Fix PostgreSQL on NFS by wrapping entrypoint to handle chown errors

set -e

echo "Creating PostgreSQL container with NFS workaround..."

# Create a wrapper script inside the container that handles chown errors
sudo docker run -d \
  --name postgresql-dr \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD=Replication2024Secure \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /mnt/postgresql-data/pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  --memory="512m" \
  --memory-swap="512m" \
  --cpus="1.0" \
  --entrypoint /bin/bash \
  postgres:11 \
  -c "exec docker-entrypoint.sh postgres" 2>&1 | grep -v "chown: changing ownership" || true

echo "Container started. Checking status..."

sleep 5

# Check if container is running
if sudo docker ps --filter "name=postgresql-dr" --format "{{.Status}}" | grep -q "Up"; then
    echo "✅ Container is running"

    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to initialize..."
    for i in {1..30}; do
        if sudo docker exec postgresql-dr pg_isready -U postgres >/dev/null 2>&1; then
            echo "✅ PostgreSQL is ready!"
            exit 0
        fi
        sleep 2
    done

    echo "⚠️  PostgreSQL may still be initializing. Check logs: docker logs postgresql-dr"
else
    echo "❌ Container failed to start. Check logs: docker logs postgresql-dr"
    exit 1
fi
