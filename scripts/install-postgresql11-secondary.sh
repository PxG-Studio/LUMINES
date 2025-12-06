#!/bin/bash
# install-postgresql11-secondary.sh
# Install PostgreSQL 11 on SECONDARY (SBX02) for replication compatibility

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Installing PostgreSQL 11 on SECONDARY (SBX02)            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Detect architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Map Synology architecture to PostgreSQL architecture
case $ARCH in
  x86_64)
    PG_ARCH="amd64"
    ;;
  armv7l)
    PG_ARCH="arm"
    ;;
  aarch64)
    PG_ARCH="arm64"
    ;;
  *)
    echo "⚠️  Unknown architecture, defaulting to x86_64"
    PG_ARCH="amd64"
    ;;
esac

echo "PostgreSQL architecture: $PG_ARCH"
echo ""

# Check if we can download PostgreSQL 11
echo "▶ Option 1: Download PostgreSQL 11 binaries"
echo "   PostgreSQL 11.11 download URL (adjust for your architecture):"
echo "   https://www.postgresql.org/ftp/source/v11.11/"
echo ""

# Alternative: Use pre-compiled binaries if available
echo "▶ Option 2: Check for existing PostgreSQL 11 installation"
if [ -d "/usr/local/pgsql" ]; then
  echo "   Found /usr/local/pgsql"
  if [ -f "/usr/local/pgsql/bin/postgres" ]; then
    /usr/local/pgsql/bin/postgres --version
  fi
fi

# Check for alternative locations
echo ""
echo "▶ Searching for PostgreSQL 11..."
find /usr -name "postgres" -type f 2>/dev/null | while read pg; do
  VERSION=$($pg --version 2>/dev/null)
  if echo "$VERSION" | grep -q "11\."; then
    echo "   Found PostgreSQL 11: $pg"
    echo "   Version: $VERSION"
  fi
done

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Installation Options                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Since Package Center doesn't have PostgreSQL 11, you have:"
echo ""
echo "1. Compile PostgreSQL 11 from source"
echo "2. Use pre-compiled binaries (if available for your architecture)"
echo "3. Use Docker (if Docker is available via Package Center)"
echo "4. Alternative: Use logical replication or other methods"
echo ""
echo "For Synology NAS, the easiest might be:"
echo "- Install Docker from Package Center"
echo "- Then run PostgreSQL 11 in a Docker container"
echo ""
