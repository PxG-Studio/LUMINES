#!/bin/bash
# PostgreSQL Backup Script
# Automated daily backups with retention

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lumines_$DATE.dump"

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

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ] && [ -z "$DATABASE_HOST" ]; then
    log_error "DATABASE_URL or DATABASE_HOST must be set"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Extract connection details from DATABASE_URL if provided
if [ -n "$DATABASE_URL" ]; then
    # Parse DATABASE_URL (postgresql://user:password@host:port/database)
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p' || echo "5432")
    DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
else
    DB_HOST="${DATABASE_HOST:-localhost}"
    DB_PORT="${DATABASE_PORT:-5432}"
    DB_USER="${DATABASE_USER:-postgres}"
    DB_NAME="${DATABASE_NAME:-lumines}"
fi

log_info "Starting PostgreSQL backup..."
log_info "Host: $DB_HOST"
log_info "Port: $DB_PORT"
log_info "Database: $DB_NAME"
log_info "Backup file: $BACKUP_FILE"

# Perform backup
log_info "Creating backup..."
PGPASSWORD="${DATABASE_PASSWORD:-${PGPASSWORD}}" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -F c \
  -b \
  -v \
  -f "$BACKUP_FILE" || {
    log_error "Backup failed"
    exit 1
  }

# Compress backup
log_info "Compressing backup..."
gzip "$BACKUP_FILE" || {
    log_warn "Compression failed, backup saved as uncompressed"
}

BACKUP_FILE_COMPRESSED="${BACKUP_FILE}.gz"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE_COMPRESSED" 2>/dev/null | cut -f1 || echo "unknown")
log_info "Backup size: $BACKUP_SIZE"

# Remove old backups
log_info "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "lumines_*.dump.gz" -type f -mtime +$RETENTION_DAYS -delete || {
    log_warn "Failed to remove old backups"
}

# List remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "lumines_*.dump.gz" -type f | wc -l)
log_info "Total backups retained: $BACKUP_COUNT"

# Verify backup
log_info "Verifying backup..."
if [ -f "$BACKUP_FILE_COMPRESSED" ]; then
    BACKUP_SIZE_BYTES=$(stat -f%z "$BACKUP_FILE_COMPRESSED" 2>/dev/null || stat -c%s "$BACKUP_FILE_COMPRESSED" 2>/dev/null || echo "0")
    if [ "$BACKUP_SIZE_BYTES" -gt 0 ]; then
        log_info "✅ Backup verified: $BACKUP_FILE_COMPRESSED"
        log_info "✅ Backup completed successfully!"
        exit 0
    else
        log_error "Backup file is empty"
        exit 1
    fi
else
    log_error "Backup file not found"
    exit 1
fi


