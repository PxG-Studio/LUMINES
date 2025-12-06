# PRIMARY Server Setup Instructions

## Quick Setup (Copy-Paste on PRIMARY)

**SSH to PRIMARY (192.168.86.27) and run these commands:**

```bash
# SSH to PRIMARY
ssh -p 2202 ncadmin@192.168.86.27
# OR
ssh ncadmin@192.168.86.27

# Switch to root
sudo su

# Find PostgreSQL config
PG_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" | xargs)
PG_CONF="$PG_DATA_DIR/postgresql.conf"
PG_HBA="$PG_DATA_DIR/pg_hba.conf"

echo "Config: $PG_CONF"
echo "HBA: $PG_HBA"

# Backup
cp "$PG_CONF" "${PG_CONF}.backup.$(date +%Y%m%d)"
cp "$PG_HBA" "${PG_HBA}.backup.$(date +%Y%m%d)"

# CRITICAL: Configure listen_addresses (allows TCP/IP connections)
echo ""
echo "Configuring listen_addresses..."
if grep -q "^listen_addresses" "$PG_CONF"; then
  sed -i "s/^listen_addresses.*/listen_addresses = '*'/" "$PG_CONF"
  echo "✅ Updated listen_addresses"
else
  echo "listen_addresses = '*'" >> "$PG_CONF"
  echo "✅ Added listen_addresses"
fi

# Configure WAL for replication
echo ""
echo "Configuring WAL settings..."
sed -i "s/^#*wal_level.*/wal_level = replica/" "$PG_CONF"
grep -q "^wal_level" "$PG_CONF" || echo "wal_level = replica" >> "$PG_CONF"

sed -i "s/^#*max_wal_senders.*/max_wal_senders = 3/" "$PG_CONF"
grep -q "^max_wal_senders" "$PG_CONF" || echo "max_wal_senders = 3" >> "$PG_CONF"

# Configure pg_hba.conf - Allow network connections
echo ""
echo "Configuring pg_hba.conf..."
# Allow all from local network
if ! grep -q "192.168.86.0/24" "$PG_HBA"; then
  echo "" >> "$PG_HBA"
  echo "# Allow connections from local network" >> "$PG_HBA"
  echo "host    all             all             192.168.86.0/24         md5" >> "$PG_HBA"
  echo "✅ Added network access"
fi

# Allow replication from secondary
if ! grep -q "replication.*replicator.*192.168.86.28" "$PG_HBA"; then
  echo "host    replication     replicator      192.168.86.28/32    md5" >> "$PG_HBA"
  echo "✅ Added replication entry"
fi

# Create replication user
echo ""
echo "Creating replication user..."
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'CHANGE_ME_PASSWORD';" 2>/dev/null || \
sudo -u postgres psql -c "ALTER USER replicator WITH ENCRYPTED PASSWORD 'CHANGE_ME_PASSWORD';"
echo "✅ Replication user ready"

# Create replication slot
echo ""
echo "Creating replication slot..."
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');" 2>/dev/null || echo "Slot may already exist"
echo "✅ Replication slot ready"

# Restart PostgreSQL
echo ""
echo "Restarting PostgreSQL..."
/usr/syno/bin/synopkg restart pgsql
sleep 5

# Verify
echo ""
echo "Verifying..."
netstat -tln | grep ":5432" && echo "✅ PostgreSQL is listening on port 5432" || echo "⚠️ Check manually"
sudo -u postgres psql -t -c "SHOW listen_addresses;" | xargs && echo "✅ listen_addresses configured"

echo ""
echo "✅ PRIMARY configuration complete!"
echo ""
echo "⚠️ IMPORTANT: Change the replication password:"
echo "   sudo -u postgres psql -c \"ALTER USER replicator WITH PASSWORD 'YOUR_STRONG_PASSWORD';\""
echo ""
echo "Now test from SECONDARY:"
echo "   psql -h 192.168.86.27 -U replicator -d postgres -c \"SELECT 1;\""
```

## After Running on PRIMARY

**On SECONDARY (192.168.86.28), test the connection:**

```bash
psql -h 192.168.86.27 -U replicator -d postgres -c "SELECT 1;"
```

If this works, proceed with the replica setup on SECONDARY.
