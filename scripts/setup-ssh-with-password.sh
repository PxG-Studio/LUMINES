#!/bin/bash
# setup-ssh-with-password.sh
# Set up SSH access - provide password as environment variable or it will prompt

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SSH_KEY="$HOME/.ssh/id_rsa_sbx02"

echo "Setting up SSH access to SBX02..."

# Get password
if [ -z "$SBX02_PASSWORD" ]; then
  read -sp "Enter password for $SBX02_USER@$SBX02_IP: " SBX02_PASSWORD
  echo
fi

# Copy SSH key
echo "Copying SSH key..."
sshpass -p "$SBX02_PASSWORD" ssh-copy-id -i "$SSH_KEY.pub" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP || {
  echo "Trying manual method..."
  cat "$SSH_KEY.pub" | sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
}

# Test key auth
echo "Testing SSH key authentication..."
if ssh -i "$SSH_KEY" -o PasswordAuthentication=no -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "echo 'Key auth works!'" 2>/dev/null; then
  echo "✅ SSH key authentication works!"
else
  echo "❌ SSH key authentication failed"
  exit 1
fi

# Set up passwordless sudo
echo "Setting up passwordless sudo..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP << 'REMOTE_SCRIPT'
sudo usermod -a -G sudo $USER 2>/dev/null || true
echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/$USER > /dev/null
sudo chmod 0440 /etc/sudoers.d/$USER
sudo -n echo "✅ Passwordless sudo configured!"
REMOTE_SCRIPT

# Create SSH config
mkdir -p ~/.ssh
if ! grep -q "Host sbx02" ~/.ssh/config 2>/dev/null; then
  cat >> ~/.ssh/config <<EOF

Host sbx02
    HostName $SBX02_IP
    User $SBX02_USER
    IdentityFile $SSH_KEY
    StrictHostKeyChecking no
EOF
  chmod 600 ~/.ssh/config
fi

# Final test
echo "Testing final setup..."
if ssh sbx02 "sudo -n echo '✅ Setup complete!'" 2>/dev/null; then
  echo ""
  echo "✅✅✅ SSH access fully configured! ✅✅✅"
  echo "You can now use: ssh sbx02"
else
  echo "⚠️  Setup may need manual verification"
fi
