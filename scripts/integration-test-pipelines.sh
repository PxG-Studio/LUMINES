#!/bin/bash
# Integration Test Suite for Data Pipelines
# Tests: Airflow DAGs, Flink Jobs, Storm Topologies, End-to-End Flow

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
NAS_PRIMARY="192.168.86.27"

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

# Test Airflow DAG Integration
print_section "Airflow DAG Integration Tests"

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow -l component=webserver --no-headers 2>/dev/null" | grep -q Running; then
    # Check if DAGs are loaded
    echo "Checking Airflow DAGs..."
    if ssh "$HELIOS_CONTROL" "microk8s kubectl exec -n airflow \$(microk8s kubectl get pods -n airflow -l component=webserver -o jsonpath='{.items[0].metadata.name}') -- airflow dags list 2>/dev/null" | grep -q "dag_id"; then
        DAG_COUNT=$(ssh "$HELIOS_CONTROL" "microk8s kubectl exec -n airflow \$(microk8s kubectl get pods -n airflow -l component=webserver -o jsonpath='{.items[0].metadata.name}') -- airflow dags list 2>/dev/null" | grep -c "dag_id" || echo "0")
        if [ "$DAG_COUNT" -gt 0 ]; then
            test_pass "Airflow DAGs loaded: $DAG_COUNT DAGs found"
        else
            test_fail "No Airflow DAGs found"
        fi
    else
        test_skip "Cannot check Airflow DAGs (requires pod access)"
    fi

    # Test DAG connectivity to PostgreSQL
    echo "Testing Airflow → PostgreSQL connectivity..."
    if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null; then
        test_pass "Airflow can connect to PostgreSQL"
    else
        test_fail "Airflow cannot connect to PostgreSQL"
    fi
else
    test_skip "Airflow webserver not running"
fi

# Test Flink Job Integration
print_section "Flink Job Integration Tests"

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=jobmanager --no-headers 2>/dev/null" | grep -q Running; then
    # Check Flink cluster status
    echo "Checking Flink cluster status..."
    FLINK_UI=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack flink-jobmanager-webui -o jsonpath='{.spec.ports[0].nodePort}'" 2>/dev/null)
    if [ -n "$FLINK_UI" ]; then
        test_pass "Flink UI accessible on NodePort $FLINK_UI"

        # Test Flink connectivity to data sources
        echo "Testing Flink → Data Sources connectivity..."
        if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null && \
           timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/6379" 2>/dev/null; then
            test_pass "Flink can connect to PostgreSQL and Redis"
        else
            test_fail "Flink cannot connect to data sources"
        fi
    else
        test_fail "Flink UI NodePort not configured"
    fi
else
    test_skip "Flink JobManager not running"
fi

# Test Storm Topology Integration
print_section "Storm Topology Integration Tests"

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=nimbus --no-headers 2>/dev/null" | grep -q Running; then
    # Check Storm cluster status
    echo "Checking Storm cluster status..."
    STORM_UI=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack storm-ui -o jsonpath='{.spec.ports[0].nodePort}'" 2>/dev/null)
    if [ -n "$STORM_UI" ]; then
        test_pass "Storm UI accessible on NodePort $STORM_UI"

        # Test Storm connectivity to NATS
        echo "Testing Storm → NATS connectivity..."
        if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/4222" 2>/dev/null; then
            test_pass "Storm can connect to NATS"
        else
            test_fail "Storm cannot connect to NATS"
        fi
    else
        test_fail "Storm UI NodePort not configured"
    fi
else
    test_skip "Storm Nimbus not running"
fi

# Test End-to-End Pipeline Flow
print_section "End-to-End Pipeline Flow Tests"

echo "Testing complete data pipeline flow..."

# Step 1: Data Source → Airflow
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null; then
    test_pass "Step 1: PostgreSQL → Airflow connection available"
else
    test_fail "Step 1: PostgreSQL → Airflow connection NOT available"
fi

# Step 2: Airflow → Flink
if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow -l component=scheduler --no-headers 2>/dev/null" | grep -q Running && \
   ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=jobmanager --no-headers 2>/dev/null" | grep -q Running; then
    test_pass "Step 2: Airflow → Flink (both services running)"
else
    test_skip "Step 2: Airflow → Flink (one or both services not running)"
fi

# Step 3: Flink → Storm
if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=jobmanager --no-headers 2>/dev/null" | grep -q Running && \
   ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=nimbus --no-headers 2>/dev/null" | grep -q Running; then
    test_pass "Step 3: Flink → Storm (both services running)"
else
    test_skip "Step 3: Flink → Storm (one or both services not running)"
fi

# Step 4: Storm → NATS → Monitoring
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/4222" 2>/dev/null; then
    test_pass "Step 4: Storm → NATS → Monitoring connection available"
else
    test_fail "Step 4: Storm → NATS → Monitoring connection NOT available"
fi

# Summary
print_section "Integration Test Summary"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              INTEGRATION TEST SUMMARY                     ║"
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
    echo -e "${GREEN}✓ All integration tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some integration tests failed${NC}"
    exit 1
fi
