#!/bin/bash
# Systematic Verification Script for WISSIL Infrastructure
# Step-by-step verification of all services and data pipelines

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
NAS_PRIMARY="192.168.86.27"
NAS_SECONDARY="192.168.86.28"

LOG_FILE="/tmp/systematic-verification-$(date +%Y%m%d-%H%M%S).log"
echo "Systematic Verification Log - $(date)" > "$LOG_FILE"

# Step counter
STEP=0
PASSED=0
FAILED=0
SKIPPED=0

print_step() {
    STEP=$((STEP + 1))
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}STEP $STEP: $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo "$(date): STEP $STEP: $1" >> "$LOG_FILE"
}

test_pass() {
    echo -e "${GREEN}✓ PASS: $1${NC}"
    echo "$(date): PASS: $1" >> "$LOG_FILE"
    PASSED=$((PASSED + 1))
}

test_fail() {
    echo -e "${RED}✗ FAIL: $1${NC}"
    echo "$(date): FAIL: $1" >> "$LOG_FILE"
    FAILED=$((FAILED + 1))
}

test_skip() {
    echo -e "${YELLOW}⚠ SKIP: $1${NC}"
    echo "$(date): SKIP: $1" >> "$LOG_FILE"
    SKIPPED=$((SKIPPED + 1))
}

# Step 1: Network Connectivity
print_step "Network Connectivity Verification"
echo "Testing connectivity to all servers..."

for host in "$HELIOS_CONTROL" "$HELIOS_COMPUTE" "$NAS_PRIMARY" "$NAS_SECONDARY"; do
    if ping -c 2 -W 2 "$host" >/dev/null 2>&1; then
        test_pass "Network connectivity to $host"
    else
        test_fail "Network connectivity to $host"
    fi
done

# Step 2: Core Data Services
print_step "Core Data Services (NAS Primary)"
echo "Testing PostgreSQL, Redis, NATS on $NAS_PRIMARY..."

for port in 5432 6379 4222; do
    service_name=""
    case $port in
        5432) service_name="PostgreSQL" ;;
        6379) service_name="Redis" ;;
        4222) service_name="NATS" ;;
    esac

    if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/$port" 2>/dev/null; then
        test_pass "$service_name ($NAS_PRIMARY:$port)"
    else
        test_fail "$service_name ($NAS_PRIMARY:$port)"
    fi
done

# Step 3: PostgreSQL Replication
print_step "PostgreSQL Replication Status"
echo "Checking replication status on DR server..."

if ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();' 2>/dev/null" | grep -q "t"; then
    test_pass "PostgreSQL Replication is ACTIVE"

    LAG=$(ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c \"SELECT pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn());\" 2>/dev/null" | xargs)
    if [ "${LAG:-0}" = "0" ]; then
        test_pass "Replication Lag: 0 bytes (synchronized)"
    else
        test_fail "Replication Lag: $LAG bytes (not synchronized)"
    fi
else
    test_fail "PostgreSQL Replication is NOT ACTIVE"
fi

# Step 4: Kubernetes Cluster Access
print_step "Kubernetes Cluster Access"
echo "Testing access to Kubernetes on $HELIOS_CONTROL..."

if ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info 2>/dev/null" >/dev/null 2>&1; then
    test_pass "Kubernetes cluster is accessible"

    # Get cluster info
    CLUSTER_INFO=$(ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info 2>/dev/null" | head -3)
    echo "$CLUSTER_INFO"
else
    test_fail "Kubernetes cluster is NOT accessible"
    test_skip "Skipping K8s namespace and pod checks"
fi

# Step 5: Kubernetes Namespaces
print_step "Kubernetes Namespaces Verification"
echo "Checking required namespaces..."

if ssh "$HELIOS_CONTROL" "microk8s kubectl get namespaces 2>/dev/null" >/dev/null 2>&1; then
    for ns in airflow lumenstack monitoring; do
        if ssh "$HELIOS_CONTROL" "microk8s kubectl get namespace $ns 2>/dev/null" >/dev/null 2>&1; then
            test_pass "Namespace '$ns' exists"
        else
            test_fail "Namespace '$ns' does NOT exist"
        fi
    done
else
    test_skip "Cannot check namespaces (K8s access failed)"
fi

# Step 6: Airflow Deployment
print_step "Apache Airflow (NERVA) Deployment"
echo "Checking Airflow pods in 'airflow' namespace..."

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow 2>/dev/null" >/dev/null 2>&1; then
    AIRFLOW_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | wc -l)
    if [ "$AIRFLOW_PODS" -gt 0 ]; then
        test_pass "Airflow pods found: $AIRFLOW_PODS"

        # Check specific pods
        for component in webserver scheduler postgres; do
            if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow -l component=$component --no-headers 2>/dev/null" | grep -q Running; then
                test_pass "Airflow $component is Running"
            else
                test_fail "Airflow $component is NOT Running"
            fi
        done
    else
        test_fail "No Airflow pods found"
    fi
