#!/bin/bash
# Install Telemetry Stack: Apache Airflow, Storm, Flink, DeepSpeed

set -e

HELIOS_COMPUTE="192.168.86.115"
HELIOS_CONTROL="192.168.86.114"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Telemetry Stack Installation Guide                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# This script provides installation instructions
# Actual installation should be done on target servers

cat << 'EOF'
## Installation Steps

### 1. Apache Airflow (Helios Compute)

```bash
# On 192.168.86.115
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv

# Create Airflow user
sudo useradd -m -s /bin/bash airflow
sudo mkdir -p /opt/airflow
sudo chown airflow:airflow /opt/airflow

# Install Airflow
export AIRFLOW_HOME=/opt/airflow
pip3 install apache-airflow[postgres,redis,celery]

# Initialize database
airflow db init

# Create admin user
airflow users create \
    --username admin \
    --firstname Admin \
    --lastname User \
    --role Admin \
    --email admin@wissil.local \
    --password admin

# Start Airflow webserver (port 8080)
airflow webserver --port 8080 -D

# Start Airflow scheduler
airflow scheduler -D
```

### 2. Apache Storm (Helios Compute)

```bash
# On 192.168.86.115
cd /opt
sudo wget https://archive.apache.org/dist/storm/apache-storm-2.5.0/apache-storm-2.5.0.tar.gz
sudo tar -xzf apache-storm-2.5.0.tar.gz
sudo mv apache-storm-2.5.0 storm
sudo chown -R $USER:$USER /opt/storm

# Configure storm.yaml
cat > /opt/storm/conf/storm.yaml <<STORM_EOF
storm.zookeeper.servers:
    - "localhost"
nimbus.seeds: ["localhost"]
storm.local.dir: "/opt/storm/data"
ui.port: 8000
STORM_EOF

# Start Nimbus
/opt/storm/bin/storm nimbus &

# Start Supervisor
/opt/storm/bin/storm supervisor &

# Start UI
/opt/storm/bin/storm ui &
```

### 3. Apache Flink (Helios Compute)

```bash
# On 192.168.86.115
cd /opt
sudo wget https://archive.apache.org/dist/flink/flink-1.18.1/flink-1.18.1-bin-scala_2.12.tgz
sudo tar -xzf flink-1.18.1-bin-scala_2.12.tgz
sudo mv flink-1.18.1 flink
sudo chown -R $USER:$USER /opt/flink

# Configure flink-conf.yaml
cat >> /opt/flink/conf/flink-conf.yaml <<FLINK_EOF
jobmanager.rpc.address: localhost
jobmanager.rpc.port: 6123
taskmanager.numberOfTaskSlots: 4
FLINK_EOF

# Start Flink
/opt/flink/bin/start-cluster.sh
```

### 4. DeepSpeed (Helios Compute)

```bash
# On 192.168.86.115
pip3 install deepspeed

# Verify installation
python3 -c "import deepspeed; print(deepspeed.__version__)"
```

### 5. Docker Compose Alternative (Recommended)

Create docker-compose.yml for all telemetry services:

```yaml
version: '3.8'
services:
  airflow-webserver:
    image: apache/airflow:2.7.0
    ports:
      - "8080:8080"
    environment:
      - AIRFLOW__CORE__EXECUTOR=LocalExecutor
      - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql://postgres:password@192.168.86.27:5432/airflow
    volumes:
      - ./airflow/dags:/opt/airflow/dags
    command: webserver

  airflow-scheduler:
    image: apache/airflow:2.7.0
    environment:
      - AIRFLOW__CORE__EXECUTOR=LocalExecutor
      - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql://postgres:password@192.168.86.27:5432/airflow
    volumes:
      - ./airflow/dags:/opt/airflow/dags
    command: scheduler

  storm-nimbus:
    image: storm:2.5.0
    ports:
      - "6627:6627"
    command: storm nimbus

  storm-ui:
    image: storm:2.5.0
    ports:
      - "8000:8000"
    command: storm ui

  flink-jobmanager:
    image: flink:1.18.1
    ports:
      - "8081:8081"
    command: jobmanager

  flink-taskmanager:
    image: flink:1.18.1
    command: taskmanager
    depends_on:
      - flink-jobmanager
```

EOF

echo ""
echo "✅ Installation guide generated"
echo "See above for installation steps"
