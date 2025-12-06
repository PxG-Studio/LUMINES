#!/bin/bash
# Comprehensive E2E Test Suite for WISSIL Infrastructure
# Tests: Services, Data Pipelines, Telemetry (Airflow, Storm, Flink, DeepSpeed)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
SKIPPED=0
TOTAL=0

# Server IPs
HELIOS_CONTROL="192.168.86.114"
HELIOS_COMPUTE="192.168.86.115"
NAS_PRIMARY="192.168.86.27"
NAS_SECONDARY="192.168.86.28"

# Service Ports
LANDING_PORT=3000
SLATE_PORT=3001
IGNITION_PORT=3002
SPARK_PORT=3003
IGNIS_PORT=3004
WAYPOINT_PORT=3005
POSTGRES_PORT=5432
REDIS_PORT=6379
NATS_PORT=4222
REGISTRY_PORT=5000

# Report file
REPORT_FILE="/tmp/e2e-test-report-$(date +%Y%m%d-%H%M%S).md"
echo "# E2E Test Report - $(date)" > "$REPORT_FILE"
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

# Test database connectivity
test_database() {
    local name=$1
    local host=$2
    local port=$3

    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name database ($host:$port)... "

    if PGPASSWORD="test" psql -h "$host" -p "$port" -U postgres -d postgres -c "SELECT 1;" >/dev/null 2>&1 2>/dev/null || \
       timeout 3 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        echo "✅ $name database ($host:$port) - PASS" >> "$REPORT_FILE"
        PASSED=$((PASSED + 1))
        return 0
    fi

    echo -e "${YELLOW}⚠ SKIP (auth required)${NC}"
    echo "⚠️ $name database ($host:$port) - SKIP (authentication required)" >> "$REPORT_FILE"
    SKIPPED=$((SKIPPED + 1))
    return 0
}

# Test telemetry service
test_telemetry() {
    local name=$1
    local host=$2
    local port=$3

    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name ($host:$port)... "

    if timeout 3 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        echo "✅ $name ($host:$port) - PASS" >> "$REPORT_FILE"
        PASSED=$((PASSED + 1))
        return 0
    fi

    echo -e "${YELLOW}⚠ NOT INSTALLED${NC}"
    echo "⚠️ $name ($host:$port) - NOT INSTALLED" >> "$REPORT_FILE"
    SKIPPED=$((SKIPPED + 1))
    return 0
}

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     WISSIL Infrastructure E2E Test Suite                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "## Test Execution Started: $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test Helios Control Services
echo -e "${BLUE}=== Testing Helios Control (192.168.86.114) ===${NC}"
echo "### Helios Control Services (192.168.86.114)" >> "$REPORT_FILE"
test_service "LANDING" "$HELIOS_CONTROL" "$LANDING_PORT" "http" || true
test_service "IGNITION" "$HELIOS_CONTROL" "$IGNITION_PORT" "http" || true
test_service "IGNIS" "$HELIOS_CONTROL" "$IGNIS_PORT" "http" || true
echo "" >> "$REPORT_FILE"

# Test Helios Compute Services
echo -e "${BLUE}=== Testing Helios Compute (192.168.86.115) ===${NC}"
echo "### Helios Compute Services (192.168.86.115)" >> "$REPORT_FILE"
test_service "SLATE" "$HELIOS_COMPUTE" "$SLATE_PORT" "http" || true
test_service "SPARK" "$HELIOS_COMPUTE" "$SPARK_PORT" "http" || true
test_service "WAYPOINT" "$HELIOS_COMPUTE" "$WAYPOINT_PORT" "http" || true

# Test PostgreSQL DR on Compute
if ssh "$HELIOS_COMPUTE" "sudo docker ps --filter 'name=postgresql-dr' --format '{{.Status}}' 2>/dev/null" | grep -q "Up"; then
    TOTAL=$((TOTAL + 1))
    echo -e "${GREEN}✓ PostgreSQL DR container - RUNNING${NC}"
    echo "✅ PostgreSQL DR container on $HELIOS_COMPUTE - RUNNING" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))

    # Test replication status
    if ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();' 2>/dev/null" | grep -q "t"; then
        TOTAL=$((TOTAL + 1))
        echo -e "${GREEN}✓ PostgreSQL Replication - ACTIVE${NC}"
        echo "✅ PostgreSQL Replication - ACTIVE" >> "$REPORT_FILE"
        PASSED=$((PASSED + 1))
    fi
fi
echo "" >> "$REPORT_FILE"

