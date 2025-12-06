# Helios Control Deployment Instructions
## Deploy Telemetry Stack from Helios Control

**Date:** December 6, 2025
**Local Machine:** 192.168.86.113 (cursor-dev)
**Helios Control:** 192.168.86.114 (helios)

---

## Quick Start

Since you're logged into Helios Control and the Luminera repo is on the local machine (192.168.86.113), you have two options:

---

## Option 1: Pull Files and Deploy (Recommended)

### On Helios Control, run:

```bash
# Create and run deployment script
cat > ~/deploy-telemetry.sh << 'SCRIPT_END'
#!/bin/bash
LOCAL_MACHINE="192.168.86.113"
LOCAL_USER="cursor-dev"
LOCAL_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"
TEMP_DIR="/tmp/telemetry-deploy-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "Pulling YAML files from $LOCAL_MACHINE..."
scp -r "$LOCAL_USER@$LOCAL_MACHINE:$LOCAL_PATH/airflow" .
scp -r "$LOCAL_USER@$LOCAL_MACHINE:$LOCAL_PATH/lumenstack" .

echo "Verifying Kubernetes..."
microk8s status --wait-ready

echo "Creating namespaces..."
microk8s kubectl create namespace airflow 2>/dev/null || true
microk8s kubectl create namespace lumenstack 2>/dev/null || true

echo "Deploying Airflow..."
microk8s kubectl apply -f airflow/airflow-optimized.yaml
sleep 10

echo "Deploying Zookeeper..."
microk8s kubectl apply -f lumenstack/zookeeper-deployment.yaml
sleep 10

echo "Deploying Storm..."
microk8s kubectl apply -f lumenstack/storm-deployment.yaml
sleep 10

echo "Deploying Flink..."
microk8s kubectl apply -f lumenstack/flink-deployment.yaml
sleep 10

echo "Deploying DeepSpeed..."
microk8s kubectl apply -f lumenstack/deepspeed-engine-complete.yaml

echo "Checking status..."
microk8s kubectl get pods --all-namespaces
SCRIPT_END

chmod +x ~/deploy-telemetry.sh
bash ~/deploy-telemetry.sh
```

---

## Option 2: Manual Deployment Commands

### Step 1: Pull YAML files from local machine

```bash
# On Helios Control
mkdir -p ~/telemetry-deploy
cd ~/telemetry-deploy

# Pull Airflow manifests
scp -r cursor-dev@192.168.86.113:/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/airflow .

# Pull lumenstack manifests
scp -r cursor-dev@192.168.86.113:/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack .
```

### Step 2: Deploy services

```bash
# Verify Kubernetes
microk8s status --wait-ready

# Create namespaces
microk8s kubectl create namespace airflow
microk8s kubectl create namespace lumenstack

# Deploy Airflow
microk8s kubectl apply -f ~/telemetry-deploy/airflow/airflow-optimized.yaml

# Deploy Zookeeper (for Storm)
microk8s kubectl apply -f ~/telemetry-deploy/lumenstack/zookeeper-deployment.yaml
sleep 10

# Deploy Storm
microk8s kubectl apply -f ~/telemetry-deploy/lumenstack/storm-deployment.yaml

# Deploy Flink
microk8s kubectl apply -f ~/telemetry-deploy/lumenstack/flink-deployment.yaml

# Deploy DeepSpeed
microk8s kubectl apply -f ~/telemetry-deploy/lumenstack/deepspeed-engine-complete.yaml
```

### Step 3: Verify deployment

```bash
# Check all pods
microk8s kubectl get pods --all-namespaces

# Check specific services
microk8s kubectl get pods -n airflow
microk8s kubectl get pods -n lumenstack

# Check services
microk8s kubectl get svc --all-namespaces | grep -E '30011|30012|30009'
```

---

## Option 3: Transfer Script from Local Machine

### On Local Machine (192.168.86.113):

```bash
# Transfer the deployment script
scp /home/cursor-dev/Documents/Lumines/scripts/deploy-from-helios-control.sh helios@192.168.86.114:~/deploy-telemetry.sh

# Or use the transfer script
bash scripts/transfer-scripts-to-helios.sh
```

### On Helios Control:

```bash
chmod +x ~/deploy-telemetry.sh
bash ~/deploy-telemetry.sh
```

---

## Troubleshooting

### If SCP fails (SSH key not configured):

1. **Set up SSH key on Helios Control:**
   ```bash
   # On Helios Control
   ssh-keygen -t ed25519
   ssh-copy-id cursor-dev@192.168.86.113
   ```

2. **Or use password authentication:**
   ```bash
   # SCP will prompt for password
   scp -r cursor-dev@192.168.86.113:/path/to/files .
   ```

### If files are not accessible:

1. **Check if local machine is accessible:**
   ```bash
   ping 192.168.86.113
   ```

2. **Check if SSH is enabled on local machine:**
   ```bash
   ssh cursor-dev@192.168.86.113 'hostname'
   ```

3. **Alternative: Use shared storage or NFS mount if available**

---

## Verification Commands

After deployment, verify with:

```bash
# Check pod status
microk8s kubectl get pods --all-namespaces

# Check services
microk8s kubectl get svc --all-namespaces

# View pod logs
microk8s kubectl logs -n airflow <pod-name>
microk8s kubectl logs -n lumenstack <pod-name>

# Check pod events
microk8s kubectl describe pod -n airflow <pod-name>
```

---

## Service Endpoints

Once pods are running:

- **Flink UI:** http://192.168.86.114:30011
- **Storm UI:** http://192.168.86.114:30012
- **DeepSpeed:** http://192.168.86.114:30009
- **Airflow UI:** http://192.168.86.114:8080 (requires port-forward)

---

**Guide Created:** December 6, 2025
