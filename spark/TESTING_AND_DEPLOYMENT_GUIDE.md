# SPARK MVP 1: Testing & Deployment Guide

**Complete guide for testing and deploying SPARK MVP 1**

---

## Phase 1: Pre-Deployment Testing

### Step 1: Install Dependencies

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to a peer dependency conflict with `vitest` and `@storybook/addon-vitest`. This is safe to use and won't affect SPARK functionality.

**Expected:** Dependencies install successfully

---

### Step 2: Verify TypeScript Compilation

```bash
npm run typecheck
```

**Expected:** No TypeScript errors

**If errors occur:**
- Check import paths
- Verify all types are defined
- Review error messages and fix issues

---

### Step 3: Test Production Build

```bash
npm run build
```

**Expected:** Build completes successfully, creates `.next` directory

**If build fails:**
- Check for missing dependencies
- Verify environment variables (if needed for build)
- Review build errors and fix

---

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected:** Server starts on `http://localhost:3000`

**Verify:**
- Server starts without errors
- No console errors in terminal
- Application is accessible

---

### Step 5: Test Health Endpoint

In a new terminal:

```bash
curl http://localhost:3000/api/spark/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-07T...",
  "service": "spark",
  "version": "1.0.0",
  "checks": {
    "apiKeys": {
      "anthropic": false,
      "openai": false,
      "status": "missing"
    },
    "memory": "healthy"
  }
}
```

**Note:** API keys will show as `false` if not configured in `.env.local`. This is expected for testing.

---

### Step 6: Manual Functional Testing

#### 6.1 Access SPARK Page

1. Open browser: `http://localhost:3000/spark`
2. Verify page loads
3. Verify two-panel layout (Chat left, Preview right)
4. Verify no console errors

#### 6.2 Test Code Generation (Requires API Key)

**Setup:**
1. Create `.env.local` file:
```bash
ANTHROPIC_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Restart dev server: `npm run dev`

**Test:**
1. Type prompt: "Create a simple MonoBehaviour script called PlayerController"
2. Click Send
3. Verify:
   - Loading indicator appears
   - Code is generated
   - Code appears in preview panel
   - Script name is extracted correctly

#### 6.3 Test Export

1. After generating code, click "Export as ZIP"
2. Verify:
   - Button shows loading state
   - ZIP file downloads
   - File name is correct (`{scriptName}.zip`)

#### 6.4 Test ZIP Structure

1. Extract downloaded ZIP
2. Verify structure:
```
Assets/
  Assets.meta
  Scripts/
    Scripts.meta
    {ScriptName}.cs
    {ScriptName}.cs.meta
```

#### 6.5 Test Unity Import (Requires Unity Editor)

1. Open Unity Editor
2. Create new project or use existing
3. Copy extracted `Assets` folder into Unity project
4. Verify:
   - Unity recognizes files
   - Script appears in Project window
   - Script compiles without errors
   - No console errors in Unity

---

## Phase 2: Deployment

### Option A: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository connected

#### Steps

1. **Push code to GitHub:**
```bash
git add .
git commit -m "SPARK MVP 1: Ready for deployment"
git push origin main
```

2. **Deploy to Vercel:**
   - Go to Vercel dashboard
   - Import repository
   - Configure:
     - Framework: Next.js
     - Build Command: `npm run build`
     - Install Command: `npm install --legacy-peer-deps`
     - Output Directory: `.next`

3. **Set Environment Variables:**
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - `DATABASE_URL` (if using)

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Verify deployment URL works

5. **Post-Deployment Verification:**
```bash
curl https://your-app.vercel.app/api/spark/health
```

---

### Option B: Docker

#### Build Image

```bash
docker build -t spark-mvp1:latest .
```

#### Run Container

```bash
docker run -d \
  --name spark-mvp1 \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  spark-mvp1:latest
```

#### Verify

```bash
curl http://localhost:3000/api/spark/health
```

---

### Option C: Kubernetes

#### Prerequisites
- Kubernetes cluster
- kubectl configured

#### Steps

1. **Create secrets:**
```bash
kubectl create secret generic spark-secrets \
  --from-literal=anthropic-api-key=your_key \
  --from-literal=openai-api-key=your_key \
  --from-literal=nextauth-secret=your_secret
```

2. **Apply deployment:**
```bash
kubectl apply -f spark/k8s/deployment.yaml
```

3. **Verify:**
```bash
kubectl get pods -l app=spark
kubectl port-forward service/spark 3000:3000
curl http://localhost:3000/api/spark/health
```

---

## Phase 3: Post-Deployment

### Monitoring Checklist

- [ ] Health endpoint responds correctly
- [ ] No errors in application logs
- [ ] API requests are being logged
- [ ] Error handling works correctly
- [ ] Rate limiting is active

### Functional Verification

- [ ] SPARK page loads
- [ ] Code generation works
- [ ] Export works
- [ ] Error messages display correctly
- [ ] Health check shows correct status

### Performance

- [ ] Page load time < 3 seconds
- [ ] Code generation < 30 seconds
- [ ] Export generation < 5 seconds
- [ ] No memory leaks

---

## Troubleshooting

### Build Issues

**Problem:** `npm install` fails with peer dependency conflicts
**Solution:** Use `npm install --legacy-peer-deps`

**Problem:** TypeScript errors
**Solution:** Run `npm run typecheck` and fix errors

**Problem:** Build fails
**Solution:** Check build logs, verify all dependencies installed

### Runtime Issues

**Problem:** Health check fails
**Solution:** 
- Verify server is running
- Check environment variables
- Review application logs

**Problem:** API keys not working
**Solution:**
- Verify environment variables are set
- Check API key format
- Verify API keys are valid

**Problem:** Export fails
**Solution:**
- Check rate limiting
- Verify ZIP generator
- Review API logs

---

## Rollback Procedure

### If Deployment Fails

1. **Revert code:**
```bash
git revert HEAD
git push origin main
```

2. **Redeploy previous version**

3. **Check logs for errors**

4. **Fix issues and redeploy**

---

## Success Criteria

✅ All pre-deployment tests pass
✅ Production build succeeds
✅ Health endpoint responds
✅ Code generation works
✅ Export works
✅ ZIP structure is correct
✅ Unity import works (if tested)

---

## Next Steps After Deployment

1. Monitor for 24-48 hours
2. Collect user feedback
3. Track error rates
4. Monitor API usage
5. Plan improvements based on feedback

---

**Last Updated:** December 2024  
**Status:** Ready for Testing & Deployment

