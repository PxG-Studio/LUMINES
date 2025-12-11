# PostgreSQL Replication Setup - Quick Start

## Step 1: Configure PRIMARY (192.168.86.27)

**SSH to PRIMARY:**
```bash
ssh ncadmin@192.168.86.27
sudo su
```

**Copy and run this script:**
```bash
# Copy the PRIMARY-setup.sh script content, or transfer it:
# Option 1: Copy-paste the script content directly
# Option 2: Transfer from your local machine

# Then run:
chmod +x PRIMARY-setup.sh
sudo ./PRIMARY-setup.sh
```

**OR run these commands directly:**
```bash
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" | xargs)
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

# Backup
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d)"
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d)"

# Configure listen_addresses
sed -i '/listen_addresses/d' "$PG_CONF"
echo "listen_addresses = '*'" >> "$PG_CONF"

# Configure WAL
sed -i '/^#*wal_level/d' "$PG_CONF"
echo "wal_level = replica" >> "$PG_CONF"
sed -i '/^#*max_wal_senders/d' "$PG_CONF"
echo "max_wal_senders = 3" >> "$PG_CONF"

# Configure pg_hba.conf
if ! grep -q "192.168.86.0/24" "$PG_HBA"; then
  echo "" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
fi
if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA"; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
fi

# Create replication user
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'Replication2024!Secure';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD 'Replication2024!Secure';"

# Create replication slot
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || true

# Restart
/usr/syno/bin/synopkg restart pgsql
sleep 8

# Verify
sudo -u postgres psql -t -c "SHOW listen_addresses;" | xargs
netstat -tln | grep ":5432"
```

## Step 2: Test Connection from SECONDARY

**On SECONDARY (192.168.86.28):**
```bash
PGPASSWORD='Replication2024!Secure' psql -h 192.168.86.27 -U replicator -d postgres -c "SELECT 1;"
```

If this works, proceed to Step 3.

## Step 3: Configure SECONDARY (192.168.86.28)

**SSH to SECONDARY:**
```bash
ssh ncadmin@192.168.86.28
sudo su
```

**Copy and run this script:**
```bash
# Copy the SECONDARY-setup.sh script content, or transfer it
chmod +x SECONDARY-setup.sh
sudo ./SECONDARY-setup.sh
```

**OR run these commands directly:**
```bash
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024!Secure"
ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")

# Stop PostgreSQL
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Backup and remove existing
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" 2>/dev/null || {
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
    rm -rf "$ACTUAL_DATA_DIR"
  }
  [ -d "$ACTUAL_DATA_DIR" ] && rm -rf "$ACTUAL_DATA_DIR"
fi

# Create fresh directory
mkdir -p "$ACTUAL_DATA_DIR"
chown -R postgres:postgres "$ACTUAL_DATA_DIR" 2>/dev/null || chown -R 999:999 "$ACTUAL_DATA_DIR"
chmod 700 "$ACTUAL_DATA_DIR"

# Base backup
sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R

# Start PostgreSQL
/usr/syno/bin/synopkg start pgsql
sleep 5

# Verify
sudo -u postgres psql -c "SELECT pg_is_in_recovery();" | grep -q "t" && echo "✅ Replication active!" || echo "⚠️ Check status"
```

## Step 4: Verify Replication

**On PRIMARY:**
```bash
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"
```

**On SECONDARY:**
```bash
sudo -u postgres psql -c "SELECT pg_is_in_recovery();"
sudo -u postgres psql -c "SELECT * FROM pg_stat_wal_receiver;"
```

Both should show active replication!
