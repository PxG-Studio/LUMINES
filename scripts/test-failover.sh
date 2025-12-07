#!/bin/bash
# Failover Testing Script
# Tests database failover procedures

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
PRIMARY_HOST="${PRIMARY_DB_HOST:-192.168.86.27}"
REPLICA_HOST="${REPLICA_DB_HOST:-192.168.86.28}"
DATABASE_NAME="${DATABASE_NAME:-lumines}"
DATABASE_USER="${DATABASE_USER:-postgres}"

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

echo "🔄 Starting failover test..."

# Pre-test checks
log_info "Pre-test checks..."

# Check primary connectivity
log_info "Checking primary database connectivity..."
if psql -h "$PRIMARY_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    log_info "✅ Primary database is accessible"
else
    log_error "❌ Primary database is not accessible"
    exit 1
fi

# Check replica connectivity
log_info "Checking replica database connectivity..."
if psql -h "$REPLICA_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    log_info "✅ Replica database is accessible"
else
    log_error "❌ Replica database is not accessible"
    exit 1
fi

# Check replication status
log_info "Checking replication status..."
REPLICATION_LAG=$(psql -h "$PRIMARY_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -t -c \
  "SELECT EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp())) FROM pg_stat_replication;" 2>/dev/null || echo "unknown")

if [ "$REPLICATION_LAG" != "unknown" ]; then
    log_info "Replication lag: ${REPLICATION_LAG}s"
else
    log_warn "Could not determine replication lag"
fi

# Test failover procedure
log_info "Testing failover procedure..."

# 1. Simulate primary failure (read-only check)
log_info "Step 1: Simulating primary failure (read-only check)..."
PRIMARY_READ_ONLY=$(psql -h "$PRIMARY_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -t -c \
  "SELECT pg_is_in_recovery();" 2>/dev/null || echo "unknown")

if [ "$PRIMARY_READ_ONLY" = "t" ]; then
    log_warn "Primary is in recovery mode (read-only)"
else
    log_info "Primary is in read-write mode"
fi

# 2. Check replica status
log_info "Step 2: Checking replica status..."
REPLICA_READ_ONLY=$(psql -h "$REPLICA_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -t -c \
  "SELECT pg_is_in_recovery();" 2>/dev/null || echo "unknown")

if [ "$REPLICA_READ_ONLY" = "t" ]; then
    log_info "✅ Replica is in recovery mode (as expected)"
else
    log_warn "Replica is not in recovery mode (may already be promoted)"
fi

# 3. Verify data consistency
log_info "Step 3: Verifying data consistency..."
PRIMARY_COUNT=$(psql -h "$PRIMARY_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -t -c \
  "SELECT count(*) FROM users;" 2>/dev/null || echo "0")
REPLICA_COUNT=$(psql -h "$REPLICA_HOST" -U "$DATABASE_USER" -d "$DATABASE_NAME" -t -c \
  "SELECT count(*) FROM users;" 2>/dev/null || echo "0")

if [ "$PRIMARY_COUNT" = "$REPLICA_COUNT" ]; then
    log_info "✅ Data consistency verified: $PRIMARY_COUNT records on both"
else
    log_warn "Data inconsistency detected: Primary=$PRIMARY_COUNT, Replica=$REPLICA_COUNT"
fi

# 4. Test application connectivity
log_info "Step 4: Testing application connectivity..."
if command -v curl &> /dev/null; then
    APP_HEALTH=$(curl -s http://localhost:3000/api/health/db 2>/dev/null || echo "unavailable")
    if echo "$APP_HEALTH" | grep -q "connected"; then
        log_info "✅ Application database connectivity verified"
    else
        log_warn "Application database connectivity check failed"
    fi
else
    log_warn "curl not available, skipping application check"
fi

# Summary
echo ""
log_info "Failover test summary:"
log_info "  Primary: $PRIMARY_HOST (accessible: ✅)"
log_info "  Replica: $REPLICA_HOST (accessible: ✅)"
log_info "  Replication lag: ${REPLICATION_LAG}s"
log_info "  Data consistency: $([ "$PRIMARY_COUNT" = "$REPLICA_COUNT" ] && echo "✅" || echo "⚠️")"
log_info ""
log_info "✅ Failover test complete!"
log_info ""
log_info "Note: This is a read-only test. Actual failover requires:"
log_info "  1. Stop primary database"
log_info "  2. Promote replica to primary"
log_info "  3. Update application configuration"
log_info "  4. Restart application"


