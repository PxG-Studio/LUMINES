#!/bin/bash
# setup-replication-complete.sh
# Complete PostgreSQL replication setup for PRIMARY and SECONDARY
# Run this from your local machine (Ubuntu VM)

set -e

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
PRIMARY_USER="ncadmin"
SECONDARY_USER="ncadmin"
REPLICATION_PASSWORD="${REPLICATION_PASSWORD:-Replication2024!Secure}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Complete PostgreSQL Replication Setup                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "PRIMARY:   $PRIMARY_IP"
echo "SECONDARY: $SECONDARY_IP"
echo ""

# Function to run command on PRIMARY
run_primary() {
  ssh -o StrictHostKeyChecking=no ${PRIMARY_USER}@${PRIMARY_IP} "$1"
}

# Function to run command on SECONDARY
run_secondary() {
  ssh -o StrictHostKeyChecking=no ${SECONDARY_USER}@${SECONDARY_IP} "$1"
}

# Step 1: Configure PRIMARY
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Step 1: Configuring PRIMARY ($PRIMARY_IP)                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PRIMARY_SCRIPT=$(cat <<'PRIMARY_EOF'
#!/bin/bash
set -e

PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "Config: $PG_CONF"
echo "HBA: $PG_HBA"

# Backup
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# Fix listen_addresses - remove all and add correct one
sed -i '/listen_addresses/d' "$PG_CONF"
echo "listen_addresses = '*'" >> "$PG_CONF"

# Configure WAL
sed -i '/^#*wal_level/d' "$PG_CONF"
echo "wal_level = replica" >> "$PG_CONF"
sed -i '/^#*max_wal_senders/d' "$PG_CONF"
echo "max_wal_senders = 3" >> "$PG_CONF"
sed -i '/^#*max_replication_slots/d' "$PG_CONF"
echo "max_replication_slots = 3" >> "$PG_CONF"

# Configure pg_hba.conf
if ! grep -q "192.168.86.0/24" "$PG_HBA" 2>/dev/null; then
  echo "" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
fi
if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA" 2>/dev/null; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
fi

# Create replication user
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'REPLICATION_PASSWORD_PLACEHOLDER';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD 'REPLICATION_PASSWORD_PLACEHOLDER';"

# Create replication slot
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || true

# Restart PostgreSQL
/usr/syno/bin/synopkg stop pgsql
sleep 3
/usr/syno/bin/synopkg start pgsql
sleep 5

# Verify
echo "Verifying..."
LISTEN=$(sudo -u postgres psql -t -c "SHOW listen_addresses;" 2>/dev/null | xargs)
echo "listen_addresses: $LISTEN"
netstat -tln | grep ":5432" || ss -tln | grep ":5432"
echo "✅ PRIMARY configured"
PRIMARY_EOF
)

# Replace password placeholder
PRIMARY_SCRIPT=$(echo "$PRIMARY_SCRIPT" | sed "s/REPLICATION_PASSWORD_PLACEHOLDER/$REPLICATION_PASSWORD/g")

echo "▶ Uploading and running PRIMARY configuration..."
run_primary "sudo bash -c '$PRIMARY_SCRIPT'" || {
  echo "❌ Failed to configure PRIMARY"
  exit 1
}

echo ""
echo "✅ PRIMARY configured successfully"
echo ""

# Wait a bit
sleep 3

# Step 2: Test connection from SECONDARY
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Step 2: Testing connection from SECONDARY                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Testing PostgreSQL connection..."
if run_secondary "PGPASSWORD='$REPLICATION_PASSWORD' psql -h $PRIMARY_IP -U replicator -d postgres -c 'SELECT 1;' > /dev/null 2>&1"; then
  echo "✅ Connection from SECONDARY to PRIMARY works!"
else
  echo "⚠️  Connection test failed, but continuing..."
fi

# Step 3: Configure SECONDARY
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Step 3: Configuring SECONDARY ($SECONDARY_IP)             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

SECONDARY_SCRIPT=$(cat <<'SECONDARY_EOF'
#!/bin/bash
set -e

PRIMARY_IP="PRIMARY_IP_PLACEHOLDER"
REPLICATION_PASSWORD="REPLICATION_PASSWORD_PLACEHOLDER"

# Find data directory
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "Data directory: $ACTUAL_DATA_DIR"

# Stop PostgreSQL
echo "Stopping PostgreSQL..."
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Backup and remove existing directory
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  echo "Backing up to: $BACKUP_DIR"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
    rm -rf "$ACTUAL_DATA_DIR"
  }
  # Ensure it's gone
  [ -d "$ACTUAL_DATA_DIR" ] && rm -rf "$ACTUAL_DATA_DIR"
fi

# Create fresh directory
mkdir -p "$ACTUAL_DATA_DIR"
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 999:999 "$ACTUAL_DATA_DIR" 2>/dev/null || \
chown -R 1026:100 "$ACTUAL_DATA_DIR" 2>/dev/null || true
chmod 700 "$ACTUAL_DATA_DIR"

# Perform base backup
echo "Performing base backup from $PRIMARY_IP..."
echo "This may take several minutes..."
sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo "❌ Base backup failed!"
  exit 1
}

# Start PostgreSQL
echo "Starting PostgreSQL..."
/usr/syno/bin/synopkg start pgsql
sleep 5

# Verify replication
echo "Verifying replication..."
if sudo -u postgres psql -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; then
  echo "✅ Replication is ACTIVE!"
else
  echo "⚠️  Not in recovery mode - check manually"
fi

echo "✅ SECONDARY configured"
SECONDARY_EOF
)

# Replace placeholders
SECONDARY_SCRIPT=$(echo "$SECONDARY_SCRIPT" | sed "s/PRIMARY_IP_PLACEHOLDER/$PRIMARY_IP/g")
SECONDARY_SCRIPT=$(echo "$SECONDARY_SCRIPT" | sed "s/REPLICATION_PASSWORD_PLACEHOLDER/$REPLICATION_PASSWORD/g")

echo "▶ Uploading and running SECONDARY configuration..."
run_secondary "sudo bash -c '$SECONDARY_SCRIPT'" || {
  echo "❌ Failed to configure SECONDARY"
  exit 1
}

echo ""
echo "✅ SECONDARY configured successfully"
echo ""

# Step 4: Final verification
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Step 4: Final Verification                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Checking PRIMARY replication status..."
run_primary "sudo -u postgres psql -c \"SELECT * FROM pg_stat_replication;\"" || echo "No active replicas yet"

echo ""
echo "▶ Checking SECONDARY replication status..."
run_secondary "sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\"" || echo "Check failed"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL replication configured between:"
echo "   PRIMARY:   $PRIMARY_IP"
echo "   SECONDARY: $SECONDARY_IP"
echo ""
echo "⚠️  IMPORTANT: Change the replication password!"
echo "   On PRIMARY: sudo -u postgres psql -c \"ALTER USER replicator WITH PASSWORD 'YOUR_STRONG_PASSWORD';\""
echo ""
