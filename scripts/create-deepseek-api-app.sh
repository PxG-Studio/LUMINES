#!/bin/bash
# Create Proper DeepSeek API Application
# Creates a minimal FastAPI application for DeepSeek API service

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Create Proper DeepSeek API Application               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

echo "▶ Step 1: Creating minimal FastAPI application..."
cat > /tmp/deepseek_api_app.py << 'PYTHON_EOF'
#!/usr/bin/env python3
"""
DeepSeek API Service
Minimal FastAPI application for DeepSeek API integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import httpx
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="DeepSeek API",
    description="API service for DeepSeek AI integration",
    version="1.0.0"
)

# Configuration
DEEPSEEK_RUNTIME_ENDPOINT = os.getenv("DEEPSEEK_RUNTIME_ENDPOINT", "http://deepseek-runtime:11434")
SERVICE_NAME = os.getenv("SERVICE_NAME", "deepseek-api")

# Request/Response models
class HealthResponse(BaseModel):
    status: str
    service: str
    runtime_endpoint: str

class ReadyResponse(BaseModel):
    ready: bool
    service: str

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service=SERVICE_NAME,
        runtime_endpoint=DEEPSEEK_RUNTIME_ENDPOINT
    )

@app.get("/ready", response_model=ReadyResponse)
async def readiness_check():
    """Readiness check endpoint"""
    try:
        # Check if runtime is accessible
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"{DEEPSEEK_RUNTIME_ENDPOINT}/api/tags")
            if response.status_code == 200:
                return ReadyResponse(ready=True, service=SERVICE_NAME)
            else:
                return ReadyResponse(ready=False, service=SERVICE_NAME)
    except Exception as e:
        logger.warning(f"Runtime check failed: {e}")
        return ReadyResponse(ready=False, service=SERVICE_NAME)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/metrics")
async def metrics():
    """Metrics endpoint for Prometheus"""
    return {
        "service": SERVICE_NAME,
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5678)
PYTHON_EOF

echo "  ✅ Application code created"

echo ""
echo "▶ Step 2: Creating requirements.txt..."
cat > /tmp/requirements.txt << 'REQ_EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.1
pydantic==2.5.0
REQ_EOF

echo "  ✅ Requirements file created"

echo ""
echo "▶ Step 3: Creating Dockerfile..."
cat > /tmp/Dockerfile << 'DOCKER_EOF'
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY deepseek_api_app.py .

# Expose port
EXPOSE 5678

# Run application
CMD ["python", "deepseek_api_app.py"]
DOCKER_EOF

echo "  ✅ Dockerfile created"

echo ""
echo "▶ Step 4: Instructions for deployment..."
cat > /tmp/DEPLOY_DEEPSEEK_API.md << 'DEPLOY_EOF'
# Deploy DeepSeek API Application

## Option 1: Build and Push Image

1. Build the image:
   ```bash
   docker build -t deepseek-api:1.0.0 -f /tmp/Dockerfile /tmp
   ```

2. Tag for registry:
   ```bash
   docker tag deepseek-api:1.0.0 192.168.86.27:5000/deepseek-api:1.0.0
   ```

3. Push to registry:
   ```bash
   docker push 192.168.86.27:5000/deepseek-api:1.0.0
   ```

4. Update deployment:
   ```bash
   microk8s kubectl set image deployment/deepseek-api -n lumenstack deepseek-api=192.168.86.27:5000/deepseek-api:1.0.0
   ```

## Option 2: Use ConfigMap + InitContainer

1. Create ConfigMap with application code:
   ```bash
   microk8s kubectl create configmap deepseek-api-code -n lumenstack \
     --from-file=deepseek_api_app.py=/tmp/deepseek_api_app.py \
     --from-file=requirements.txt=/tmp/requirements.txt
   ```

2. Update deployment to use ConfigMap and install dependencies in init container

## Option 3: Use existing image with mounted code

Update deployment to mount ConfigMap and run Python directly

DEPLOY_EOF

echo "  ✅ Deployment instructions created"

echo ""
echo "▶ Step 5: Files created:"
echo "  - /tmp/deepseek_api_app.py (FastAPI application)"
echo "  - /tmp/requirements.txt (Python dependencies)"
echo "  - /tmp/Dockerfile (Docker image definition)"
echo "  - /tmp/DEPLOY_DEEPSEEK_API.md (Deployment instructions)"

echo ""
echo "✅ DeepSeek API application created!"
echo ""
echo "📋 Next steps:"
echo "   1. Review the application code: cat /tmp/deepseek_api_app.py"
echo "   2. Build and deploy using one of the options in DEPLOY_DEEPSEEK_API.md"
echo "   3. Update the deployment to use the new image"
echo "   4. Test the endpoints: curl http://192.168.86.114:30008/health"
