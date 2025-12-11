# Comprehensive Deployment Guide
## WISSIL Infrastructure - Telemetry Stack Deployment

**Date:** December 6, 2025
**Version:** 1.0.0
**Scope:** Complete Telemetry Stack (Airflow, Storm, Flink, DeepSpeed)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Overview](#deployment-overview)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Verification Procedures](#verification-procedures)
5. [Health Checks](#health-checks)
6. [Integration Testing](#integration-testing)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## Prerequisites

### 1. Network Access

**Required:**
- SSH access to Helios Control (192.168.86.114)
- Network connectivity to all servers
- Kubernetes cluster running (microk8s)

**Verify:**
```bash
# Test SSH access
ssh 192.168.86.114 "hostname"

# Test network connectivity
ping -c 2 192.168.86.114
ping -c 2 192.168.86.115
ping -c 2 192.168.86.27
ping -c 2 192.168.86.28
```

### 2. Kubernetes Cluster

**Required:**
- microk8s installed and running
- kubectl access configured
- Sufficient resources (CPU, Memory)

**Verify:**
```bash
ssh 192.168.86.114 "microk8s status"
ssh 192.168.86.114 "microk8s kubectl cluster-info"
ssh 192.168.86.114 "microk8s kubectl get nodes"
```

### 3. Configuration Files

**Required:**
- LUMINERA repository accessible
- Kubernetes manifests available

**Verify:**
```bash
ls -la /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/airflow/airflow-optimized.yaml
ls -la /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/storm-deployment.yaml
ls -la /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/flink-deployment.yaml
ls -la /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production/lumenstack/deepspeed-engine-complete.yaml
```

### 4. Data Services

**Required:**
- PostgreSQL accessible (192.168.86.27:5432)
- Redis accessible (192.168.86.27:6379)
- NATS accessible (192.168.86.27:4222)

**Verify:**
```bash
timeout 3 bash -c "echo > /dev/tcp/192.168.86.27/5432" && echo "PostgreSQL: OK"
timeout 3 bash -c "echo > /dev/tcp/192.168.86.27/6379" && echo "Redis: OK"
timeout 3 bash -c "echo > /dev/tcp/192.168.86.27/4222" && echo "NATS: OK"
```

---

## Deployment Overview

### Architecture

```
┌─────────────────────────────────────────────────┐
│  Kubernetes Cluster (Helios Control)          │
│                                                 │
│  Namespace: airflow                             │
│  ├── Apache Airflow (NERVA)                    │
│  │   ├── Webserver (port 8080)                 │
│  │   ├── Scheduler                             │
│  │   └── PostgreSQL (internal)                 │
│                                                 │
│  Namespace: lumenstack                          │
│  ├── Apache Storm (FLUX)                       │
│  │   ├── Nimbus (port 6627)                    │
│  │   ├── Supervisor (2x)                        │
│  │   └── UI (NodePort 30012)                   │
│  ├── Apache Flink (GRAVIA/FLUX)                │
│  │   ├── JobManager (port 8081)                │
│  │   ├── TaskManager (2x)                      │
│  │   └── UI (NodePort 30011)                   │
│  └── DeepSpeed Engine                          │
│      └── Service (NodePort 30009)              │
│                                                 │
│  Namespace: monitoring                          │
│  ├── Storm Telemetry                           │
│  └── Flink Telemetry                           │
└─────────────────────────────────────────────────┘
         │
         ├─→ PostgreSQL (192.168.86.27:5432)
         ├─→ Redis (192.168.86.27:6379)
         └─→ NATS (192.168.86.27:4222)
```

### Deployment Order

1. **Namespaces** - Create required namespaces
2. **Apache Airflow** - Deploy NERVA orchestrator
3. **Apache Storm** - Deploy FLUX telemetry
4. **Apache Flink** - Deploy GRAVIA/FLUX validation
5. **DeepSpeed** - Deploy ML/AI engine

---

## Step-by-Step Deployment

### Option 1: Automated Deployment (Recommended)

**Use the automated deployment script:**
```bash
cd /home/cursor-dev/Documents/Lumines
bash scripts/deploy-telemetry-stack.sh
```

This script will:
- Check prerequisites
- Create namespaces
- Deploy all telemetry services
- Verify deployments
- Provide status summary

### Option 2: Manual Deployment

#### Step 1: Create Namespaces

```bash
ssh 192.168.86.114 "microk8s kubectl create namespace airflow"
ssh 192.168.86.114 "microk8s kubectl create namespace lumenstack"
ssh 192.168.86.114 "microk8s kubectl create namespace monitoring"
```

#### Step 2: Deploy Apache Airflow

```bash
cd /home/cursor-dev/Documents/Luminera/infrastructure/k8s/production

# Copy YAML to remote if needed
scp airflow/airflow-optimized.yaml 192.168.86.114:/tmp/

# Deploy
ssh 192.168.86.114 "microk8s kubectl apply -f /tmp/airflow-optimized.yaml"

# Verify
ssh 192.168.86.114 "microk8s kubectl get pods -n airflow -w"
```

#### Step 3: Deploy Apache Storm

```bash
scp lumenstack/storm-deployment.yaml 192.168.86.114:/tmp/
ssh 192.168.86.114 "microk8s kubectl apply -f /tmp/storm-deployment.yaml"
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=storm"
```

#### Step 4: Deploy Apache Flink

```bash
scp lumenstack/flink-deployment.yaml 192.168.86.114:/tmp/
ssh 192.168.86.114 "microk8s kubectl apply -f /tmp/flink-deployment.yaml"
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=flink"
```

#### Step 5: Deploy DeepSpeed

```bash
scp lumenstack/deepspeed-engine-complete.yaml 192.168.86.114:/tmp/
ssh 192.168.86.114 "microk8s kubectl apply -f /tmp/deepspeed-engine-complete.yaml"
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine"
```

---

## Verification Procedures

### 1. Pod Status Verification

```bash
# Check all pods
ssh 192.168.86.114 "microk8s kubectl get pods --all-namespaces | grep -E 'airflow|storm|flink|deepspeed'"

# Airflow pods
ssh 192.168.86.114 "microk8s kubectl get pods -n airflow"

# Storm pods
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=storm"

# Flink pods
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=flink"

# DeepSpeed pods
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine"
```

### 2. Service Verification

```bash
# Check all services
ssh 192.168.86.114 "microk8s kubectl get svc --all-namespaces | grep -E 'airflow|storm|flink|deepspeed'"

# Check NodePort services
ssh 192.168.86.114 "microk8s kubectl get svc --all-namespaces | grep NodePort"
```

### 3. Automated Verification

**Run the systematic verification script:**
```bash
bash scripts/systematic-verification.sh
```

**Run the health check script:**
```bash
bash scripts/health-check-telemetry.sh
```

---

## Health Checks

### Automated Health Checks

**Run comprehensive health check:**
```bash
bash scripts/health-check-telemetry.sh
```

This checks:
- Kubernetes cluster health
- Pod status (Running/Not Running)
- Service endpoints
- Data pipeline connectivity

### Manual Health Checks

#### Airflow Health

```bash
# Check pod status
ssh 192.168.86.114 "microk8s kubectl get pods -n airflow"

# Check service
ssh 192.168.86.114 "microk8s kubectl get svc -n airflow"

# Port-forward and test
ssh 192.168.86.114 "microk8s kubectl port-forward -n airflow svc/airflow-webserver 8080:8080" &
sleep 2
curl http://localhost:8080
pkill -f "port-forward.*airflow"
```

#### Storm Health

```bash
# Check pod status
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=storm"

# Test UI
curl http://192.168.86.114:30012
```

#### Flink Health

```bash
# Check pod status
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=flink"

# Test UI
curl http://192.168.86.114:30011
```

#### DeepSpeed Health

```bash
# Check pod status
ssh 192.168.86.114 "microk8s kubectl get pods -n lumenstack -l app=deepspeed-engine"

# Test health endpoint
curl http://192.168.86.114:30009/health
```

---

## Integration Testing

### Automated Integration Tests

**Run integration test suite:**
```bash
bash scripts/integration-test-pipelines.sh
```

This tests:
- Airflow DAG integration
- Flink job integration
- Storm topology integration
- End-to-end pipeline flow

### Manual Integration Tests

#### Test Airflow → PostgreSQL

```bash
# Verify Airflow can connect to PostgreSQL
ssh 192.168.86.114 "microk8s kubectl exec -n airflow \$(microk8s kubectl get pods -n airflow -l component=webserver -o jsonpath='{.items[0].metadata.name}') -- psql -h 192.168.86.27 -U postgres -c 'SELECT 1;'"
```

#### Test Flink → Data Sources

```bash
# Verify Flink can connect to PostgreSQL and Redis
# (Requires Flink job that uses these sources)
```

#### Test Storm → NATS

```bash
# Verify Storm can connect to NATS
# (Requires Storm topology that uses NATS)
```

---

## Troubleshooting

### Common Issues

#### 1. Pods Not Starting

**Symptoms:** Pods stuck in Pending or CrashLoopBackOff

**Diagnosis:**
```bash
# Check pod events
ssh 192.168.86.114 "microk8s kubectl describe pod -n <namespace> <pod-name>"

# Check pod logs
ssh 192.168.86.114 "microk8s kubectl logs -n <namespace> <pod-name>"
```

**Solutions:**
- Check resource limits
- Verify image availability
- Check PersistentVolumeClaims
- Verify ConfigMaps and Secrets

#### 2. Services Not Accessible

**Symptoms:** NodePort services not responding

**Diagnosis:**
```bash
# Check service configuration
ssh 192.168.86.114 "microk8s kubectl get svc -n <namespace> <service-name> -o yaml"

# Check firewall rules
ssh 192.168.86.114 "sudo ufw status"
```

**Solutions:**
- Verify NodePort is configured
- Check firewall rules
- Verify pods are running
- Check service selectors

#### 3. Data Pipeline Connectivity Issues

**Symptoms:** Services cannot connect to PostgreSQL/Redis/NATS

**Diagnosis:**
```bash
# Test connectivity from pod
ssh 192.168.86.114 "microk8s kubectl exec -n <namespace> <pod-name> -- nc -zv 192.168.86.27 5432"
```

**Solutions:**
- Verify network policies
- Check service endpoints
- Verify credentials
- Check firewall rules

---

## Maintenance

### Regular Maintenance Tasks

#### Daily
- Check pod status
- Review logs for errors
- Monitor resource usage

#### Weekly
- Review DAG execution history (Airflow)
- Check Flink job metrics
- Review Storm topology performance
- Verify backup procedures

#### Monthly
- Update configurations
- Review and optimize resource allocation
- Update documentation
- Review security policies

### Update Procedures

#### Update Airflow

```bash
# Backup current deployment
ssh 192.168.86.114 "microk8s kubectl get deployment -n airflow -o yaml > /tmp/airflow-backup.yaml"

# Apply new configuration
ssh 192.168.86.114 "microk8s kubectl apply -f /path/to/new/airflow-optimized.yaml"

# Verify update
ssh 192.168.86.114 "microk8s kubectl rollout status -n airflow deployment/airflow-webserver"
```

#### Update Storm/Flink/DeepSpeed

Similar procedure - backup, apply, verify.

---

## Quick Reference

### Service Endpoints

| Service | Namespace | NodePort | URL |
|---------|-----------|----------|-----|
| Airflow UI | airflow | N/A | Port-forward or Ingress |
| Flink UI | lumenstack | 30011 | http://192.168.86.114:30011 |
| Storm UI | lumenstack | 30012 | http://192.168.86.114:30012 |
| DeepSpeed | lumenstack | 30009 | http://192.168.86.114:30009 |

### Useful Commands

```bash
# Get all pods
microk8s kubectl get pods --all-namespaces

# Get all services
microk8s kubectl get svc --all-namespaces

# Get logs
microk8s kubectl logs -n <namespace> <pod-name>

# Describe resource
microk8s kubectl describe -n <namespace> <resource-type> <resource-name>

# Port-forward
microk8s kubectl port-forward -n <namespace> svc/<service-name> <local-port>:<remote-port>
```

---

**Guide Version:** 1.0.0
**Last Updated:** December 6, 2025
**Maintained By:** Infrastructure Team
