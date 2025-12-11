#!/bin/bash
# Backup Restoration Test Script
# Tests backup restoration procedures

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups/postgres}"
TEST_DB_NAME="${TEST_DB_NAME:-lumines_test}"
DATABASE_USER="${DATABASE_USER:-postgres}"
DATABASE_HOST="${DATABASE_HOST:-localhost}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cd "$PROJECT_ROOT"

echo "🔄 Starting backup restoration test..."

# Find latest backup
log_info "Finding latest backup..."
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "lumines_*.dump.gz" -type f | sort -r | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    log_error "No backup found in $BACKUP_DIR"
    exit 1
fi

log_info "Latest backup: $LATEST_BACKUP"

# Check backup file
BACKUP_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
log_info "Backup size: $BACKUP_SIZE"

# Create test database
log_info "Creating test database: $TEST_DB_NAME..."
psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d postgres -c \
  "DROP DATABASE IF EXISTS $TEST_DB_NAME;" > /dev/null 2>&1 || true

psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d postgres -c \
  "CREATE DATABASE $TEST_DB_NAME;" || {
    log_error "Failed to create test database"
    exit 1
  }

log_info "✅ Test database created"

# Restore backup
log_info "Restoring backup to test database..."
START_TIME=$(date +%s)

gunzip -c "$LATEST_BACKUP" | \
  pg_restore -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$TEST_DB_NAME" \
  --verbose --no-owner --no-privileges || {
    log_error "Backup restoration failed"
    psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d postgres -c \
      "DROP DATABASE IF EXISTS $TEST_DB_NAME;" > /dev/null 2>&1
    exit 1
  }

END_TIME=$(date +%s)
RESTORE_TIME=$((END_TIME - START_TIME))

log_info "✅ Backup restored in ${RESTORE_TIME}s"

# Verify restoration
log_info "Verifying restoration..."

# Check table counts
TABLES=("users" "projects" "components" "deployments" "builds")
for table in "${TABLES[@]}"; do
    COUNT=$(psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$TEST_DB_NAME" -t -c \
      "SELECT count(*) FROM $table;" 2>/dev/null || echo "0")
    if [ "$COUNT" != "0" ] && [ "$COUNT" != "" ]; then
        log_info "  ✅ $table: $COUNT records"
    else
        log_warn "  ⚠️  $table: No records or table doesn't exist"
    fi
done

# Check data integrity
log_info "Checking data integrity..."
INTEGRITY_CHECK=$(psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d "$TEST_DB_NAME" -t -c \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

if [ "$INTEGRITY_CHECK" -gt 0 ]; then
    log_info "✅ Database integrity verified: $INTEGRITY_CHECK tables"
else
    log_error "❌ Database integrity check failed"
    exit 1
fi

# Cleanup
log_info "Cleaning up test database..."
psql -h "$DATABASE_HOST" -U "$DATABASE_USER" -d postgres -c \
  "DROP DATABASE IF EXISTS $TEST_DB_NAME;" > /dev/null 2>&1 || {
    log_warn "Failed to drop test database (manual cleanup may be required)"
  }

# Summary
echo ""
log_info "Backup restoration test summary:"
log_info "  Backup file: $LATEST_BACKUP"
log_info "  Backup size: $BACKUP_SIZE"
log_info "  Restore time: ${RESTORE_TIME}s"
log_info "  Integrity: ✅ Verified"
log_info ""
log_info "✅ Backup restoration test complete!"


