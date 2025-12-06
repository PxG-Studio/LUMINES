# PostgreSQL Replication Setup - Correct Order

## ⚠️ IMPORTANT: Setup Order

You must configure the **PRIMARY server FIRST**, then the **SECONDARY server**.

## Step 1: Configure PRIMARY Server (192.168.86.27)

**On PRIMARY server (192.168.86.27)**, run:

```bash
# Transfer and run the primary configuration script
# From your local machine:
cd /home/cursor-dev/Documents/Lumines
cat scripts/configure-primary-for-replication.sh | ssh -p 2202 warden-ssh@192.168.86.27 "cat > ~/configure-primary.sh && chmod +x ~/configure-primary.sh && sudo ~/configure-primary.sh"
```

Or manually on PRIMARY:

```bash
# 1. Create replication user
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';"

# 2. Edit postgresql.conf
sudo nano /var/lib/postgresql/14/main/postgresql.conf
# Add/modify:
# wal_level = replica
# max_wal_senders = 3
# max_replication_slots = 3

# 3. Edit pg_hba.conf
sudo nano /var/lib/postgresql/14/main/pg_hba.conf
# Add:
# host    replication     replicator      192.168.86.28/32    md5

# 4. Create replication slot
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');"

# 5. Restart PostgreSQL
sudo systemctl restart postgresql
```

## Step 2: Configure SECONDARY Server (192.168.86.28)

**On SECONDARY server (192.168.86.28)**, run:

```bash
cd ~/scripts

# Use the fixed script that handles existing directory
cat > fix-postgresql-replica-synology.sh << 'SCRIPTEND'
[paste the complete script content]
SCRIPTEND

chmod +x fix-postgresql-replica-synology.sh
sudo ./fix-postgresql-replica-synology.sh
```

## Current Issue

The script is failing because:
1. The directory `/var/services/pgsql` already exists (it's the current PostgreSQL data)
2. `pg_basebackup` cannot overwrite an existing directory
3. Replication hasn't been configured on PRIMARY yet

## Quick Fix - On Secondary (192.168.86.28)

**On the NAS**, run this fixed version:

```bash
cd ~/scripts

cat > fix-postgresql-replica-synology.sh << 'EOF'
#!/bin/bash
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="CHANGE_ME"  # Use the same password as on primary

ACTUAL_DATA_DIR=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs || echo "/var/services/pgsql")
echo "Data directory: $ACTUAL_DATA_DIR"

# Stop PostgreSQL
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Backup and remove existing directory
if [ -d "$ACTUAL_DATA_DIR" ]; then
  BACKUP_DIR="${ACTUAL_DATA_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
  mv "$ACTUAL_DATA_DIR" "$BACKUP_DIR" || {
    cp -r "$ACTUAL_DATA_DIR" "$BACKUP_DIR"
    rm -rf "$ACTUAL_DATA_DIR"
  }
fi

# Create fresh empty directory
mkdir -p "$ACTUAL_DATA_DIR"
POSTGRES_UID=$(id -u postgres 2>/dev/null || echo "999")
POSTGRES_GID=$(id -g postgres 2>/dev/null || echo "999")
chown -R $POSTGRES_UID:$POSTGRES_GID "$ACTUAL_DATA_DIR"

# Perform backup (requires PRIMARY to be configured first!)
sudo -u postgres pg_basebackup -h $PRIMARY_IP -D "$ACTUAL_DATA_DIR" -U replicator -v -P -W -R || {
  echo "❌ Failed! Configure PRIMARY first!"
  exit 1
}

# Start PostgreSQL
/usr/syno/bin/synopkg start pgsql
sleep 3

# Verify
sudo -u postgres psql -c "SELECT pg_is_in_recovery();" | grep -q "t" && echo "✅ Replication active!" || echo "❌ Check status"
EOF

chmod +x fix-postgresql-replica-synology.sh
sudo ./fix-postgresql-replica-synology.sh
```

## Summary

1. **FIRST**: Configure PRIMARY (192.168.86.27) for replication
2. **THEN**: Run replica setup on SECONDARY (192.168.86.28)

The PRIMARY must be ready before the SECONDARY can connect!
