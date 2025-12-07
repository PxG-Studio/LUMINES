# Sentry Error Monitoring Setup for SPARK

**Complete guide for setting up Sentry error monitoring in SPARK MVP 1**

---

## Overview

SPARK includes Sentry integration for production error monitoring. Sentry provides:
- Real-time error tracking
- Error aggregation and grouping
- Stack traces and context
- Performance monitoring
- Release tracking

---

## Installation

### Option 1: Using npm (Recommended)

```bash
npm install @sentry/nextjs --save
```

### Option 2: Using yarn

```bash
yarn add @sentry/nextjs
```

---

## Configuration

### 1. Get Sentry DSN

1. Go to [sentry.io](https://sentry.io)
2. Create a new project (or use existing)
3. Select "Next.js" as the platform
4. Copy your DSN (Data Source Name)

### 2. Set Environment Variables

Add to `.env.local` (development) or your production environment:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Optional: Release tracking
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Environment name
NODE_ENV=production
```

### 3. Initialize Sentry

Sentry is automatically initialized when SPARK loads. The initialization happens in:
- `src/lib/spark/monitoring/sentry.ts` - Sentry integration
- `src/app/spark/init.ts` - SPARK initialization

**No additional code changes needed** - Sentry will initialize automatically if `SENTRY_DSN` is set.

---

## Usage

### Automatic Error Tracking

Errors are automatically captured by:
- **ErrorBoundary** - React component errors
- **Error Logger** - Server-side errors
- **API Routes** - API errors
- **Global Error Handler** - Unhandled errors

### Manual Error Tracking

You can manually capture errors:

```typescript
import { captureException, captureMessage } from '@/lib/spark/monitoring/sentry';

// Capture an exception
try {
  // Some code that might throw
} catch (error) {
  await captureException(error, {
    tags: {
      component: 'MyComponent',
      feature: 'code-generation',
    },
    extra: {
      userId: 'user-123',
      prompt: 'Create a player controller',
    },
    level: 'error',
  });
}

// Capture a message
await captureMessage('Something important happened', 'info', {
  tags: { feature: 'export' },
  extra: { scriptName: 'PlayerController' },
});
```

### Set User Context

```typescript
import { setUser } from '@/lib/spark/monitoring/sentry';

await setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'username',
});
```

---

## Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SENTRY_DSN` | Sentry DSN for server-side | Yes |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for client-side | Yes |
| `NEXT_PUBLIC_APP_VERSION` | App version for release tracking | No |
| `NODE_ENV` | Environment (production/development) | No |

### Sentry Options

The Sentry integration is configured with:
- **Traces Sample Rate:** 10% in production, 100% in development
- **Environment:** From `NODE_ENV`
- **Release:** From `NEXT_PUBLIC_APP_VERSION`
- **Before Send:** Filters sensitive data (API keys, etc.)

---

## Security

### Data Filtering

Sentry automatically filters sensitive data:
- API keys in headers
- Authorization tokens
- Request bodies with sensitive information

### Custom Filtering

You can add custom filtering in `src/lib/spark/monitoring/sentry.ts`:

```typescript
beforeSend(event) {
  // Your custom filtering logic
  return event;
}
```

---

## Testing

### Test Sentry Integration

1. Set `SENTRY_DSN` in `.env.local`
2. Start the app: `npm run dev`
3. Trigger an error (e.g., invalid API call)
4. Check Sentry dashboard for the error

### Disable Sentry

To disable Sentry:
- Remove `SENTRY_DSN` from environment variables
- Or set `SENTRY_DSN=""`

The app will continue to work without Sentry - it just won't track errors.

---

## Monitoring

### Sentry Dashboard

Access your Sentry dashboard at:
- https://sentry.io/organizations/your-org/issues/

### Key Metrics

Monitor:
- Error rate
- Error frequency
- Affected users
- Error trends
- Performance issues

### Alerts

Set up alerts in Sentry for:
- Critical errors
- Error rate spikes
- New error types
- Performance degradation

---

## Troubleshooting

### Sentry Not Initializing

**Problem:** Errors not appearing in Sentry

**Solutions:**
1. Verify `SENTRY_DSN` is set correctly
2. Check browser console for Sentry initialization messages
3. Verify `@sentry/nextjs` is installed
4. Check network tab for Sentry API calls

### Too Many Errors

**Problem:** Sentry is capturing too many errors

**Solutions:**
1. Adjust `tracesSampleRate` in `sentry.ts`
2. Add filtering in `beforeSend`
3. Configure error grouping in Sentry dashboard

### Missing Context

**Problem:** Errors lack context

**Solutions:**
1. Add tags when capturing errors
2. Set user context
3. Add extra data to error captures

---

## Best Practices

### 1. Use Appropriate Error Levels

- **error:** Actual errors that need attention
- **warning:** Warnings that might become errors
- **info:** Informational messages

### 2. Add Context

Always include:
- Component/feature name
- User ID (if available)
- Relevant request data
- Error type

### 3. Don't Log Sensitive Data

Never log:
- API keys
- Passwords
- Personal information
- Credit card numbers

### 4. Group Related Errors

Use tags to group related errors:
- `component: 'MCPChat'`
- `feature: 'code-generation'`
- `error_type: 'APIError'`

---

## Production Checklist

- [ ] Sentry DSN configured
- [ ] `@sentry/nextjs` installed
- [ ] Environment variables set
- [ ] Error tracking tested
- [ ] Alerts configured
- [ ] Data filtering verified
- [ ] Release tracking enabled

---

## Support

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **SPARK Docs:** `spark/API_DOCUMENTATION.md`
- **Troubleshooting:** `spark/TROUBLESHOOTING.md`

---

**Last Updated:** December 2024  
**Version:** 1.0.0

