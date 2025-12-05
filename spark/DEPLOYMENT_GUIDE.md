# SPARK Deployment Guide

**Version:** 1.0  
**Last Updated:** 2024-12-19

---

## Overview

This guide covers the complete deployment process for the SPARK application, including infrastructure setup, configuration, and monitoring.

---

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker registry access
- SSL certificates
- OAuth provider (Google) configured
- PostgreSQL database
- Monitoring infrastructure (optional)

---

## 1. Build and Push Docker Image

```bash
# Build the image
docker build -t spark:latest .

# Tag for registry
docker tag spark:latest your-registry/spark:latest

# Push to registry
docker push your-registry/spark:latest
```

---

## 2. Configure Secrets

Create Kubernetes secrets:

```bash
kubectl create namespace spark

kubectl create secret generic spark-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=anthropic-api-key='sk-...' \
  --from-literal=openai-api-key='sk-...' \
  --from-literal=nextauth-secret='your-secret-here' \
  --from-literal=google-client-id='your-client-id' \
  --from-literal=google-client-secret='your-client-secret' \
  -n spark
```

---

## 3. Deploy Application

```bash
# Update deployment.yaml with your image registry
# Then deploy:
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

---

## 4. Configure TLS

### Option A: Ingress with TLS

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: spark-ingress
  namespace: spark
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - spark.example.com
    secretName: spark-tls
  rules:
  - host: spark.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: spark-service
            port:
              number: 80
```

### Option B: LoadBalancer with TLS

Configure TLS in your load balancer (AWS ALB, GCP LB, etc.)

---

## 5. Configure OIDC SSO

1. **Google Cloud Console:**
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
   - Enable MFA enforcement (if required)

2. **Environment Variables:**
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/callback/google
   GOOGLE_MFA_REQUIRED=true
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secret-key
   ```

---

## 6. Configure CDN

### Cloudflare

1. Add your domain to Cloudflare
2. Configure DNS records
3. Enable caching rules
4. Set environment variable: `CDN_PROVIDER=cloudflare`

### AWS CloudFront

1. Create CloudFront distribution
2. Configure origin (your LoadBalancer)
3. Set cache behaviors
4. Set environment variable: `CDN_PROVIDER=aws-cloudfront`

---

## 7. Set Up Monitoring

### OpenTelemetry

1. Deploy OpenTelemetry Collector:
```bash
kubectl apply -f https://raw.githubusercontent.com/open-telemetry/opentelemetry-operator/main/deploy/crds/opentelemetry.io_opentelemetrycollectors.yaml
```

2. Configure environment variables:
```bash
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_SERVICE_NAME=spark
OTEL_SERVICE_VERSION=1.0.0
```

### Grafana Dashboards

1. Import dashboard from `config/grafana-dashboards.json`
2. Configure Prometheus data source
3. Set up alert rules

### Log Aggregation

Configure logging service URL:
```bash
LOGGING_SERVICE_URL=https://your-loki-endpoint/loki/api/v1/push
# OR
LOGGING_SERVICE_URL=https://your-elasticsearch-endpoint/_bulk
```

---

## 8. Configure Alerting

Set up notification channels:

```bash
# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Email
ALERT_EMAIL_TO=alerts@yourcompany.com
ALERT_EMAIL_FROM=noreply@yourcompany.com

# Webhook
ALERT_WEBHOOK_URL=https://your-webhook-endpoint.com/alerts
```

---

## 9. Verify Deployment

```bash
# Check pods
kubectl get pods -n spark

# Check services
kubectl get svc -n spark

# Check HPA
kubectl get hpa -n spark

# Check logs
kubectl logs -f deployment/spark-app -n spark

# Test health endpoint
curl https://your-domain.com/api/health
```

---

## 10. Post-Deployment Checklist

- [ ] TLS certificates configured
- [ ] OIDC SSO working
- [ ] Database connection verified
- [ ] Health checks passing
- [ ] Monitoring dashboards configured
- [ ] Alerting channels tested
- [ ] CDN configured
- [ ] HPA scaling tested
- [ ] Load testing completed
- [ ] Backup strategy in place

---

## Troubleshooting

### Pods Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n spark

# Check logs
kubectl logs <pod-name> -n spark
```

### Database Connection Issues

- Verify database URL in secrets
- Check network policies
- Verify database firewall rules

### Authentication Issues

- Verify OAuth credentials
- Check redirect URIs match
- Verify NEXTAUTH_SECRET is set

### Performance Issues

- Check HPA metrics
- Review pod resource limits
- Check database query performance
- Review CDN cache hit rates

---

## Scaling

### Horizontal Scaling

HPA automatically scales based on:
- CPU utilization (70% threshold)
- Memory utilization (80% threshold)
- HTTP requests per second (100 req/s per pod)

### Manual Scaling

```bash
kubectl scale deployment spark-app --replicas=5 -n spark
```

---

## Backup and Recovery

### Database Backups

Set up automated PostgreSQL backups:
```bash
# Example: Daily backups
0 2 * * * pg_dump -h db-host -U user -d spark > /backups/spark-$(date +%Y%m%d).sql
```

### Configuration Backups

Back up Kubernetes secrets and configs:
```bash
kubectl get secrets -n spark -o yaml > spark-secrets-backup.yaml
```

---

## Security Considerations

1. **Secrets Management:** Use Kubernetes secrets or external secret management
2. **Network Policies:** Restrict pod-to-pod communication
3. **TLS:** Enforce TLS for all connections
4. **RBAC:** Configure proper role-based access control
5. **Audit Logging:** Monitor all authentication events
6. **Rate Limiting:** Already configured in middleware

---

## Support

For issues or questions:
- Check logs: `kubectl logs -f deployment/spark-app -n spark`
- Review monitoring dashboards
- Check alert notifications
- Consult documentation in `/docs`

---

**Deployment Guide Version:** 1.0  
**Last Updated:** 2024-12-19
