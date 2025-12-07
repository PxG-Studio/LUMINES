#!/bin/bash
# setup-sbx02-remote.sh
# Remote setup script - runs commands on SBX02 via SSH with password

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Remote SBX02 Setup via SSH                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Test connection
echo "▶ Testing connection..."
run_remote "echo 'Connected to' \$(hostname)" || {
  echo "❌ Cannot connect to SBX02"
  exit 1
}
echo "✅ Connected to SBX02"
echo ""

# Check system info
echo "▶ System Information:"
run_remote "uname -a"
run_remote "cat /proc/cpuinfo | grep -i 'model name' | head -1"
run_remote "free -h | head -2"
echo ""

# Check iSCSI service
echo "▶ Checking iSCSI service..."
run_remote "/usr/syno/bin/synopkg status iscsi 2>/dev/null || echo 'iSCSI package check'"
echo ""

# Check for Docker
echo "▶ Checking for Docker..."
run_remote "which docker || echo 'Docker not found'"
run_remote "docker --version 2>/dev/null || echo 'Docker not installed'"
echo ""

# Check for snap/microk8s
echo "▶ Checking for snap/microk8s..."
run_remote "which snap || echo 'snap not available'"
run_remote "which microk8s || echo 'microk8s not installed'"
echo ""

echo "✅ System check complete!"
echo ""
echo "Next steps:"
echo "1. Create iSCSI LUN via DSM web interface"
echo "2. Install Docker or microk8s (depending on what's available)"
echo "3. Proceed with PostgreSQL 11 container setup"
echo ""
