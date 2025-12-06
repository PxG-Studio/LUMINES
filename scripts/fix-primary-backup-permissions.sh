#!/bin/bash
# Fix backup file permissions on PRIMARY that are blocking pg_basebackup

set -e

PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")

echo "Fixing backup file permissions in $PG_DATA_DIR..."

# Remove or fix permissions on backup files
sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -exec chmod 600 {} \; 2>/dev/null || true
sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -exec chown postgres:postgres {} \; 2>/dev/null || true

# Or remove them if they're causing issues
# sudo find "$PG_DATA_DIR" -name "*.backup.*" -type f -delete 2>/dev/null || true

echo "✅ Backup file permissions fixed"
echo ""
echo "Now retry the base backup on DR server"
