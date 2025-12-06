#!/bin/bash
# fix-secondary-directory.sh
# Fix SECONDARY directory issue - remove symlink and create fresh

PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Fixing SECONDARY Directory Issue                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Find data directory
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "Data directory: $ACTUAL_DATA_DIR"

# Stop PostgreSQL
echo ""
echo "▶ Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql 2>/dev/null || true
sleep 3
killall -u postgres postgres 2>/dev/null || true
sleep 2

# Check what it is (file, directory, symlink)
echo ""
echo "▶ Checking directory status..."
if [ -L "$ACTUAL_DATA_DIR" ]; then
  echo "   It's a symlink, removing..."
  rm -f "$ACTUAL_DATA_DIR"
elif [ -d "$ACTUAL_DATA_DIR" ]; then
  echo "   It's a directory, backing up and removing..."
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
    rm -rf "$ACTUAL_DATA_DIR"
  }
elif [ -f "$ACTUAL_DATA_DIR" ]; then
  echo "   It's a file, removing..."
  rm -f "$ACTUAL_DATA_DIR"
fi

# Ensure it's completely gone
[ -e "$ACTUAL_DATA_DIR" ] && rm -rf "$ACTUAL_DATA_DIR" 2>/dev/null || true
[ -L "$ACTUAL_DATA_DIR" ] && rm -f "$ACTUAL_DATA_DIR" 2>/dev/null || true

# Verify it's gone
if [ -e "$ACTUAL_DATA_DIR" ] || [ -L "$ACTUAL_DATA_DIR" ]; then
  echo "   ⚠️  Still exists, force removing..."
  rm -rf "$ACTUAL_DATA_DIR" 2>/dev/null || true
  rm -f "$ACTUAL_DATA_DIR" 2>/dev/null || true
fi

# Create fresh directory
echo ""
echo "▶ Creating fresh directory..."
PARENT_DIR=$(dirname "$ACTUAL_DATA_DIR")
mkdir -p "$PARENT_DIR"
mkdir -p "$ACTUAL_DATA_DIR"

# Set ownership
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 1026:100 "$ACTUAL_DATA_DIR" 2>/dev/null || true
chmod 700 "$ACTUAL_DATA_DIR"

# Verify it's empty and writable
if [ "$(ls -A $ACTUAL_DATA_DIR 2>/dev/null)" ]; then
  echo "   ⚠️  Directory not empty, cleaning..."
  rm -rf "$ACTUAL_DATA_DIR"/*
  rm -rf "$ACTUAL_DATA_DIR"/.* 2>/dev/null || true
fi

# Test write permission
sudo -u postgres touch "$ACTUAL_DATA_DIR/.test" 2>/dev/null && rm -f "$ACTUAL_DATA_DIR/.test" && {
  echo "   ✅ Directory is writable"
} || {
  echo "   ⚠️  Write test failed, but continuing..."
}

# Perform base backup
echo ""
echo "▶ Performing base backup from PRIMARY..."
echo "   This may take several minutes..."
echo ""
sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
  -h $PRIMARY_IP \
  -D "$ACTUAL_DATA_DIR" \
  -U replicator \
  -v -P -W -R || {
  echo ""
  echo "❌ Base backup failed!"
  exit 1
}

echo ""
echo "✅ Base backup completed"

# Start PostgreSQL
echo ""
echo "▶ Starting PostgreSQL..."
/usr/syno/bin/synopkg start pgsql 2>/dev/null || {
  sudo -u postgres /usr/bin/postgres -D "$ACTUAL_DATA_DIR" > /dev/null 2>&1 &
  sleep 3
}
sleep 5

# Verify replication
echo ""
echo "▶ Verifying replication..."
sleep 2
if sudo -u postgres psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ PostgreSQL is in recovery mode"
  echo "   ✅ Replication is ACTIVE!"
else
  echo "   ⚠️  Not in recovery mode"
  echo "   Check: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
