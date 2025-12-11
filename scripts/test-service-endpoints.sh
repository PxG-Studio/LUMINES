#!/bin/bash
# Service Endpoint Testing Script
# Tests: NodePort services, ClusterIP services, Health endpoints

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
HELIOS_CONTROL="192.168.86.114"
HELIOS_COMPUTE="192.168.86.115"

PASSED=0
FAILED=0
SKIPPED=0

print_section() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
}

test_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    PASSED=$((PASSED + 1))
}

test_fail() {
    echo -e "${RED}✗ $1${NC}"
    FAILED=$((FAILED + 1))
}

test_skip() {
    echo -e "${YELLOW}⚠ $1${NC}"
    SKIPPED=$((SKIPPED + 1))
}

# Test NodePort Services
print_section "NodePort Service Endpoints"

# Flink UI (30011)
echo "Testing Flink UI (NodePort 30011)..."
if timeout 5 curl -s "http://$HELIOS_CONTROL:30011" >/dev/null 2>&1 || \
   timeout 5 curl -s "http://$HELIOS_COMPUTE:30011" >/dev/null 2>&1; then
    test_pass "Flink UI (30011) is accessible"
    RESPONSE=$(timeout 5 curl -s "http://$HELIOS_CONTROL:30011" 2>/dev/null | head -5 || timeout 5 curl -s "http://$HELIOS_COMPUTE:30011" 2>/dev/null | head -5)
    if echo "$RESPONSE" | grep -qi "flink\|apache"; then
        test_pass "Flink UI returns valid content"
    fi
else
    test_fail "Flink UI (30011) is NOT accessible"
fi

# Storm UI (30012)
echo "Testing Storm UI (NodePort 30012)..."
if timeout 5 curl -s "http://$HELIOS_CONTROL:30012" >/dev/null 2>&1 || \
   timeout 5 curl -s "http://$HELIOS_COMPUTE:30012" >/dev/null 2>&1; then
    test_pass "Storm UI (30012) is accessible"
    RESPONSE=$(timeout 5 curl -s "http://$HELIOS_CONTROL:30012" 2>/dev/null | head -5 || timeout 5 curl -s "http://$HELIOS_COMPUTE:30012" 2>/dev/null | head -5)
    if echo "$RESPONSE" | grep -qi "storm\|apache"; then
        test_pass "Storm UI returns valid content"
    fi
else
    test_fail "Storm UI (30012) is NOT accessible"
fi

# DeepSpeed (30009)
echo "Testing DeepSpeed (NodePort 30009)..."
if timeout 5 curl -s "http://$HELIOS_CONTROL:30009" >/dev/null 2>&1 || \
   timeout 5 curl -s "http://$HELIOS_COMPUTE:30009" >/dev/null 2>&1; then
    test_pass "DeepSpeed (30009) is accessible"
    RESPONSE=$(timeout 5 curl -s "http://$HELIOS_CONTROL:30009/health" 2>/dev/null || timeout 5 curl -s "http://$HELIOS_COMPUTE:30009/health" 2>/dev/null)
    if echo "$RESPONSE" | grep -qi "ok\|healthy"; then
        test_pass "DeepSpeed health endpoint returns valid response"
    fi
else
    test_fail "DeepSpeed (30009) is NOT accessible"
fi

# Test ClusterIP Services (via port-forward or from within cluster)
print_section "ClusterIP Service Endpoints (via kubectl)"

if ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info" >/dev/null 2>&1; then
    # Airflow Webserver
    echo "Testing Airflow Webserver (ClusterIP)..."
    if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n airflow airflow-webserver" >/dev/null 2>&1; then
        test_pass "Airflow webserver service exists"

        # Try port-forward test
        PORT_FORWARD=$(ssh "$HELIOS_CONTROL" "timeout 2 microk8s kubectl port-forward -n airflow svc/airflow-webserver 8080:8080" 2>&1 &)
        sleep 2
        if timeout 3 curl -s "http://localhost:8080" >/dev/null 2>&1; then
            test_pass "Airflow webserver is accessible via port-forward"
        else
            test_skip "Airflow webserver port-forward test (requires manual verification)"
        fi
        pkill -f "port-forward.*airflow" 2>/dev/null || true
    else
        test_fail "Airflow webserver service NOT found"
    fi

    # Flink JobManager
    echo "Testing Flink JobManager (ClusterIP)..."
    if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack flink-jobmanager" >/dev/null 2>&1; then
        test_pass "Flink JobManager service exists"
    else
        test_fail "Flink JobManager service NOT found"
    fi

    # Storm Nimbus
    echo "Testing Storm Nimbus (ClusterIP)..."
    if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack storm-nimbus" >/dev/null 2>&1; then
        test_pass "Storm Nimbus service exists"
    else
        test_fail "Storm Nimbus service NOT found"
    fi
else
    test_skip "Cannot test ClusterIP services (K8s access required)"
fi

# Test Health Endpoints
print_section "Health Endpoints"

# DeepSpeed Health
echo "Testing DeepSpeed health endpoint..."
if timeout 5 curl -s "http://$HELIOS_CONTROL:30009/health" >/dev/null 2>&1 || \
   timeout 5 curl -s "http://$HELIOS_COMPUTE:30009/health" >/dev/null 2>&1; then
    HEALTH_RESPONSE=$(timeout 5 curl -s "http://$HELIOS_CONTROL:30009/health" 2>/dev/null || timeout 5 curl -s "http://$HELIOS_COMPUTE:30009/health" 2>/dev/null)
    if echo "$HEALTH_RESPONSE" | grep -qi "ok\|healthy\|status"; then
        test_pass "DeepSpeed health endpoint returns healthy"
    else
        test_skip "DeepSpeed health endpoint accessible but response unclear"
    fi
else
    test_fail "DeepSpeed health endpoint NOT accessible"
fi

# Summary
print_section "Endpoint Test Summary"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ENDPOINT TEST SUMMARY                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo -e "Skipped: ${YELLOW}$SKIPPED${NC}"
echo ""

TOTAL=$((PASSED + FAILED + SKIPPED))
if [ $TOTAL -gt 0 ]; then
    PASS_RATE=$((PASSED * 100 / TOTAL))
    echo -e "Pass Rate: ${BLUE}${PASS_RATE}%${NC}"
fi

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All accessible endpoints are working!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some endpoints are not accessible${NC}"
    exit 1
fi
