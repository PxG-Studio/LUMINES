# SPARK MVP 1 Deployment Checklist

**Complete checklist for deploying SPARK MVP 1 to production.**

---

## Pre-Deployment Validation

### Code Quality
- [ ] Run validation script: `npm run validate:spark` or `tsx spark/scripts/validate-mvp1.ts`
- [ ] All TypeScript compilation passes: `npm run typecheck`
- [ ] All linter checks pass: `npm run lint`
- [ ] No critical errors in build: `npm run build`
- [ ] All tests pass (if applicable): `npm run test`

### Component Verification
- [ ] MCPChat component renders correctly
- [ ] PreviewPanel displays code with Monaco Editor
- [ ] ExportButton triggers download correctly
- [ ] ErrorBoundary catches and displays errors
- [ ] All components integrate properly (data flows: Chat → Preview → Export)

### API Routes
- [ ] `/api/export` route responds correctly
- [ ] `/api/spark/health` route returns healthy status
- [ ] Rate limiting is active on `/api/export`
- [ ] Request logging is working
- [ ] Error logging is working

### AI Integration
- [ ] Claude API integration works (test with valid API key)
- [ ] OpenAI API integration works (test with valid API key)
- [ ] Error handling for API failures works
- [ ] Retry logic works for transient failures
- [ ] Token usage tracking works

### Export System
- [ ] ZIP generation creates valid Unity structure
- [ ] `.meta` files are generated correctly
- [ ] ZIP file downloads successfully
- [ ] ZIP file can be extracted
- [ ] Extracted files have correct structure (`Assets/Scripts/`)

### Validation
- [ ] C# code validation works
- [ ] Script name extraction works
- [ ] Validation errors are displayed to user
- [ ] Invalid code is rejected with clear error messages

---

## Environment Configuration

### Required Environment Variables
- [ ] `ANTHROPIC_API_KEY` is set (for Claude)
- [ ] `OPENAI_API_KEY` is set (for OpenAI)
- [ ] `NEXT_PUBLIC_APP_URL` is set (for production URL)
- [ ] Database connection string is configured
- [ ] Redis connection (if used) is configured
- [ ] All environment variables are documented in `.env.example`

### Security
- [ ] API keys are stored securely (not in code)
- [ ] Rate limiting is configured appropriately
- [ ] CORS is configured correctly
- [ ] Security headers are set
- [ ] Error messages don't leak sensitive information

---

## Database Setup

### Prisma
- [ ] Database schema is up to date: `npx prisma migrate deploy`
- [ ] Database connection is tested
- [ ] User preferences table exists
- [ ] Generation logs table exists
- [ ] All migrations are applied

### Data
- [ ] Seed data is loaded (if needed)
- [ ] Test user accounts exist (if needed)
- [ ] Database backups are configured

---

## Build & Deployment

### Build Process
- [ ] Production build succeeds: `npm run build`
- [ ] Build output is verified
- [ ] Static assets are generated correctly
- [ ] No build warnings or errors

### Deployment Steps
- [ ] Code is committed to `develop` branch
- [ ] All changes are reviewed
- [ ] Code is merged to `main` branch (or deployment branch)
- [ ] Deployment pipeline is triggered
- [ ] Deployment completes successfully
- [ ] Health check endpoint returns 200

---

## Post-Deployment Verification

### Functional Testing
- [ ] Access SPARK page: `/spark`
- [ ] UI loads correctly
- [ ] Chat interface is functional
- [ ] Generate a test script with Claude
- [ ] Generate a test script with OpenAI
- [ ] Preview panel displays generated code
- [ ] Export button downloads ZIP file
- [ ] ZIP file structure is correct
- [ ] Error handling works (test with invalid API key)

### Performance
- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Code generation completes in reasonable time (< 30 seconds)
- [ ] Export generation is fast (< 5 seconds)
- [ ] No memory leaks during extended use

### Monitoring
- [ ] Health check endpoint is monitored
- [ ] Error logs are being collected
- [ ] Request logs are being collected
- [ ] API usage metrics are tracked
- [ ] Alerting is configured (if applicable)

### User Testing
- [ ] Test with real Unity project
- [ ] Import exported ZIP into Unity Editor
- [ ] Verify script compiles in Unity
- [ ] Verify script runs in Unity
- [ ] Document any issues found

---

## Rollback Plan

### If Deployment Fails
- [ ] Rollback procedure is documented
- [ ] Previous version is tagged in Git
- [ ] Database migration rollback is tested
- [ ] Rollback can be executed quickly (< 5 minutes)

### If Issues Are Found Post-Deployment
- [ ] Issue severity is assessed
- [ ] Hotfix procedure is documented
- [ ] Emergency contact list is available
- [ ] Rollback decision criteria are defined

---

## Documentation

### User Documentation
- [ ] User guide is complete: `spark/USER_GUIDE_MVP1.md`
- [ ] Environment setup guide is complete: `spark/ENV_SETUP.md`
- [ ] Troubleshooting guide is complete: `spark/TROUBLESHOOTING.md`
- [ ] API documentation is complete: `spark/API_DOCUMENTATION.md`

### Developer Documentation
- [ ] Architecture is documented
- [ ] Component structure is documented
- [ ] API endpoints are documented
- [ ] Environment variables are documented

---

## Sign-Off

### Technical Sign-Off
- [ ] Code review completed
- [ ] Technical lead approval
- [ ] QA testing completed (if applicable)

### Business Sign-Off
- [ ] Product owner approval
- [ ] Stakeholder approval (if required)

### Deployment Sign-Off
- [ ] DevOps approval
- [ ] Security review completed
- [ ] Final deployment approval

---

## Post-Launch

### Monitoring (First 24 Hours)
- [ ] Monitor error rates
- [ ] Monitor API usage
- [ ] Monitor response times
- [ ] Monitor user feedback
- [ ] Check logs for issues

### Support
- [ ] Support team is briefed
- [ ] Known issues are documented
- [ ] User feedback collection is set up
- [ ] Bug reporting process is active

---

## Notes

- Keep this checklist updated as the system evolves
- Add specific items for your deployment environment
- Customize based on your infrastructure setup
- Review and update before each deployment

---

**Last Updated:** December 2024  
**Version:** MVP 1

