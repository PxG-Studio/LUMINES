#!/bin/bash
# Check Prisma version compatibility
# Ensures Prisma CLI and Client versions match

echo "🔍 Checking Prisma versions..."

CLIENT_VERSION=$(npm list @prisma/client --depth=0 | grep @prisma/client | sed 's/.*@prisma\/client@\([0-9.]*\).*/\1/')
CLI_VERSION=$(npx prisma --version | grep '@prisma/cli' | sed 's/.*\([0-9]\+\.[0-9]\+\.[0-9]\+\).*/\1/' || npx prisma --version | head -n 1 | sed 's/.*\([0-9]\+\.[0-9]\+\.[0-9]\+\).*/\1/')

echo "Client version: $CLIENT_VERSION"
echo "CLI version: $CLI_VERSION"

if [ "$CLIENT_VERSION" != "$CLI_VERSION" ]; then
  echo "⚠️  WARNING: Prisma client and CLI versions don't match"
  echo "   Client: $CLIENT_VERSION"
  echo "   CLI: $CLI_VERSION"
  echo ""
  echo "   To fix, use matching versions:"
  echo "   npm install -D prisma@$CLIENT_VERSION"
  echo "   npm install @prisma/client@$CLIENT_VERSION"
else
  echo "✅ Prisma versions match"
fi

