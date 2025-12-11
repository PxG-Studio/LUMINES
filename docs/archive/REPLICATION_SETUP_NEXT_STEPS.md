# Replication Setup - Next Steps

## ✅ Current Status

- **PostgreSQL DR Server:** ✅ Running on 192.168.86.115
- **NFS Storage:** ✅ Configured and working
- **PostgreSQL Version:** 11.16
- **Replication:** ⏳ Ready to configure

## 🔧 Step 1: Configure PRIMARY Server (192.168.86.27)

**Run this script on PRIMARY server:**

```bash
# Copy script to PRIMARY
scp scripts/setup-primary-for-replication.sh ncadmin@192.168.86.27:/tmp/
ssh ncadmin@192.168.86.27 "chmod +x /tmp/setup-primary-for-replication.sh && sudo bash /tmp/setup-primary-for-replication.sh"
```

**Or manually configure:**

1. **Set listen_addresses:**
   ```bash
   sudo -u postgres psql -c "ALTER SYSTEM SET listen_addresses = '*';"
   ```

2. **Configure WAL:**
   ```bash
   sudo -u postgres psql -c "ALTER SYSTEM SET wal_level = 'replica';"
   sudo -u postgres psql -c "ALTER SYSTEM SET max_wal_senders = 3;"
   sudo -u postgres psql -c "ALTER SYSTEM SET max_replication_slots = 3;"
   ```

3. **Configure pg_hba.conf:**
   ```bash
   # Add to pg_hba.conf:
   host    replication     replicator      192.168.86.115/32    md5
   ```

4. **Create replication user:**
   ```bash
   sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'Replication2024Secure';"
   ```

5. **Create replication slot:**
   ```bash
   sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');"
   ```

6. **Restart PostgreSQL:**
   ```bash
   /usr/syno/bin/synopkg restart pgsql
   ```

## 🔧 Step 2: Setup Replication on DR Server

Once PRIMARY is configured, run:

```bash
ssh 192.168.86.115 "bash /tmp/setup-postgresql-replication.sh"
```

**Or manually:**

1. **Stop DR PostgreSQL:**
   ```bash
   ssh 192.168.86.115 "sudo docker stop postgresql-dr"
   ```

2. **Backup existing data:**
   ```bash
   ssh 192.168.86.115 "sudo mv /mnt/postgresql-data/pgdata /mnt/postgresql-data/pgdata.backup.$(date +%Y%m%d-%H%M%S)"
   ```

3. **Perform base backup:**
   ```bash
   ssh 192.168.86.115 "sudo docker run --rm --network host \
     -v /mnt/postgresql-data:/backup \
     -e PGPASSWORD='Replication2024Secure' \
     postgres:11 \
     pg_basebackup -h 192.168.86.27 -D /backup/pgdata -U replicator -v -P -W -R" <<< "Replication2024Secure"
   ```

4. **Start DR PostgreSQL:**
   ```bash
   ssh 192.168.86.115 "sudo docker start postgresql-dr"
   ```

5. **Verify replication:**
   ```bash
   ssh 192.168.86.115 "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();'"
   # Should return 't' (true)
   ```

## ✅ Verification Commands

**Check replication status:**
```bash
# On PRIMARY
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"

# On DR
sudo docker exec postgresql-dr psql -U postgres -c "SELECT pg_is_in_recovery();"
sudo docker exec postgresql-dr psql -U postgres -c "SELECT pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn();"
```

**Test connectivity:**
```bash
# From DR server, test PRIMARY connection
ssh 192.168.86.115 "sudo docker exec postgresql-dr psql -h 192.168.86.27 -U replicator -d postgres -c 'SELECT 1;'"
```

## 📋 Summary

1. ✅ DR PostgreSQL is running
2. ⏳ Configure PRIMARY for replication
3. ⏳ Setup replication from PRIMARY to DR
4. ⏳ Verify replication is working

All scripts are ready - just need to configure PRIMARY server first!
