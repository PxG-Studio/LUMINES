#!/bin/bash
# check-build-tools-sbx02.sh
# Checks what build tools are available on SBX02

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Build Tools Check for SBX02                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Checking build tools..."
echo ""

# Check individual tools
echo "1. Compiler:"
GCC=$(run_remote "which gcc 2>/dev/null || echo 'not found'")
if [ "$GCC" != "not found" ]; then
  echo "   ✅ gcc: $GCC"
  run_remote "gcc --version 2>/dev/null | head -1"
else
  echo "   ❌ gcc: not found"
fi
echo ""

echo "2. Build system:"
MAKE=$(run_remote "which make 2>/dev/null || echo 'not found'")
if [ "$MAKE" != "not found" ]; then
  echo "   ✅ make: $MAKE"
  run_remote "make --version 2>/dev/null | head -1"
else
  echo "   ❌ make: not found"
fi
echo ""

echo "3. Download tools:"
WGET=$(run_remote "which wget 2>/dev/null || echo 'not found'")
CURL=$(run_remote "which curl 2>/dev/null || echo 'not found'")
if [ "$WGET" != "not found" ]; then
  echo "   ✅ wget: $WGET"
elif [ "$CURL" != "not found" ]; then
  echo "   ✅ curl: $CURL"
else
  echo "   ❌ wget/curl: not found"
fi
echo ""

echo "4. Archive tools:"
TAR=$(run_remote "which tar 2>/dev/null || echo 'not found'")
if [ "$TAR" != "not found" ]; then
  echo "   ✅ tar: $TAR"
else
  echo "   ❌ tar: not found"
fi
echo ""

echo "5. System resources:"
echo "   Disk space:"
run_remote "df -h /tmp /volume1 | tail -2"
echo "   Memory:"
run_remote "free -h | head -2"
echo ""

echo "6. Package managers:"
ENTWARE=$(run_remote "test -d /opt/bin && echo 'yes' || echo 'no'")
if [ "$ENTWARE" = "yes" ]; then
  echo "   ✅ Entware: /opt/bin"
else
  echo "   ❌ Entware: not installed"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Summary                                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$GCC" != "not found" ] && [ "$MAKE" != "not found" ]; then
  echo "✅ Build tools available! Can compile PostgreSQL 11 from source."
  echo ""
  echo "Next step:"
  echo "  ./scripts/install-postgresql11-direct-sbx02.sh"
else
  echo "❌ Build tools missing. Need to install:"
  echo ""
  if [ "$GCC" = "not found" ]; then
    echo "   - gcc (C compiler)"
  fi
  if [ "$MAKE" = "not found" ]; then
    echo "   - make (build system)"
  fi
  echo ""
  echo "Options to install:"
  echo "1. Check Synology Package Center for 'Development Tools'"
  echo "2. Install Entware and use: opkg install gcc make"
  echo "3. Manual installation"
  echo ""
fi
