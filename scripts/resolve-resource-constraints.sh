#!/bin/bash
# Resolve Resource Constraints - Comprehensive Fix
# Addresses "Insufficient cpu" errors by analyzing and adjusting resources

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Resolve Resource Constraints                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

echo "▶ Step 1: Analyzing node resources..."
echo "  Node capacity:"
run_on_helios "microk8s kubectl describe nodes | grep -E 'Name:|Allocatable:' | head -10"

echo ""
echo "▶ Step 2: Analyzing allocated resources..."
echo "  Current allocation:"
run_on_helios "microk8s kubectl describe nodes | grep -A 5 'Allocated resources:' | head -20"

echo ""
echo "▶ Step 3: Identifying pods with high CPU requests..."
run_on_helios "microk8s kubectl get pods --all-namespaces -o json | jq -r '[.items[] | select(.status.phase == \"Pending\") | {name: .metadata.name, namespace: .metadata.namespace, cpu: (.spec.containers[]? | .resources.requests.cpu // \"0\")}] | sort_by(.cpu) | reverse | .[0:10]'" 2>&1 | head -30

echo ""
echo "▶ Step 4: Reducing DeepSeek API replicas (temporary)..."
# Scale down to 1 replica to reduce resource pressure
run_on_helios "microk8s kubectl scale deployment deepseek-api -n lumenstack --replicas=1" 2>&1 || true

echo ""
echo "▶ Step 5: Checking for unnecessary pods..."
# Check for old/terminating pods that might be holding resources
run_on_helios "microk8s kubectl get pods --all-namespaces | grep -E 'Terminating|Error|CrashLoopBackOff' | wc -l && echo 'pods in problematic states'"

echo ""
echo "▶ Step 6: Cleaning up old DeepSeek API pods..."
# Delete old CrashLoopBackOff pods
run_on_helios "microk8s kubectl delete pod -n lumenstack -l app=deepseek-api --field-selector=status.phase!=Running" 2>&1 || true

echo ""
echo "▶ Step 7: Final resource status..."
run_on_helios "microk8s kubectl top nodes 2>&1 || echo 'Metrics not available'"

echo ""
echo "✅ Resource constraint resolution complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Monitor pod scheduling: microk8s kubectl get pods -n lumenstack -w"
echo "   2. Wait for pods to be scheduled (may take 2-5 minutes)"
echo "   3. If still pending, consider reducing resource requests further"
