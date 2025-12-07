#!/bin/bash
# Deployment script to run FROM Helios Control
# Pulls YAML files from local machine (192.168.86.113) and deploys

set -e

LOCAL_MACHINE="192.168.86.113"
LOCAL_USER="cursor-dev"
LOCAL_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"
TEMP_DIR="/tmp/telemetry-deploy-$(date +%Y%m%d-%H%M%S)"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Telemetry Stack Deployment from Helios Control        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Create temp directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "▶ Step 1: Pulling YAML files from local machine ($LOCAL_MACHINE)..."

# Pull Airflow YAML
echo "  Pulling Airflow manifests..."
scp -r "$LOCAL_USER@$LOCAL_MACHINE:$LOCAL_PATH/airflow" . 2>/dev/null || {
    echo "  ⚠️  Could not pull Airflow manifests. Trying alternative method..."
    # Alternative: Try to access via shared path if available
    if [ -d "/mnt/shared/Luminera/infrastructure/k8s/production/airflow" ]; then
        cp -r /mnt/shared/Luminera/infrastructure/k8s/production/airflow .
    else
        echo "  ❌ Airflow manifests not accessible"
        exit 1
    fi
}

# Pull lumenstack YAMLs
echo "  Pulling lumenstack manifests..."
scp -r "$LOCAL_USER@$LOCAL_MACHINE:$LOCAL_PATH/lumenstack" . 2>/dev/null || {
    echo "  ⚠️  Could not pull lumenstack manifests. Trying alternative method..."
    if [ -d "/mnt/shared/Luminera/infrastructure/k8s/production/lumenstack" ]; then
        cp -r /mnt/shared/Luminera/infrastructure/k8s/production/lumenstack .
    else
        echo "  ❌ lumenstack manifests not accessible"
        exit 1
    fi
}

echo "✅ YAML files pulled successfully"
echo ""

# Verify Kubernetes
echo "▶ Step 2: Verifying Kubernetes cluster..."
microk8s status --wait-ready || {
    echo "❌ Kubernetes cluster not ready"
    exit 1
}
echo "✅ Kubernetes cluster ready"
echo ""

# Create namespaces
echo "▶ Step 3: Creating namespaces..."
for ns in airflow lumenstack monitoring; do
    if microk8s kubectl get namespace "$ns" >/dev/null 2>&1; then
        echo "  ✓ Namespace '$ns' already exists"
    else
        microk8s kubectl create namespace "$ns"
        echo "  ✓ Namespace '$ns' created"
    fi
done
echo ""

# Deploy Airflow
echo "▶ Step 4: Deploying Apache Airflow (NERVA)..."
if [ -f "airflow/airflow-optimized.yaml" ]; then
    microk8s kubectl apply -f airflow/airflow-optimized.yaml
    echo "✅ Airflow deployment initiated"
    sleep 10
    microk8s kubectl get pods -n airflow || true
else
    echo "⚠️  Airflow YAML not found"
fi
echo ""

# Deploy Zookeeper (for Storm)
echo "▶ Step 5: Deploying Zookeeper (required for Storm)..."
if [ -f "lumenstack/zookeeper-deployment.yaml" ]; then
    microk8s kubectl apply -f lumenstack/zookeeper-deployment.yaml
    echo "✅ Zookeeper deployment initiated"
    sleep 10
    microk8s kubectl get pods -n lumenstack -l app=zookeeper || true
else
    echo "⚠️  Zookeeper YAML not found"
fi
echo ""

# Deploy Storm
echo "▶ Step 6: Deploying Apache Storm (FLUX)..."
if [ -f "lumenstack/storm-deployment.yaml" ]; then
    microk8s kubectl apply -f lumenstack/storm-deployment.yaml
    echo "✅ Storm deployment initiated"
    sleep 10
    microk8s kubectl get pods -n lumenstack -l app=storm || true
else
    echo "⚠️  Storm YAML not found"
fi
echo ""

# Deploy Flink
echo "▶ Step 7: Deploying Apache Flink (GRAVIA/FLUX)..."
if [ -f "lumenstack/flink-deployment.yaml" ]; then
    microk8s kubectl apply -f lumenstack/flink-deployment.yaml
    echo "✅ Flink deployment initiated"
    sleep 10
    microk8s kubectl get pods -n lumenstack -l app=flink || true
else
    echo "⚠️  Flink YAML not found"
fi
echo ""

# Deploy DeepSpeed
echo "▶ Step 8: Deploying DeepSpeed Engine..."
if [ -f "lumenstack/deepspeed-engine-complete.yaml" ]; then
    microk8s kubectl apply -f lumenstack/deepspeed-engine-complete.yaml
    echo "✅ DeepSpeed deployment initiated"
    sleep 10
    microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine || true
else
    echo "⚠️  DeepSpeed YAML not found"
fi
echo ""

# Final status
echo "▶ Step 9: Final deployment status..."
echo ""
echo "All pods:"
microk8s kubectl get pods --all-namespaces | grep -E 'airflow|storm|flink|deepspeed|zookeeper|NAME' | head -20

echo ""
echo "Services:"
microk8s kubectl get svc --all-namespaces | grep -E '30011|30012|30009|8080|NodePort|NAME' | head -15

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 2-5 minutes for pods to fully start"
echo "   2. Check status: microk8s kubectl get pods --all-namespaces"
echo "   3. Test endpoints:"
echo "      - Flink UI: http://192.168.86.114:30011"
echo "      - Storm UI: http://192.168.86.114:30012"
echo "      - DeepSpeed: http://192.168.86.114:30009"
echo ""
echo "📁 Temporary files: $TEMP_DIR"
echo "   (You can delete this directory after verification)"
