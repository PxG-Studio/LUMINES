# Manual SSH Setup Instructions

## What We Need

To set up automated SSH access to SBX02 (192.168.86.28), I need:

1. **SSH Key Pair** - For key-based authentication
2. **sshpass** - For initial password-based setup
3. **Passwordless sudo** - On SBX02 for the user
4. **SSH Config** - For easy connection

## Step-by-Step Setup

### Step 1: Generate SSH Key (if needed)

```bash
# On your local machine (Ubuntu VM)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_sbx02 -N "" -C "sbx02-access"
```

### Step 2: Install sshpass

```bash
sudo apt-get update
sudo apt-get install -y sshpass
```

### Step 3: Copy SSH Key to SBX02

**You'll need the password for ncadmin@192.168.86.28**

```bash
# Method 1: Using ssh-copy-id with sshpass
sshpass -p "YOUR_PASSWORD" ssh-copy-id -i ~/.ssh/id_rsa_sbx02.pub ncadmin@192.168.86.28

# Method 2: Manual copy
cat ~/.ssh/id_rsa_sbx02.pub | sshpass -p "YOUR_PASSWORD" ssh ncadmin@192.168.86.28 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

### Step 4: Set Up Passwordless Sudo on SBX02

**SSH to SBX02 and run:**

```bash
ssh ncadmin@192.168.86.28
# Enter password

# Add user to sudo group (if not already)
sudo usermod -a -G sudo $USER

# Configure passwordless sudo
echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/$USER
sudo chmod 0440 /etc/sudoers.d/$USER

# Test
sudo -n echo "Passwordless sudo works!"
```

### Step 5: Create SSH Config

**On your local machine:**

```bash
cat >> ~/.ssh/config <<EOF

Host sbx02
    HostName 192.168.86.28
    User ncadmin
    IdentityFile ~/.ssh/id_rsa_sbx02
    StrictHostKeyChecking no
EOF

chmod 600 ~/.ssh/config
```

### Step 6: Test Connection

```bash
# Test SSH key auth
ssh -i ~/.ssh/id_rsa_sbx02 ncadmin@192.168.86.28 "echo 'SSH key works!'"

# Test with alias
ssh sbx02 "echo 'SSH config works!'"

# Test passwordless sudo
ssh sbx02 "sudo -n echo 'Passwordless sudo works!'"
```

## Automated Setup Script

**Run this script on your local machine:**

```bash
./scripts/setup-ssh-access.sh
```

It will:
1. Generate SSH key (if needed)
2. Install sshpass
3. Copy SSH key to SBX02 (will prompt for password)
4. Set up passwordless sudo on SBX02
5. Create SSH config
6. Test everything

## After Setup

Once SSH is configured, I can help you:
1. Transfer files to SBX02
2. Run setup scripts remotely
3. Configure microk8s + PostgreSQL 11
4. Set up replication

## Information Needed

**To complete the setup, I need:**

1. **Password for ncadmin@192.168.86.28** (for initial setup)
2. **Confirmation that user can use sudo** (or root access)
3. **Network access** to 192.168.86.28

**Or you can run the setup script yourself and it will handle everything!**
