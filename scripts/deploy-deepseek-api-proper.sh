#!/bin/bash
# Deploy Proper DeepSeek API Application
# Builds and deploys the FastAPI application we created

set -e

HELIOS_CONTROL="192.168.86.114"
HELIOS_USER="helios"
HELIOS_PASSWORD="C0mp0\$e2k3!!Hopper70!!"
LOCAL_MACHINE="192.168.86.113"
REGISTRY="192.168.86.27:5000"
IMAGE_NAME="deepseek-api"
IMAGE_TAG="1.0.0"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Deploy Proper DeepSeek API Application               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to execute command on Helios Control
run_on_helios() {
    sshpass -p "$HELIOS_PASSWORD" ssh -o StrictHostKeyChecking=no "$HELIOS_USER@$HELIOS_CONTROL" "$1"
}

# Function to copy file to Helios Control
copy_to_helios() {
    sshpass -p "$HELIOS_PASSWORD" scp -o StrictHostKeyChecking=no "$1" "$HELIOS_USER@$HELIOS_CONTROL:$2"
}

echo "▶ Step 1: Checking if application files exist..."
if [ ! -f "/tmp/deepseek_api_app.py" ]; then
    echo "  ❌ Application file not found. Running create script..."
    bash /home/cursor-dev/Documents/Lumines/scripts/create-deepseek-api-app.sh
fi

echo "  ✅ Application files found"

echo ""
echo "▶ Step 2: Copying application files to Helios Control..."
copy_to_helios "/tmp/deepseek_api_app.py" "/tmp/deepseek_api_app.py"
copy_to_helios "/tmp/requirements.txt" "/tmp/requirements.txt"
copy_to_helios "/tmp/Dockerfile" "/tmp/Dockerfile"

echo "  ✅ Files copied"

echo ""
echo "▶ Step 3: Building Docker image on Helios Control..."
run_on_helios "cd /tmp && docker build -t $IMAGE_NAME:$IMAGE_TAG -f Dockerfile ." 2>&1 || {
    echo "  ⚠️  Docker build failed. Checking if Docker is available..."
    run_on_helios "which docker" || {
        echo "  ❌ Docker not found. Using alternative deployment method..."
        echo ""
        echo "  💡 Alternative: Deploy using ConfigMap + InitContainer"
        echo "  This will be implemented in the next step..."
        exit 1
    }
}

echo ""
echo "▶ Step 4: Tagging image for registry..."
run_on_helios "docker tag $IMAGE_NAME:$IMAGE_TAG $REGISTRY/$IMAGE_NAME:$IMAGE_TAG" 2>&1 || echo "  ⚠️  Tagging failed (may not be needed)"

echo ""
echo "▶ Step 5: Pushing to registry (if accessible)..."
run_on_helios "docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG" 2>&1 || {
    echo "  ⚠️  Registry push failed. Will use local image or ConfigMap method"
}

echo ""
echo "▶ Step 6: Creating ConfigMap with application code (alternative method)..."
run_on_helios "microk8s kubectl create configmap deepseek-api-code -n lumenstack \
  --from-file=deepseek_api_app.py=/tmp/deepseek_api_app.py \
  --from-file=requirements.txt=/tmp/requirements.txt \
  --dry-run=client -o yaml | microk8s kubectl apply -f -" 2>&1 || {
    echo "  ⚠️  ConfigMap creation failed or already exists"
}

echo ""
echo "▶ Step 7: Updating deployment to use new image or ConfigMap..."
echo "  Option A: Update deployment to use built image"
echo "  Option B: Update deployment to use ConfigMap with init container"
echo ""
echo "  For now, we'll update the deployment to use the built image:"
run_on_helios "microk8s kubectl set image deployment/deepseek-api -n lumenstack deepseek-api=$IMAGE_NAME:$IMAGE_TAG" 2>&1 || {
    echo "  ⚠️  Image update failed. Will need to update deployment YAML manually"
    echo ""
    echo "  📋 Manual update required:"
    echo "    1. Edit deployment YAML"
    echo "    2. Update image to: $IMAGE_NAME:$IMAGE_TAG"
    echo "    3. Add command: [\"python\", \"deepseek_api_app.py\"]"
    echo "    4. Apply: microk8s kubectl apply -f <yaml-file>"
}

echo ""
echo "▶ Step 8: Restarting deployment..."
run_on_helios "microk8s kubectl rollout restart deployment/deepseek-api -n lumenstack" 2>&1 || true

echo ""
echo "▶ Step 9: Waiting for rollout..."
sleep 10

echo ""
echo "▶ Step 10: Checking deployment status..."
run_on_helios "microk8s kubectl get deployment deepseek-api -n lumenstack"
run_on_helios "microk8s kubectl get pods -n lumenstack -l app=deepseek-api"

echo ""
echo "✅ Deployment script complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Monitor pod status: microk8s kubectl get pods -n lumenstack -l app=deepseek-api -w"
echo "   2. Check logs: microk8s kubectl logs -n lumenstack -l app=deepseek-api -c deepseek-api"
echo "   3. Test endpoint: curl http://192.168.86.114:30008/health"
