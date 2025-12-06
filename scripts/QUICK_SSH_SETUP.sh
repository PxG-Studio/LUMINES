#!/bin/bash
# QUICK_SSH_SETUP.sh
# Quick SSH setup - Run this on your local machine

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"

echo "Setting up SSH access to SBX02..."

# Get password
read -sp "Enter password for $SBX02_USER@$SBX02_IP: " PASSWORD
echo

# Generate key
if [ ! -f ~/.ssh/id_rsa_sbx02 ]; then
  ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_sbx02 -N "" -C "sbx02-auto"
fi

# Install sshpass
if ! command -v sshpass > /dev/null; then
  sudo apt-get update && sudo apt-get install -y sshpass
fi

# Copy key
sshpass -p "$PASSWORD" ssh-copy-id -i ~/.ssh/id_rsa_sbx02.pub -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP

# Setup passwordless sudo
ssh -i ~/.ssh/id_rsa_sbx02 -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "sudo usermod -a -G sudo $USER && echo '$USER ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/$USER && sudo chmod 0440 /etc/sudoers.d/$USER"

# Create SSH config
mkdir -p ~/.ssh
cat >> ~/.ssh/config <<EOF

Host sbx02
    HostName $SBX02_IP
    User $SBX02_USER
    IdentityFile ~/.ssh/id_rsa_sbx02
    StrictHostKeyChecking no
EOF
chmod 600 ~/.ssh/config

# Test
ssh sbx02 "sudo -n echo '✅ SSH setup complete!'"

echo "✅ SSH access configured! I can now help you set up SBX02 remotely."
