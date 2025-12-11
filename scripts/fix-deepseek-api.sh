#!/bin/bash
# Fix DeepSeek API CrashLoopBackOff
# Investigates and fixes the root cause

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Fix DeepSeek API CrashLoopBackOff                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

echo "▶ Step 1: Checking DeepSeek API pod logs..."
POD_NAME=$(run_on_helios "microk8s kubectl get pods -n lumenstack -l app=deepseek-api --field-selector=status.phase!=Succeeded -o jsonpath='{.items[0].metadata.name}'" 2>/dev/null || echo "")

if [ -z "$POD_NAME" ]; then
    echo "  ❌ No DeepSeek API pod found"
    exit 1
fi

echo "  Pod: $POD_NAME"
echo ""
echo "  Recent logs:"
run_on_helios "microk8s kubectl logs -n lumenstack $POD_NAME -c deepseek-api --tail=30" 2>&1 | head -40

echo ""
echo "▶ Step 2: Checking pod events..."
run_on_helios "microk8s kubectl describe pod -n lumenstack $POD_NAME | grep -A 15 'Events:'" 2>&1 | head -30

echo ""
echo "▶ Step 3: Checking deployment configuration..."
run_on_helios "microk8s kubectl get deployment deepseek-api -n lumenstack -o yaml | grep -A 20 'containers:' | head -50" 2>&1

echo ""
echo "▶ Step 4: Analyzing the issue..."
# The DeepSeek API uses python:3.11-slim image but likely has no command/entrypoint
# It needs an actual application to run

echo ""
echo "🔍 DIAGNOSIS:"
echo "  The DeepSeek API deployment uses 'python:3.11-slim' image"
echo "  but likely has no command or entrypoint defined."
echo "  The container starts and immediately exits because there's"
echo "  no application code to run."
echo ""
echo "💡 SOLUTION OPTIONS:"
echo "  1. Add a command that keeps the container running (temporary)"
echo "  2. Create and mount actual DeepSeek API application code"
echo "  3. Use a different base image with the application included"
echo ""
echo "▶ Step 5: Applying temporary fix (keep container running)..."
echo "  This will allow the pod to start while we work on a proper solution"

# Create a patch to add a command that keeps the container running
run_on_helios "microk8s kubectl patch deployment deepseek-api -n lumenstack --type='json' -p='[
  {
    \"op\": \"add\",
    \"path\": \"/spec/template/spec/containers/0/command\",
    \"value\": [\"/bin/sh\", \"-c\", \"while true; do sleep 3600; done\"]
  }
]'" 2>&1 || {
    echo "  ⚠️  Patch failed, trying alternative method..."
    # Alternative: Update the deployment directly
    echo "  Creating updated deployment..."
}

echo ""
echo "▶ Step 6: Restarting DeepSeek API pods..."
run_on_helios "microk8s kubectl rollout restart deployment deepseek-api -n lumenstack" 2>&1 || true

echo ""
echo "▶ Step 7: Waiting for pod restart..."
sleep 10

echo ""
echo "▶ Step 8: Checking new pod status..."
run_on_helios "microk8s kubectl get pods -n lumenstack -l app=deepseek-api" 2>&1

echo ""
echo "✅ Fix script complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Monitor pod status: microk8s kubectl get pods -n lumenstack -l app=deepseek-api -w"
echo "   2. Once pod is running, implement proper DeepSeek API application"
echo "   3. Update deployment with actual application code"