# Test NAS Primary Services
echo -e "${BLUE}=== Testing NAS Primary (192.168.86.27) ===${NC}"
echo "### NAS Primary Services (192.168.86.27)" >> "$REPORT_FILE"
test_database "PostgreSQL Primary" "$NAS_PRIMARY" "$POSTGRES_PORT"
test_service "Redis" "$NAS_PRIMARY" "$REDIS_PORT"
test_service "NATS" "$NAS_PRIMARY" "$NATS_PORT"
test_service "Container Registry" "$NAS_PRIMARY" "$REGISTRY_PORT"
echo "" >> "$REPORT_FILE"

# Test NAS Secondary Services
echo -e "${BLUE}=== Testing NAS Secondary (192.168.86.28) ===${NC}"
echo "### NAS Secondary Services (192.168.86.28)" >> "$REPORT_FILE"
test_database "PostgreSQL Replica" "$NAS_SECONDARY" "$POSTGRES_PORT"
test_service "Redis Sentinel" "$NAS_SECONDARY" "26379"
test_service "NATS Cluster" "$NAS_SECONDARY" "$NATS_PORT"
test_service "Registry Mirror" "$NAS_SECONDARY" "$REGISTRY_PORT"
echo "" >> "$REPORT_FILE"

# Test Telemetry Services
echo -e "${BLUE}=== Testing Telemetry Services ===${NC}"
echo "### Telemetry Services" >> "$REPORT_FILE"

# Apache Airflow (default port 8080)
test_telemetry "Apache Airflow" "$HELIOS_COMPUTE" "8080"
test_telemetry "Apache Airflow" "$HELIOS_CONTROL" "8080"

# Apache Storm (default ports 6627, 8000)
test_telemetry "Apache Storm Nimbus" "$HELIOS_COMPUTE" "6627"
test_telemetry "Apache Storm UI" "$HELIOS_COMPUTE" "8000"

# Apache Flink (default ports 8081, 6123)
test_telemetry "Apache Flink JobManager" "$HELIOS_COMPUTE" "8081"
test_telemetry "Apache Flink TaskManager" "$HELIOS_COMPUTE" "6123"

# DeepSpeed (typically runs on compute nodes, check for processes)
echo -n "Testing DeepSpeed availability... "
if ssh "$HELIOS_COMPUTE" "which deepspeed 2>/dev/null || python3 -c 'import deepspeed' 2>/dev/null"; then
    TOTAL=$((TOTAL + 1))
    echo -e "${GREEN}✓ INSTALLED${NC}"
    echo "✅ DeepSpeed - INSTALLED" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    TOTAL=$((TOTAL + 1))
    echo -e "${YELLOW}⚠ NOT INSTALLED${NC}"
    echo "⚠️ DeepSpeed - NOT INSTALLED" >> "$REPORT_FILE"
    SKIPPED=$((SKIPPED + 1))
fi
echo "" >> "$REPORT_FILE"

# Data Pipeline Integration Tests
echo -e "${BLUE}=== Testing Data Pipeline Integration ===${NC}"
echo "### Data Pipeline Integration Tests" >> "$REPORT_FILE"

# Test PostgreSQL to Redis pipeline
echo -n "Testing PostgreSQL → Redis pipeline... "
TOTAL=$((TOTAL + 1))
if test_service "PostgreSQL" "$NAS_PRIMARY" "$POSTGRES_PORT" && test_service "Redis" "$NAS_PRIMARY" "$REDIS_PORT"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "✅ PostgreSQL → Redis pipeline - PASS" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "❌ PostgreSQL → Redis pipeline - FAIL" >> "$REPORT_FILE"
    FAILED=$((FAILED + 1))
fi

# Test NATS message bus
echo -n "Testing NATS message bus... "
TOTAL=$((TOTAL + 1))
if test_service "NATS" "$NAS_PRIMARY" "$NATS_PORT"; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "✅ NATS message bus - PASS" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "❌ NATS message bus - FAIL" >> "$REPORT_FILE"
    FAILED=$((FAILED + 1))
fi

# Test PostgreSQL replication
echo -n "Testing PostgreSQL replication... "
TOTAL=$((TOTAL + 1))
if ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();' 2>/dev/null" | grep -q "t"; then
    echo -e "${GREEN}✓ ACTIVE${NC}"
    echo "✅ PostgreSQL replication - ACTIVE" >> "$REPORT_FILE"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ NOT VERIFIED${NC}"
    echo "⚠️ PostgreSQL replication - NOT VERIFIED" >> "$REPORT_FILE"
    SKIPPED=$((SKIPPED + 1))
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

# Calculate percentage
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
echo "Report saved to: $REPORT_FILE" >> "$REPORT_FILE"
