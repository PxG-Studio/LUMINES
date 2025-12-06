# Monitoring Setup Guide
## Complete Monitoring Configuration for LUMINES/WIS2L

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **CONFIGURATION READY**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Prometheus Setup](#3-prometheus-setup)
4. [Grafana Setup](#4-grafana-setup)
5. [Alerting Configuration](#5-alerting-configuration)
6. [Dashboard Configuration](#6-dashboard-configuration)
7. [Verification](#7-verification)
8. [Maintenance](#8-maintenance)

---

## 1. Overview

This guide covers the complete setup of monitoring infrastructure for LUMINES/WIS2L production environment using:

- **Prometheus** - Metrics collection and storage
- **Grafana** - Visualization and dashboards
- **Alertmanager** - Alert routing and notification

### Architecture

```
┌─────────────────┐
│  LUMINES Web    │──┐
│  PostgreSQL     │──┤
│  Redis          │──┼──► Prometheus ──► Grafana
│  NATS           │──┤
│  Exporters      │──┘
└─────────────────┘
```

---

## 2. Prerequisites

### Required Components

- Docker and Docker Compose (for local setup)
- Kubernetes cluster (for production)
- Network access to all services
- Sufficient resources (CPU, Memory, Disk)

### Required Ports

| Service | Port | Purpose |
|---------|------|---------|
| Prometheus | 9090 | Web UI and API |
| Grafana | 3001 | Web UI |
| Alertmanager | 9093 | Alert API |

---

## 3. Prometheus Setup

### 3.1 Docker Compose Setup

**File:** `docker-compose.monitoring.yml`

```yaml
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
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
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

volumes:
  prometheus-data:
  alertmanager-data:

networks:
  monitoring-network:
    driver: bridge
```

### 3.2 Kubernetes Setup

**File:** `infrastructure/monitoring/prometheus/prometheus-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        - name: prometheus-data
          mountPath: /prometheus
        args:
          - '--config.file=/etc/prometheus/prometheus.yml'
          - '--storage.tsdb.path=/prometheus'
          - '--storage.tsdb.retention.time=30d'
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
      - name: prometheus-data
        persistentVolumeClaim:
          claimName: prometheus-data
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
spec:
  selector:
    app: prometheus
  ports:
  - port: 9090
    targetPort: 9090
  type: ClusterIP
```

### 3.3 Configuration

**File:** `infrastructure/monitoring/prometheus/prometheus.yml`

See `infrastructure/monitoring/prometheus/prometheus.yml` for complete configuration.

**Key Settings:**
- Scrape interval: 15s
- Evaluation interval: 15s
- Retention: 30 days
- Alert rules: `/etc/prometheus/alerts/*.yml`

### 3.4 Start Prometheus

**Docker Compose:**
```bash
docker-compose -f docker-compose.monitoring.yml up -d prometheus
```

**Kubernetes:**
```bash
kubectl apply -f infrastructure/monitoring/prometheus/prometheus-deployment.yaml
```

**Verify:**
```bash
curl http://localhost:9090/api/v1/status/config
```

---

## 4. Grafana Setup

### 4.1 Docker Compose Setup

**Add to `docker-compose.monitoring.yml`:**

```yaml
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
```

### 4.2 Kubernetes Setup

**File:** `infrastructure/monitoring/grafana/grafana-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: grafana-secrets
              key: admin-password
        volumeMounts:
        - name: grafana-data
          mountPath: /var/lib/grafana
        - name: grafana-dashboards
          mountPath: /etc/grafana/provisioning/dashboards
        - name: grafana-datasources
          mountPath: /etc/grafana/provisioning/datasources
      volumes:
      - name: grafana-data
        persistentVolumeClaim:
          claimName: grafana-data
      - name: grafana-dashboards
        configMap:
          name: grafana-dashboards
      - name: grafana-datasources
        configMap:
          name: grafana-datasources
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  selector:
    app: grafana
  ports:
  - port: 3000
    targetPort: 3000
  type: LoadBalancer
```

### 4.3 Data Source Configuration

**File:** `infrastructure/monitoring/grafana/datasources/prometheus.yml`

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

### 4.4 Start Grafana

**Docker Compose:**
```bash
docker-compose -f docker-compose.monitoring.yml up -d grafana
```

**Kubernetes:**
```bash
kubectl apply -f infrastructure/monitoring/grafana/grafana-deployment.yaml
```

**Access:**
- URL: `http://localhost:3001`
- Username: `admin`
- Password: `admin` (change in production!)

---

## 5. Alerting Configuration

### 5.1 Alert Rules

**File:** `infrastructure/monitoring/alerts/alerts.yml`

See `infrastructure/monitoring/alerts/alerts.yml` for complete alert rules.

**Alert Categories:**
- **Critical (P0):** Service down, database down, high error rate
- **Warning (P1):** High response time, high resource usage
- **Info (P2):** Deployment events, scaling events

### 5.2 Alertmanager Configuration

**File:** `infrastructure/monitoring/alertmanager/alertmanager.yml`

```yaml
global:
  resolve_timeout: 5m
  slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
    - match:
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        title: 'LUMINES Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

  - name: 'critical-alerts'
    slack_configs:
      - channel: '#critical-alerts'
        title: '🚨 CRITICAL: LUMINES Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
    email_configs:
      - to: 'oncall@example.com'
        from: 'alerts@example.com'
        headers:
          Subject: 'CRITICAL: LUMINES Alert'

  - name: 'warning-alerts'
    slack_configs:
      - channel: '#alerts'
        title: '⚠️ WARNING: LUMINES Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

### 5.3 Notification Channels

**Supported Channels:**
- Slack
- Email
- PagerDuty
- Webhook

**Configuration:**
Update `alertmanager.yml` with your notification channel credentials.

---

## 6. Dashboard Configuration

### 6.1 Pre-configured Dashboards

**Available Dashboards:**
- LUMINES Overview
- Database Performance
- Infrastructure Health
- Error Analysis
- User Activity

**Location:** `infrastructure/monitoring/grafana/dashboards/`

### 6.2 Import Dashboards

**Via Grafana UI:**
1. Go to Dashboards → Import
2. Upload JSON file from `infrastructure/monitoring/grafana/dashboards/`
3. Select Prometheus data source
4. Click Import

**Via Provisioning:**
Dashboards are automatically provisioned from `infrastructure/monitoring/grafana/dashboards/`

---

## 7. Verification

### 7.1 Prometheus Verification

```bash
# Check Prometheus is running
curl http://localhost:9090/api/v1/status/config

# Check targets
curl http://localhost:9090/api/v1/targets

# Check alerts
curl http://localhost:9090/api/v1/alerts
```

### 7.2 Grafana Verification

```bash
# Check Grafana is running
curl http://localhost:3001/api/health

# Login and verify dashboards
# Access: http://localhost:3001
```

### 7.3 Alert Verification

```bash
# Trigger test alert
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '[{
    "labels": {
      "alertname": "TestAlert",
      "severity": "warning"
    },
    "annotations": {
      "summary": "Test alert",
      "description": "This is a test alert"
    }
  }]'
```

---

## 8. Maintenance

### 8.1 Regular Tasks

**Daily:**
- Review alert history
- Check dashboard performance
- Verify data retention

**Weekly:**
- Review and tune alert thresholds
- Update dashboards as needed
- Check storage usage

**Monthly:**
- Review and optimize queries
- Update Prometheus and Grafana
- Review alert effectiveness

### 8.2 Troubleshooting

**Prometheus not scraping:**
- Check service discovery configuration
- Verify network connectivity
- Check target endpoints

**Grafana not loading dashboards:**
- Check data source configuration
- Verify Prometheus connectivity
- Check dashboard JSON syntax

**Alerts not firing:**
- Check alert rules syntax
- Verify Alertmanager configuration
- Check notification channel configuration

---

## Appendix

### A. Exporters

**Required Exporters:**
- `postgres_exporter` - PostgreSQL metrics
- `redis_exporter` - Redis metrics
- `nats_exporter` - NATS metrics

**Installation:**
See individual exporter documentation.

### B. Useful Queries

**Request Rate:**
```promql
rate(http_requests_total[5m])
```

**Error Rate:**
```promql
rate(http_requests_total{status=~"5.."}[5m])
```

**Response Time (p95):**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Database Connections:**
```promql
pg_stat_database_numbackends
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Next Review:** January 6, 2026

