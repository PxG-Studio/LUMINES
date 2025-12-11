#!/bin/bash
# restore-primary.sh
# Restore PRIMARY PostgreSQL after accidental SECONDARY script run

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Restoring PRIMARY PostgreSQL (SBX01)                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check for backups
echo "▶ Looking for backups..."
BACKUPS=$(ls -dt /var/services/pgsql.backup.* 2>/dev/null | head -1)
if [ -n "$BACKUPS" ]; then
  echo "   Found backup: $BACKUPS"
  echo ""
  echo "▶ Restoring from backup..."

  # Stop PostgreSQL if running
  /usr/syno/bin/synopkg stop pgsql 2>/dev/null || true
  killall -u postgres postgres 2>/dev/null || true
  sleep 2

  # Remove current directory if it exists
  if [ -e "/var/services/pgsql" ]; then
    echo "   Removing current directory..."
    rm -rf /var/services/pgsql 2>/dev/null || true
  fi

  # Restore from backup
  echo "   Restoring backup..."
  mv "$BACKUPS" /var/services/pgsql
  echo "   ✅ Backup restored"

  # Set correct ownership
  chown -R postgres:postgres /var/services/pgsql 2>/dev/null || \
  chown -R 999:999 /var/services/pgsql 2>/dev/null || true

  # Start PostgreSQL
  echo ""
  echo "▶ Starting PostgreSQL..."
  /usr/syno/bin/synopkg start pgsql 2>/dev/null || {
    # Try manual start
    PG_DATA_DIR="/var/services/pgsql"
    sudo -u postgres /usr/bin/postgres -D "$PG_DATA_DIR" > /tmp/postgres.log 2>&1 &
    sleep 3
  }

  sleep 5

  # Verify
  if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL is running"
  else
    echo "   ⚠️  PostgreSQL may not have started properly"
    echo "   Check logs: tail -f /tmp/postgres.log"
  fi
else
  echo "   ⚠️  No backup found"
  echo ""
  echo "   Checking if data directory exists..."
  if [ -d "/var/services/pgsql" ]; then
    echo "   ✅ Data directory exists at /var/services/pgsql"
    echo ""
    echo "   Trying to start PostgreSQL..."
    /usr/syno/bin/synopkg start pgsql 2>/dev/null || {
      PG_DATA_DIR="/var/services/pgsql"
      sudo -u postgres /usr/bin/postgres -D "$PG_DATA_DIR" > /tmp/postgres.log 2>&1 &
      sleep 3
    }
    sleep 5

    if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
      echo "   ✅ PostgreSQL started successfully"
    else
      echo "   ❌ PostgreSQL failed to start"
      echo "   Check: tail -f /tmp/postgres.log"
    fi
  else
    echo "   ❌ Data directory not found"
    echo "   You may need to reinstall PostgreSQL or restore from a different backup"
  fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Restore Complete                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
