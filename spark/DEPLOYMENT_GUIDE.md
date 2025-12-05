# SPARK Deployment Guide

Complete guide for deploying SPARK MVP 1 to production.

## Table of Contents
1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
4. [Alternative Platforms](#alternative-platforms)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What You'll Deploy

- **Next.js 15 application** with App Router
- **Server actions** for AI generation
- **API routes** for export functionality
- **Static assets** (HTML, CSS, JS)
- **Environment variables** (API keys)

### Deployment Requirements

- **Node.js**: 18.x or later
- **NPM**: 9.x or later
- **Build time**: ~20-40 seconds
- **Cold start**: <500ms
- **Memory**: 128-256 MB

### Cost Estimates

**Vercel (Recommended)**
- **Hobby (Free)**: Perfect for MVP 1
  - 100GB bandwidth/month
  - Unlimited requests
  - Serverless functions
  - Free custom domains
- **Pro ($20/month)**: If scaling
  - 1TB bandwidth
  - Advanced analytics
  - Team features

**AI API Costs (Separate)**
- **Claude**: $3-15 per 1M tokens (~2000-10000 scripts)
- **OpenAI GPT-4**: $30-60 per 1M tokens (~2000-10000 scripts)
- **OpenAI GPT-3.5**: $0.50-2 per 1M tokens (~20000-80000 scripts)

---

## Pre-Deployment Checklist

### 1. Code Quality

- [ ] All tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in dev mode
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)

### 2. Configuration

- [ ] `.env.local` configured with real API keys
- [ ] API keys tested and working
- [ ] No hardcoded secrets in code
- [ ] `.env.example` up to date
- [ ] `.gitignore` excludes sensitive files

### 3. Documentation

- [ ] USER_GUIDE.md complete
- [ ] UNITY_IMPORT_GUIDE.md complete
- [ ] README.md accurate
- [ ] QUICK_START.md helpful

### 4. Testing

- [ ] Tested script generation end-to-end
- [ ] Tested export functionality
- [ ] Tested with both AI providers
- [ ] Tested error scenarios
- [ ] Tested on mobile devices

### 5. Performance

- [ ] Generation time < 5 seconds
- [ ] Export time < 2 seconds
- [ ] Page loads < 1 second
- [ ] No memory leaks

---

## Vercel Deployment (Recommended)

Vercel is the easiest and best platform for Next.js apps.

### Step 1: Prepare Your Repository

**1.1 Create Git Repository**
```bash
cd spark
git init
git add .
git commit -m "Initial SPARK MVP 1"
```

**1.2 Push to GitHub**
```bash
# Create new repo on GitHub first, then:
git remote add origin https://github.com/yourusername/spark.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

**2.1 Sign Up**
1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repos

**2.2 Import Project**
1. Click "New Project"
2. Select your SPARK repository
3. Vercel auto-detects Next.js configuration

**2.3 Configure Build Settings**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (or `./spark` if nested)
- **Build Command**: `next build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Environment Variables

**3.1 Add Production Variables**

In Vercel dashboard:
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add the following:

```
ANTHROPIC_API_KEY=sk-ant-xxx...
OPENAI_API_KEY=sk-xxx...
NEXT_PUBLIC_APP_URL=https://your-spark-app.vercel.app
```

**3.2 Variable Scopes**
- Set to: **Production, Preview, Development**
- This ensures keys work in all environments

**3.3 Sensitive Variables**
- Mark as "Sensitive" to hide from logs
- Never commit to Git

### Step 4: Deploy

**4.1 Initial Deployment**
1. Click "Deploy"
2. Wait ~30-60 seconds
3. Vercel builds and deploys automatically

**4.2 Deployment URL**
- Vercel provides: `https://spark-xxx.vercel.app`
- Or use custom domain (see below)

**4.3 Verify Deployment**
1. Visit deployment URL
2. Test script generation
3. Test export functionality
4. Check all features work

### Step 5: Custom Domain (Optional)

**5.1 Add Domain**
1. In Vercel, go to Project Settings > Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `spark.yourdomain.com`)

**5.2 Configure DNS**
Add CNAME record with your DNS provider:
```
Type: CNAME
Name: spark (or @ for root domain)
Value: cname.vercel-dns.com
```

