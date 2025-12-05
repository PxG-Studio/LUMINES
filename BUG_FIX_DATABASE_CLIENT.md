# Bug Fix: PostgreSQL Client in Browser

## Issue
The error `pg.js: Uncaught ReferenceError: process is not defined` was occurring because PostgreSQL client code was being imported into browser-side React hooks.

## Root Cause
- React hooks (`useProjects`, `useFiles`, `useAssets`) were directly importing database operations
- Database operations imported `pg` (PostgreSQL client) which is a Node.js library
- When bundled for the browser, `pg` tries to access `process`, `net`, `tls`, etc. which don't exist

## Solution
Created a client-side API wrapper that uses `fetch()` to call backend API routes instead of directly accessing the database:

### Changes Made

1. **Created API Client** (`src/lib/api/client.ts`)
   - Type-safe wrapper around `fetch()`
   - Handles GET, POST, PUT, DELETE requests
   - Centralized error handling

2. **Updated Hooks**
   - `useProjects.ts` - Now calls `/api/projects` instead of direct database operations
   - `useFiles.ts` - Now calls `/api/files`
   - `useAssets.ts` - Now calls `/api/assets`

### Required: Create API Routes

You need to create API routes in your Next.js app (or Express/Fastify server) that handle these endpoints:

#### Projects API
```typescript
// /api/projects
GET    /api/projects?userId={userId}       // List projects
POST   /api/projects                       // Create project
GET    /api/projects/{id}                  // Get project
PUT    /api/projects/{id}                  // Update project
DELETE /api/projects/{id}                  // Delete project
```

#### Files API
```typescript
// /api/files
GET    /api/files?projectId={projectId}    // List files
POST   /api/files                          // Create file
PUT    /api/files/{id}                     // Update file
DELETE /api/files/{id}                     // Delete file
```

#### Assets API
```typescript
// /api/assets
GET    /api/assets?projectId={projectId}   // List assets
POST   /api/assets                         // Create asset
PUT    /api/assets/{id}                    // Update asset
DELETE /api/assets/{id}                    // Delete asset
```

### Implementation Example

```typescript
// app/api/projects/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import * as projectOps from '@/lib/database/operations/projects';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const projects = await projectOps.listProjects(userId);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await projectOps.createProject(body);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
```

## Other Console Errors

### Sentry Errors (Can Ignore)
```
o4509445939331072.ingest.us.sentry.io: ERR_BLOCKED_BY_CLIENT
```
These are blocked by ad blocker/content blocker. Not a real issue.

### Base64 Decoding Errors (Can Ignore)
```
Error decoding value: SyntaxError: Found a character...
```
Analytics/tracking code trying to decode invalid cookies. Not affecting functionality.

### GitHub API Error (Not Your Code)
```
HiroyasuDev does not have the correct permissions to execute CreateCommitOnBranch
```
This is Bolt.new trying to commit to GitHub. Not related to SPARK project.

## Testing
After creating the API routes:

```bash
# Build should succeed without pg errors
npm run build

# Test in browser
npm run dev
# Open browser console - should see no pg/process errors
```

## Status
- ✅ Client-side hooks updated to use API client
- ⚠️ API routes need to be created (see implementation example above)
- ✅ Database operations remain server-side only
