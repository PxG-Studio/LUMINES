#!/usr/bin/env bash
# Install Nginx config for game + staging on the production server.
# Run on the server. Config file path is the directory containing this script by default.
#
# From your machine (copy files then run on server):
#   scp scripts/nginx-game.conf scripts/setup-nginx-game.sh ncadmin@192.168.86.29:~/
#   ssh ncadmin@192.168.86.29 'bash ~/setup-nginx-game.sh'
#
# Or run on server with config path:
#   ./setup-nginx-game.sh /path/to/nginx-game.conf

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF_SOURCE="${1:-$SCRIPT_DIR/nginx-game.conf}"
SITES_AVAILABLE="/etc/nginx/sites-available/game"
SITES_ENABLED="/etc/nginx/sites-enabled/game"

if [ ! -f "$CONF_SOURCE" ]; then
  echo "Config not found: $CONF_SOURCE"
  echo "Usage: $0 [path/to/nginx-game.conf]"
  exit 1
fi

echo "Installing Nginx config for game (production :8080, staging :8081)..."
sudo cp "$CONF_SOURCE" "$SITES_AVAILABLE"
sudo ln -sf "$SITES_AVAILABLE" "$SITES_ENABLED"
sudo nginx -t && sudo systemctl reload nginx
echo "Done. Production: http://192.168.86.29:8080  Staging: http://192.168.86.29:8081"
