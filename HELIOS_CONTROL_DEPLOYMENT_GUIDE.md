# Helios Control Deployment Guide
## Quick Reference for Deployment on Helios Control

**Date:** December 6, 2025
**Target:** Helios Control (192.168.86.114)

---

## Current Situation

You're logged into Helios Control as `helios@helios-production`. The deployment scripts are located on your local machine (`/home/cursor-dev/Documents/Lumines/scripts/`), not on Helios Control.

---

## Option 1: Transfer Scripts (Recommended)

### On Your Local Machine:

```bash
# Transfer scripts to Helios Control
bash scripts/transfer-scripts-to-helios.sh
```

### On Helios Control:

```bash
# Run deployment
bash ~/scripts/deploy-telemetry-stack.sh

# Run health checks
bash ~/scripts/health-check-telemetry.sh
```

---

## Option 2: Direct Deployment Commands

If the Luminera repository exists on Helios Control, you can run deployment commands directly.

### Check if Luminera repo exists:

```bash
ls -la /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/
```

### If it exists, run these commands on Helios Control:

```bash
# 1. Verify Kubernetes is ready
microk8s status --wait-ready

# 2. Deploy Apache Airflow (NERVA)
microk8s kubectl apply -f /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/airflow/airflow-optimized.yaml

# 3. Deploy Zookeeper (required for Storm)
microk8s kubectl apply -f /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/zookeeper-deployment.yaml

# Wait for Zookeeper to start
sleep 10

# 4. Deploy Apache Storm (FLUX)
microk8s kubectl apply -f /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/storm-deployment.yaml

# 5. Deploy Apache Flink (GRAVIA/FLUX)
microk8s kubectl apply -f /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/flink-deployment.yaml

# 6. Deploy DeepSpeed Engine
microk8s kubectl apply -f /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/deepspeed-engine-complete.yaml

# 7. Check deployment status
microk8s kubectl get pods --all-namespaces
```

---

## Option 3: Copy Script Content

If you prefer, you can copy the deployment script content and create it on Helios Control:

### On Helios Control:

```bash
# Create the script
cat > ~/deploy-telemetry.sh << 'SCRIPT_END'
#!/bin/bash
# Telemetry Stack Deployment

LUMINERA_K8S_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"

echo "Deploying Airflow..."
microk8s kubectl apply -f "$LUMINERA_K8S_PATH/airflow/airflow-optimized.yaml"
sleep 10

echo "Deploying Zookeeper..."
microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/zookeeper-deployment.yaml"
sleep 10

echo "Deploying Storm..."
microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/storm-deployment.yaml"
sleep 10

echo "Deploying Flink..."
microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/flink-deployment.yaml"
sleep 10

echo "Deploying DeepSpeed..."
microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/deepspeed-engine-complete.yaml"

echo "Checking status..."
microk8s kubectl get pods --all-namespaces
SCRIPT_END

chmod +x ~/deploy-telemetry.sh
bash ~/deploy-telemetry.sh
```

---

## Verification Commands

After deployment, use these commands to verify:

```bash
# Check all pods
microk8s kubectl get pods --all-namespaces

# Check services
microk8s kubectl get svc --all-namespaces

# Check specific namespace
microk8s kubectl get pods -n airflow
microk8s kubectl get pods -n lumenstack

# View pod logs
microk8s kubectl logs -n airflow <pod-name>
microk8s kubectl logs -n lumenstack <pod-name>

# Check pod status
microk8s kubectl describe pod -n airflow <pod-name>
```

---

## Troubleshooting

### If manifests are not found:

1. Check if Luminera repository exists:
   ```bash
   ls -la /home/cursor-dev/Documents/Luminera/
   ```

2. If not, you may need to:
   - Clone the repository, or
   - Transfer the manifests from your local machine

### If pods are not starting:

1. Check pod status:
   ```bash
   microk8s kubectl get pods --all-namespaces
   ```

2. Check pod events:
   ```bash
   microk8s kubectl describe pod -n <namespace> <pod-name>
   ```

3. Check pod logs:
   ```bash
   microk8s kubectl logs -n <namespace> <pod-name>
   ```

---

## Quick Reference

**Kubernetes Commands:**
- `microk8s kubectl get pods --all-namespaces` - List all pods
- `microk8s kubectl get svc --all-namespaces` - List all services
- `microk8s kubectl logs -n <namespace> <pod-name>` - View logs
- `microk8s kubectl describe pod -n <namespace> <pod-name>` - Pod details

**Service Endpoints:**
- Flink UI: http://192.168.86.114:30011
- Storm UI: http://192.168.86.114:30012
- DeepSpeed: http://192.168.86.114:30009
- Airflow UI: http://192.168.86.114:8080 (requires port-forward)

---

**Guide Created:** December 6, 2025
