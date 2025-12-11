#!/bin/bash
# enable-iscsi-service-sbx02.sh
# Attempts to enable iSCSI service on SBX02

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Enabling iSCSI Service on SBX02                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "▶ Checking iSCSI packages..."
PKG_LIST=$(run_remote "/usr/syno/bin/synopkg list 2>/dev/null | grep -iE 'iscsi|target' || echo 'none'")
echo "$PKG_LIST"
echo ""

echo "▶ Attempting to start iSCSI service..."
# Try different package names
run_remote "sudo /usr/syno/bin/synopkg start iSCSITarget 2>&1 || \
sudo /usr/syno/bin/synopkg start iSCSITarget-* 2>&1 || \
sudo /usr/syno/bin/synopkg start SynologyiSCSITarget 2>&1 || \
echo 'Service start attempted - check DSM interface'"

sleep 3

echo ""
echo "▶ Checking if port 3260 is now listening..."
PORT_CHECK=$(run_remote "netstat -tln 2>/dev/null | grep 3260 || echo 'not listening'")
if echo "$PORT_CHECK" | grep -q "3260"; then
  echo "✅ iSCSI service is running!"
  echo "$PORT_CHECK"
else
  echo "⚠️  iSCSI service may need to be enabled via DSM web interface"
  echo ""
  echo "Please:"
  echo "  1. Open DSM: http://192.168.86.28:5000"
  echo "  2. Go to iSCSI Manager"
  echo "  3. Enable iSCSI service"
  echo "  4. Create Target and LUN"
fi
echo ""
