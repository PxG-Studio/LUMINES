#!/bin/bash
# check-iscsi-sbx02.sh
# Checks iSCSI service status on SBX02

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Checking iSCSI Service on SBX02                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "▶ Checking iSCSI port (3260)..."
PORT_CHECK=$(run_remote "netstat -tln 2>/dev/null | grep 3260 || echo 'not listening'")
if echo "$PORT_CHECK" | grep -q "3260"; then
  echo "✅ iSCSI port 3260 is listening"
  echo "$PORT_CHECK"
else
  echo "❌ iSCSI port 3260 is NOT listening"
  echo "   iSCSI Manager may not be installed or service not running"
fi
echo ""

echo "▶ Checking for iSCSI Manager package..."
PKG_CHECK=$(run_remote "/usr/syno/bin/synopkg list 2>/dev/null | grep -i iscsi || echo 'not found'")
if echo "$PKG_CHECK" | grep -q -i "iscsi"; then
  echo "✅ iSCSI Manager package found:"
  echo "$PKG_CHECK"
else
  echo "❌ iSCSI Manager package not found"
  echo "   Need to install via DSM Package Center"
fi
echo ""

echo "▶ Checking iSCSI service status..."
SERVICE_CHECK=$(run_remote "/usr/syno/bin/synopkg status iSCSITarget 2>/dev/null || echo 'service check failed'")
echo "$SERVICE_CHECK"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Summary                                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "If iSCSI Manager is not installed:"
echo "  1. Open DSM: http://192.168.86.28:5000"
echo "  2. Go to Package Center"
echo "  3. Search for 'iSCSI Manager'"
echo "  4. Install the package"
echo "  5. Start the service"
echo ""
echo "If iSCSI Manager is installed but not running:"
echo "  1. Open iSCSI Manager in DSM"
echo "  2. Enable iSCSI service"
echo "  3. Create Target and LUN"
echo ""
