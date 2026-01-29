#!/usr/bin/env bash
# Bring LUMINES to full live production: server (storage + GitLab), group/project, push, CI/CD variable.
# Run from repo root when SBX04 (192.168.86.29) is reachable.
#
# Usage:
#   cd /Users/hiroyasu/Documents/GitHub/LUMINES
#   ./scripts/bring-lumines-to-production.sh
#
# Optional (for API automation: create group/project, add SSH_PRIVATE_KEY):
#   GITLAB_TOKEN=your-personal-access-token ./scripts/bring-lumines-to-production.sh
#
# Optional overrides:
#   SBX04_HOST=192.168.86.29 SBX04_USER=ncadmin GITLAB_ROOT_PASS='...' ./scripts/bring-lumines-to-production.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SBX04_HOST="${SBX04_HOST:-192.168.86.29}"
SBX04_USER="${SBX04_USER:-ncadmin}"
GITLAB_URL="http://${SBX04_HOST}"
GITLAB_API="${GITLAB_URL}/api/v4"
GROUP_PATH="pxg-studio"
PROJECT_PATH="game-repo"
GITLAB_ROOT_PASS="${GITLAB_ROOT_PASS:-C0mp0\$e2k3!!}"
WAIT_GITLAB_MAX="${WAIT_GITLAB_MAX:-600}"   # 10 min
WAIT_GITLAB_INTERVAL="${WAIT_GITLAB_INTERVAL:-15}"

echo "=== Bring LUMINES to Full Live Production ==="
echo "Server: ${SBX04_USER}@${SBX04_HOST}"
echo "GitLab: ${GITLAB_URL}"
echo ""

# --- Step 1: Server reachable and run server completion script ---
echo "--- Step 1: Server (storage + GitLab) ---"
if ! ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new "${SBX04_USER}@${SBX04_HOST}" 'echo OK' 2>/dev/null; then
    echo "❌ Cannot reach ${SBX04_USER}@${SBX04_HOST}. Ensure server is on the same network and SSH works."
    exit 1
fi
echo "   ✅ Server reachable"

echo "   Running server completion script (storage, RAID, mount, GitLab)..."
if ! ssh "${SBX04_USER}@${SBX04_HOST}" 'bash -s' < scripts/complete-outstanding-tasks-server.sh; then
    echo "   ⚠️  Server script failed (e.g. no SATA/RAID). Check storage/USB. You can still try starting GitLab manually."
    if [ -t 0 ]; then
        read -r -p "   Continue waiting for GitLab anyway? (y/N) " CONTINUE
        if [[ ! "${CONTINUE,,}" =~ ^y ]]; then exit 1; fi
    else
        echo "   (non-interactive: exiting)"
        exit 1
    fi
else
    echo "   ✅ Server completion script finished"
fi

# --- Step 2: Wait for GitLab to respond ---
echo ""
echo "--- Step 2: Wait for GitLab ---"
WAITED=0
while [ "$WAITED" -lt "$WAIT_GITLAB_MAX" ]; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "${GITLAB_URL}/" 2>/dev/null || echo "000")
    if [ "$CODE" = "200" ] || [ "$CODE" = "302" ]; then
        echo "   ✅ GitLab responding (HTTP ${CODE}) after ${WAITED}s"
        break
    fi
    echo "   Waiting for GitLab... (${WAITED}s, HTTP ${CODE})"
    sleep "$WAIT_GITLAB_INTERVAL"
    WAITED=$((WAITED + WAIT_GITLAB_INTERVAL))
done
if [ "$WAITED" -ge "$WAIT_GITLAB_MAX" ]; then
    echo "   ❌ GitLab did not respond within ${WAIT_GITLAB_MAX}s. Check: ssh ${SBX04_USER}@${SBX04_HOST} 'docker ps; docker logs gitlab 2>&1 | tail -20'"
    exit 1
fi

