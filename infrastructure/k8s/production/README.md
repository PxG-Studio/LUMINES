# Kubernetes Production Manifests

**Purpose:** Kubernetes deployment configurations for LUMINES/WIS2L services

## Structure

```
manifests/
├── namespace.yaml           # LUMINES namespace
├── configmap.yaml           # Non-sensitive configuration
├── secrets-template.yaml    # Secrets template (DO NOT commit actual secrets)
├── kustomization.yaml       # Kustomize base configuration
│
├── landing-deployment.yaml  # LANDING service deployment
├── slate-deployment.yaml    # SLATE service deployment
├── ignition-deployment.yaml # IGNITION service deployment
├── spark-deployment.yaml    # SPARK service deployment
├── ignis-deployment.yaml    # IGNIS service deployment
├── waypoint-deployment.yaml # WAYPOINT service deployment
│
├── landing-service.yaml     # LANDING service
├── slate-service.yaml       # SLATE service
├── ignition-service.yaml    # IGNITION service
├── spark-service.yaml       # SPARK service
├── ignis-service.yaml       # IGNIS service
├── waypoint-service.yaml    # WAYPOINT service
│
├── ingress.yaml             # Ingress configuration
└── hpa-landing.yaml         # Horizontal Pod Autoscaler
```

## Deployment

### Prerequisites

1. Kubernetes cluster (Helios Control + Helos Compute)
2. kubectl configured
3. Secrets generated

### Generate Secrets

```bash
# Set environment variables first
export DATABASE_PASSWORD=your_actual_password
export REDIS_PASSWORD=your_actual_password
# ... etc

# Generate secrets
./scripts/generate-secrets.sh
```

### Apply Manifests

```bash
# Apply all manifests
kubectl apply -k infrastructure/k8s/production/manifests/

# Or apply individually
kubectl apply -f infrastructure/k8s/production/manifests/namespace.yaml
kubectl apply -f infrastructure/k8s/production/manifests/configmap.yaml
kubectl apply -f infrastructure/k8s/production/manifests/secrets-generated.yaml
# ... etc
```

## TODO: Future Enhancements

- [ ] Create dev/staging overlays using Kustomize
- [ ] Add HPA for all services (currently only landing)
- [ ] Add PodDisruptionBudgets
- [ ] Add NetworkPolicies
- [ ] Add ServiceMonitor for Prometheus
- [ ] Configure proper SSL/TLS certificates
- [ ] Set up backup/restore procedures

