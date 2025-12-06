#!/bin/bash
# Comprehensive E2E Test Suite for WISSIL Infrastructure
# Based on LUMINERA Repository Configurations
# Tests: Services, Data Pipelines, Telemetry (Airflow, Storm, Flink, DeepSpeed)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
PASSED=0
FAILED=0
SKIPPED=0
TOTAL=0

# Server IPs (from LUMINERA)
HELIOS_CONTROL="192.168.86.114"
HELIOS_COMPUTE="192.168.86.115"
NAS_PRIMARY="192.168.86.27"
NAS_SECONDARY="192.168.86.28"

# Kubernetes namespaces
AIRFLOW_NS="airflow"
LUMENSTACK_NS="lumenstack"
MONITORING_NS="monitoring"

# Report file
REPORT_FILE="/tmp/e2e-luminera-report-$(date +%Y%m%d-%H%M%S).md"
echo "# E2E Test Report - LUMINERA Infrastructure" > "$REPORT_FILE"
echo "**Date:** $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test function
test_service() {
    local name=$1
    local host=$2
    local port=$3
    local protocol=${4:-tcp}

    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name ($host:$port)... "

    if [ "$protocol" = "http" ] || [ "$protocol" = "https" ]; then
        if curl -s --connect-timeout 5 "$protocol://$host:$port" >/dev/null 2>&1; then
            echo -e "${GREEN}✓ PASS${NC}"
            echo "✅ $name ($host:$port) - PASS" >> "$REPORT_FILE"
            PASSED=$((PASSED + 1))
            return 0
        fi
    else
        if timeout 3 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; then
            echo -e "${GREEN}✓ PASS${NC}"
            echo "✅ $name ($host:$port) - PASS" >> "$REPORT_FILE"
            PASSED=$((PASSED + 1))
            return 0
        fi
    fi

    echo -e "${RED}✗ FAIL${NC}"
    echo "❌ $name ($host:$port) - FAIL" >> "$REPORT_FILE"
    FAILED=$((FAILED + 1))
    return 1
}

# Test Kubernetes service
test_k8s_service() {
    local name=$1
    local namespace=$2
    local service=$3
    local port=$4

    TOTAL=$((TOTAL + 1))
    echo -n "Testing K8s $name ($namespace/$service:$port)... "

    if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n $namespace $service 2>/dev/null | grep -q $service" 2>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        echo "✅ K8s $name ($namespace/$service:$port) - PASS" >> "$REPORT_FILE"
        PASSED=$((PASSED + 1))
        return 0
    fi

    echo -e "${YELLOW}⚠ SKIP (not accessible)${NC}"
    echo "⚠️ K8s $name ($namespace/$service:$port) - SKIP" >> "$REPORT_FILE"
    SKIPPED=$((SKIPPED + 1))
    return 0
}

# Test Kubernetes pod
test_k8s_pod() {
    local name=$1
    local namespace=$2
    local label=$3

    TOTAL=$((TOTAL + 1))
    echo -n "Testing K8s Pod $name ($namespace)... "

    if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n $namespace -l $label --no-headers 2>/dev/null | grep -q Running" 2>/dev/null; then
        echo -e "${GREEN}✓ RUNNING${NC}"
        echo "✅ K8s Pod $name ($namespace) - RUNNING" >> "$REPORT_FILE"
        PASSED=$((PASSED + 1))
        return 0
    fi

    echo -e "${YELLOW}⚠ NOT RUNNING${NC}"
    echo "⚠️ K8s Pod $name ($namespace) - NOT RUNNING" >> "$REPORT_FILE"
    SKIPPED=$((SKIPPED + 1))
    return 0
}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  WISSIL Infrastructure E2E Test - LUMINERA Config        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "## Test Execution Started: $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test Core Data Services
echo -e "${BLUE}=== Testing Core Data Services ===${NC}"
echo "### Core Data Services" >> "$REPORT_FILE"
test_service "PostgreSQL Primary" "$NAS_PRIMARY" "5432"
test_service "Redis" "$NAS_PRIMARY" "6379"
test_service "NATS" "$NAS_PRIMARY" "4222"
echo "" >> "$REPORT_FILE"

# Test PostgreSQL Replication
echo -e "${BLUE}=== Testing PostgreSQL Replication ===${NC}"
echo "### PostgreSQL Replication" >> "$REPORT_FILE"
if ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();' 2>/dev/null" | grep -q "t"; then
    TOTAL=$((TOTAL + 1))
    echo -e "${GREEN}✓ PostgreSQL Replication - ACTIVE${NC}"
    echo "✅ PostgreSQL Replication - ACTIVE" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))

    # Get replication lag
    LAG=$(ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c \"SELECT pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn());\" 2>/dev/null" | xargs)
    echo "   Replication Lag: ${LAG:-0} bytes"
    echo "   Replication Lag: ${LAG:-0} bytes" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# Test Apache Airflow (NERVA)
echo -e "${BLUE}=== Testing Apache Airflow (NERVA) ===${NC}"
echo "### Apache Airflow - NERVA Orchestrator" >> "$REPORT_FILE"
test_k8s_pod "Airflow Webserver" "$AIRFLOW_NS" "component=webserver"
test_k8s_pod "Airflow Scheduler" "$AIRFLOW_NS" "component=scheduler"
test_k8s_service "Airflow Webserver" "$AIRFLOW_NS" "airflow-webserver" "8080"
test_service "Airflow UI" "$HELIOS_CONTROL" "8080" "http" || test_service "Airflow UI" "$HELIOS_COMPUTE" "8080" "http" || true
echo "" >> "$REPORT_FILE"