# --- Step 3: Ensure group and project exist (API or instructions) ---
echo ""
echo "--- Step 3: Group and project ---"
if [ -n "${GITLAB_TOKEN:-}" ]; then
    echo "   Using GITLAB_TOKEN for API..."
    # Get or create group
    GROUP_ID=$(curl -s -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" "${GITLAB_API}/groups?search=${GROUP_PATH}" 2>/dev/null | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    if [ -z "$GROUP_ID" ]; then
        RESP=$(curl -s -X POST -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" -H "Content-Type: application/json" \
            "${GITLAB_API}/groups" -d "{\"name\":\"PXG.STUDIO\",\"path\":\"${GROUP_PATH}\"}" 2>/dev/null)
        GROUP_ID=$(echo "$RESP" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
        if [ -z "$GROUP_ID" ]; then
            echo "   ⚠️  Could not create group. Create manually: ${GITLAB_URL} → New group → PXG.STUDIO (path: ${GROUP_PATH})"
        else
            echo "   ✅ Group created (id=${GROUP_ID})"
        fi
    else
        echo "   ✅ Group exists (id=${GROUP_ID})"
    fi

    if [ -n "$GROUP_ID" ]; then
        # Get or create project
        PROJ_ID=$(curl -s -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" "${GITLAB_API}/groups/${GROUP_ID}/projects" 2>/dev/null | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
        if [ -z "$PROJ_ID" ]; then
            RESP=$(curl -s -X POST -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" -H "Content-Type: application/json" \
                "${GITLAB_API}/projects" -d "{\"name\":\"game-repo\",\"path\":\"${PROJECT_PATH}\",\"namespace_id\":${GROUP_ID},\"visibility\":\"private\"}" 2>/dev/null)
            PROJ_ID=$(echo "$RESP" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
            if [ -z "$PROJ_ID" ]; then
                echo "   ⚠️  Could not create project. Create manually: ${GITLAB_URL}/${GROUP_PATH} → New project → game-repo"
            else
                echo "   ✅ Project created (id=${PROJ_ID})"
            fi
        else
            echo "   ✅ Project exists (id=${PROJ_ID})"
        fi
    fi
    # Ensure PROJ_ID for variable step (fetch by path if not set)
    if [ -z "${PROJ_ID:-}" ]; then
        PROJ_ID=$(curl -s -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" "${GITLAB_API}/projects/${GROUP_PATH}%2F${PROJECT_PATH}" 2>/dev/null | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    fi
else
    echo "   No GITLAB_TOKEN set. Create group and project in the browser:"
    echo "   1. Open ${GITLAB_URL} and log in as root"
    echo "   2. New group → Name: PXG.STUDIO, Path: ${GROUP_PATH}"
    echo "   3. New project → Name: game-repo, Path: ${PROJECT_PATH}, Group: pxg-studio"
    if [ -t 0 ]; then
        echo "   Press Enter when done to continue with push..."
        read -r -t 120
    else
        echo "   (non-interactive: attempting push; create group/project in browser if push fails)"
    fi
fi

# --- Step 4: Ensure gitlab remote and push ---
echo ""
echo "--- Step 4: Push LUMINES to GitLab ---"
GITLAB_REPO_URL="${GITLAB_URL}/${GROUP_PATH}/${PROJECT_PATH}.git"
if git remote get-url gitlab 2>/dev/null | grep -q .; then
    git remote set-url gitlab "$GITLAB_REPO_URL"
else
    git remote add gitlab "$GITLAB_REPO_URL"
fi
echo "   Remote: gitlab → ${GITLAB_REPO_URL}"

# Push with token as password if set (GitLab accepts token as HTTP password)
if [ -n "${GITLAB_TOKEN:-}" ]; then
    PUSH_URL="http://root:${GITLAB_TOKEN}@${SBX04_HOST}/${GROUP_PATH}/${PROJECT_PATH}.git"
    git push "$PUSH_URL" main 2>/dev/null || git push gitlab main
    git push "$PUSH_URL" develop 2>/dev/null || git push gitlab develop
    git push "$PUSH_URL" prototype 2>/dev/null || git push gitlab prototype
else
    echo "   Pushing (you may be prompted for root password)..."
    git push gitlab main
    git push gitlab develop
    git push gitlab prototype
fi
echo "   ✅ Pushed main, develop, prototype"

# --- Step 5: Add SSH_PRIVATE_KEY to GitLab (API or instructions) ---
echo ""
echo "--- Step 5: CI/CD variable SSH_PRIVATE_KEY ---"
if [ ! -f "$REPO_ROOT/deploy_key" ]; then
    echo "   ⚠️  deploy_key not found. Generate: bash scripts/generate-deploy-key.sh && ssh-copy-id -i ./deploy_key.pub ${SBX04_USER}@${SBX04_HOST}"
    echo "   Then add SSH_PRIVATE_KEY in GitLab: Settings → CI/CD → Variables (see docs/GITLAB_ADD_SSH_KEY.md)"
else
    if [ -n "${GITLAB_TOKEN:-}" ] && [ -n "${PROJ_ID:-}" ]; then
        # Check if variable already exists
        EXISTING=$(curl -s -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" "${GITLAB_API}/projects/${PROJ_ID}/variables" 2>/dev/null | grep -o '"key":"SSH_PRIVATE_KEY"' || true)
        if [ -n "$EXISTING" ]; then
            echo "   ✅ SSH_PRIVATE_KEY already set"
        else
            # Use --form and value@file to preserve newlines in key content
            curl -s -X POST -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
                --form "key=SSH_PRIVATE_KEY" --form "value=@${REPO_ROOT}/deploy_key" \
                --form "masked=true" --form "protected=true" \
                "${GITLAB_API}/projects/${PROJ_ID}/variables" 2>/dev/null && echo "   ✅ SSH_PRIVATE_KEY added via API" || echo "   ⚠️  Add manually: Settings → CI/CD → Variables → SSH_PRIVATE_KEY (value = contents of deploy_key)"
        fi
    else
        echo "   Add in GitLab: Open ${GITLAB_URL}/${GROUP_PATH}/${PROJECT_PATH} → Settings → CI/CD → Variables → Add variable:"
        echo "   Key: SSH_PRIVATE_KEY, Value: (paste contents of deploy_key), Mask + Protect."
        echo "   See docs/GITLAB_ADD_SSH_KEY.md"
    fi
fi

# --- Step 6: Verify production URLs ---
echo ""
echo "--- Step 6: Verify production ---"
for URL in "${GITLAB_URL}" "${GITLAB_URL}/${GROUP_PATH}/${PROJECT_PATH}" "http://${SBX04_HOST}:8080"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$URL" 2>/dev/null || echo "000")
    if [ "$CODE" = "200" ] || [ "$CODE" = "302" ]; then
        echo "   ✅ ${URL} (HTTP ${CODE})"
    else
        echo "   ⚠️  ${URL} (HTTP ${CODE})"
    fi
done

echo ""
echo "=== LUMINES production steps complete ==="
echo "  GitLab:    ${GITLAB_URL}"
echo "  Project:   ${GITLAB_URL}/${GROUP_PATH}/${PROJECT_PATH}"
echo "  Game:      http://${SBX04_HOST}:8080 (production), :8081 (staging)"
echo ""
