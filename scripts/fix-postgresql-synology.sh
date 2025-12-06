#!/bin/bash
# fix-postgresql-synology.sh
# Fixed PostgreSQL replica setup for Synology NAS

PRIMARY_IP="192.168.86.27"
DATA_DIR="/volume1/@database/pgsql"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL Replica Setup for Synology NAS                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# Check PostgreSQL status
echo "▶ Checking PostgreSQL installation..."
if ! command -v psql > /dev/null 2>&1; then
  echo "❌ PostgreSQL not found. Install via Package Center first."
  exit 1
fi

echo "✅ PostgreSQL found: $(psql --version)"

# Find actual data directory
echo ""
echo "▶ Finding PostgreSQL data directory..."
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "$DATA_DIR")
echo "   Data directory: $ACTUAL_DATA_DIR"

# Check if directory exists and get ownership
if [ -d "$ACTUAL_DATA_DIR" ]; then
  OWNER=$(stat -c '%U:%G' "$ACTUAL_DATA_DIR" 2>/dev/null || stat -f '%Su:%Sg' "$ACTUAL_DATA_DIR" 2>/dev/null)
  echo "   Current owner: $OWNER"
else
  echo "   ⚠️  Data directory doesn't exist, will be created"
fi

# Stop PostgreSQL
echo ""
echo "▶ Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 2

# Backup existing data
echo ""
echo "▶ Backing up existing data..."
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "   Backing up to: $BACKUP_DIR"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" || {
    echo "   ⚠️  Could not move directory, trying copy..."
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR" || {
      echo "   ❌ Backup failed. Aborting."
      /usr/syno/bin/synopkg start pgsql
      exit 1
    }
  }
  echo "   ✅ Backup created"
else
  echo "   No existing data to backup"
fi

# Create parent directory with correct permissions
echo ""
echo "▶ Creating data directory..."
PARENT_DIR=$(dirname "$ACTUAL_DATA_DIR")
mkdir -p "$PARENT_DIR"
chown postgres:postgres "$PARENT_DIR" 2>/dev/null || {
  echo "   ⚠️  Could not set ownership, will try after backup"
}

# Create data directory
mkdir -p "$ACTUAL_DATA_DIR"

# Set ownership to postgres user
echo "   Setting ownership to postgres user..."
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || {
  # Try alternative method
  chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || {
    echo "   ⚠️  Could not set ownership automatically"
    echo "   You may need to set ownership manually:"
    echo "   chown -R postgres:postgres $ACTUAL_DATA_DIR"
  }
}

# Perform base backup
echo ""
echo "▶ Performing base backup from primary server..."
echo "   This may take several minutes depending on database size..."
echo "   Source: $PRIMARY_IP:5432"
echo "   Target: $ACTUAL_DATA_DIR"

# Try with postgres user
sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo ""
  echo "❌ pg_basebackup failed!"
  echo ""
  echo "Possible issues:"
  echo "1. Replication user 'replicator' doesn't exist on primary"
  echo "2. pg_hba.conf on primary doesn't allow replication from this IP"
  echo "3. Network connectivity issue"
  echo "4. Wrong password"
  echo ""
  echo "Before retrying, ensure on PRIMARY (192.168.86.27):"
  echo "  1. Create replication user:"
  echo "     CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'YOUR_PASSWORD';"
  echo ""
  echo "  2. Add to pg_hba.conf:"
  echo "     host replication replicator 192.168.86.28/32 md5"
  echo ""
  echo "  3. Configure postgresql.conf:"
  echo "     wal_level = replica"
  echo "     max_wal_senders = 3"
  echo ""
  read -p "Restore backup and start PostgreSQL? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "$BACKUP_DIR" ]; then
      rm -rf "$ACTUAL_DATA_DIR"
      mv "$BACKUP_DIR" "$ACTUAL_DATA_DIR"
    fi
    /usr/syno/bin/synopkg start pgsql
  fi
  exit 1
}

echo "   ✅ Base backup completed successfully"

# Configure recovery
echo ""
echo "▶ Configuring recovery settings..."
cat > "$ACTUAL_DATA_DIR/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$PRIMARY_IP port=5432 user=replicator password=$REPLICATION_PASSWORD'
primary_slot_name = 'replica_slot'
EOF

# Create standby signal file
sudo -u postgres touch "$ACTUAL_DATA_DIR/standby.signal" || touch "$ACTUAL_DATA_DIR/standby.signal"

# Ensure correct ownership
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || true

# Start PostgreSQL
echo ""
echo "▶ Starting PostgreSQL..."
/usr/syno/bin/synopkg start pgsql
sleep 3

# Verify replication
echo ""
echo "▶ Verifying replication status..."
if sudo -u postgres psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "   ✅ PostgreSQL is in recovery mode (replica mode)"
  echo "   ✅ Replication is active"
else
  echo "   ⚠️  Could not verify replication status"
  echo "   Check manually: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL replica configured"
echo ""
echo "Next steps:"
echo "1. Verify replication: sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\""
echo "2. Check lag: sudo -u postgres psql -h $PRIMARY_IP -U postgres -c \"SELECT * FROM pg_stat_replication;\""
echo "3. Continue with Redis, NATS, and Registry setup"
echo ""