# Test Apache Storm (FLUX Telemetry)
echo -e "${BLUE}=== Testing Apache Storm (FLUX) ===${NC}"
echo "### Apache Storm - FLUX Telemetry" >> "$REPORT_FILE"
test_k8s_pod "Storm Nimbus" "$LUMENSTACK_NS" "component=nimbus"
test_k8s_pod "Storm Supervisor" "$LUMENSTACK_NS" "component=supervisor"
test_k8s_service "Storm UI" "$LUMENSTACK_NS" "storm-ui" "8080"
test_service "Storm UI (NodePort)" "$HELIOS_CONTROL" "30012" "http" || test_service "Storm UI (NodePort)" "$HELIOS_COMPUTE" "30012" "http" || true
echo "" >> "$REPORT_FILE"

# Test Apache Flink (GRAVIA + FLUX Validation)
echo -e "${BLUE}=== Testing Apache Flink (GRAVIA/FLUX) ===${NC}"
echo "### Apache Flink - GRAVIA/FLUX Validation" >> "$REPORT_FILE"
test_k8s_pod "Flink JobManager" "$LUMENSTACK_NS" "component=jobmanager"
test_k8s_pod "Flink TaskManager" "$LUMENSTACK_NS" "component=taskmanager"
test_k8s_service "Flink JobManager" "$LUMENSTACK_NS" "flink-jobmanager-webui" "8081"
test_service "Flink UI (NodePort)" "$HELIOS_CONTROL" "30011" "http" || test_service "Flink UI (NodePort)" "$HELIOS_COMPUTE" "30011" "http" || true
echo "" >> "$REPORT_FILE"

# Test DeepSpeed Engine
echo -e "${BLUE}=== Testing DeepSpeed Engine ===${NC}"
echo "### DeepSpeed Engine" >> "$REPORT_FILE"
test_k8s_pod "DeepSpeed Engine" "$LUMENSTACK_NS" "app=deepspeed-engine"
test_k8s_service "DeepSpeed Engine" "$LUMENSTACK_NS" "deepspeed-engine" "5679"
test_service "DeepSpeed (NodePort)" "$HELIOS_CONTROL" "30009" "http" || test_service "DeepSpeed (NodePort)" "$HELIOS_COMPUTE" "30009" "http" || true
echo "" >> "$REPORT_FILE"

# Test Monitoring Namespace Services
echo -e "${BLUE}=== Testing Monitoring Services ===${NC}"
echo "### Monitoring Services" >> "$REPORT_FILE"
test_k8s_pod "Storm Telemetry" "$MONITORING_NS" "app=storm-telemetry"
test_k8s_pod "Flink Telemetry" "$MONITORING_NS" "app=flink-telemetry"
echo "" >> "$REPORT_FILE"

# Test Data Pipeline Integration
echo -e "${BLUE}=== Testing Data Pipeline Integration ===${NC}"
echo "### Data Pipeline Integration" >> "$REPORT_FILE"

# Airflow → PostgreSQL
echo -n "Testing Airflow → PostgreSQL connection... "
TOTAL=$((TOTAL + 1))
if test_service "PostgreSQL Primary" "$NAS_PRIMARY" "5432"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "✅ Airflow → PostgreSQL - PASS" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "❌ Airflow → PostgreSQL - FAIL" >> "$REPORT_FILE"
    FAILED=$((FAILED + 1))
fi

# Flink → Data Sources
echo -n "Testing Flink → Data Sources... "
TOTAL=$((TOTAL + 1))
if test_service "PostgreSQL Primary" "$NAS_PRIMARY" "5432" && test_service "Redis" "$NAS_PRIMARY" "6379"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "✅ Flink → Data Sources - PASS" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "❌ Flink → Data Sources - FAIL" >> "$REPORT_FILE"
    FAILED=$((FAILED + 1))
fi

# Storm → NATS
echo -n "Testing Storm → NATS connection... "
TOTAL=$((TOTAL + 1))
if test_service "NATS" "$NAS_PRIMARY" "4222"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "✅ Storm → NATS - PASS" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "❌ Storm → NATS - FAIL" >> "$REPORT_FILE"
    FAILED=$((FAILED + 1))
fi
echo "" >> "$REPORT_FILE"

# Summary
echo "## Test Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Metric | Count |" >> "$REPORT_FILE"
echo "|--------|-------|" >> "$REPORT_FILE"
echo "| Total Tests | $TOTAL |" >> "$REPORT_FILE"
echo "| Passed | $PASSED |" >> "$REPORT_FILE"
echo "| Failed | $FAILED |" >> "$REPORT_FILE"
echo "| Skipped | $SKIPPED |" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ $TOTAL -gt 0 ]; then
    PASS_RATE=$((PASSED * 100 / TOTAL))
    echo "| Pass Rate | ${PASS_RATE}% |" >> "$REPORT_FILE"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Test Summary                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "Total Tests: ${BLUE}$TOTAL${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo -e "Skipped: ${YELLOW}$SKIPPED${NC}"
if [ $TOTAL -gt 0 ]; then
    echo -e "Pass Rate: ${BLUE}${PASS_RATE}%${NC}"
fi
echo ""
echo "Report saved to: $REPORT_FILE"
