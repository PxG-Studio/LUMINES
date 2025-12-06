#!/bin/bash
# diagnose-primary-postgresql.sh
# Diagnose why PostgreSQL won't start on PRIMARY

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Diagnosing PRIMARY PostgreSQL Issue                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PG_DATA_DIR="/var/services/pgsql"

# Check if data directory exists
echo "▶ Checking data directory..."
if [ -d "$PG_DATA_DIR" ]; then
  echo "   ✅ Data directory exists: $PG_DATA_DIR"
  ls -la "$PG_DATA_DIR" | head -10
else
  echo "   ❌ Data directory not found"
  exit 1
fi

# Check for PostgreSQL binary
echo ""
echo "▶ Checking PostgreSQL binary..."
if [ -f /usr/bin/postgres ]; then
  echo "   ✅ PostgreSQL binary found: /usr/bin/postgres"
  /usr/bin/postgres --version
else
  echo "   ⚠️  PostgreSQL binary not found at /usr/bin/postgres"
  which postgres || echo "   PostgreSQL not in PATH"
fi

# Check PostgreSQL log
echo ""
echo "▶ Checking PostgreSQL log..."
if [ -f /tmp/postgres.log ]; then
  echo "   Recent log entries:"
  tail -20 /tmp/postgres.log
else
  echo "   No log file found at /tmp/postgres.log"
fi

# Try to start PostgreSQL with verbose output
echo ""
echo "▶ Attempting to start PostgreSQL with verbose output..."
sudo -u postgres /usr/bin/postgres -D "$PG_DATA_DIR" -c log_destination=stderr -c logging_collector=off > /tmp/postgres_verbose.log 2>&1 &
PG_PID=$!
sleep 3

if ps -p $PG_PID > /dev/null 2>&1; then
  echo "   ✅ PostgreSQL started (PID: $PG_PID)"
  echo "   Check: ps aux | grep postgres"
else
  echo "   ❌ PostgreSQL failed to start"
  echo ""
  echo "   Error log:"
  cat /tmp/postgres_verbose.log
fi

# Check for common issues
echo ""
echo "▶ Checking for common issues..."

# Check if data directory is initialized
if [ ! -f "$PG_DATA_DIR/PG_VERSION" ]; then
  echo "   ⚠️  Data directory not initialized (no PG_VERSION file)"
  echo "   PostgreSQL may need to be reinitialized"
fi

# Check permissions
echo ""
echo "   Checking permissions..."
ls -ld "$PG_DATA_DIR"
if [ -d "$PG_DATA_DIR" ]; then
  OWNER=$(stat -c '%U' "$PG_DATA_DIR" 2>/dev/null || stat -f '%Su' "$PG_DATA_DIR" 2>/dev/null)
  echo "   Owner: $OWNER"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Diagnosis Complete                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
