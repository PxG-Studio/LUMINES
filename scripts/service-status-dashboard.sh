#!/bin/bash
# Service Status Dashboard
# Real-time status of all WISSIL infrastructure services

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

HELIOS_CONTROL="192.168.86.114"
HELIOS_COMPUTE="192.168.86.115"
NAS_PRIMARY="192.168.86.27"
NAS_SECONDARY="192.168.86.28"

clear
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║     WISSIL Infrastructure - Service Status Dashboard     ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Last Updated: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo ""

# Network Connectivity
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Network Connectivity${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

for host in "$HELIOS_CONTROL" "$HELIOS_COMPUTE" "$NAS_PRIMARY" "$NAS_SECONDARY"; do
    if ping -c 1 -W 2 "$host" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ $host${NC} - Online"
    else
        echo -e "${RED}✗ $host${NC} - Offline"
    fi
done

# Core Data Services
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Core Data Services (NAS Primary)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

for port in "5432:PostgreSQL" "6379:Redis" "4222:NATS"; do
    PORT_NUM=$(echo "$port" | cut -d: -f1)
    SERVICE_NAME=$(echo "$port" | cut -d: -f2)
    if timeout 2 bash -c "echo > /dev/tcp/$NAS_PRIMARY/$PORT_NUM" 2>/dev/null; then
        echo -e "${GREEN}✓ $SERVICE_NAME${NC} ($NAS_PRIMARY:$PORT_NUM) - Running"
    else
        echo -e "${RED}✗ $SERVICE_NAME${NC} ($NAS_PRIMARY:$PORT_NUM) - Not Running"
    fi
done

# PostgreSQL Replication
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PostgreSQL Replication${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();' 2>/dev/null" | grep -q "t"; then
    echo -e "${GREEN}✓ Replication Status${NC} - ACTIVE"

    LAG=$(ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c \"SELECT pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn());\" 2>/dev/null" | xargs)
    if [ "${LAG:-0}" = "0" ]; then
        echo -e "${GREEN}✓ Replication Lag${NC} - 0 bytes (synchronized)"
    else
        echo -e "${YELLOW}⚠ Replication Lag${NC} - $LAG bytes"
    fi

    RECEIVE_LSN=$(ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_last_wal_receive_lsn();' 2>/dev/null" | xargs)
    REPLAY_LSN=$(ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_last_wal_replay_lsn();' 2>/dev/null" | xargs)
    echo "  Receive LSN: $RECEIVE_LSN"
    echo "  Replay LSN:  $REPLAY_LSN"
else
    echo -e "${RED}✗ Replication Status${NC} - NOT ACTIVE"
fi

# Kubernetes Services
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Kubernetes Services${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Kubernetes Cluster${NC} - Accessible"

    # Airflow
    AIRFLOW_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | grep -c Running || echo "0")
    AIRFLOW_TOTAL=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | wc -l)
    if [ "$AIRFLOW_TOTAL" -gt 0 ]; then
        echo -e "${GREEN}✓ Airflow${NC} - $AIRFLOW_PODS/$AIRFLOW_TOTAL pods running"
    else
        echo -e "${YELLOW}⚠ Airflow${NC} - Not deployed"
    fi

    # Storm
    STORM_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null" | grep -c Running || echo "0")
    STORM_TOTAL=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm --no-headers 2>/dev/null" | wc -l)
    if [ "$STORM_TOTAL" -gt 0 ]; then
        echo -e "${GREEN}✓ Storm${NC} - $STORM_PODS/$STORM_TOTAL pods running"
    else
        echo -e "${YELLOW}⚠ Storm${NC} - Not deployed"
    fi

    # Flink
    FLINK_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null" | grep -c Running || echo "0")
    FLINK_TOTAL=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink --no-headers 2>/dev/null" | wc -l)
    if [ "$FLINK_TOTAL" -gt 0 ]; then
        echo -e "${GREEN}✓ Flink${NC} - $FLINK_PODS/$FLINK_TOTAL pods running"
    else
        echo -e "${YELLOW}⚠ Flink${NC} - Not deployed"
    fi

    # DeepSpeed
    DEEPSPEED_PODS=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine --no-headers 2>/dev/null" | grep -c Running || echo "0")
    if [ "$DEEPSPEED_PODS" -gt 0 ]; then
        echo -e "${GREEN}✓ DeepSpeed${NC} - Running"
    else
        echo -e "${YELLOW}⚠ DeepSpeed${NC} - Not deployed"
    fi
else
    echo -e "${RED}✗ Kubernetes Cluster${NC} - Not accessible"
    echo -e "${YELLOW}⚠ All K8s services${NC} - Cannot verify"
fi

# Service Endpoints
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Service Endpoints${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

for endpoint in "30011:Flink UI" "30012:Storm UI" "30009:DeepSpeed"; do
    PORT=$(echo "$endpoint" | cut -d: -f1)
    NAME=$(echo "$endpoint" | cut -d: -f2)
    if timeout 2 curl -s "http://$HELIOS_CONTROL:$PORT" >/dev/null 2>&1 || \
       timeout 2 curl -s "http://$HELIOS_COMPUTE:$PORT" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ $NAME${NC} (:$PORT) - Accessible"
    else
        echo -e "${RED}✗ $NAME${NC} (:$PORT) - Not accessible"
    fi
done

# Data Pipeline Integration
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Data Pipeline Integration${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

# Airflow → PostgreSQL
if timeout 2 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null; then
    echo -e "${GREEN}✓ Airflow → PostgreSQL${NC} - Connection available"
else
    echo -e "${RED}✗ Airflow → PostgreSQL${NC} - Connection NOT available"
fi

# Flink → Data Sources
if timeout 2 bash -c "echo > /dev/tcp/$NAS_PRIMARY/5432" 2>/dev/null && \
   timeout 2 bash -c "echo > /dev/tcp/$NAS_PRIMARY/6379" 2>/dev/null; then
    echo -e "${GREEN}✓ Flink → Data Sources${NC} - Connections available"
else
    echo -e "${RED}✗ Flink → Data Sources${NC} - Connections NOT available"
fi

# Storm → NATS
if timeout 2 bash -c "echo > /dev/tcp/$NAS_PRIMARY/4222" 2>/dev/null; then
    echo -e "${GREEN}✓ Storm → NATS${NC} - Connection available"
else
    echo -e "${RED}✗ Storm → NATS${NC} - Connection NOT available"
fi

# Summary
echo ""
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}Summary${NC}"
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Run detailed verification: bash scripts/systematic-verification.sh"
echo "Run health checks: bash scripts/health-check-telemetry.sh"
echo "Run E2E tests: bash scripts/e2e-test-luminera-complete.sh"
echo ""
echo -e "${CYAN}Press Ctrl+C to exit, or wait 30 seconds for auto-refresh...${NC}"
