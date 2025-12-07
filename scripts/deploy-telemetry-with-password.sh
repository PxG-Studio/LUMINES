#!/bin/bash
# Deploy Telemetry Stack using password authentication
# Uses password from SSH_PLAYBOOK.md

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"
LOCAL_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"

# Check if sshpass is installed
if ! command -v sshpass >/dev/null 2>&1; then
    echo "Installing sshpass..."
    sudo apt-get update && sudo apt-get install -y sshpass
fi

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Telemetry Stack Deployment (Password Auth)           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

# Function to copy file to Helios Control
copy_to_helios() {
    sshpass -p "$HELIOS_PASSWORD" scp -o StrictHostKeyChecking=no "$1" "$HELIOS_USER@$HELIOS_CONTROL:$2"
}

# Function to copy directory to Helios Control
copy_dir_to_helios() {
    sshpass -p "$HELIOS_PASSWORD" scp -r -o StrictHostKeyChecking=no "$1" "$HELIOS_USER@$HELIOS_CONTROL:$2"
}

echo "▶ Step 1: Verifying Kubernetes cluster..."
if run_on_helios "microk8s status --wait-ready" >/dev/null 2>&1; then
    echo "✅ Kubernetes cluster ready"
else
    echo "❌ Kubernetes cluster not ready"
    exit 1
fi

echo ""
echo "▶ Step 2: Creating namespaces..."
for ns in airflow lumenstack monitoring; do
    if run_on_helios "microk8s kubectl get namespace $ns" >/dev/null 2>&1; then
        echo "  ✓ Namespace '$ns' already exists"
    else
        run_on_helios "microk8s kubectl create namespace $ns"
        echo "  ✓ Namespace '$ns' created"
    fi
done

echo ""
echo "▶ Step 3: Copying YAML files to Helios Control..."
TEMP_DIR="/tmp/telemetry-deploy-$(date +%Y%m%d-%H%M%S)"
run_on_helios "mkdir -p $TEMP_DIR"

# Copy Airflow manifests
echo "  Copying Airflow manifests..."
copy_dir_to_helios "$LOCAL_PATH/airflow" "$TEMP_DIR/"

# Copy lumenstack manifests
echo "  Copying lumenstack manifests..."
copy_dir_to_helios "$LOCAL_PATH/lumenstack" "$TEMP_DIR/"

echo "✅ Files copied"
echo ""

echo "▶ Step 4: Deploying Apache Airflow (NERVA)..."
if run_on_helios "cd $TEMP_DIR && microk8s kubectl apply -f airflow/airflow-optimized.yaml" 2>&1; then
    echo "✅ Airflow deployment initiated"
    sleep 10
    run_on_helios "microk8s kubectl get pods -n airflow" || true
else
    echo "❌ Airflow deployment failed"
fi
echo ""

echo "▶ Step 5: Deploying Zookeeper (required for Storm)..."
if run_on_helios "cd $TEMP_DIR && microk8s kubectl apply -f lumenstack/zookeeper-deployment.yaml" 2>&1; then
    echo "✅ Zookeeper deployment initiated"
    sleep 10
    run_on_helios "microk8s kubectl get pods -n lumenstack -l app=zookeeper" || true
else
    echo "❌ Zookeeper deployment failed"
fi
echo ""

echo "▶ Step 6: Deploying Apache Storm (FLUX)..."
if run_on_helios "cd $TEMP_DIR && microk8s kubectl apply -f lumenstack/storm-deployment.yaml" 2>&1; then
    echo "✅ Storm deployment initiated"
    sleep 10
    run_on_helios "microk8s kubectl get pods -n lumenstack -l app=storm" || true
else
    echo "❌ Storm deployment failed"
fi
echo ""

echo "▶ Step 7: Deploying Apache Flink (GRAVIA/FLUX)..."
if run_on_helios "cd $TEMP_DIR && microk8s kubectl apply -f lumenstack/flink-deployment.yaml" 2>&1; then
    echo "✅ Flink deployment initiated"
    sleep 10
    run_on_helios "microk8s kubectl get pods -n lumenstack -l app=flink" || true
else
    echo "❌ Flink deployment failed"
fi
echo ""

echo "▶ Step 8: Deploying DeepSpeed Engine..."
if run_on_helios "cd $TEMP_DIR && microk8s kubectl apply -f lumenstack/deepspeed-engine-complete.yaml" 2>&1; then
    echo "✅ DeepSpeed deployment initiated"
    sleep 10
    run_on_helios "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine" || true
else
    echo "❌ DeepSpeed deployment failed"
fi
echo ""

echo "▶ Step 9: Deploying DeepSeek API..."
if run_on_helios "cd $TEMP_DIR && microk8s kubectl apply -f lumenstack/deepseek-api-complete.yaml" 2>&1; then
    echo "✅ DeepSeek API deployment initiated"
    sleep 10
    run_on_helios "microk8s kubectl get pods -n lumenstack -l app=deepseek-api" || true
    run_on_helios "microk8s kubectl get svc -n lumenstack -l app=deepseek-api" || true
else
    echo "⚠️  DeepSeek API deployment failed or manifest not found"
fi
echo ""

echo "▶ Step 10: Final deployment status..."
echo ""
echo "All pods:"
run_on_helios "microk8s kubectl get pods --all-namespaces | grep -E 'airflow|storm|flink|deepspeed|deepseek|zookeeper|NAME'" | head -25

echo ""
echo "Services:"
run_on_helios "microk8s kubectl get svc --all-namespaces | grep -E '30011|30012|30009|30080|8080|deepseek|NodePort|NAME'" | head -20

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 2-5 minutes for pods to fully start"
echo "   2. Check status: ssh $HELIOS_USER@$HELIOS_CONTROL 'microk8s kubectl get pods --all-namespaces'"
echo "   3. Test endpoints:"
echo "      - Flink UI: http://192.168.86.114:30011"
echo "      - Storm UI: http://192.168.86.114:30012"
echo "      - DeepSpeed: http://192.168.86.114:30009"