**5.3 SSL Certificate**
- Vercel auto-provisions SSL (Let's Encrypt)
- Takes 1-5 minutes
- HTTPS enabled automatically

### Step 6: Continuous Deployment

**Auto-Deploy on Push**
- Every `git push` to main triggers new deployment
- Preview deployments for pull requests
- Rollback to previous deployments in one click

**Manual Deploy**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel --prod
```

---

## Alternative Platforms

### Netlify

**Pros**: Similar to Vercel, great Next.js support
**Cons**: Slightly slower builds

**Quick Deploy:**
```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

**Environment Variables:**
Set in Netlify dashboard under Site Settings > Environment Variables

### Railway

**Pros**: Simple, Docker support, databases included
**Cons**: Not specialized for Next.js

**Quick Deploy:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### AWS (Advanced)

**Services Needed:**
- **AWS Amplify**: For Next.js hosting
- **AWS Lambda**: For serverless functions
- **CloudFront**: For CDN

**Use Case**: Enterprise deployments with custom requirements

### Self-Hosted

**Requirements:**
- Node.js 18+ server
- PM2 or similar process manager
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

**Quick Start:**
```bash
# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "spark" -- start
pm2 save
pm2 startup
```

---

## Environment Configuration

### Production Environment Variables

**Required:**
```env
ANTHROPIC_API_KEY=sk-ant-xxx...
OPENAI_API_KEY=sk-xxx...
```

**Optional:**
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Security Best Practices

**1. Never Commit Secrets**
```gitignore
.env.local
.env*.local
.env.production
```

**2. Use Different Keys Per Environment**
- Development: Use test/sandbox keys
- Production: Use production keys
- Rotate keys regularly

**3. Rate Limiting**
- Implement API rate limiting
- Monitor usage
- Set budget alerts

**4. CORS Configuration**
Already configured in API routes:
```typescript
headers: {
  'Access-Control-Allow-Origin': '*', // Restrict in production
  'Access-Control-Allow-Methods': 'GET,POST',
}
```

For production, restrict to your domain:
```typescript
'Access-Control-Allow-Origin': 'https://yourdomain.com'
```

---

## Post-Deployment

### Verify Production

**1. Functional Testing**
- [ ] Homepage loads correctly
- [ ] Script generation works
- [ ] Both AI providers work
- [ ] Export downloads successfully
- [ ] Error handling works

**2. Performance Testing**
- [ ] Page load < 2 seconds
- [ ] Generation < 5 seconds
- [ ] Export < 3 seconds
- [ ] No console errors

**3. Mobile Testing**
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Export works on mobile
- [ ] Text is readable

### Configure Monitoring

**Vercel Analytics (Recommended)**
1. Enable in Project Settings > Analytics
2. Free on all plans
3. See page views, performance, demographics

**Custom Monitoring**
Add to `app/spark/layout.tsx`:
```typescript
// Google Analytics
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXX" />

// PostHog, Mixpanel, etc.
```

### Set Up Alerts

**Vercel Notifications:**
1. Go to Project Settings > Notifications
2. Enable:
   - Deployment failures
   - Performance degradation
   - Budget alerts

**API Budget Alerts:**
1. Anthropic Console: Set budget alerts
2. OpenAI Dashboard: Set usage notifications

---

## Monitoring and Maintenance

### Daily Monitoring

**Check Daily:**
- Deployment status (Vercel dashboard)
- Error logs (Vercel logs)
- API usage (AI provider dashboards)
- User feedback

**Vercel Logs:**
```bash
# Install Vercel CLI
vercel logs --prod

# Filter by function
vercel logs --prod -n 100
```

### Weekly Maintenance

**Review Weekly:**
- Analytics and usage trends
- Performance metrics
- API costs
- User-reported issues

**Update Dependencies:**
```bash
npm outdated
npm update
npm audit fix
```

### Monthly Tasks

**Check Monthly:**
- Security updates
- Dependency vulnerabilities
- API key rotation
- Backup configurations

### Scaling Considerations

**When to Scale:**
- >100 active users
- >1000 scripts/day
- API rate limits hit
- Performance degradation

**Scaling Options:**
1. **Upgrade Vercel plan** (Pro $20/mo)
2. **Implement caching** (Redis)
3. **Add rate limiting** (Upstash)
4. **Optimize prompts** (reduce token usage)
5. **Consider queue system** (Bull, BeeQueue)

---

## Troubleshooting

### Build Failures

**Issue: "Module not found" during build**
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue: "Environment variable not found"**
- Verify environment variables are set in Vercel
- Check variable names match exactly
- Ensure variables are marked for Production environment

### Runtime Errors

**Issue: "API key not configured"**
- Check environment variables in Vercel dashboard
- Verify variable names: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- Redeploy after adding variables

**Issue: "Generation timeout"**
- AI API might be slow
- Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "app/spark/actions/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**Issue: "Export failed"**
- Check browser console for errors
- Verify API route is deployed
- Test directly: `https://yourdomain.com/api/export`

### Performance Issues

**Issue: Slow page load**
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
# Lazy load components
# Enable Next.js caching
```

**Issue: High API costs**
- Switch to cheaper models (GPT-3.5, Claude Haiku)
- Implement caching for common requests
- Add rate limiting per user

---

## Rollback Procedure

If deployment fails or has critical bugs:

**Vercel (Instant Rollback)**
1. Go to Deployments tab
2. Find last working deployment
3. Click "..." menu
4. Select "Promote to Production"
5. Instant rollback (0 downtime)

**Git Rollback**
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the revert
```

---

## Security Checklist

Before going live:

- [ ] No API keys in code
- [ ] Environment variables secure
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] HTTPS enabled (auto with Vercel)
- [ ] No sensitive data logged
- [ ] CSP headers configured
- [ ] Dependencies up to date

---

## Launch Checklist

Ready to launch? Verify:

- [ ] Production deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] All features tested in production
- [ ] Monitoring and alerts configured
- [ ] Documentation up to date
- [ ] Team has access to dashboards
- [ ] Backup/rollback plan ready
- [ ] Support channels established
- [ ] Launch announcement prepared

---

## Next Steps

After successful deployment:

1. **Announce launch** to beta users
2. **Monitor closely** for first 48 hours
3. **Collect feedback** actively
4. **Iterate** based on usage patterns
5. **Plan MVP 2** features

---

**Related Documentation:**
- User Guide: `USER_GUIDE.md`
- Unity Import Guide: `UNITY_IMPORT_GUIDE.md`
- Testing Guide: `TESTING_GUIDE.md`

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- SPARK Issues: [Your GitHub repo]

**Generated by SPARK - Production-Ready AI Development**
