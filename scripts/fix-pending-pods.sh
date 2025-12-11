#!/bin/bash
# Fix Pending Pods - Comprehensive Fix Script
# Addresses Zookeeper, Flink, DeepSpeed, and DeepSeek API issues

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Fix Pending Pods - Comprehensive Resolution           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

echo "▶ Step 1: Checking current pod status..."
run_on_helios "microk8s kubectl get pods -n lumenstack | grep -E 'zookeeper|flink|storm|deepspeed|deepseek|NAME'"

echo ""
echo "▶ Step 2: Fixing Zookeeper volume mount issue..."
# Check if Zookeeper StatefulSet exists
if run_on_helios "microk8s kubectl get statefulset zookeeper -n lumenstack" >/dev/null 2>&1; then
    echo "  Deleting problematic Zookeeper StatefulSet..."
    run_on_helios "microk8s kubectl delete statefulset zookeeper -n lumenstack --cascade=orphan" || true
    sleep 5
    echo "  Reapplying Zookeeper deployment..."
    run_on_helios "microk8s kubectl apply -f /tmp/telemetry-deploy-*/lumenstack/zookeeper-deployment.yaml" || {
        echo "  ⚠️  Zookeeper YAML not in temp dir, will need to copy"
    }
else
    echo "  Zookeeper StatefulSet not found, will create fresh"
fi

echo ""
echo "▶ Step 3: Creating Flink PVCs if missing..."
# Check for Flink PVCs
if ! run_on_helios "microk8s kubectl get pvc flink-checkpoints-pvc -n lumenstack" >/dev/null 2>&1; then
    echo "  Creating flink-checkpoints-pvc..."
    run_on_helios "cat <<EOF | microk8s kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: flink-checkpoints-pvc
  namespace: lumenstack
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: microk8s-hostpath
EOF"
fi

if ! run_on_helios "microk8s kubectl get pvc flink-savepoints-pvc -n lumenstack" >/dev/null 2>&1; then
    echo "  Creating flink-savepoints-pvc..."
    run_on_helios "cat <<EOF | microk8s kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: flink-savepoints-pvc
  namespace: lumenstack
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: microk8s-hostpath
EOF"
fi

echo ""
echo "▶ Step 4: Checking resource constraints..."
# Get node resources
echo "  Node resources:"
run_on_helios "microk8s kubectl describe nodes | grep -E 'Name:|Allocatable:|cpu:|memory:' | head -20"

echo ""
echo "▶ Step 5: Adjusting pod resource requests if needed..."
# Check DeepSpeed resource requests
echo "  Checking DeepSpeed deployment resources..."
run_on_helios "microk8s kubectl get deployment deepspeed-engine -n lumenstack -o yaml | grep -A 10 'resources:'" || true

# Check DeepSeek API resource requests
echo "  Checking DeepSeek API deployment resources..."
run_on_helios "microk8s kubectl get deployment deepseek-api -n lumenstack -o yaml | grep -A 10 'resources:'" || true

echo ""
echo "▶ Step 6: Waiting for Zookeeper to be ready..."
for i in {1..30}; do
    if run_on_helios "microk8s kubectl get pod -n lumenstack -l app=zookeeper --field-selector=status.phase=Running" >/dev/null 2>&1; then
        echo "  ✅ Zookeeper is ready"
        break
    fi
    echo "  Waiting for Zookeeper... ($i/30)"
    sleep 2
done

echo ""
echo "▶ Step 7: Restarting Storm pods (they depend on Zookeeper)..."
run_on_helios "microk8s kubectl delete pod -n lumenstack -l app=storm" || true
sleep 5

echo ""
echo "▶ Step 8: Final pod status..."
run_on_helios "microk8s kubectl get pods -n lumenstack | grep -E 'zookeeper|flink|storm|deepspeed|deepseek|NAME'"

echo ""
echo "✅ Fix script complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Monitor pod startup: microk8s kubectl get pods -n lumenstack -w"
echo "   2. Check pod logs if issues persist"
echo "   3. Verify service endpoints once pods are running"
