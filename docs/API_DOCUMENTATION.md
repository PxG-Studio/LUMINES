# WIS2L API Documentation

**Base URL:** `/api`  
**Version:** 1.0.0  
**Authentication:** Bearer Token (JWT)

---

## Authentication

### POST /api/auth/refresh

Refresh an access token using a refresh token.

**Request Body:**
```json
{
  "refresh_token": "string"
}
```

**Response (200 OK):**
```json
{
  "access_token": "string",
  "expires_in": 900,
  "token_type": "Bearer",
  "refresh_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "roles": ["string"]
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid or expired refresh token"
}
```

### PUT /api/auth/refresh

Refresh an access token using refresh token from Authorization header.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response:** Same as POST /api/auth/refresh

### GET /api/auth/verify

Verify the current access token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "valid": true,
  "userId": "string",
  "email": "string",
  "roles": ["string"],
  "expiresAt": "ISO8601 string"
}
```

---

## Users

### GET /api/users

Get all users with pagination, filtering, and sorting.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `filter[email]` (string) - Filter by email
- `filter[name]` (string) - Filter by name
- `filter[roles]` (string) - Filter by roles (comma-separated)
- `sort` (string, default: createdAt) - Sort field
- `order` (asc|desc, default: desc) - Sort order

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "email": "string",
      "name": "string",
      "roles": ["string"],
      "createdAt": "ISO8601 string",
      "updatedAt": "ISO8601 string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### POST /api/users

Create a new user.

**Request Body:**
```json
{
  "email": "string",
  "name": "string (optional)",
  "roles": ["string"] // optional, default: ["user"]
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "roles": ["string"],
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### GET /api/users/[id]

Get a specific user by ID.

**Response (200 OK):**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "roles": ["string"],
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### PUT /api/users/[id]

Update a user.

**Request Body:**
```json
{
  "name": "string (optional)",
  "roles": ["string"] // optional
}
```

**Response (200 OK):** Updated user object

### DELETE /api/users/[id]

Delete a user.

**Response (204 No Content)**

---

## Projects

### GET /api/projects

Get all projects with pagination, filtering, and sorting.

**Query Parameters:** Same as Users endpoint

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "engine": "string",
      "platform": "string",
      "userId": "string",
      "createdAt": "ISO8601 string",
      "updatedAt": "ISO8601 string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### POST /api/projects

Create a new project.

**Request Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "engine": "string (default: unity)",
  "platform": "string (default: webgl)",
  "templateId": "string (optional)"
}
```

**Response (201 Created):** Project object

### GET /api/projects/[id]

Get a specific project by ID.

**Response (200 OK):** Project object with relations

### PUT /api/projects/[id]

Update a project.

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "engine": "string (optional)",
  "platform": "string (optional)"
}
```

**Response (200 OK):** Updated project object

### DELETE /api/projects/[id]

Delete a project.

**Response (204 No Content)**

---

## Components

### GET /api/components

Get all components with pagination, filtering, and sorting.

**Query Parameters:** Same as Users endpoint, plus:
- `filter[projectId]` (string) - Filter by project
- `filter[type]` (string) - Filter by component type

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "language": "string",
      "projectId": "string",
      "userId": "string",
      "createdAt": "ISO8601 string",
      "updatedAt": "ISO8601 string"
    }
  ],
  "pagination": { ... }
}
```

### POST /api/components

Create a new component.

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "content": "string",
  "language": "string (default: csharp)",
  "projectId": "string (optional)",
  "prompt": "string (optional)",
  "model": "string (optional)"
}
```

**Response (201 Created):** Component object

### GET /api/components/[id]

Get a specific component by ID.

**Response (200 OK):** Component object with content

### PUT /api/components/[id]

Update a component.

**Request Body:**
```json
{
  "name": "string (optional)",
  "content": "string (optional)",
  "type": "string (optional)"
}
```

**Response (200 OK):** Updated component object

### DELETE /api/components/[id]

Delete a component.

**Response (204 No Content)**

---

## Builds

### GET /api/builds

Get all builds with pagination, filtering, and sorting.

**Query Parameters:** Same as Components endpoint, plus:
- `filter[status]` (string) - Filter by build status
- `filter[projectId]` (string) - Filter by project

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "projectId": "string",
      "userId": "string",
      "status": "string",
      "progress": 0,
      "target": "string",
      "configuration": "string",
      "createdAt": "ISO8601 string",
      "completedAt": "ISO8601 string"
    }
  ],
  "pagination": { ... }
}
```

### POST /api/builds

Create a new build.

**Request Body:**
```json
{
  "projectId": "string",
  "target": "string (default: webgl)",
  "configuration": "string (default: development)"
}
```

**Response (201 Created):** Build object

---

## Deployments

### GET /api/deployments

Get all deployments with pagination, filtering, and sorting.

**Query Parameters:** Same as Builds endpoint, plus:
- `filter[environment]` (string) - Filter by environment (staging|production)
- `filter[status]` (string) - Filter by deployment status

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "projectId": "string",
      "userId": "string",
      "buildId": "string",
      "environment": "string",
      "status": "string",
      "version": "string",
      "url": "string",
      "createdAt": "ISO8601 string",
      "deployedAt": "ISO8601 string"
    }
  ],
  "pagination": { ... }
}
```

