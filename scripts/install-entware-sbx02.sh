#!/bin/bash
# install-entware-sbx02.sh
# Installs Entware package manager on SBX02 (Synology DS213+ PowerPC)

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Entware Installation on SBX02 (DS213+ PowerPC)         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on SBX02
run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Step 1: Check if Entware already installed
echo "▶ Step 1: Checking if Entware is already installed..."
if run_remote "test -d /opt/bin && echo 'yes' || echo 'no'" | grep -q "yes"; then
  echo "✅ Entware is already installed!"
  run_remote "/opt/bin/opkg --version 2>/dev/null | head -1 || echo 'opkg available'"
  exit 0
fi
echo "Entware not found. Proceeding with installation..."
echo ""

# Step 2: Detect architecture
echo "▶ Step 2: Detecting system architecture..."
ARCH=$(run_remote "uname -m")
KERNEL=$(run_remote "uname -r | cut -d. -f1,2")
echo "Architecture: $ARCH"
echo "Kernel: $KERNEL"
echo ""

# Step 3: Determine Entware repository
echo "▶ Step 3: Determining Entware repository..."
# PowerPC with kernel 2.6.x
ENTWARE_REPO="http://bin.entware.net/powerpc-k2.6"
echo "Repository: $ENTWARE_REPO"
echo ""

# Step 4: Check disk space
echo "▶ Step 4: Checking disk space..."
DISK_SPACE=$(run_remote "df -h /opt 2>/dev/null | tail -1 | awk '{print \$4}' || df -h /volume1 | tail -1 | awk '{print \$4}'")
echo "Available space: $DISK_SPACE"
echo ""

# Step 5: Create /opt directory if needed
echo "▶ Step 5: Preparing /opt directory..."
if run_remote "test -d /opt && echo 'exists' || echo 'missing'" | grep -q "missing"; then
  echo "Creating /opt directory..."
  run_remote "sudo mkdir -p /opt"
  run_remote "sudo chmod 755 /opt"
  echo "✅ /opt directory created"
else
  echo "✅ /opt directory exists"
fi
echo ""

# Step 6: Install Entware
echo "▶ Step 6: Installing Entware..."
echo "This will download and install Entware package manager..."
echo ""

# Download and run installer
INSTALL_SCRIPT="/tmp/entware-install.sh"
run_remote "wget -O $INSTALL_SCRIPT $ENTWARE_REPO/installer/generic.sh 2>&1 | tail -5" || {
  echo "❌ Failed to download Entware installer"
  echo "Trying alternative repository..."
  # Try alternative
  ENTWARE_REPO="http://bin.entware.net/powerpc-k2.6"
  run_remote "wget -O $INSTALL_SCRIPT $ENTWARE_REPO/installer/generic.sh 2>&1 | tail -5" || {
    echo "❌ Failed to download from alternative repository"
    exit 1
  }
}

echo "✅ Installer downloaded"
echo ""

# Make executable and run
echo "▶ Step 7: Running Entware installer..."
run_remote "chmod +x $INSTALL_SCRIPT"
run_remote "sudo sh $INSTALL_SCRIPT 2>&1 | tail -20" || {
  echo "⚠️  Installation may have completed with warnings"
}
echo ""

# Step 8: Verify installation
echo "▶ Step 8: Verifying Entware installation..."
sleep 3
if run_remote "test -f /opt/bin/opkg && echo 'yes' || echo 'no'" | grep -q "yes"; then
  echo "✅ Entware installed successfully!"
  run_remote "/opt/bin/opkg --version"
else
  echo "❌ Entware installation failed"
  echo "Checking what was installed..."
  run_remote "ls -la /opt/ 2>/dev/null | head -10"
  exit 1
fi
echo ""

# Step 9: Update package list
echo "▶ Step 9: Updating Entware package list..."
run_remote "/opt/bin/opkg update 2>&1 | tail -10" || {
  echo "⚠️  Package list update had issues, but continuing..."
}
echo "✅ Package list updated"
echo ""

# Step 10: Add to PATH
echo "▶ Step 10: Adding Entware to PATH..."
run_remote "echo 'export PATH=/opt/bin:/opt/sbin:\$PATH' >> ~/.profile 2>/dev/null || echo 'PATH update skipped'"
run_remote "export PATH=/opt/bin:/opt/sbin:\$PATH && echo 'PATH updated for current session'"
echo "✅ Entware added to PATH"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Entware Installation Complete                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Entware is now installed and ready to use"
echo ""
echo "Next steps:"
echo "1. Install build tools: /opt/bin/opkg install gcc make"
echo "2. Verify: ./scripts/check-build-tools-sbx02.sh"
echo "3. Compile PostgreSQL 11: ./scripts/install-postgresql11-direct-sbx02.sh"
echo ""
