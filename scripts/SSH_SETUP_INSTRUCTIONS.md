# SSH Setup Instructions for SBX02

## Option 1: Transfer Files and Run Script

**From your local machine (Ubuntu VM):**

```bash
# Transfer all files to SBX02
./scripts/transfer-to-sbx02.sh

# Or manually:
scp -r k8s/ scripts/setup-sbx02-complete.sh ncadmin@192.168.86.28:~/postgresql-setup/
```

**Then SSH to SBX02 and run:**

```bash
ssh ncadmin@192.168.86.28
cd ~/postgresql-setup
chmod +x setup-sbx02-complete.sh
sudo ./setup-sbx02-complete.sh
```

## Option 2: Run Commands Directly on SBX02

**SSH to SBX02 and run these commands step by step:**

### Step 1: Create iSCSI LUN (via DSM Web Interface)
- Open: http://192.168.86.28:5000
- Storage Manager → iSCSI LUN → Create
- Note the Target IQN

### Step 2: Install microk8s

```bash
# On SBX02
sudo snap install microk8s --classic
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube
newgrp microk8s

# Enable addons
microk8s enable dns storage rbac
```

### Step 3: Install iSCSI Initiator

```bash
# On SBX02
sudo apt-get update
sudo apt-get install -y open-iscsi
```

### Step 4: Connect to iSCSI

```bash
# Discover targets
sudo iscsiadm -m discovery -t st -p 192.168.86.28

# Login (replace IQN with actual)
sudo iscsiadm -m node -T <TARGET_IQN> -p 192.168.86.28 -l
```

### Step 5: Create Kubernetes Manifests

```bash
# Create directory
mkdir -p ~/k8s

# Create manifests (copy from local machine or create manually)
# See k8s/*.yaml files
```

### Step 6: Deploy PostgreSQL

```bash
microk8s kubectl apply -f ~/k8s/
```

## Option 3: Copy-Paste Setup Script

**SSH to SBX02 and create the script:**

```bash
ssh ncadmin@192.168.86.28
cat > ~/setup-sbx02.sh << 'SCRIPT_END'
# Paste the contents of scripts/setup-sbx02-complete.sh here
SCRIPT_END

chmod +x ~/setup-sbx02.sh
sudo ./setup-sbx02.sh
```

## Quick Command Reference

**Transfer files:**
```bash
scp -r k8s/ scripts/*.sh ncadmin@192.168.86.28:~/
```

**SSH and run:**
```bash
ssh ncadmin@192.168.86.28
sudo ./setup-sbx02-complete.sh
```

**Check status:**
```bash
microk8s kubectl get pods
microk8s kubectl get pv
microk8s kubectl get pvc
```