### POST /api/deployments

Create a new deployment.

**Request Body:**
```json
{
  "projectId": "string",
  "buildId": "string (optional)",
  "environment": "string (default: staging)",
  "version": "string"
}
```

**Response (201 Created):** Deployment object

### POST /api/deployments/[id]/rollback

Rollback a deployment (admin only).

**Response (200 OK):**
```json
{
  "message": "Deployment rolled back successfully",
  "deployment": { ... }
}
```

---

## Templates

### GET /api/templates

Get all templates with pagination, filtering, and sorting.

**Query Parameters:**
- `filter[engine]` (string) - Filter by engine
- `filter[category]` (string) - Filter by category
- Other standard pagination/filtering params

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "engine": "string",
      "category": "string",
      "createdAt": "ISO8601 string"
    }
  ],
  "pagination": { ... }
}
```

**Note:** Templates are publicly accessible (no authentication required for GET)

### GET /api/templates/[id]

Get a template by ID or slug.

**Response (200 OK):** Template object

---

## Design Tokens

### GET /api/tokens

Get all design tokens with pagination, filtering, and sorting.

**Query Parameters:**
- `filter[category]` (string) - Filter by category
- `filter[group]` (string) - Filter by group
- Other standard pagination/filtering params

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "value": "string",
      "group": "string",
      "version": 1,
      "createdAt": "ISO8601 string"
    }
  ],
  "pagination": { ... }
}
```

**Note:** Tokens are cached for 1 hour

---

## Health & Monitoring

### GET /api/health

Health check endpoint for Kubernetes probes.

**Response (200 OK):**
```json
{
  "status": "ok|degraded|unhealthy",
  "timestamp": "ISO8601 string",
  "services": {
    "database": {
      "status": "healthy|unhealthy|not_configured",
      "message": "string",
      "healthy": true
    },
    "redis": { ... },
    "nats": { ... }
  },
  "uptime": 12345
}
```

### GET /api/metrics

Get Prometheus-compatible metrics (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```
# Prometheus metrics format
http_requests_total{method="GET",path="/api/users",status="200"} 1234
...
```

### GET /api/performance

Get performance metrics and statistics (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "memory": {
    "heapUsed": 12345678,
    "heapTotal": 23456789,
    "external": 3456789,
    "rss": 45678901,
    "heapUsedPercentage": 52.5
  },
  "api": {
    "responseTime": {
      "count": 1000,
      "avg": 125.5,
      "min": 50,
      "max": 500,
      "p50": 120,
      "p95": 250,
      "p99": 400
    }
  },
  "database": { ... },
  "cache": { ... }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["field"],
      "message": "Error message"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authorization header"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Rate limits are applied per user based on their subscription tier:

- **Free:** 10 requests/minute
- **Pro:** 100 requests/minute
- **Enterprise:** 1000 requests/minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

All list endpoints support pagination with the following parameters:

- `page` - Page number (1-indexed)
- `limit` - Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering

Filtering uses query parameters in the format:
```
?filter[field]=value&filter[field2]=value2
```

Multiple values can be comma-separated:
```
?filter[roles]=admin,user
```

---

## Sorting

Sorting uses query parameters:
```
?sort=field&order=asc|desc
```

Multiple fields can be comma-separated:
```
?sort=createdAt,updatedAt&order=desc,asc
```

---

## Caching

Some endpoints support caching. Cache-Control headers indicate:
- `public, max-age=60` - Public cache, 60 seconds
- `private, max-age=300` - Private cache, 300 seconds
- `no-store` - No caching

---

## Webhooks & Events

The API publishes events to NATS for the following actions:

- `component.created`, `component.updated`, `component.deleted`
- `build.started`, `build.progress`, `build.completed`, `build.failed`
- `deployment.started`, `deployment.completed`, `deployment.failed`, `deployment.rolledBack`
- `token.updated`, `token.synced`

Subscribers can listen to these events for real-time updates.

---

## Security

- All endpoints (except `/api/health` and public template endpoints) require authentication
- JWT tokens expire in 15 minutes (access) or 7 days (refresh)
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS is configured for allowed origins only
- Security headers are set on all responses

---

**Last Updated:** December 2024

