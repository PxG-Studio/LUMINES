#!/bin/bash
# finalize-iscsi-config.sh
# Finalizes iSCSI configuration by writing files correctly

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Finalizing iSCSI Configuration                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ Checking default config format..."
DEFAULT_FORMAT=$(run_remote "cat /usr/syno/etc.defaults/iscsi_target.conf 2>/dev/null | head -10")
echo "$DEFAULT_FORMAT"
echo ""

echo "▶ Writing configuration files using correct format..."
echo ""

# Write target config
run_remote "cat > /tmp/iscsi_target.conf << 'EOF'
[postgresql-storage]
iqn=\"iqn.2000-01.com.synology:sbx02.postgresql-storage\"
EOF
sudo cp /tmp/iscsi_target.conf /usr/syno/etc/iscsi_target.conf
sudo chmod 644 /usr/syno/etc/iscsi_target.conf
cat /usr/syno/etc/iscsi_target.conf"

echo ""
echo "✅ Target config written"
echo ""

# Write LUN config
run_remote "cat > /tmp/iscsi_lun.conf << 'EOF'
[postgresql-data]
lun_id=\"1\"
path=\"/volume1/postgresql-data.img\"
EOF
sudo cp /tmp/iscsi_lun.conf /usr/syno/etc/iscsi_lun.conf
sudo chmod 644 /usr/syno/etc/iscsi_lun.conf
cat /usr/syno/etc/iscsi_lun.conf"

echo ""
echo "✅ LUN config written"
echo ""

# Write mapping
run_remote "echo 'postgresql-storage:postgresql-data' | sudo tee -a /usr/syno/etc/iscsi_mapping.conf > /dev/null
sudo chmod 644 /usr/syno/etc/iscsi_mapping.conf
cat /usr/syno/etc/iscsi_mapping.conf"

echo ""
echo "✅ Mapping config written"
echo ""

# Write ACL
run_remote "echo 'postgresql-storage:ALL' | sudo tee -a /usr/syno/etc/iscsi_acl.conf > /dev/null
sudo chmod 644 /usr/syno/etc/iscsi_acl.conf
cat /usr/syno/etc/iscsi_acl.conf"

echo ""
echo "✅ ACL config written"
echo ""

echo "▶ Restarting iSCSI service..."
run_remote "sudo /usr/syno/bin/synoiscsiep --stopall iscsi 2>/dev/null; sleep 2; sudo /usr/syno/bin/synoiscsiep --startall iscsi 2>&1"
sleep 5

echo ""
echo "▶ Verifying port 3260..."
PORT_CHECK=$(run_remote "netstat -tln | grep 3260 || echo 'not listening'")
echo "$PORT_CHECK"
echo ""

echo "✅ Configuration finalized!"
echo ""
