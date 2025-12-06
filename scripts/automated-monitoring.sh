#!/bin/bash
# Automated Monitoring Script
# Continuous monitoring with alerting and logging

set -e

# Configuration
HELIOS_CONTROL="192.168.86.114"
HELIOS_COMPUTE="192.168.86.115"
NAS_PRIMARY="192.168.86.27"
NAS_SECONDARY="192.168.86.28"

MONITOR_INTERVAL=60  # seconds
LOG_FILE="/tmp/wissil-monitoring-$(date +%Y%m%d).log"
ALERT_FILE="/tmp/wissil-alerts-$(date +%Y%m%d).log"

# Initialize logs
echo "=== WISSIL Monitoring Started: $(date) ===" >> "$LOG_FILE"
echo "=== WISSIL Alerts: $(date) ===" > "$ALERT_FILE"

check_service() {
    local name=$1
    local host=$2
    local port=$3

    if timeout 2 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; then
        echo "$(date): ✓ $name ($host:$port) - OK" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): ✗ $name ($host:$port) - FAILED" >> "$LOG_FILE"
        echo "$(date): ALERT - $name ($host:$port) is DOWN" >> "$ALERT_FILE"
        return 1
    fi
}

check_replication() {
    if ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c 'SELECT pg_is_in_recovery();' 2>/dev/null" | grep -q "t"; then
        LAG=$(ssh "$HELIOS_COMPUTE" "sudo docker exec postgresql-dr psql -U postgres -t -c \"SELECT pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn());\" 2>/dev/null" | xargs)
        if [ "${LAG:-0}" != "0" ]; then
            echo "$(date): ALERT - PostgreSQL replication lag: $LAG bytes" >> "$ALERT_FILE"
        fi
        echo "$(date): ✓ PostgreSQL Replication - Active (lag: ${LAG:-0} bytes)" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): ALERT - PostgreSQL replication is NOT active" >> "$ALERT_FILE"
        echo "$(date): ✗ PostgreSQL Replication - NOT Active" >> "$LOG_FILE"
        return 1
    fi
}

monitor_loop() {
    while true; do
        echo ""
        echo "=== Monitoring Check: $(date) ==="

        # Network connectivity
        for host in "$HELIOS_CONTROL" "$HELIOS_COMPUTE" "$NAS_PRIMARY" "$NAS_SECONDARY"; do
            if ! ping -c 1 -W 2 "$host" >/dev/null 2>&1; then
                echo "$(date): ALERT - $host is unreachable" >> "$ALERT_FILE"
            fi
        done

        # Core services
        check_service "PostgreSQL" "$NAS_PRIMARY" "5432"
        check_service "Redis" "$NAS_PRIMARY" "6379"
        check_service "NATS" "$NAS_PRIMARY" "4222"

        # Replication
        check_replication

        # Kubernetes services (if accessible)
        if ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info" >/dev/null 2>&1; then
            # Check Airflow
            AIRFLOW_RUNNING=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | grep -c Running || echo "0")
            AIRFLOW_TOTAL=$(ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow --no-headers 2>/dev/null" | wc -l)
            if [ "$AIRFLOW_TOTAL" -gt 0 ] && [ "$AIRFLOW_RUNNING" -lt "$AIRFLOW_TOTAL" ]; then
                echo "$(date): ALERT - Airflow: $AIRFLOW_RUNNING/$AIRFLOW_TOTAL pods running" >> "$ALERT_FILE"
            fi
        fi

        # Check for alerts
        if [ -s "$ALERT_FILE" ]; then
            RECENT_ALERTS=$(tail -5 "$ALERT_FILE" | grep "$(date +%Y-%m-%d)" | wc -l)
            if [ "$RECENT_ALERTS" -gt 0 ]; then
                echo "⚠️  Recent alerts detected. Check: $ALERT_FILE"
            fi
        fi

        echo "Next check in $MONITOR_INTERVAL seconds..."
        sleep "$MONITOR_INTERVAL"
    done
}

# Run monitoring
echo "Starting WISSIL infrastructure monitoring..."
echo "Monitoring interval: $MONITOR_INTERVAL seconds"
echo "Log file: $LOG_FILE"
echo "Alert file: $ALERT_FILE"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""

monitor_loop
