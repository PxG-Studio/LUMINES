# Setting Up SSH Access for Automated Setup

## What I Need From You

To set up automated SSH access to SBX02 (192.168.86.28), please provide:

1. **Password for `ncadmin@192.168.86.28`** - For initial SSH key setup
2. **Confirmation** - That `ncadmin` user can use `sudo` (or has root access)

## Quick Setup (Run This on Your Local Machine)

```bash
# Step 1: Generate SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_sbx02 -N "" -C "sbx02-auto"

# Step 2: Install sshpass
sudo apt-get update && sudo apt-get install -y sshpass

# Step 3: Copy SSH key to SBX02 (will prompt for password)
sshpass -p "YOUR_PASSWORD_HERE" ssh-copy-id -i ~/.ssh/id_rsa_sbx02.pub ncadmin@192.168.86.28

# Step 4: Set up passwordless sudo on SBX02
ssh -i ~/.ssh/id_rsa_sbx02 ncadmin@192.168.86.28 << 'EOF'
# Add to sudo group
sudo usermod -a -G sudo $USER

# Configure passwordless sudo
echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/$USER
sudo chmod 0440 /etc/sudoers.d/$USER

# Test
sudo -n echo "Passwordless sudo works!"
EOF

# Step 5: Create SSH config
cat >> ~/.ssh/config <<EOF

Host sbx02
    HostName 192.168.86.28
    User ncadmin
    IdentityFile ~/.ssh/id_rsa_sbx02
    StrictHostKeyChecking no
EOF

chmod 600 ~/.ssh/config

# Step 6: Test
ssh sbx02 "sudo -n echo 'Setup complete!'"
```

## Or Use the Automated Script

**Run this script (it will prompt for password):**

```bash
# Make script executable
chmod +x scripts/setup-ssh-access.sh

# Run it
./scripts/setup-ssh-access.sh
```

## After SSH is Set Up

Once SSH key authentication and passwordless sudo are configured, I can:

1. ✅ SSH to SBX02 automatically
2. ✅ Run setup commands remotely
3. ✅ Transfer files
4. ✅ Configure microk8s + PostgreSQL 11
5. ✅ Set up replication

## Information to Provide

**Please provide:**
- Password for `ncadmin@192.168.86.28` (or run the setup script yourself)
- Confirmation that `ncadmin` can use `sudo`

**Or just run the setup script and it will handle everything!**

## Test After Setup

```bash
# Should work without password
ssh sbx02 "echo 'SSH key works!'"

# Should work without sudo password
ssh sbx02 "sudo -n echo 'Passwordless sudo works!'"
```

Once this is set up, I can proceed with the complete microk8s + PostgreSQL setup remotely!
