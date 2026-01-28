#!/usr/bin/env bash
# Pre-deployment port conflict detection script.
# Checks if required ports (80, 443, 2222, 8080, 8081) are already in use.
# Run on the server before starting GitLab services.
#
# Usage:
#   bash scripts/check-port-conflicts.sh
#   Or on server: ssh ncadmin@192.168.86.29 'bash -s' < scripts/check-port-conflicts.sh

set -e

REQUIRED_PORTS=(80 443 2222 8080 8081)
CONFLICTS=0

echo "Checking for port conflicts on required ports..."
echo ""

for port in "${REQUIRED_PORTS[@]}"; do
  if sudo ss -tlnp 2>/dev/null | grep -q ":$port "; then
    echo "⚠️  WARNING: Port $port is already in use:"
    sudo ss -tlnp 2>/dev/null | grep ":$port " | sed 's/^/   /'
    CONFLICTS=$((CONFLICTS + 1))
  else
    echo "✅ Port $port is free"
  fi
done

echo ""
if [ $CONFLICTS -eq 0 ]; then
  echo "✅ All required ports are free. Safe to proceed with deployment."
  exit 0
else
  echo "❌ Found $CONFLICTS port conflict(s). Resolve conflicts before deployment."
  echo ""
  echo "Common fixes:"
  echo "  - Disable default Nginx: sudo rm /etc/nginx/sites-enabled/default && sudo systemctl restart nginx"
  echo "  - Stop conflicting services: sudo systemctl stop <service>"
  echo "  - Change port mappings in docker-compose.yml if needed"
  exit 1
fi
