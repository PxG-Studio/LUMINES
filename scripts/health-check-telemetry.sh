#!/bin/bash
# Comprehensive Health Check for Telemetry Stack
# Checks: Airflow, Storm, Flink, DeepSpeed health and connectivity

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

HEALTHY=0
UNHEALTHY=0
UNKNOWN=0

print_section() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
}

check_healthy() {
    echo -e "${GREEN}✓ $1${NC}"
    HEALTHY=$((HEALTHY + 1))
}

check_unhealthy() {
    echo -e "${RED}✗ $1${NC}"
    UNHEALTHY=$((UNHEALTHY + 1))
}

check_unknown() {
    echo -e "${YELLOW}⚠ $1${NC}"
    UNKNOWN=$((UNKNOWN + 1))
}

# Check Kubernetes cluster
print_section "Kubernetes Cluster Health"

if ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info" >/dev/null 2>&1; then
    check_healthy "Kubernetes cluster is accessible"
    CLUSTER_NODES=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get nodes --no-headers 2>/dev/null" | wc -l)
    echo "  Nodes: $CLUSTER_NODES"
else
    check_unhealthy "Kubernetes cluster is NOT accessible"
fi

# Check Airflow Health
print_section "Apache Airflow (NERVA) Health"

# Check pods
AIRFLOW_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | wc -l)
if [ "$AIRFLOW_PODS" -gt 0 ]; then
    RUNNING_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | grep -c Running || echo "0")
    TOTAL_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | wc -l)

    if [ "$RUNNING_PODS" -eq "$TOTAL_PODS" ] && [ "$TOTAL_PODS" -gt 0 ]; then
        check_healthy "Airflow pods: $RUNNING_PODS/$TOTAL_PODS Running"
    else
        check_unhealthy "Airflow pods: $RUNNING_PODS/$TOTAL_PODS Running (expected all)"
    fi

    # Check specific components
    for component in webserver scheduler postgres; do
        if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow -l component=$component --no-headers 2>/dev/null" | grep -q Running; then
            check_healthy "Airflow $component is Running"
        else
            check_unhealthy "Airflow $component is NOT Running"
        fi
    done
else
    check_unknown "No Airflow pods found"
fi

# Check Airflow service
if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n airflow airflow-webserver" >/dev/null 2>&1; then
    check_healthy "Airflow webserver service exists"
else
    check_unhealthy "Airflow webserver service NOT found"
fi

# Check Storm Health
print_section "Apache Storm (FLUX) Health"

STORM_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null" | wc -l)
if [ "$STORM_PODS" -gt 0 ]; then
    RUNNING_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null" | grep -c Running || echo "0")
    TOTAL_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null" | wc -l)

    if [ "$RUNNING_PODS" -eq "$TOTAL_PODS" ] && [ "$TOTAL_PODS" -gt 0 ]; then
        check_healthy "Storm pods: $RUNNING_PODS/$TOTAL_PODS Running"
    else
        check_unhealthy "Storm pods: $RUNNING_PODS/$TOTAL_PODS Running (expected all)"
    fi

    # Check components
    for component in nimbus supervisor ui; do
        if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=$component --no-headers 2>/dev/null" | grep -q Running; then
            check_healthy "Storm $component is Running"
        else
            check_unhealthy "Storm $component is NOT Running"
        fi
    done
else
    check_unknown "No Storm pods found"
fi

# Check Storm UI service
if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack storm-ui" >/dev/null 2>&1; then
    check_healthy "Storm UI service exists"
    NODEPORT=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack storm-ui -o jsonpath='{.spec.ports[0].nodePort}'" 2>/dev/null)
    if [ -n "$NODEPORT" ]; then
        echo "  NodePort: $NODEPORT"
    fi
else
    check_unhealthy "Storm UI service NOT found"
fi

# Check Flink Health
print_section "Apache Flink (GRAVIA/FLUX) Health"

