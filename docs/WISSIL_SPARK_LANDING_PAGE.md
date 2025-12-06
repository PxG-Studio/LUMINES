# WISSIL SPARK Landing Page — Comprehensive Documentation

**Version:** 1.0.0  
**Date:** 2025-11-28  
**Target:** Agent building SPARK landing page  
**System:** SPARK — AI Component Generator  
**Location:** Helios Compute (192.168.86.115:3003)  
**Domain:** spark.lumenforge.io (via Cloudflared tunnel)  
**Color Identity:** Yellow (#FBBF24) → Amber (#F59E0B)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture & Infrastructure](#system-architecture--infrastructure)
3. [Network Topology & Deployment](#network-topology--deployment)
4. [Component Library & UI/UX Specifications](#component-library--uiux-specifications)
5. [Design System Integration](#design-system-integration)
6. [Page Structure & Layout](#page-structure--layout)
7. [Interactive Elements & Animations](#interactive-elements--animations)
8. [Integration Points](#integration-points)
9. [Content Guidelines](#content-guidelines)
10. [Implementation Guide](#implementation-guide)
11. [Performance Optimization](#performance-optimization)
12. [Accessibility Requirements](#accessibility-requirements)
13. [Testing Strategy](#testing-strategy)
14. [Deployment & CI/CD](#deployment--cicd)
15. [Monitoring & Observability](#monitoring--observability)
16. [Troubleshooting](#troubleshooting)
17. [Reference Materials](#reference-materials)

---

## Executive Summary

The **SPARK** landing page serves as the primary entry point for the AI-powered component generation system within the WISSIL ecosystem. SPARK leverages a Mixture of Experts (MoE) architecture with three specialized AI models (Design Expert, Logic Expert, Performance Expert) to generate production-ready React components from natural language prompts.

### Key Capabilities

- **Natural Language to Code**: Convert descriptive prompts into fully functional React components
- **Context-Aware Generation**: Understands project structure, existing components, and design tokens
- **Multi-Expert Collaboration**: Three specialized AI models work together for optimal output
- **MCP Integration**: Seamless integration with Model Context Protocol for file system operations
- **Real-Time Preview**: Instant component preview via IGNIS hot-reload
- **Production-Ready Output**: Generated code includes TypeScript types, tests, and Storybook stories

### Infrastructure Context

SPARK operates on **Helios Compute (192.168.86.115)** at port **3003**, accessible via Cloudflared tunnel at `spark.lumenforge.io`. The system integrates with:

- **SLATE** (port 3001): Design token system for consistent styling
- **IGNIS** (port 3004): Development server for hot-reload preview
- **WAYPOINT** (port 3005): Component registry and deployment
- **PostgreSQL** (192.168.86.27:5432): Component metadata and generation history
- **Redis** (192.168.86.27:6379): Generation cache and rate limiting
- **NATS** (192.168.86.27:4222): Real-time event streaming for generation status

---

## System Architecture & Infrastructure

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                            │
│              (spark.lumenforge.io)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── Cloudflare Zero Trust
                            │    (Authentication Layer)
                            │
┌─────────────────────────────────────────────────────────────┐
│              Cloudflared Tunnel (WISSIL)                     │
│              Route: spark.lumenforge.io                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── HTTPS (TLS 1.3)
                            │
┌─────────────────────────────────────────────────────────────┐
│         Helios Compute (192.168.86.115:3003)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         SPARK Landing Page (Next.js 14)             │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Frontend Components                         │   │    │
│  │  │  - Hero Section                              │   │    │
│  │  │  - Prompt Input                             │   │    │
│  │  │  - Expert Display                           │   │    │
│  │  │  - Code Output                              │   │    │
│  │  │  - Integration Cards                        │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  API Layer (Next.js API Routes)              │   │    │
│  │  │  - /api/generate                             │   │    │
│  │  │  - /api/experts                              │   │    │
│  │  │  - /api/status                               │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  MoE AI Backend (Distributed)                       │    │
│  │  - Design Expert (GPT-4 Vision)                    │    │
│  │  - Logic Expert (Claude Sonnet)                    │    │
│  │  - Performance Expert (GPT-4 Turbo)                 │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─── WebSocket (HMR)
                            │    (192.168.86.114:24678)
                            │
┌─────────────────────────────────────────────────────────────┐
│         Synology NAS (192.168.86.27)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │    Redis     │  │    NATS      │      │
│  │  :5432       │  │    :6379     │  │    :4222     │      │
│  │              │  │              │  │              │      │
│  │ - Components │  │ - Cache      │  │ - Events     │      │
│  │ - History    │  │ - Rate Limit │  │ - Status     │      │
│  │ - Metadata   │  │ - Sessions   │  │ - Streaming  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Generation Flow

```
User Prompt Input
    ↓
Prompt Analysis (Intent Detection)
    ↓
Expert Routing Algorithm
    ├─── Design Expert (Visual keywords)
    ├─── Logic Expert (State/API keywords)
    └─── Performance Expert (Optimization keywords)
    ↓
Parallel Expert Generation
    ├─── Design Expert → Structure + Styles
    ├─── Logic Expert → State + Interactions
    └─── Performance Expert → Optimizations
    ↓
Code Synthesis & Validation
    ├─── TypeScript Compilation
    ├─── ESLint Validation
    ├─── Accessibility Check
    └─── Performance Audit
    ↓
Output Generation
    ├─── Component Code (.tsx)
    ├─── Unit Tests (.test.tsx)
    ├─── Storybook Story (.stories.tsx)
    └─── Type Definitions (.d.ts)
    ↓
MCP Write Operation
    ├─── Write to File System
    ├─── Update Component Registry
    └─── Trigger IGNIS Hot-Reload
    ↓
Real-Time Preview (IGNIS)
    └─── Live Component Rendering
```

### Database Schema

**PostgreSQL Tables:**

```sql
-- Component Generation History
CREATE TABLE spark_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    prompt TEXT NOT NULL,
    generated_code TEXT NOT NULL,
    expert_route JSONB NOT NULL, -- Which experts were used
    generation_time_ms INTEGER NOT NULL,
    token_usage JSONB, -- Token counts per expert
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Component Metadata
CREATE TABLE spark_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    file_path TEXT NOT NULL,
    generation_id UUID REFERENCES spark_generations(id),
    dependencies TEXT[],
    size_bytes INTEGER,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Expert Performance Metrics
CREATE TABLE spark_expert_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_name VARCHAR(50) NOT NULL, -- 'design', 'logic', 'performance'
    generation_id UUID REFERENCES spark_generations(id),
    response_time_ms INTEGER,
    token_count INTEGER,
    cache_hit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rate Limiting
CREATE TABLE spark_rate_limits (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMP DEFAULT NOW(),
    tier VARCHAR(20) DEFAULT 'free' -- 'free', 'pro', 'enterprise'
);
```

### Redis Cache Structure

```typescript
// Cache keys for prompt → code generation
interface CacheKey {
  pattern: `spark:generation:${hash(prompt)}:${expert}:${contextHash}`;
  ttl: 3600; // 1 hour
  value: {
    code: string;
    tests: string;
    stories: string;
    metadata: ComponentMetadata;
  };
}

// Rate limiting buckets
interface RateLimitBucket {
  key: `spark:ratelimit:${userId}:${window}`;
  ttl: 60; // 1 minute window
  count: number;
  limit: number; // Based on user tier
}
```

### NATS Event Topics

```typescript
// Real-time generation status updates
const topics = {
  'spark.generation.started': {
    payload: { generationId, userId, prompt, experts },
    subscribers: ['frontend', 'monitoring'],
  },
  'spark.generation.progress': {
    payload: { generationId, expert, progress, status },
    subscribers: ['frontend'],
  },
  'spark.generation.completed': {
    payload: { generationId, component, metrics },
    subscribers: ['frontend', 'ignis', 'waypoint'],
  },
  'spark.generation.failed': {
    payload: { generationId, error, retryable },
    subscribers: ['frontend', 'monitoring'],
  },
};
```

---

## Network Topology & Deployment

### Infrastructure Layout

**Primary Server:**
- **Hostname:** Helios Compute
- **IP Address:** 192.168.86.115
- **Port:** 3003 (HTTP/HTTPS), 3003 (WebSocket for real-time updates)
- **Protocol:** HTTPS (TLS 1.3), WebSocket Secure (WSS)
- **Authentication:** nocturnaID with Agent role minimum

**External Access:**
- **Domain:** spark.lumenforge.io
- **CDN:** Cloudflare (global edge network)
- **Tunnel:** Cloudflared (secure tunnel to internal network)
- **SSL/TLS:** Cloudflare managed certificates (automatic renewal)

**Internal Dependencies:**
- **SLATE:** 192.168.86.115:3001 (design tokens)
- **IGNIS:** 192.168.86.114:3004 (hot-reload preview)
- **WAYPOINT:** 192.168.86.115:3005 (component registry)
- **PostgreSQL:** 192.168.86.27:5432 (metadata storage)
- **Redis:** 192.168.86.27:6379 (caching, rate limiting)
- **NATS:** 192.168.86.27:4222 (event streaming)

### Cloudflared Tunnel Configuration

```yaml
# /etc/cloudflared/config.yml
tunnel: wissil-prod
credentials-file: /etc/cloudflared/cert.json

ingress:
  # SPARK landing page
  - hostname: spark.lumenforge.io
    service: http://192.168.86.115:3003
    originRequest:
      noTLSVerify: false
      connectTimeout: 30s
      tcpKeepAlive: 30s
      httpHostHeader: spark.lumenforge.io
      http2Origin: true

  # SPARK WebSocket (real-time updates)
  - hostname: spark-ws.lumenforge.io
    service: ws://192.168.86.115:3003
    originRequest:
      noTLSVerify: false

  # Catch-all
  - service: http_status:404
```

### Kubernetes Deployment

```yaml
# infrastructure/k8s/production/spark-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spark-landing
  namespace: wissil
  labels:
    app: spark
    component: landing
    tier: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: spark
      component: landing
  template:
    metadata:
      labels:
        app: spark
        component: landing
        version: v1.2.3
    spec:
      containers:
      - name: spark-frontend
        image: registry.nocturna.network/spark:1.2.3
        ports:
        - containerPort: 3003
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_SPARK_API_URL
          value: "https://spark.lumenforge.io/api"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: spark-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: spark-secrets
              key: redis-url
        - name: NATS_URL
          valueFrom:
            secretKeyRef:
              name: spark-secrets
              key: nats-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3003
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3003
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: spark-service
  namespace: wissil
spec:
  selector:
    app: spark
    component: landing
  ports:
  - port: 3003
    targetPort: 3003
    protocol: TCP
    name: http
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: spark-ingress
  namespace: wissil
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - spark.lumenforge.io
    secretName: spark-tls
  rules:
  - host: spark.lumenforge.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: spark-service
            port:
              number: 3003
```

### Environment Variables

```bash
# .env.production
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://spark.lumenforge.io
NEXT_PUBLIC_API_URL=https://spark.lumenforge.io/api

# Authentication
NEXT_PUBLIC_NOCTURNA_ID_URL=https://nocturnaID.org
NOCTURNA_JWT_SECRET=*** # From Kubernetes secret
NOCTURNA_JWT_AUDIENCE=wissil.nocturna.network

# Database
DATABASE_URL=postgresql://spark_user:***@192.168.86.27:5432/spark_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Cache
REDIS_URL=redis://192.168.86.27:6379/0
REDIS_PASSWORD=*** # From Kubernetes secret
REDIS_TTL=3600

# Message Bus
NATS_URL=nats://192.168.86.27:4222
NATS_CLUSTER=wissil-cluster

# AI Backend
SPARK_AI_ENDPOINT=https://api.openai.com/v1
SPARK_AI_API_KEY=*** # From Kubernetes secret
SPARK_ANTHROPIC_API_KEY=*** # From Kubernetes secret
SPARK_DESIGN_EXPERT_MODEL=gpt-4-vision-preview
SPARK_LOGIC_EXPERT_MODEL=claude-sonnet-4
SPARK_PERFORMANCE_EXPERT_MODEL=gpt-4-turbo-preview

# Rate Limiting
SPARK_RATE_LIMIT_FREE=10 # requests per hour
SPARK_RATE_LIMIT_PRO=100
SPARK_RATE_LIMIT_ENTERPRISE=1000

# Monitoring
SENTRY_DSN=*** # From Kubernetes secret
SENTRY_ENVIRONMENT=production
DATADOG_API_KEY=*** # From Kubernetes secret
LOG_LEVEL=info

# Feature Flags
ENABLE_SPARK_AI=true
ENABLE_REAL_TIME_PREVIEW=true
ENABLE_COMPONENT_REGISTRY=true
ENABLE_MCP_INTEGRATION=true
```

### Health Check Endpoints

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      nats: await checkNATS(),
      aiBackend: await checkAIBackend(),
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
  };

  const allHealthy = Object.values(checks.checks).every(c => c.status === 'healthy');
  
  return Response.json(checks, {
    status: allHealthy ? 200 : 503,
  });
}
```

---

## Component Library & UI/UX Specifications

### Core Components from LUMENFORGE Mirror

Based on the LUMENFORGE landing page DNA and mirror components, SPARK uses the following component library:

#### 1. GradientButton Component

**Purpose:** Primary and secondary action buttons with gradient styling

**Specifications:**

```typescript
interface GradientButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'aria-disabled'?: boolean;
}
```

**SPARK-Specific Styling:**

```css
/* Primary Button (SPARK Yellow) */
.spark-button-primary {
  background: linear-gradient(to right, #FBBF24, #F59E0B);
  color: #1E1345; /* Dark text for contrast */
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  transition: all 0.3s ease;
}

.spark-button-primary:hover {
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.8);
  transform: scale(1.05);
}

/* Secondary Button */
.spark-button-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FBBF24;
  backdrop-filter: blur(16px);
}

.spark-button-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(251, 191, 36, 0.5);
}
```

**Usage Example:**

```tsx
<GradientButton
  size="lg"
  variant="primary"
  onClick={handleGenerate}
  icon={<Sparkles className="w-6 h-6" />}
  iconPosition="left"
  loading={isGenerating}
  disabled={!prompt.trim()}
  className="spark-button-primary"
  aria-label="Generate component with SPARK"
>
  Generate Component
</GradientButton>
```

#### 2. GlassCard Component

**Purpose:** Glassmorphic card containers for content sections

**Specifications:**

```typescript
interface GlassCardProps {
  children: React.ReactNode;
  hover3D?: boolean;
  glowColor?: string; // SPARK: rgba(251, 191, 36, 0.3)
  padding?: string;
  borderRadius?: string;
  className?: string;
  onClick?: () => void;
}
```

**SPARK-Specific Styling:**

```css
.spark-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.3s ease;
}

.spark-glass-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(251, 191, 36, 0.3);
  box-shadow: 0 20px 60px rgba(251, 191, 36, 0.2);
  transform: translateY(-8px);
}
```

**Usage Example:**

```tsx
<GlassCard
  hover3D={true}
  glowColor="rgba(251, 191, 36, 0.3)"
  className="spark-glass-card"
>
  <h3 className="text-3xl font-bold text-white mb-4">SPARK</h3>
  <p className="text-white/80 text-lg">
    AI-powered component generation with Mixture of Experts
  </p>
</GlassCard>
```

#### 3. FloatingOrbs Component

**Purpose:** Animated background orbs for visual depth

**SPARK Color Configuration:**

```typescript
const sparkOrbs = [
  {
    gradient: 'from-[#FBBF24] to-[#F59E0B]', // SPARK primary gradient
    size: 'w-96 h-96',
    startX: 20,
    startY: 10,
    delay: 0,
  },
  {
    gradient: 'from-[#FCD34D] to-[#FBBF24]', // SPARK light yellow
    size: 'w-64 h-64',
    startX: 80,
    startY: 30,
    delay: 2,
  },
  {
    gradient: 'from-[#F59E0B] to-[#D97706]', // SPARK amber
    size: 'w-[32rem] h-[32rem]',
    startX: 50,
    startY: 60,
    delay: 4,
  },
];
```

**Usage:**

```tsx
<FloatingOrbs count={3} className="spark-orbs" />
```

#### 4. RotatingWord Component

**Purpose:** Animated rotating words in hero section

**SPARK Words:**

```typescript
const sparkWords = [
  'Generate',
  'Create',
  'Build',
  'Design',
  'Forge',
  'Spark',
];
```

**Usage:**

```tsx
<h1 className="text-7xl font-bold text-white">
  <RotatingWord 
    words={sparkWords}
    interval={2500}
    className="text-[#FBBF24]"
  />{' '}
  Components with AI
</h1>
```

#### 5. StreamingText Component

**Purpose:** Typewriter effect for descriptions

**Usage:**

```tsx
<StreamingText
  content="SPARK uses Mixture of Experts to generate production-ready React components from natural language prompts."
  speed={30}
  showCursor={true}
  className="text-xl text-white/70"
/>
```

#### 6. HeroPromptInput Component

**Purpose:** Main input field for component generation prompts

**SPARK-Specific Configuration:**

```typescript
<HeroPromptInput
  onSubmit={handleGenerate}
  placeholder="Describe your component... (e.g., 'A responsive card with image, title, and CTA button')"
  examples={[
    "Create a button with loading state",
    "Build a data table with sorting and filtering",
    "Design a modal dialog with smooth animations",
    "Generate a form with email validation",
    "Create a navigation bar with mobile menu",
    // ... 50+ more examples
  ]}
/>
```

**Styling:**

```css
.spark-prompt-input {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px 24px;
  font-size: 18px;
  color: white;
}

.spark-prompt-input:focus {
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
}
```

### Custom SPARK Components

#### ExpertDisplay Component

**Purpose:** Visual representation of the three MoE experts

```typescript
interface ExpertDisplayProps {
  expert: 'design' | 'logic' | 'performance';
  status: 'idle' | 'thinking' | 'generating' | 'complete';
  progress?: number; // 0-100
  output?: string;
}

const ExpertDisplay: React.FC<ExpertDisplayProps> = ({
  expert,
  status,
  progress,
  output,
}) => {
  const expertConfig = {
    design: {
      name: 'Design Expert',
      icon: <Palette className="w-8 h-8" />,
      color: 'from-[#FBBF24] to-[#F59E0B]',
      description: 'Visual design & styling',
    },
    logic: {
      name: 'Logic Expert',
      icon: <Code className="w-8 h-8" />,
      color: 'from-[#F59E0B] to-[#D97706]',
      description: 'Business logic & state',
    },
    performance: {
      name: 'Performance Expert',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-[#FCD34D] to-[#FBBF24]',
      description: 'Optimization & best practices',
    },
  };

  const config = expertConfig[expert];

  return (
    <GlassCard
      glowColor={`rgba(${expert === 'design' ? '251, 191, 36' : expert === 'logic' ? '245, 158, 11' : '252, 211, 77'}, 0.3)`}
      className="spark-expert-card"
    >
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">
            {config.name}
          </h3>
          <p className="text-[#FBBF24] font-medium text-sm mb-4">
            {config.description}
          </p>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 mb-3">
            <StatusDot status={status} />
            <span className="text-white/70 text-sm capitalize">
              {status}
            </span>
            {progress !== undefined && (
              <span className="text-[#FBBF24] text-sm ml-auto">
                {progress}%
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Output Preview */}
          {output && (
            <div className="mt-4 p-3 bg-[#1E1345]/50 rounded-lg border border-white/10">
              <pre className="text-xs text-white/80 font-mono overflow-x-auto">
                {output.slice(0, 200)}...
              </pre>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
```

#### CodeOutput Component

**Purpose:** Syntax-highlighted code display with copy functionality

```typescript
interface CodeOutputProps {
  code: string;
  language: 'typescript' | 'tsx' | 'javascript' | 'css';
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({
  code,
  language,
  filename,
  showLineNumbers = true,
  maxHeight = '600px',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#1E1345] rounded-xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A0E27] border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {filename && (
            <span className="text-sm text-white/60 font-mono">
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors flex items-center space-x-2"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div
        className="overflow-auto"
        style={{ maxHeight }}
      >
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '20px',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
```

#### GenerationStatus Component

**Purpose:** Real-time generation progress indicator

```typescript
interface GenerationStatusProps {
  generationId: string;
  status: 'pending' | 'analyzing' | 'routing' | 'generating' | 'synthesizing' | 'validating' | 'complete' | 'failed';
  progress: number; // 0-100
  currentStep?: string;
  estimatedTime?: number; // seconds remaining
}

const GenerationStatus: React.FC<GenerationStatusProps> = ({
  generationId,
  status,
  progress,
  currentStep,
  estimatedTime,
}) => {
  const statusConfig = {
    pending: { color: 'text-white/50', icon: <Clock className="w-5 h-5" /> },
    analyzing: { color: 'text-[#FBBF24]', icon: <Search className="w-5 h-5" /> },
    routing: { color: 'text-[#F59E0B]', icon: <GitBranch className="w-5 h-5" /> },
    generating: { color: 'text-[#FCD34D]', icon: <Sparkles className="w-5 h-5" /> },
    synthesizing: { color: 'text-[#FBBF24]', icon: <Merge className="w-5 h-5" /> },
    validating: { color: 'text-[#F59E0B]', icon: <CheckCircle className="w-5 h-5" /> },
    complete: { color: 'text-green-400', icon: <CheckCircle2 className="w-5 h-5" /> },
    failed: { color: 'text-red-400', icon: <XCircle className="w-5 h-5" /> },
  };

  const config = statusConfig[status];

  return (
    <div className="spark-status-container">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${config.color}`}>
          {config.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white capitalize">
            {status.replace(/_/g, ' ')}
          </h3>
          {currentStep && (
            <p className="text-sm text-white/60">
              {currentStep}
            </p>
          )}
        </div>
        {estimatedTime && (
          <span className="ml-auto text-sm text-white/50">
            ~{estimatedTime}s remaining
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-white/50">
        <span>{progress}% complete</span>
        <span>ID: {generationId.slice(0, 8)}</span>
      </div>
    </div>
  );
};
```

---

## Design System Integration

### SLATE Token Usage

SPARK uses the following SLATE design tokens:

**Colors:**
```typescript
import { slateTokens } from '@/tokens/slate.tokens';

const sparkColors = {
  primary: slateTokens.colors.spark.primary,      // #FBBF24
  secondary: slateTokens.colors.spark.secondary, // #F59E0B
  accent: slateTokens.colors.spark.accent,        // #FCD34D
  gradient: slateTokens.colors.spark.gradient,    // from-[#FBBF24] to-[#F59E0B]
};
```

**Typography:**
```typescript
const sparkTypography = {
  hero: slateTokens.typography.fontSize['7xl'],     // 4.5rem (72px)
  heading: slateTokens.typography.fontSize['5xl'],   // 3rem (48px)
  subheading: slateTokens.typography.fontSize['3xl'], // 1.875rem (30px)
  body: slateTokens.typography.fontSize.lg,          // 1.125rem (18px)
  small: slateTokens.typography.fontSize.sm,        // 0.875rem (14px)
};
```

**Spacing:**
```typescript
const sparkSpacing = {
  section: slateTokens.spacing[20],  // 5rem (80px)
  card: slateTokens.spacing[8],       // 2rem (32px)
  gap: slateTokens.spacing[6],       // 1.5rem (24px)
  padding: slateTokens.spacing[4],   // 1rem (16px)
};
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        spark: {
          primary: '#FBBF24',
          secondary: '#F59E0B',
          accent: '#FCD34D',
          dark: '#D97706',
        },
      },
      backgroundImage: {
        'spark-gradient': 'linear-gradient(to right, #FBBF24, #F59E0B)',
        'spark-gradient-radial': 'radial-gradient(circle, #FBBF24, #F59E0B)',
      },
      boxShadow: {
        'spark-glow': '0 0 30px rgba(251, 191, 36, 0.5)',
        'spark-glow-lg': '0 0 60px rgba(251, 191, 36, 0.8)',
      },
    },
  },
  plugins: [],
};
```

---

## Page Structure & Layout

### Complete Page Hierarchy

```
SPARK Landing Page
├── Navigation Header
│   ├── Logo (SPARK icon + text)
│   ├── Breadcrumb: "WISSIL → SPARK"
│   ├── Navigation Links
│   │   ├── Features
│   │   ├── Examples
│   │   ├── Documentation
│   │   └── Pricing
│   └── User Menu (nocturnaID)
│
├── Hero Section
│   ├── Background Effects
│   │   ├── Floating Orbs (3 SPARK-colored orbs)
│   │   ├── Star Field (20-50 stars)
│   │   └── Gradient Overlay (SPARK yellow/amber)
│   ├── Main Headline
│   │   ├── H1: "SPARK — AI Component Generator"
│   │   ├── Rotating Word: ["Generate", "Create", "Build", "Design", "Forge", "Spark"]
│   │   └── Subheadline: "Production-ready React components from natural language"
│   ├── Prompt Input
│   │   ├── HeroPromptInput Component
│   │   ├── Placeholder: "Describe your component..."
│   │   ├── Example Rotation (50+ examples, 3s interval)
│   │   └── Submit Button (GradientButton)
│   └── Trust Signals
│       ├── "10K+ Components Generated"
│       ├── "99.9% Success Rate"
│       └── "Sub-10s Generation Time"
│
├── Features Section
│   ├── Section Header
│   │   ├── Breadcrumb: "🧭 WISSIL Ecosystem → AI Generation"
│   │   ├── H2: "Powered by Mixture of Experts"
│   │   └── Description
│   └── Feature Grid (2-column, 6 features)
│       ├── Feature Card 1: "Natural Language Input"
│       ├── Feature Card 2: "Context-Aware Generation"
│       ├── Feature Card 3: "Multi-Expert Collaboration"
│       ├── Feature Card 4: "Real-Time Preview"
│       ├── Feature Card 5: "Production-Ready Output"
│       └── Feature Card 6: "MCP Integration"
│
├── Experts Section
│   ├── Section Header
│   │   ├── H2: "Three Specialized AI Experts"
│   │   └── Description
│   └── Expert Cards (3 cards, side-by-side)
│       ├── Design Expert Card
│       │   ├── Icon (Palette)
│       │   ├── Name & Description
│       │   ├── Responsibilities List
│       │   └── Example Output Preview
│       ├── Logic Expert Card
│       │   ├── Icon (Code)
│       │   ├── Name & Description
│       │   ├── Responsibilities List
│       │   └── Example Output Preview
│       └── Performance Expert Card
│           ├── Icon (Zap)
│           ├── Name & Description
│           ├── Responsibilities List
│           └── Example Output Preview
│
├── Integration Section
│   ├── Section Header
│   │   ├── H2: "Seamlessly Integrated with WISSIL"
│   │   └── Description
│   └── Integration Cards (4 cards, 2x2 grid)
│       ├── SLATE Integration Card
│       │   ├── Icon
│       │   ├── Title: "Design Tokens"
│       │   ├── Description
│       │   └── Link to SLATE
│       ├── IGNIS Integration Card
│       │   ├── Icon
│       │   ├── Title: "Hot Reload Preview"
│       │   ├── Description
│       │   └── Link to IGNIS
│       ├── WAYPOINT Integration Card
│       │   ├── Icon
│       │   ├── Title: "Component Registry"
│       │   ├── Description
│       │   └── Link to WAYPOINT
│       └── MCP Integration Card
│           ├── Icon
│           ├── Title: "Model Context Protocol"
│           ├── Description
│           └── Link to Documentation
│
├── Code Example Section
│   ├── Section Header
│   │   ├── H2: "See SPARK in Action"
│   │   └── Description
│   └── Live Demo
│       ├── Input Panel (left)
│       │   ├── Prompt Input
│       │   ├── Expert Selection (optional)
│       │   └── Generate Button
│       └── Output Panel (right)
│           ├── Code Output (syntax-highlighted)
│           ├── Tests Output
│           ├── Storybook Story
│           └── Preview (iframe)
│
├── CTA Section
│   ├── Background Gradient (SPARK yellow/amber)
│   ├── H2: "Ready to Generate Your First Component?"
│   ├── Description
│   ├── Primary CTA: "Start Generating Now"
│   └── Secondary CTA: "View Documentation"
│
└── Footer
    ├── WISSIL Links
    │   ├── LANDING
    │   ├── SLATE
    │   ├── IGNITION
    │   ├── IGNIS
    │   └── WAYPOINT
    ├── Studio PxG Branding
    └── Copyright
```

### Section Specifications

#### Hero Section

**Layout:**
- Full viewport height (`min-h-screen`)
- Centered content (`flex items-center justify-center`)
- Max width: 1200px
- Padding: `py-20 sm:py-32 px-6 sm:px-8 lg:px-12`

**Typography:**
- H1: `text-5xl sm:text-6xl lg:text-7xl` (72px desktop)
- Subheadline: `text-xl sm:text-2xl lg:text-3xl`
- Body: `text-lg sm:text-xl`
- Line height: 1.6-1.8

**Spacing:**
- Section padding: `py-20 sm:py-32`
- Element gaps: `gap-6` (24px)
- Container max-width: `max-w-[1200px]`

#### Features Section

**Layout:**
- 2-column grid on desktop (`grid-cols-1 lg:grid-cols-2`)
- Gap: `gap-6` (24px)
- Card padding: `p-8` (32px)

**Card Structure:**
- Icon container: 64x64px, SPARK gradient background
- Title: `text-2xl font-bold`
- Description: `text-lg text-white/80`, line-height 1.8
- Feature list: 4-5 bullet points

#### Experts Section

**Layout:**
- 3-column grid on desktop (`grid-cols-1 md:grid-cols-3`)
- Equal height cards (`items-stretch`)
- Gap: `gap-8` (32px)

**Card Content:**
- Expert icon: 80x80px
- Status indicator (real-time)
- Progress bar (if generating)
- Output preview (collapsible)

---

## Interactive Elements & Animations

### Scroll-Triggered Animations

```typescript
// Fade in on scroll
const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
```

### Hover Effects

**Card Hover:**
- Translate Y: -8px
- Shadow: Enhanced glow (SPARK yellow)
- Border: Increased opacity
- Duration: 300ms

**Button Hover:**
- Scale: 1.05
- Shadow: Increased glow
- Duration: 200ms

**Icon Hover:**
- Scale: 1.1
- Rotate: 5deg (optional)
- Duration: 300ms

### Loading States

**Generation Progress:**
- Pulsing animation on expert cards
- Progress bar with gradient fill
- Spinner on generate button
- Status text updates in real-time

**Skeleton Loaders:**
- Code output skeleton (3-4 lines)
- Expert card skeleton
- Feature card skeleton

### Real-Time Updates (WebSocket)

```typescript
// Connect to NATS for real-time generation updates
const ws = new WebSocket('wss://spark.lumenforge.io/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'generation.started':
      setStatus('generating');
      setGenerationId(data.generationId);
      break;
    case 'generation.progress':
      setProgress(data.progress);
      setCurrentStep(data.step);
      updateExpertStatus(data.expert, data.expertStatus);
      break;
    case 'generation.completed':
      setStatus('complete');
      setGeneratedCode(data.code);
      setTests(data.tests);
      setStories(data.stories);
      break;
    case 'generation.failed':
      setStatus('failed');
      setError(data.error);
      break;
  }
};
```

---

## Integration Points

### SLATE Integration

**Token Loading:**
```typescript
import { slateTokens, getSystemColors } from '@/tokens/slate.tokens';

const sparkColors = getSystemColors('spark');
// Returns: { primary, secondary, accent, gradient }
```

**Token Usage in Components:**
```tsx
<div className={`bg-${sparkColors.primary} text-white`}>
  SPARK Component
</div>
```

### IGNIS Integration

**Hot Reload Preview:**
```typescript
// After generation completes
const previewUrl = await ignis.previewComponent({
  component: generatedCode,
  tests: generatedTests,
  stories: generatedStories,
});

// Open in iframe
<iframe src={previewUrl} className="w-full h-[600px]" />
```

**Build Status:**
```typescript
const buildStatus = await fetch('http://192.168.86.114:3004/api/build/status');
// Returns: { status, bundleSize, buildTime, errors }
```

### WAYPOINT Integration

**Component Publishing:**
```typescript
// After user approves generated component
await waypoint.publish({
  component: 'GeneratedCard',
  version: '1.0.0',
  code: generatedCode,
  tests: generatedTests,
  stories: generatedStories,
  metadata: {
    author: user.email,
    generatedBy: 'SPARK',
    generationId: generationId,
  },
});
```

**Registry Lookup:**
```typescript
const existingComponents = await waypoint.search({
  query: 'card',
  limit: 10,
});
// Use to show similar components or avoid duplicates
```

### MCP Integration

**Component Reading:**
```typescript
// Read existing component for context
const existing = await mcp.call('mcp_luminera_read_component', {
  component: 'Button',
  includeTests: true,
  includeStories: true,
});

// Use in prompt context
const enhancedPrompt = `Create a component similar to Button but with ${userPrompt}`;
```

**Component Writing:**
```typescript
// Write generated component
await mcp.call('mcp_luminera_write_component', {
  component: 'NewCard',
  code: generatedCode,
  path: 'src/components/NewCard.tsx',
  tests: generatedTests,
  stories: generatedStories,
});
```

**File System Operations:**
```typescript
// Read project structure
const packageJson = await mcp.call('mcp_vfs_read', {
  path: 'package.json',
});

// Check for existing components
const componentsDir = await mcp.call('mcp_vfs_read', {
  path: 'src/components',
});
```

### Database Integration

**Save Generation History:**
```typescript
await db.query(`
  INSERT INTO spark_generations (
    user_id, prompt, generated_code, expert_route,
    generation_time_ms, token_usage, status
  ) VALUES ($1, $2, $3, $4, $5, $6, $7)
`, [
  userId,
  prompt,
  generatedCode,
  JSON.stringify(expertRoute),
  generationTime,
  JSON.stringify(tokenUsage),
  'completed',
]);
```

**Load Previous Generations:**
```typescript
const history = await db.query(`
  SELECT * FROM spark_generations
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT 10
`, [userId]);
```

### Redis Integration

**Cache Management:**
```typescript
// Check cache before generation
const cacheKey = `spark:generation:${hash(prompt)}:${contextHash}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached); // Return cached result
}

// Generate and cache
const result = await generateComponent(prompt);
await redis.setex(cacheKey, 3600, JSON.stringify(result));
```

**Rate Limiting:**
```typescript
const rateLimitKey = `spark:ratelimit:${userId}:${currentWindow}`;
const currentCount = await redis.incr(rateLimitKey);

if (currentCount === 1) {
  await redis.expire(rateLimitKey, 3600); // 1 hour window
}

const limit = getUserRateLimit(userId); // Based on tier
if (currentCount > limit) {
  throw new RateLimitError('Rate limit exceeded');
}
```

---

## Content Guidelines

### Headline Formula

**Primary Headline:**
```
SPARK — AI Component Generator
```

**Subheadline:**
```
Production-ready React components from natural language prompts. Powered by Mixture of Experts.
```

**Supporting Copy:**
```
Describe what you need, and SPARK generates fully functional components with TypeScript types, tests, and Storybook stories. Three specialized AI experts collaborate to ensure design consistency, proper logic, and optimal performance.
```

### Feature Descriptions

**Feature 1: Natural Language Input**
- **Title:** "Natural Language to Code"
- **Description:** "Simply describe your component in plain English. SPARK understands your intent and generates production-ready code."
- **Example:** "Create a button with loading state" → Full Button component with spinner, disabled state, and proper TypeScript types.

**Feature 2: Context-Aware Generation**
- **Title:** "Understands Your Project"
- **Description:** "SPARK analyzes your codebase to match existing patterns, use your design tokens, and maintain consistency."
- **Benefits:** Reuses existing components, applies SLATE tokens, follows project structure.

**Feature 3: Multi-Expert Collaboration**
- **Title:** "Three Specialized Experts"
- **Description:** "Design Expert handles styling, Logic Expert manages state, Performance Expert optimizes output."
- **Benefits:** Best-in-class code quality, proper separation of concerns, optimized performance.

**Feature 4: Real-Time Preview**
- **Title:** "Instant Feedback"
- **Description:** "See your component render instantly via IGNIS hot-reload. No waiting, no build steps."
- **Benefits:** Immediate visual feedback, rapid iteration, faster development.

**Feature 5: Production-Ready Output**
- **Title:** "Complete Package"
- **Description:** "Every generated component includes TypeScript types, unit tests, and Storybook stories."
- **Benefits:** Ready to commit, fully tested, well-documented.

**Feature 6: MCP Integration**
- **Title:** "Seamless Workflow"
- **Description:** "Integrates with Model Context Protocol for file system operations and component management."
- **Benefits:** Automatic file writing, component registry updates, IDE integration.

### Expert Descriptions

**Design Expert:**
- **Name:** "Design Expert"
- **Tagline:** "Visual Design & Styling"
- **Responsibilities:**
  - SLATE token usage
  - Responsive design patterns
  - Accessibility (WCAG AA+)
  - Visual hierarchy
  - Animation and transitions
  - Glassmorphism and effects
- **Example Output:** "Ensures all components use SLATE tokens, follow responsive breakpoints, and maintain proper contrast ratios."

**Logic Expert:**
- **Name:** "Logic Expert"
- **Tagline:** "Business Logic & State Management"
- **Responsibilities:**
  - React hooks (useState, useEffect, etc.)
  - State management patterns
  - Data flow architecture
  - Event handling
  - API integration
  - Form validation
- **Example Output:** "Handles all state management, API calls, and user interactions with proper error handling."

**Performance Expert:**
- **Name:** "Performance Expert"
- **Tagline:** "Optimization & Best Practices"
- **Responsibilities:**
  - React.memo, useMemo, useCallback
  - Lazy loading and code splitting
  - Bundle size optimization
  - Render performance
  - Image optimization
  - Accessibility best practices
- **Example Output:** "Adds performance optimizations, prevents unnecessary re-renders, and ensures fast load times."

### CTA Copy

**Primary CTA:**
- Text: "Start Generating Now"
- Icon: Sparkles (left)
- Action: Opens prompt input or scrolls to it

**Secondary CTA:**
- Text: "View Documentation"
- Icon: BookOpen (left)
- Action: Links to `/docs/spark`

**Tertiary CTA (in Code Example Section):**
- Text: "Try It Live"
- Icon: Play (left)
- Action: Opens live demo interface

---

## Implementation Guide

### Project Setup

**1. Initialize Next.js Project:**

```bash
npx create-next-app@latest spark-landing --typescript --tailwind --app
cd spark-landing
```

**2. Install Dependencies:**

```bash
npm install \
  react@^18.2.0 \
  react-dom@^18.2.0 \
  framer-motion@^10.18.0 \
  lucide-react@^0.294.0 \
  @prisma/client@^5.0.0 \
  ioredis@^5.3.0 \
  nats@^2.7.0 \
  react-syntax-highlighter@^15.5.0 \
  @types/react-syntax-highlighter@^15.5.0

npm install -D \
  @types/node \
  @types/react \
  @types/react-dom \
  typescript \
  tailwindcss \
  postcss \
  autoprefixer \
  prisma
```

**3. Configure Tailwind:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spark: {
          primary: '#FBBF24',
          secondary: '#F59E0B',
          accent: '#FCD34D',
          dark: '#D97706',
        },
      },
      backgroundImage: {
        'spark-gradient': 'linear-gradient(to right, #FBBF24, #F59E0B)',
      },
      boxShadow: {
        'spark-glow': '0 0 30px rgba(251, 191, 36, 0.5)',
        'spark-glow-lg': '0 0 60px rgba(251, 191, 36, 0.8)',
      },
    },
  },
  plugins: [],
};

export default config;
```

**4. Set Up Environment Variables:**

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@192.168.86.27:5432/spark_db
REDIS_URL=redis://192.168.86.27:6379/0
NATS_URL=nats://192.168.86.27:4222
SPARK_AI_API_KEY=sk-...
SPARK_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SPARK_API_URL=http://localhost:3003/api
```

### Component Implementation

**1. Create Component Directory Structure:**

```
src/
├── app/
│   ├── spark/
│   │   ├── page.tsx          # Main landing page
│   │   └── layout.tsx        # Page-specific layout
│   └── layout.tsx            # Root layout
├── components/
│   ├── spark/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── ExpertsSection.tsx
│   │   ├── IntegrationSection.tsx
│   │   ├── CodeExampleSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── ExpertDisplay.tsx
│   │   ├── CodeOutput.tsx
│   │   └── GenerationStatus.tsx
│   ├── shared/
│   │   ├── GradientButton.tsx
│   │   ├── GlassCard.tsx
│   │   ├── FloatingOrbs.tsx
│   │   ├── RotatingWord.tsx
│   │   ├── StreamingText.tsx
│   │   └── HeroPromptInput.tsx
│   └── layout/
│       ├── Navigation.tsx
│       └── Footer.tsx
├── lib/
│   ├── spark/
│   │   ├── api.ts            # API client
│   │   ├── websocket.ts       # WebSocket client
│   │   └── experts.ts        # Expert routing logic
│   ├── db.ts                 # Database client
│   ├── redis.ts              # Redis client
│   └── nats.ts               # NATS client
└── tokens/
    └── slate.tokens.ts       # SLATE design tokens
```

**2. Implement Main Page:**

```typescript
// app/spark/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/spark/HeroSection';
import { FeaturesSection } from '@/components/spark/FeaturesSection';
import { ExpertsSection } from '@/components/spark/ExpertsSection';
import { IntegrationSection } from '@/components/spark/IntegrationSection';
import { CodeExampleSection } from '@/components/spark/CodeExampleSection';
import { CTASection } from '@/components/spark/CTASection';
import { FloatingOrbs } from '@/components/shared/FloatingOrbs';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export default function SparkPage() {
  const [generationStatus, setGenerationStatus] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Background Effects */}
      <FloatingOrbs count={3} />
      
      {/* Navigation */}
      <Navigation currentPage="spark" />
      
      {/* Hero Section */}
      <HeroSection onGenerate={handleGenerate} />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Experts Section */}
      <ExpertsSection status={generationStatus} />
      
      {/* Integration Section */}
      <IntegrationSection />
      
      {/* Code Example Section */}
      <CodeExampleSection code={generatedCode} />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
```

**3. Implement API Routes:**

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateComponent } from '@/lib/spark/generate';
import { rateLimit } from '@/lib/rate-limit';
import { cache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  // Rate limiting
  const userId = request.headers.get('x-user-id');
  const limited = await rateLimit(userId);
  if (limited) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const { prompt, context } = await request.json();

  // Check cache
  const cacheKey = `spark:${hash(prompt)}:${hash(context)}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // Generate component
  const result = await generateComponent(prompt, context);

  // Cache result
  await cache.set(cacheKey, result, 3600);

  return NextResponse.json(result);
}
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const CodeExampleSection = lazy(() => import('@/components/spark/CodeExampleSection'));
const ExpertsSection = lazy(() => import('@/components/spark/ExpertsSection'));

// Route-based splitting
const SparkPage = lazy(() => import('./app/spark/page'));
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/spark-hero.png"
  alt="SPARK AI Component Generator"
  width={1200}
  height={600}
  priority // Above the fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Size Targets

- **Initial JavaScript:** < 150 KB (gzipped)
- **CSS:** < 20 KB (gzipped)
- **Total First Load:** < 200 KB
- **Time to Interactive:** < 2s

### Caching Strategy

```typescript
// Static assets: 1 year
Cache-Control: public, max-age=31536000, immutable

// API responses: 1 hour
Cache-Control: public, max-age=3600

// HTML: 5 minutes
Cache-Control: public, max-age=300, must-revalidate
```

---

## Accessibility Requirements

### WCAG AA+ Compliance

- **Color Contrast:** 4.5:1 minimum (text), 3:1 (UI components)
- **Keyboard Navigation:** Full keyboard support
- **Screen Readers:** Semantic HTML, ARIA labels
- **Focus Management:** Visible focus indicators
- **Reduced Motion:** Respect `prefers-reduced-motion`

### ARIA Labels

```tsx
<button
  onClick={handleGenerate}
  aria-label="Generate component with SPARK AI"
  aria-busy={isGenerating}
  aria-describedby="generation-status"
>
  Generate Component
</button>
```

### Keyboard Shortcuts

- `Enter`: Submit prompt
- `Escape`: Clear input
- `Tab`: Navigate between sections
- `Ctrl/Cmd + K`: Open command palette

---

## Testing Strategy

### Unit Tests

```typescript
// components/spark/ExpertDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { ExpertDisplay } from './ExpertDisplay';

describe('ExpertDisplay', () => {
  it('renders expert name and description', () => {
    render(
      <ExpertDisplay
        expert="design"
        status="idle"
      />
    );
    expect(screen.getByText('Design Expert')).toBeInTheDocument();
  });

  it('shows progress when generating', () => {
    render(
      <ExpertDisplay
        expert="design"
        status="generating"
        progress={50}
      />
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/generation.test.ts
describe('Component Generation Flow', () => {
  it('generates component from prompt', async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Create a button with loading state',
      }),
    });
    const result = await response.json();
    expect(result.code).toContain('Button');
    expect(result.tests).toBeDefined();
  });
});
```

### E2E Tests

```typescript
// e2e/spark-generation.spec.ts
import { test, expect } from '@playwright/test';

test('user can generate a component', async ({ page }) => {
  await page.goto('/spark');
  await page.fill('[data-testid="prompt-input"]', 'Create a card component');
  await page.click('[data-testid="generate-button"]');
  await expect(page.locator('[data-testid="code-output"]')).toBeVisible();
});
```

---

## Deployment & CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy-spark.yml
name: Deploy SPARK Landing

on:
  push:
    branches: [main]
    paths:
      - 'src/app/spark/**'
      - 'src/components/spark/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: .next

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/spark-landing \
            spark-frontend=registry.nocturna.network/spark:${{ github.sha }} \
            -n wissil
```

### Deployment Checklist

- [ ] All tests passing
- [ ] No linter errors
- [ ] Bundle size < 200 KB
- [ ] Lighthouse score 95+
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Health check endpoint responding
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Redis cache cleared (if needed)

---

## Monitoring & Observability

### Metrics to Track

- **Generation Success Rate:** Target 99%+
- **Average Generation Time:** Target < 10s
- **Cache Hit Rate:** Target 60%+
- **API Response Time:** P95 < 500ms
- **Error Rate:** Target < 0.1%

### Logging

```typescript
import { logger } from '@/lib/logger';

logger.info('Generation started', {
  generationId,
  userId,
  prompt: prompt.slice(0, 100),
  experts: expertRoute,
});

logger.error('Generation failed', {
  generationId,
  error: error.message,
  stack: error.stack,
});
```

### Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: {
    component: 'spark-generation',
    expert: expertName,
  },
  extra: {
    prompt,
    context,
  },
});
```

---

## Troubleshooting

### Common Issues

**1. Generation Timeout**
- **Symptom:** Generation takes > 30s
- **Cause:** AI API rate limiting or network issues
- **Fix:** Implement retry logic, increase timeout, check API status

**2. Cache Not Working**
- **Symptom:** Same prompts generate different code
- **Cause:** Cache key mismatch or Redis connection issue
- **Fix:** Verify cache key generation, check Redis connection

**3. WebSocket Disconnection**
- **Symptom:** Real-time updates stop working
- **Cause:** Network interruption or NATS connection lost
- **Fix:** Implement reconnection logic, exponential backoff

---

## Reference Materials

### Documentation Links

- **SPARK MDX:** `E:/Projects/LUMINES/src/app/spark/spark.mdx`
- **LUMINES Handoff:** `E:/Projects/LUMINES/infrastructure/k8s/production/docs/LUMINES_AGENT_HANDOFF.md`
- **SLATE Tokens:** `E:/Projects/LUMINES/src/tokens/slate.tokens.ts`
- **HELIOS Manifests:** `E:/Github/Projects/NERVCENTRE/HELIOS-CN/docs/manifests/`

### Component References

- **GradientButton:** `E:/Projects/LUMENFORGE/apps/lumenforge-landing/src/components/GradientButton.tsx`
- **GlassCard:** `E:/Projects/LUMENFORGE/apps/lumenforge-landing/src/components/GlassCard.tsx`
- **FloatingOrbs:** `E:/Projects/LUMENFORGE/apps/lumenforge-landing/src/components/FloatingOrbs.tsx`
- **RotatingWord:** `E:/Projects/LUMENFORGE/apps/lumenforge-landing/src/components/RotatingWord.tsx`
- **StreamingText:** `E:/Projects/LUMENFORGE/apps/lumenforge-landing/src/components/StreamingText.tsx`
- **HeroPromptInput:** `E:/Projects/LUMENFORGE/apps/lumenforge-landing/src/components/HeroPromptInput.tsx`

### API Endpoints

- **Generate:** `POST /api/generate`
- **Status:** `GET /api/status/:generationId`
- **History:** `GET /api/history`
- **Health:** `GET /api/health`

---

**Document Length:** ~10,500 words  
**Last Updated:** 2025-11-28  
**Maintained By:** HELIOS Core Platform Team  
**Next Review:** After initial deployment

