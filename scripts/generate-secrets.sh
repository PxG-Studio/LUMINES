#!/bin/bash
# Generate Kubernetes Secrets for LUMINES
# DO NOT commit actual secrets to git

set -e

echo "🔐 Generating Kubernetes Secrets for LUMINES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create namespace if it doesn't exist
kubectl create namespace lumines --dry-run=client -o yaml | kubectl apply -f -

# Generate secrets
kubectl create secret generic lumines-secrets \
  --namespace=lumines \
  --from-literal=database-url="${DATABASE_URL:-postgresql://user:password@192.168.86.27:5432/lumines}" \
  --from-literal=database-user="${DATABASE_USER:-lumines}" \
  --from-literal=database-password="${DATABASE_PASSWORD:-changeme}" \
  --from-literal=redis-url="${REDIS_URL:-redis://192.168.86.27:6379/0}" \
  --from-literal=redis-password="${REDIS_PASSWORD:-}" \
  --from-literal=nats-url="${NATS_URL:-nats://192.168.86.27:4222}" \
  --from-literal=nats-user="${NATS_USER:-}" \
  --from-literal=nats-password="${NATS_PASSWORD:-}" \
  --from-literal=nocturna-jwt-secret="${NOCTURNA_JWT_SECRET:-changeme}" \
  --from-literal=spark-ai-api-key="${SPARK_AI_API_KEY:-}" \
  --from-literal=spark-anthropic-api-key="${SPARK_ANTHROPIC_API_KEY:-}" \
  --from-literal=registry-user="${REGISTRY_USER:-}" \
  --from-literal=registry-password="${REGISTRY_PASSWORD:-}" \
  --dry-run=client -o yaml > infrastructure/k8s/production/manifests/secrets-generated.yaml

echo ""
echo "✅ Secrets template generated: infrastructure/k8s/production/manifests/secrets-generated.yaml"
echo ""
echo "⚠️  WARNING: Review and update secrets before applying!"
echo "⚠️  DO NOT commit actual secrets to git!"
echo ""
echo "To apply secrets:"
echo "  kubectl apply -f infrastructure/k8s/production/manifests/secrets-generated.yaml"