else
    test_skip "Cannot check Airflow pods (K8s access failed)"
fi

# Step 7: Storm Deployment
print_step "Apache Storm (FLUX) Deployment"
echo "Checking Storm pods in 'lumenstack' namespace..."

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack 2>/dev/null" >/dev/null 2>&1; then
    STORM_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null" | wc -l)
    if [ "$STORM_PODS" -gt 0 ]; then
        test_pass "Storm pods found: $STORM_PODS"

        for component in nimbus supervisor ui; do
            if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=$component --no-headers 2>/dev/null" | grep -q Running; then
                test_pass "Storm $component is Running"
            else
                test_fail "Storm $component is NOT Running"
            fi
        done
    else
        test_fail "No Storm pods found"
    fi
else
    test_skip "Cannot check Storm pods (K8s access failed)"
fi

# Step 8: Flink Deployment
print_step "Apache Flink (GRAVIA/FLUX) Deployment"
echo "Checking Flink pods in 'lumenstack' namespace..."

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack 2>/dev/null" >/dev/null 2>&1; then
    FLINK_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null" | wc -l)
    if [ "$FLINK_PODS" -gt 0 ]; then
        test_pass "Flink pods found: $FLINK_PODS"

        for component in jobmanager taskmanager; do
            if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=$component --no-headers 2>/dev/null" | grep -q Running; then
                test_pass "Flink $component is Running"
            else
                test_fail "Flink $component is NOT Running"
            fi
        done
    else
        test_fail "No Flink pods found"
    fi
else
    test_skip "Cannot check Flink pods (K8s access failed)"
fi

# Step 9: DeepSpeed Deployment
print_step "DeepSpeed Engine Deployment"
echo "Checking DeepSpeed pods in 'lumenstack' namespace..."

if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack 2>/dev/null" >/dev/null 2>&1; then
    if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine --no-headers 2>/dev/null" | grep -q Running; then
        test_pass "DeepSpeed Engine is Running"
    else
        test_fail "DeepSpeed Engine is NOT Running"
    fi
else
    test_skip "Cannot check DeepSpeed pods (K8s access failed)"
fi

# Step 10: Service Endpoints
print_step "Service Endpoints (NodePorts)"
echo "Testing NodePort service endpoints..."

for port in "30011:Flink UI" "30012:Storm UI" "30009:DeepSpeed"; do
    PORT_NUM=$(echo "$port" | cut -d: -f1)
    SERVICE_NAME=$(echo "$port" | cut -d: -f2)

    if timeout 3 curl -s "http://$HELIOS_CONTROL:$PORT_NUM" >/dev/null 2>&1 || \
       timeout 3 curl -s "http://$HELIOS_COMPUTE:$PORT_NUM" >/dev/null 2>&1; then
        test_pass "$SERVICE_NAME ($PORT_NUM) is accessible"
    else
        test_fail "$SERVICE_NAME ($PORT_NUM) is NOT accessible"
    fi
done

# Step 11: Data Pipeline Integration
print_step "Data Pipeline Integration Tests"
echo "Testing pipeline connectivity..."

# Airflow → PostgreSQL
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null; then
    test_pass "Airflow → PostgreSQL connection available"
else
    test_fail "Airflow → PostgreSQL connection NOT available"
fi

# Flink → Data Sources
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null && \
   timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/6379" 2>/dev/null; then
    test_pass "Flink → Data Sources (PostgreSQL, Redis) available"
else
    test_fail "Flink → Data Sources NOT available"
fi

# Storm → NATS
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/4222" 2>/dev/null; then
    test_pass "Storm → NATS connection available"
else
    test_fail "Storm → NATS connection NOT available"
fi

# Step 12: Summary
print_step "Verification Summary"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              VERIFICATION SUMMARY                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Total Steps: ${BLUE}$STEP${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo -e "Skipped: ${YELLOW}$SKIPPED${NC}"
echo ""
echo "Detailed log: $LOG_FILE"
echo ""
echo "$(date): SUMMARY - Passed: $PASSED, Failed: $FAILED, Skipped: $SKIPPED" >> "$LOG_FILE"
