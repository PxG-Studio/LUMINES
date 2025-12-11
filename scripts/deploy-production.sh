#!/bin/bash
# Production Deployment Script
# Usage: ./scripts/deploy-production.sh [environment]

set -e

ENVIRONMENT="${1:-production}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Pre-deployment validation
validate_pre_deployment() {
    log_info "Running pre-deployment validation..."

    # Check if validation script exists
    if [ -f "$SCRIPT_DIR/validate-production.sh" ]; then
        "$SCRIPT_DIR/validate-production.sh" || {
            log_error "Pre-deployment validation failed"
            exit 1
        }
    else
        log_warn "Validation script not found, skipping..."
    fi

    # Check environment variables
    if [ -z "$DATABASE_URL" ] && [ -z "$DATABASE_HOST" ]; then
        log_error "DATABASE_URL or DATABASE_HOST must be set"
        exit 1
    fi

    if [ -z "$NOCTURNA_JWT_SECRET" ]; then
        log_error "NOCTURNA_JWT_SECRET must be set"
        exit 1
    fi

    log_info "Pre-deployment validation passed"
}

# Build application
build_application() {
    log_info "Building application..."

    cd "$PROJECT_ROOT"

    # Install dependencies
    log_info "Installing dependencies..."
    npm ci

    # Run tests
    log_info "Running tests..."
    npm run test || {
        log_warn "Some tests failed, continuing..."
    }

    # Build application
    log_info "Building application..."
    npm run build || {
        log_error "Build failed"
        exit 1
    }

    log_info "Application built successfully"
}

# Deploy with Docker Compose
deploy_docker_compose() {
    log_info "Deploying with Docker Compose..."

    cd "$PROJECT_ROOT"

    # Build image
    log_info "Building Docker image..."
    docker-compose build lumines-web || {
        log_error "Docker build failed"
        exit 1
    }

    # Deploy
    log_info "Starting services..."
    docker-compose up -d --no-deps lumines-web || {
        log_error "Docker deployment failed"
        exit 1
    }

    log_info "Docker deployment complete"
}

# Deploy with Kubernetes
deploy_kubernetes() {
    log_info "Deploying with Kubernetes..."

    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found"
        exit 1
    fi

    # Apply manifests
    log_info "Applying Kubernetes manifests..."
    kubectl apply -f "$PROJECT_ROOT/infrastructure/k8s/production/manifests/" || {
        log_error "Kubernetes deployment failed"
        exit 1
    }

    # Wait for rollout
    log_info "Waiting for rollout..."
    kubectl rollout status deployment/lumines-web -n lumines || {
        log_error "Rollout failed"
        exit 1
    }

    log_info "Kubernetes deployment complete"
}

# Post-deployment verification
verify_deployment() {
    log_info "Verifying deployment..."

    # Wait for service to be ready
    log_info "Waiting for service to be ready..."
    sleep 10

    # Health check
    if [ -f "$SCRIPT_DIR/verify-deployment.sh" ]; then
        "$SCRIPT_DIR/verify-deployment.sh" || {
            log_error "Deployment verification failed"
            exit 1
        }
    else
        log_warn "Verification script not found, performing basic checks..."

        # Basic health check
        HEALTH_URL="http://localhost:3000/api/health"
        if command -v curl &> /dev/null; then
            for i in {1..30}; do
                if curl -f -s "$HEALTH_URL" > /dev/null; then
                    log_info "Health check passed"
                    break
                fi
                if [ $i -eq 30 ]; then
                    log_error "Health check failed after 30 attempts"
                    exit 1
                fi
                sleep 2
            done
        else
            log_warn "curl not found, skipping health check"
        fi
    fi

    log_info "Deployment verification complete"
}

# Main deployment function
main() {
    log_info "Starting production deployment..."
    log_info "Environment: $ENVIRONMENT"

    # Pre-deployment checks
    validate_pre_deployment

    # Build application
    build_application

    # Determine deployment method
    if [ -f "$PROJECT_ROOT/docker-compose.yml" ]; then
        deploy_docker_compose
    elif [ -d "$PROJECT_ROOT/infrastructure/k8s/production" ]; then
        deploy_kubernetes
    else
        log_error "No deployment configuration found"
        exit 1
    fi

    # Post-deployment verification
    verify_deployment

    log_info "✅ Production deployment complete!"
}

# Run main function
main "$@"