FLINK_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null" | wc -l)
if [ "$FLINK_PODS" -gt 0 ]; then
    RUNNING_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null" | grep -c Running || echo "0")
    TOTAL_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null" | wc -l)

    if [ "$RUNNING_PODS" -eq "$TOTAL_PODS" ] && [ "$TOTAL_PODS" -gt 0 ]; then
        check_healthy "Flink pods: $RUNNING_PODS/$TOTAL_PODS Running"
    else
        check_unhealthy "Flink pods: $RUNNING_PODS/$TOTAL_PODS Running (expected all)"
    fi

    # Check components
    for component in jobmanager taskmanager; do
        if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l component=$component --no-headers 2>/dev/null" | grep -q Running; then
            check_healthy "Flink $component is Running"
        else
            check_unhealthy "Flink $component is NOT Running"
        fi
    done
else
    check_unknown "No Flink pods found"
fi

# Check Flink UI service
if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack flink-jobmanager-webui" >/dev/null 2>&1; then
    check_healthy "Flink UI service exists"
    NODEPORT=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack flink-jobmanager-webui -o jsonpath='{.spec.ports[0].nodePort}'" 2>/dev/null)
    if [ -n "$NODEPORT" ]; then
        echo "  NodePort: $NODEPORT"
    fi
else
    check_unhealthy "Flink UI service NOT found"
fi

# Check DeepSpeed Health
print_section "DeepSpeed Engine Health"

DEEPSPEED_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine --no-headers 2>/dev/null" | wc -l)
if [ "$DEEPSPEED_PODS" -gt 0 ]; then
    if ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine --no-headers 2>/dev/null" | grep -q Running; then
        check_healthy "DeepSpeed engine is Running"
    else
        check_unhealthy "DeepSpeed engine is NOT Running"
    fi
else
    check_unknown "No DeepSpeed pods found"
fi

# Check DeepSpeed service
if ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack deepspeed-engine" >/dev/null 2>&1; then
    check_healthy "DeepSpeed service exists"
    NODEPORT=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get svc -n lumenstack deepspeed-engine -o jsonpath='{.spec.ports[0].nodePort}'" 2>/dev/null)
    if [ -n "$NODEPORT" ]; then
        echo "  NodePort: $NODEPORT"
    fi
else
    check_unhealthy "DeepSpeed service NOT found"
fi

# Check Data Pipeline Connectivity
print_section "Data Pipeline Connectivity"

# Airflow → PostgreSQL
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null; then
    check_healthy "Airflow → PostgreSQL connection available"
else
    check_unhealthy "Airflow → PostgreSQL connection NOT available"
fi

# Flink → Data Sources
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null && \
   timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/6379" 2>/dev/null; then
    check_healthy "Flink → Data Sources (PostgreSQL, Redis) available"
else
    check_unhealthy "Flink → Data Sources NOT available"
fi

# Storm → NATS
if timeout 3 bash -c "echo > /dev/tcp/$NAS_PRIMARY/4222" 2>/dev/null; then
    check_healthy "Storm → NATS connection available"
else
    check_unhealthy "Storm → NATS connection NOT available"
fi

# Summary
print_section "Health Check Summary"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              HEALTH CHECK SUMMARY                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Healthy: ${GREEN}$HEALTHY${NC}"
echo -e "Unhealthy: ${RED}$UNHEALTHY${NC}"
echo -e "Unknown: ${YELLOW}$UNKNOWN${NC}"
echo ""

if [ $UNHEALTHY -eq 0 ] && [ $UNKNOWN -eq 0 ]; then
    echo -e "${GREEN}✓ All systems healthy!${NC}"
    exit 0
elif [ $UNHEALTHY -gt 0 ]; then
    echo -e "${RED}✗ Some systems are unhealthy${NC}"
    exit 1
else
    echo -e "${YELLOW}⚠ Some systems status unknown${NC}"
    exit 2
fi
