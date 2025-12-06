#!/bin/bash
# Monitoring Infrastructure Deployment Script
# Deploys Prometheus, Grafana, and Alertmanager

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_section() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"
}

cd "$PROJECT_ROOT"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Monitoring Infrastructure Deployment                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

DEPLOYMENT_METHOD="${1:-docker}"

log_section "Deployment Method: $DEPLOYMENT_METHOD"

if [ "$DEPLOYMENT_METHOD" = "docker" ]; then
    # Docker Compose deployment
    log_info "Deploying with Docker Compose..."
    
    if [ ! -f "docker-compose.monitoring.yml" ]; then
        log_error "docker-compose.monitoring.yml not found"
        log_info "Creating docker-compose.monitoring.yml..."
        
        cat > docker-compose.monitoring.yml << 'EOF'
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./infrastructure/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./infrastructure/monitoring/alerts:/etc/prometheus/alerts
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    networks:
      - monitoring-network

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./infrastructure/monitoring/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    networks:
      - monitoring-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./infrastructure/monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./infrastructure/monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - monitoring-network
    depends_on:
      - prometheus

volumes:
  prometheus-data:
  alertmanager-data:
  grafana-data:

networks:
  monitoring-network:
    driver: bridge
EOF
        log_info "Created docker-compose.monitoring.yml"
    fi
    
    # Deploy
    log_info "Starting monitoring services..."
    docker-compose -f docker-compose.monitoring.yml up -d
    
    log_info "✅ Monitoring services deployed"
    log_info ""
    log_info "Access:"
    log_info "  Prometheus: http://localhost:9090"
    log_info "  Grafana: http://localhost:3001 (admin/admin)"
    log_info "  Alertmanager: http://localhost:9093"
    
elif [ "$DEPLOYMENT_METHOD" = "kubernetes" ]; then
    # Kubernetes deployment
    log_info "Deploying with Kubernetes..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found"
        exit 1
    fi
    
    # Create namespace
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy Prometheus
    if [ -f "infrastructure/monitoring/prometheus/prometheus-deployment.yaml" ]; then
        kubectl apply -f infrastructure/monitoring/prometheus/
    else
        log_warn "Prometheus Kubernetes manifests not found, skipping..."
    fi
    
    # Deploy Grafana
    if [ -f "infrastructure/monitoring/grafana/grafana-deployment.yaml" ]; then
        kubectl apply -f infrastructure/monitoring/grafana/
    else
        log_warn "Grafana Kubernetes manifests not found, skipping..."
    fi
    
    log_info "✅ Monitoring services deployed to Kubernetes"
    log_info ""
    log_info "Check status:"
    log_info "  kubectl get pods -n monitoring"
    
else
    log_error "Invalid deployment method: $DEPLOYMENT_METHOD"
    log_info "Usage: $0 [docker|kubernetes]"
    exit 1
fi

log_section "Verification"

# Wait for services to be ready
log_info "Waiting for services to be ready..."
sleep 10

# Check Prometheus
if command -v curl &> /dev/null; then
    if curl -f -s http://localhost:9090/api/v1/status/config > /dev/null 2>&1; then
        log_info "✅ Prometheus is running"
    else
        log_warn "⚠️  Prometheus health check failed"
    fi
    
    # Check Grafana
    if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
        log_info "✅ Grafana is running"
    else
        log_warn "⚠️  Grafana health check failed"
    fi
else
    log_warn "curl not found, skipping health checks"
fi

log_info ""
log_info "✅ Monitoring infrastructure deployment complete!"
log_info ""
log_info "Next steps:"
log_info "  1. Configure Grafana data sources"
log_info "  2. Import dashboards"
log_info "  3. Configure alert notification channels"
log_info "  4. Review: docs/MONITORING_SETUP.md"

