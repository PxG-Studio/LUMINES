#!/bin/bash
# Direct deployment commands to run on Helios Control
# Copy and paste these commands directly on Helios Control

set -e

LUMINERA_K8S_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Telemetry Stack Deployment - Direct Commands          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if running on Helios Control
if ! hostname | grep -q "helios"; then
    echo "⚠️  This script should be run on Helios Control (192.168.86.114)"
    echo "   Current host: $(hostname)"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "▶ Step 1: Deploying Apache Airflow (NERVA) in 'airflow' namespace..."
if [ -d "$LUMINERA_K8S_PATH/airflow" ]; then
    microk8s kubectl apply -f "$LUMINERA_K8S_PATH/airflow/airflow-optimized.yaml"
    echo "✅ Airflow deployment initiated."
else
    echo "⚠️  Airflow manifests not found at $LUMINERA_K8S_PATH/airflow"
    echo "   Please ensure Luminera repository is available"
fi
sleep 10

echo ""
echo "▶ Step 2: Deploying Zookeeper (required for Storm)..."
if [ -d "$LUMINERA_K8S_PATH/lumenstack" ]; then
    microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/zookeeper-deployment.yaml"
    echo "✅ Zookeeper deployment initiated."
    sleep 10
else
    echo "⚠️  Lumenstack manifests not found at $LUMINERA_K8S_PATH/lumenstack"
fi

echo ""
echo "▶ Step 3: Deploying Apache Storm (FLUX) in 'lumenstack' namespace..."
if [ -d "$LUMINERA_K8S_PATH/lumenstack" ]; then
    microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/storm-deployment.yaml"
    echo "✅ Storm deployment initiated."
    sleep 10
else
    echo "⚠️  Storm manifests not found"
fi

echo ""
echo "▶ Step 4: Deploying Apache Flink (GRAVIA/FLUX) in 'lumenstack' namespace..."
if [ -d "$LUMINERA_K8S_PATH/lumenstack" ]; then
    microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/flink-deployment.yaml"
    echo "✅ Flink deployment initiated."
    sleep 10
else
    echo "⚠️  Flink manifests not found"
fi

echo ""
echo "▶ Step 5: Deploying DeepSpeed Engine in 'lumenstack' namespace..."
if [ -d "$LUMINERA_K8S_PATH/lumenstack" ]; then
    microk8s kubectl apply -f "$LUMINERA_K8S_PATH/lumenstack/deepspeed-engine-complete.yaml"
    echo "✅ DeepSpeed Engine deployment initiated."
    sleep 10
else
    echo "⚠️  DeepSpeed manifests not found"
fi

echo ""
echo "✅ All telemetry stack components deployed!"
echo ""
echo "▶ Checking pod status..."
microk8s kubectl get pods --all-namespaces | grep -E 'airflow|storm|flink|deepspeed|zookeeper|NAME' | head -20

echo ""
echo "📋 Next steps:"
echo "   1. Wait 2-5 minutes for pods to start"
echo "   2. Check status: microk8s kubectl get pods --all-namespaces"
echo "   3. View logs: microk8s kubectl logs -n <namespace> <pod-name>"
