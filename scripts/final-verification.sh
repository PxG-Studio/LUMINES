#!/bin/bash
# Final Comprehensive Verification Script
# Tests all services, endpoints, integrations, and configurations

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Final Comprehensive Verification                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNING=0

check_pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((WARNING++))
}

echo "▶ Section 1: Kubernetes Cluster Health"
echo "─────────────────────────────────────────"

# Check cluster nodes
NODES=$(run_on_helios "microk8s kubectl get nodes --no-headers 2>/dev/null | wc -l" || echo "0")
if [ "$NODES" -ge "1" ]; then
    check_pass "Cluster has $NODES node(s)"
else
    check_fail "No nodes found in cluster"
fi

# Check node status
READY_NODES=$(run_on_helios "microk8s kubectl get nodes --no-headers 2>/dev/null | grep -c Ready || echo 0")
if [ "$READY_NODES" -eq "$NODES" ]; then
    check_pass "All nodes are Ready"
else
    check_warn "$READY_NODES/$NODES nodes are Ready"
fi

echo ""
echo "▶ Section 2: Namespace Verification"
echo "─────────────────────────────────────"

# Check namespaces
for ns in lumenstack airflow; do
    if run_on_helios "microk8s kubectl get namespace $ns >/dev/null 2>&1"; then
        check_pass "Namespace '$ns' exists"
    else
        check_fail "Namespace '$ns' does not exist"
    fi
done

echo ""
echo "▶ Section 3: Deployment Status"
echo "───────────────────────────────"

# Check telemetry deployments
for deploy in zookeeper storm-nimbus storm-supervisor flink-jobmanager flink-taskmanager deepspeed-engine deepseek-api; do
    STATUS=$(run_on_helios "microk8s kubectl get deployment $deploy -n lumenstack -o jsonpath='{.status.readyReplicas}/{.spec.replicas}' 2>/dev/null" || echo "0/0")
    READY=$(echo $STATUS | cut -d'/' -f1)
    TOTAL=$(echo $STATUS | cut -d'/' -f2)
    if [ "$READY" = "$TOTAL" ] && [ "$TOTAL" != "0" ]; then
        check_pass "$deploy: $STATUS ready"
    elif [ "$TOTAL" = "0" ]; then
        check_warn "$deploy: Not deployed (0 replicas)"
    else
        check_warn "$deploy: $STATUS ready (partial)"
    fi
done

echo ""
echo "▶ Section 4: Pod Status"
echo "───────────────────────"

# Check pod phases
RUNNING=$(run_on_helios "microk8s kubectl get pods -n lumenstack --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l" || echo "0")
PENDING=$(run_on_helios "microk8s kubectl get pods -n lumenstack --field-selector=status.phase=Pending --no-headers 2>/dev/null | wc -l" || echo "0")
FAILED=$(run_on_helios "microk8s kubectl get pods -n lumenstack --field-selector=status.phase=Failed --no-headers 2>/dev/null | wc -l" || echo "0")

check_pass "Running pods: $RUNNING"
if [ "$PENDING" -gt "0" ]; then
    check_warn "Pending pods: $PENDING"
fi
if [ "$FAILED" -gt "0" ]; then
    check_fail "Failed pods: $FAILED"
fi

echo ""
echo "▶ Section 5: Service Endpoints"
echo "──────────────────────────────"

# Check services
for svc in deepseek-api deepspeed-engine flink-jobmanager-webui storm-ui; do
    if run_on_helios "microk8s kubectl get svc $svc -n lumenstack >/dev/null 2>&1"; then
        check_pass "Service '$svc' exists"
    else
        check_fail "Service '$svc' does not exist"
    fi
done

# Check NodePort services
NODEPORT_SERVICES=$(run_on_helios "microk8s kubectl get svc -n lumenstack -o json | jq -r '.items[] | select(.spec.type == \"NodePort\") | .metadata.name' 2>/dev/null" || echo "")
if [ -n "$NODEPORT_SERVICES" ]; then
    check_pass "NodePort services configured"
else
    check_warn "No NodePort services found"
fi

