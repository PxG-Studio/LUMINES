#!/bin/bash
# verify-production-readiness.sh
# Comprehensive Production Readiness Verification Script

set -e

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
PASSED=0
FAILED=0

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Production Readiness Verification                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to check service
check_service() {
  local host=$1
  local port=$2
  local service=$3

  if nc -zv $host $port 2>&1 | grep -q succeeded; then
    echo "✅ $service on $host:$port - UP"
    ((PASSED++))
    return 0
  else
    echo "❌ $service on $host:$port - DOWN"
    ((FAILED++))
    return 1
  fi
}

# Function to check database
check_database() {
  local host=$1
  local service=$2

  if psql -h $host -U wissil -d wissil -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ $service on $host - UP"
    ((PASSED++))
    return 0
  else
    echo "❌ $service on $host - DOWN"
    ((FAILED++))
    return 1
  fi
}

# Network Connectivity
echo "=== Network Connectivity ==="
ping -c 2 $PRIMARY_IP > /dev/null 2>&1 && echo "✅ Primary server ($PRIMARY_IP) reachable" && ((PASSED++)) || echo "❌ Primary server unreachable" && ((FAILED++))
ping -c 2 $SECONDARY_IP > /dev/null 2>&1 && echo "✅ Secondary server ($SECONDARY_IP) reachable" && ((PASSED++)) || echo "❌ Secondary server unreachable" && ((FAILED++))

echo ""
echo "=== Primary Server (192.168.86.27) Services ==="
check_service $PRIMARY_IP 5432 "PostgreSQL"
check_service $PRIMARY_IP 6379 "Redis"
check_service $PRIMARY_IP 4222 "NATS"
check_service $PRIMARY_IP 5000 "Container Registry"

echo ""
echo "=== Secondary Server (192.168.86.28) Services ==="
check_service $SECONDARY_IP 5432 "PostgreSQL Replica"
check_service $SECONDARY_IP 26379 "Redis Sentinel"
check_service $SECONDARY_IP 4222 "NATS Cluster"
check_service $SECONDARY_IP 5000 "Registry Mirror"

echo ""
echo "=== Database Connectivity ==="
check_database $PRIMARY_IP "PostgreSQL Primary"
check_database $SECONDARY_IP "PostgreSQL Replica"

echo ""
echo "=== Replication Status ==="
if psql -h $PRIMARY_IP -U postgres -c "SELECT * FROM pg_stat_replication;" 2>/dev/null | grep -q $SECONDARY_IP; then
  echo "✅ PostgreSQL replication active"
  ((PASSED++))
else
  echo "❌ PostgreSQL replication not active"
  ((FAILED++))
fi

echo ""
echo "=== Redis Sentinel Status ==="
if redis-cli -h $SECONDARY_IP -p 26379 SENTINEL masters > /dev/null 2>&1; then
  echo "✅ Redis Sentinel monitoring active"
  ((PASSED++))
else
  echo "❌ Redis Sentinel not monitoring"
  ((FAILED++))
fi

echo ""
echo "=== NATS Cluster Status ==="
if curl -s http://$PRIMARY_IP:8222/varz 2>/dev/null | grep -q cluster; then
  echo "✅ NATS cluster configured on primary"
  ((PASSED++))
else
  echo "❌ NATS cluster not configured on primary"
  ((FAILED++))
fi

if curl -s http://$SECONDARY_IP:8222/varz 2>/dev/null | grep -q cluster; then
  echo "✅ NATS cluster configured on secondary"
  ((PASSED++))
else
  echo "❌ NATS cluster not configured on secondary"
  ((FAILED++))
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Verification Summary                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All checks passed! System is production ready."
  exit 0
else
  echo "⚠️  Some checks failed. Please review and fix issues before production deployment."
  exit 1
fi
