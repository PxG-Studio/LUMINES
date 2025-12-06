#!/bin/bash
# Comprehensive Telemetry Stack Deployment Script
# Deploys: Airflow, Storm, Flink, DeepSpeed based on LUMINERA configurations

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
LUMINERA_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"
LOCAL_LUMINERA_PATH="/home/cursor-dev/Documents/Luminera/infrastructure/k8s/production"

LOG_FILE="/tmp/telemetry-deployment-$(date +%Y%m%d-%H%M%S).log"
echo "Telemetry Stack Deployment Log - $(date)" > "$LOG_FILE"

DEPLOYED=0
FAILED=0
SKIPPED=0

print_step() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo "$(date): $1" >> "$LOG_FILE"
}

deploy_success() {
    echo -e "${GREEN}✓ $1${NC}"
    echo "$(date): SUCCESS: $1" >> "$LOG_FILE"
    DEPLOYED=$((DEPLOYED + 1))
}

deploy_fail() {
    echo -e "${RED}✗ $1${NC}"
    echo "$(date): FAILED: $1" >> "$LOG_FILE"
    FAILED=$((FAILED + 1))
}

deploy_skip() {
    echo -e "${YELLOW}⚠ $1${NC}"
    echo "$(date): SKIPPED: $1" >> "$LOG_FILE"
    SKIPPED=$((SKIPPED + 1))
}

# Check prerequisites
print_step "Prerequisites Check"

echo "Checking SSH access to Helios Control..."
if ssh -o ConnectTimeout=5 "$HELIOS_CONTROL" "hostname" >/dev/null 2>&1; then
    deploy_success "SSH access to Helios Control"
else
    deploy_fail "SSH access to Helios Control - Cannot proceed"
    echo ""
    echo "Please set up SSH access first:"
    echo "  ssh-keygen -t ed25519"
    echo "  ssh-copy-id user@$HELIOS_CONTROL"
    exit 1
fi

echo "Checking Kubernetes cluster..."
if ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info" >/dev/null 2>&1; then
    deploy_success "Kubernetes cluster accessible"
    CLUSTER_INFO=$(ssh "$HELIOS_CONTROL" "microk8s kubectl cluster-info" 2>/dev/null | head -1)
    echo "  $CLUSTER_INFO"
else
    deploy_fail "Kubernetes cluster not accessible"
    exit 1
fi

echo "Checking LUMINERA configuration files..."
if [ -d "$LOCAL_LUMINERA_PATH" ]; then
    deploy_success "LUMINERA configuration directory found"
else
    deploy_fail "LUMINERA configuration directory not found: $LOCAL_LUMINERA_PATH"
    exit 1
fi

# Create namespaces
print_step "Creating Kubernetes Namespaces"

for ns in airflow lumenstack monitoring; do
    echo "Creating namespace: $ns"
    if ssh "$HELIOS_CONTROL" "microk8s kubectl get namespace $ns" >/dev/null 2>&1; then
        deploy_skip "Namespace '$ns' already exists"
    else
        if ssh "$HELIOS_CONTROL" "microk8s kubectl create namespace $ns" 2>/dev/null; then
            deploy_success "Namespace '$ns' created"
        else
            deploy_fail "Failed to create namespace '$ns'"
        fi
    fi
done

# Deploy Apache Airflow
print_step "Deploying Apache Airflow (NERVA)"

AIRFLOW_YAML="$LOCAL_LUMINERA_PATH/airflow/airflow-optimized.yaml"
if [ -f "$AIRFLOW_YAML" ]; then
    echo "Deploying Airflow from: $AIRFLOW_YAML"

    # Copy YAML to remote if needed, or apply directly
    if ssh "$HELIOS_CONTROL" "test -f $LUMINERA_PATH/airflow/airflow-optimized.yaml" 2>/dev/null; then
        if ssh "$HELIOS_CONTROL" "cd $LUMINERA_PATH && microk8s kubectl apply -f airflow/airflow-optimized.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "Airflow deployment initiated"
            echo "  Waiting for pods to be ready..."
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow" || true
        else
            deploy_fail "Airflow deployment failed"
        fi
    else
        # Copy file to remote
        echo "  Copying Airflow YAML to remote..."
        scp "$AIRFLOW_YAML" "$HELIOS_CONTROL:/tmp/airflow-optimized.yaml" >/dev/null 2>&1
        if ssh "$HELIOS_CONTROL" "microk8s kubectl apply -f /tmp/airflow-optimized.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "Airflow deployment initiated"
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow" || true
        else
            deploy_fail "Airflow deployment failed"
        fi
    fi
else
    deploy_fail "Airflow YAML not found: $AIRFLOW_YAML"
fi

# Deploy Apache Storm
print_step "Deploying Apache Storm (FLUX)"

