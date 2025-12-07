#!/bin/bash
# Custom entrypoint for PostgreSQL on NFS that handles chown gracefully

set -e

# If data directory exists and has PG_VERSION, skip initialization
if [ -s "$PGDATA/PG_VERSION" ]; then
    # Data already initialized, skip chown attempts
    echo "PostgreSQL data directory already initialized, skipping chown..."

    # Run the original entrypoint but skip chown
    exec docker-entrypoint.sh postgres "$@"
else
    # Fresh initialization - let original entrypoint handle it
    exec docker-entrypoint.sh postgres "$@"
fi
