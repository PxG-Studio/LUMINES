#!/bin/bash
# setup-ssh-access.sh
# Set up SSH key authentication and passwordless sudo for SBX02

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD=""  # Will be prompted or provided

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Setting Up SSH Access to SBX02                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Generate SSH key if it doesn't exist
echo "▶ Step 1: Generating SSH key..."
SSH_KEY_PATH="$HOME/.ssh/id_rsa_sbx02"
if [ ! -f "$SSH_KEY_PATH" ]; then
  ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N "" -C "sbx02-access"
  echo "   ✅ SSH key generated: $SSH_KEY_PATH"
else
  echo "   ✅ SSH key already exists: $SSH_KEY_PATH"
fi

# Step 2: Get password if not provided
if [ -z "$SBX02_PASSWORD" ]; then
  read -sp "Enter password for $SBX02_USER@$SBX02_IP: " SBX02_PASSWORD
  echo
fi

# Step 3: Install sshpass if needed
echo ""
echo "▶ Step 2: Checking sshpass..."
if ! command -v sshpass > /dev/null 2>&1; then
  echo "   Installing sshpass..."
  sudo apt-get update
  sudo apt-get install -y sshpass
  echo "   ✅ sshpass installed"
else
  echo "   ✅ sshpass is installed"
fi

# Step 4: Copy SSH key to SBX02
echo ""
echo "▶ Step 3: Copying SSH key to SBX02..."
sshpass -p "$SBX02_PASSWORD" ssh-copy-id -i "$SSH_KEY_PATH.pub" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP || {
  echo "   ⚠️  ssh-copy-id failed, trying manual method..."

  # Manual method
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "mkdir -p ~/.ssh && chmod 700 ~/.ssh" || true

  cat "$SSH_KEY_PATH.pub" | sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

  echo "   ✅ SSH key copied manually"
}

# Step 5: Test SSH key authentication
echo ""
echo "▶ Step 4: Testing SSH key authentication..."
if ssh -i "$SSH_KEY_PATH" -o PasswordAuthentication=no -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "echo 'SSH key auth works!'" 2>/dev/null; then
  echo "   ✅ SSH key authentication works!"
else
  echo "   ❌ SSH key authentication failed"
  exit 1
fi

# Step 6: Set up passwordless sudo on SBX02
echo ""
echo "▶ Step 5: Setting up passwordless sudo on SBX02..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP << 'REMOTE_SCRIPT'
# Check if user is in sudo group
if groups | grep -q sudo; then
  echo "   ✅ User is in sudo group"
else
  echo "   Adding user to sudo group..."
  sudo usermod -a -G sudo $USER || {
    echo "   ⚠️  Could not add to sudo group. May need root access."
  }
fi

# Configure passwordless sudo
echo "   Configuring passwordless sudo..."
if sudo test -f /etc/sudoers.d/$USER; then
  echo "   ✅ Sudoers file already exists"
else
  echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/$USER > /dev/null
  sudo chmod 0440 /etc/sudoers.d/$USER
  echo "   ✅ Passwordless sudo configured"
fi
REMOTE_SCRIPT

# Step 7: Test passwordless sudo
echo ""
echo "▶ Step 6: Testing passwordless sudo..."
if ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "sudo -n echo 'Passwordless sudo works!'" 2>/dev/null; then
  echo "   ✅ Passwordless sudo works!"
else
  echo "   ⚠️  Passwordless sudo may not be working. Check manually."
fi

# Step 8: Create SSH config entry
echo ""
echo "▶ Step 7: Creating SSH config entry..."
mkdir -p ~/.ssh
if ! grep -q "Host sbx02" ~/.ssh/config 2>/dev/null; then
  cat >> ~/.ssh/config <<EOF

Host sbx02
    HostName $SBX02_IP
    User $SBX02_USER
    IdentityFile $SSH_KEY_PATH
    StrictHostKeyChecking no
    UserKnownHostsFile ~/.ssh/known_hosts
EOF
  chmod 600 ~/.ssh/config
  echo "   ✅ SSH config created"
  echo "   You can now use: ssh sbx02"
else
  echo "   ✅ SSH config already exists"
fi

# Step 9: Test final connection
echo ""
echo "▶ Step 8: Testing final connection..."
if ssh sbx02 "echo 'Connection successful!'" 2>/dev/null; then
  echo "   ✅ SSH connection works!"
  echo "   ✅ Passwordless sudo works!"
  echo "   ✅ Ready to proceed with setup!"
else
  echo "   ⚠️  Connection test failed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    SSH Setup Complete!                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ You can now SSH to SBX02 with:"
echo "   ssh sbx02"
echo ""
echo "✅ Passwordless sudo is configured"
echo ""
echo "Next: Run the SBX02 setup script"
echo ""