STORM_YAML="$LOCAL_LUMINERA_PATH/lumenstack/storm-deployment.yaml"
if [ -f "$STORM_YAML" ]; then
    echo "Deploying Storm from: $STORM_YAML"

    if ssh "$HELIOS_CONTROL" "test -f $LUMINERA_PATH/lumenstack/storm-deployment.yaml" 2>/dev/null; then
        if ssh "$HELIOS_CONTROL" "cd $LUMINERA_PATH && microk8s kubectl apply -f lumenstack/storm-deployment.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "Storm deployment initiated"
            echo "  Waiting for pods to be ready..."
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm" || true
        else
            deploy_fail "Storm deployment failed"
        fi
    else
        scp "$STORM_YAML" "$HELIOS_CONTROL:/tmp/storm-deployment.yaml" >/dev/null 2>&1
        if ssh "$HELIOS_CONTROL" "microk8s kubectl apply -f /tmp/storm-deployment.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "Storm deployment initiated"
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm" || true
        else
            deploy_fail "Storm deployment failed"
        fi
    fi
else
    deploy_fail "Storm YAML not found: $STORM_YAML"
fi

# Deploy Apache Flink
print_step "Deploying Apache Flink (GRAVIA/FLUX)"

FLINK_YAML="$LOCAL_LUMINERA_PATH/lumenstack/flink-deployment.yaml"
if [ -f "$FLINK_YAML" ]; then
    echo "Deploying Flink from: $FLINK_YAML"

    if ssh "$HELIOS_CONTROL" "test -f $LUMINERA_PATH/lumenstack/flink-deployment.yaml" 2>/dev/null; then
        if ssh "$HELIOS_CONTROL" "cd $LUMINERA_PATH && microk8s kubectl apply -f lumenstack/flink-deployment.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "Flink deployment initiated"
            echo "  Waiting for pods to be ready..."
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink" || true
        else
            deploy_fail "Flink deployment failed"
        fi
    else
        scp "$FLINK_YAML" "$HELIOS_CONTROL:/tmp/flink-deployment.yaml" >/dev/null 2>&1
        if ssh "$HELIOS_CONTROL" "microk8s kubectl apply -f /tmp/flink-deployment.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "Flink deployment initiated"
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink" || true
        else
            deploy_fail "Flink deployment failed"
        fi
    fi
else
    deploy_fail "Flink YAML not found: $FLINK_YAML"
fi

# Deploy DeepSpeed
print_step "Deploying DeepSpeed Engine"

DEEPSPEED_YAML="$LOCAL_LUMINERA_PATH/lumenstack/deepspeed-engine-complete.yaml"
if [ -f "$DEEPSPEED_YAML" ]; then
    echo "Deploying DeepSpeed from: $DEEPSPEED_YAML"

    if ssh "$HELIOS_CONTROL" "test -f $LUMINERA_PATH/lumenstack/deepspeed-engine-complete.yaml" 2>/dev/null; then
        if ssh "$HELIOS_CONTROL" "cd $LUMINERA_PATH && microk8s kubectl apply -f lumenstack/deepspeed-engine-complete.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "DeepSpeed deployment initiated"
            echo "  Waiting for pods to be ready..."
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine" || true
        else
            deploy_fail "DeepSpeed deployment failed"
        fi
    else
        scp "$DEEPSPEED_YAML" "$HELIOS_CONTROL:/tmp/deepspeed-engine-complete.yaml" >/dev/null 2>&1
        if ssh "$HELIOS_CONTROL" "microk8s kubectl apply -f /tmp/deepspeed-engine-complete.yaml" 2>&1 | tee -a "$LOG_FILE"; then
            deploy_success "DeepSpeed deployment initiated"
            sleep 10
            ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine" || true
        else
            deploy_fail "DeepSpeed deployment failed"
        fi
    fi
else
    deploy_fail "DeepSpeed YAML not found: $DEEPSPEED_YAML"
fi

# Verify deployments
print_step "Verifying Deployments"

echo "Checking pod status..."
echo ""
echo "Airflow pods:"
ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n airflow" 2>/dev/null || echo "  Cannot check Airflow pods"

echo ""
echo "Storm pods:"
ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=storm" 2>/dev/null || echo "  Cannot check Storm pods"

echo ""
echo "Flink pods:"
ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=flink" 2>/dev/null || echo "  Cannot check Flink pods"

echo ""
echo "DeepSpeed pods:"
ssh "$HELIOS_CONTROL" "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine" 2>/dev/null || echo "  Cannot check DeepSpeed pods"

# Check services
print_step "Checking Services"

echo "NodePort services:"
ssh "$HELIOS_CONTROL" "microk8s kubectl get svc --all-namespaces | grep -E '30011|30012|30009|NodePort'" 2>/dev/null || echo "  Cannot check services"

# Summary
print_step "Deployment Summary"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              DEPLOYMENT SUMMARY                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Deployed: ${GREEN}$DEPLOYED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo -e "Skipped: ${YELLOW}$SKIPPED${NC}"
echo ""
echo "Detailed log: $LOG_FILE"
echo ""
echo "Next steps:"
echo "  1. Wait for pods to be in Running state"
echo "  2. Verify services are accessible"
echo "  3. Run health checks: bash scripts/health-check-telemetry.sh"
echo "  4. Test endpoints: bash scripts/test-service-endpoints.sh"