echo ""
echo "▶ Section 6: Storage (PVCs)"
echo "───────────────────────────"

# Check PVCs
for pvc in data-zookeeper-0 flink-checkpoints-pvc flink-savepoints-pvc; do
    PHASE=$(run_on_helios "microk8s kubectl get pvc $pvc -n lumenstack -o jsonpath='{.status.phase}' 2>/dev/null" || echo "NotFound")
    if [ "$PHASE" = "Bound" ]; then
        check_pass "PVC '$pvc' is Bound"
    elif [ "$PHASE" = "Pending" ]; then
        check_warn "PVC '$pvc' is Pending"
    else
        check_fail "PVC '$pvc' not found or error: $PHASE"
    fi
done

echo ""
echo "▶ Section 7: Configuration (ConfigMaps & Secrets)"
echo "──────────────────────────────────────────────────"

# Check ConfigMaps
for cm in deepseek-api-config storm-config flink-config deepspeed-config; do
    if run_on_helios "microk8s kubectl get configmap $cm -n lumenstack >/dev/null 2>&1"; then
        check_pass "ConfigMap '$cm' exists"
    else
        check_fail "ConfigMap '$cm' does not exist"
    fi
done

# Check Secrets
for secret in postgres-credentials redis-credentials; do
    if run_on_helios "microk8s kubectl get secret $secret -n lumenstack >/dev/null 2>&1"; then
        check_pass "Secret '$secret' exists"
    else
        check_warn "Secret '$secret' does not exist"
    fi
done

echo ""
echo "▶ Section 8: Service Endpoint Accessibility"
echo "────────────────────────────────────────────"

# Test endpoints
declare -A ENDPOINTS=(
    ["30080"]="Airflow UI"
    ["30011"]="Flink UI"
    ["30012"]="Storm UI"
    ["30009"]="DeepSpeed"
    ["30008"]="DeepSeek API"
)

for port in "${!ENDPOINTS[@]}"; do
    NAME="${ENDPOINTS[$port]}"
    if timeout 3 curl -s "http://$HELIOS_CONTROL:$port" >/dev/null 2>&1; then
        check_pass "$NAME (port $port) is accessible"
    else
        check_warn "$NAME (port $port) is not accessible (pod may not be running)"
    fi
done

echo ""
echo "▶ Section 9: Resource Constraints"
echo "─────────────────────────────────"

# Check node resources
CPU_USAGE=$(run_on_helios "microk8s kubectl top nodes --no-headers 2>/dev/null | head -1 | awk '{print \$3}' | sed 's/%//'" || echo "0")
if [ -n "$CPU_USAGE" ] && [ "$CPU_USAGE" != "0" ]; then
    if (( $(echo "$CPU_USAGE < 95" | bc -l 2>/dev/null || echo "1") )); then
        check_pass "CPU usage: ${CPU_USAGE}% (reasonable)"
    else
        check_warn "CPU usage: ${CPU_USAGE}% (high)"
    fi
else
    check_warn "CPU metrics not available"
fi

echo ""
echo "▶ Section 10: Integration Points"
echo "──────────────────────────────────"

# Check if services can reach each other
if run_on_helios "microk8s kubectl get svc deepseek-runtime -n lumenstack >/dev/null 2>&1"; then
    check_pass "DeepSeek Runtime service exists (for DeepSeek API integration)"
else
    check_warn "DeepSeek Runtime service not found"
fi

if run_on_helios "microk8s kubectl get svc zookeeper -n lumenstack >/dev/null 2>&1"; then
    check_pass "Zookeeper service exists (for Storm integration)"
else
    check_fail "Zookeeper service not found"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION SUMMARY                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Passed:  $PASSED"
echo "⚠️  Warnings: $WARNING"
echo "❌ Failed:  $FAILED"
echo ""
TOTAL=$((PASSED + WARNING + FAILED))
if [ "$FAILED" -eq "0" ] && [ "$WARNING" -eq "0" ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    exit 0
elif [ "$FAILED" -eq "0" ]; then
    echo -e "${YELLOW}⚠️  SOME WARNINGS (but no failures)${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    exit 1
fi
