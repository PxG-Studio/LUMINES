#!/usr/bin/env bash
# Create production (and optional staging) deploy directories on the server.
# Run on the production host (e.g. SBX04) or via: ssh ncadmin@192.168.86.29 'bash -s' < scripts/setup-production-deploy-path.sh

set -e

GAME_DIR="${GAME_DIR:-/var/www/game}"
STAGING_DIR="${STAGING_DIR:-/var/www/staging}"
USER="${USER:-ncadmin}"

echo "Creating deploy directories..."
sudo mkdir -p "$GAME_DIR" "$STAGING_DIR"
sudo chown "$USER:$USER" "$GAME_DIR" "$STAGING_DIR"
echo "Done. Production: $GAME_DIR  Staging: $STAGING_DIR"
