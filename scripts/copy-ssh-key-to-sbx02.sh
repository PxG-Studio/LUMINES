#!/bin/bash
# copy-ssh-key-to-sbx02.sh
# Copy SSH key to SBX02 - will prompt for password

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SSH_KEY="$HOME/.ssh/id_rsa_sbx02.pub"

echo "Copying SSH key to SBX02..."

# Try with sshpass if password is provided
if [ -n "$SBX02_PASSWORD" ]; then
  sshpass -p "$SBX02_PASSWORD" ssh-copy-id -i "$SSH_KEY" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP
else
  # Manual copy
  echo "Please enter password for $SBX02_USER@$SBX02_IP:"
  ssh-copy-id -i "$SSH_KEY" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP
fi

# Set up passwordless sudo
echo "Setting up passwordless sudo..."
ssh -i ~/.ssh/id_rsa_sbx02 -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP << 'REMOTE_SCRIPT'
sudo usermod -a -G sudo $USER 2>/dev/null || true
echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/$USER > /dev/null
sudo chmod 0440 /etc/sudoers.d/$USER
sudo -n echo "Passwordless sudo configured!"
REMOTE_SCRIPT

# Create SSH config
mkdir -p ~/.ssh
if ! grep -q "Host sbx02" ~/.ssh/config 2>/dev/null; then
  cat >> ~/.ssh/config <<EOF

Host sbx02
    HostName $SBX02_IP
    User $SBX02_USER
    IdentityFile ~/.ssh/id_rsa_sbx02
    StrictHostKeyChecking no
EOF
  chmod 600 ~/.ssh/config
fi

echo "✅ SSH key copied and configured!"
echo "Test with: ssh sbx02"
