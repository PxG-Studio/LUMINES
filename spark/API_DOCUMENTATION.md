# SPARK MVP 1 API Documentation

## Endpoints

### POST /api/export

Export generated Unity C# code as a ZIP file.

**Request:**
```json
{
  "code": "using UnityEngine;\n\npublic class PlayerController : MonoBehaviour {\n  // ...",
  "scriptName": "PlayerController"
}
```

**Response:**
- **Success (200):** ZIP file download
  - Content-Type: `application/zip`
  - Content-Disposition: `attachment; filename="PlayerController.zip"`

- **Error (400):** Missing required fields
  ```json
  {
    "error": "Missing code or scriptName"
  }
  ```

- **Error (429):** Rate limit exceeded
  ```json
  {
    "error": "Too Many Requests",
    "message": "Too many requests, please try again later.",
    "retryAfter": 900
  }
  ```

- **Error (500):** Server error
  ```json
  {
    "error": "Failed to generate export"
  }
  ```

**Rate Limiting:**
- 100 requests per 15 minutes per IP
- Headers included in response:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Unix timestamp when limit resets
  - `Retry-After`: Seconds until retry (if rate limited)

### GET /api/spark/health

Health check endpoint for SPARK service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-07T14:00:00.000Z",
  "service": "spark",
  "version": "1.0.0",
  "checks": {
    "apiKeys": {
      "anthropic": true,
      "openai": false,
      "status": "configured"
    },
    "memory": "healthy"
  }
}
```

**Status Codes:**
- **200:** Service is healthy
- **503:** Service is degraded or unhealthy

## Server Actions

### generateUnityScript

Server action for generating Unity C# code.

**Usage:**
```typescript
import { generateUnityScript } from "@/app/spark/actions/generate";

const result = await generateUnityScript("Create a PlayerController script", {
  provider: "claude", // or "openai"
  claudeModel: "claude-sonnet-3-5-20241022",
  openaiModel: "gpt-4",
});
```

**Parameters:**
- `prompt` (string, required): Natural language description of desired script
- `options` (object, optional):
  - `provider`: "claude" | "openai" (default: "claude")
  - `claudeModel`: Claude model to use
  - `openaiModel`: OpenAI model to use
  - `userId`: User ID for logging (optional)

**Returns:**
```typescript
{
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
  tokensUsed?: number;
  inputTokens?: number;
  outputTokens?: number;
}
```

**Errors:**
- API key not configured
- API request failed
- Code validation failed
- Network error

## Rate Limiting

### Limits

- **Standard:** 100 requests per 15 minutes per IP
- **Strict:** 10 requests per minute per IP
- **Relaxed:** 1000 requests per hour per IP

### Headers

All rate-limited endpoints include:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Exceeding Limits

When rate limit is exceeded:
- HTTP 429 status code
- `Retry-After` header with seconds to wait
- Error message in response body

## Error Handling

### Error Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": "Additional context (optional)"
}
```

### Common Errors

1. **Missing API Key**
   - Error: "Claude API key not configured"
   - Solution: Add `ANTHROPIC_API_KEY` to `.env.local`

2. **Invalid API Key**
   - Error: "Invalid API key"
   - Solution: Verify key is correct and active

3. **Rate Limit Exceeded**
   - Error: "Too Many Requests"
   - Solution: Wait for rate limit window to reset

4. **Validation Failed**
   - Error: "Generated code has errors: ..."
   - Solution: Try generating again with clearer prompt

5. **Network Error**
   - Error: "Network request failed"
   - Solution: Check internet connection and API provider status

## Request Logging

All API requests are logged with:
- Timestamp
- Method and path
- Status code
- Duration
- IP address
- Error details (if any)

Logs are output to console in JSON format for production log aggregation.

---

**Version:** 1.0.0  
**Last Updated:** December 2024

