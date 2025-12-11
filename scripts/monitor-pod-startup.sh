#!/bin/bash
# Comprehensive Pod Startup Monitor
# Monitors all telemetry pods and reports status

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Comprehensive Pod Startup Monitor                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

echo "▶ Step 1: Current Pod Status..."
run_on_helios "microk8s kubectl get pods -n lumenstack | grep -E 'zookeeper|storm|flink|deepspeed|deepseek|NAME'"

echo ""
echo "▶ Step 2: Zookeeper Status..."
ZOOKEEPER_PHASE=$(run_on_helios "microk8s kubectl get pod -n lumenstack zookeeper-0 -o jsonpath='{.status.phase}'" 2>/dev/null || echo "Unknown")
echo "  Phase: $ZOOKEEPER_PHASE"

if [ "$ZOOKEEPER_PHASE" = "Running" ]; then
    echo "  ✅ Zookeeper is RUNNING!"
    ZOOKEEPER_READY=$(run_on_helios "microk8s kubectl get pod -n lumenstack zookeeper-0 -o jsonpath='{.status.containerStatuses[?(@.name==\"zookeeper\")].ready}'" 2>/dev/null || echo "false")
    echo "  Ready: $ZOOKEEPER_READY"
else
    echo "  ⚠️  Zookeeper is $ZOOKEEPER_PHASE"
    run_on_helios "microk8s kubectl describe pod -n lumenstack zookeeper-0 | grep -A 5 'Events:'" 2>&1 | head -15
fi

echo ""
echo "▶ Step 3: Storm Pod Status..."
STORM_PODS=$(run_on_helios "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null | wc -l" || echo "0")
STORM_RUNNING=$(run_on_helios "microk8s kubectl get pods -n lumenstack -l app=storm --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l" || echo "0")
echo "  Total Storm pods: $STORM_PODS"
echo "  Running: $STORM_RUNNING"

if [ "$ZOOKEEPER_PHASE" = "Running" ] && [ "$STORM_RUNNING" -eq "0" ]; then
    echo "  ⚠️  Zookeeper is ready but Storm pods not started yet"
    echo "  Restarting Storm pods..."
    run_on_helios "microk8s kubectl delete pod -n lumenstack -l app=storm" 2>/dev/null || true
    sleep 5
fi

echo ""
echo "▶ Step 4: Flink Pod Status..."
FLINK_PODS=$(run_on_helios "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null | wc -l" || echo "0")
FLINK_RUNNING=$(run_on_helios "microk8s kubectl get pods -n lumenstack -l app=flink --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l" || echo "0")
echo "  Total Flink pods: $FLINK_PODS"
echo "  Running: $FLINK_RUNNING"

echo ""
echo "▶ Step 5: PVC Binding Status..."
run_on_helios "microk8s kubectl get pvc -n lumenstack | grep -E 'zookeeper|flink|NAME'"

echo ""
echo "▶ Step 6: Resource Constraints..."
run_on_helios "microk8s kubectl describe nodes | grep -E 'Name:|Allocated resources:' -A 3" 2>&1 | head -20

echo ""
echo "▶ Step 7: Service Endpoint Status..."
echo "  Testing endpoints..."
for port in 30080 30011 30012 30009 30008; do
    if timeout 3 curl -s "http://192.168.86.114:$port" >/dev/null 2>&1; then
        echo "  ✅ Port $port: ACCESSIBLE"
    else
        echo "  ❌ Port $port: NOT ACCESSIBLE"
    fi
done

echo ""
echo "▶ Step 8: Final Status Summary..."
run_on_helios "microk8s kubectl get pods -n lumenstack | grep -E 'zookeeper|storm|flink|deepspeed|deepseek|NAME'"

echo ""
echo "✅ Monitoring complete!"
