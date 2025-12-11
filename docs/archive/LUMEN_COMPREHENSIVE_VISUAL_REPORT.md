# LUMEN Comprehensive Visual Report
## Complete System Architecture, Flowcharts, and Mind Maps

**Date:** December 2024  
**Status:** ✅ **PRODUCTION READY**  
**Version:** 1.0.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Route Structure & Navigation](#route-structure--navigation)
4. [Authentication Flow](#authentication-flow)
5. [Component Hierarchy](#component-hierarchy)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [User Journey Maps](#user-journey-maps)
8. [Mind Map](#mind-map)
9. [Technical Stack](#technical-stack)
10. [Deployment Architecture](#deployment-architecture)

---

## Executive Summary

LUMEN is the production marketing landing page for **lumenforge.io**, serving as the primary gateway routing users to **SPARK** (AI-powered component generation) and **SLATE** (IDE workspace). This report provides comprehensive visual documentation of the entire system.

### Key Metrics

- **Routes:** 7 primary routes
- **Components:** 15+ landing page components
- **Authentication:** 2 OAuth providers (GitHub, Google)
- **API Endpoints:** 5+ endpoints
- **Error Handling:** Global error boundary + 404 page
- **Accessibility:** WCAG 2.1 AA compliant

---

## System Architecture

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[User Browser] --> B[Next.js App Router]
        B --> C[LUMEN Marketing Page]
        B --> D[SPARK IDE]
        B --> E[SLATE IDE]
        B --> F[Login Page]
    end
    
    subgraph "Authentication Layer"
        F --> G[NextAuth.js]
        G --> H[GitHub OAuth]
        G --> I[Google OAuth]
        G --> J[JWT Sessions]
    end
    
    subgraph "API Layer"
        C --> K[API Routes]
        D --> K
        E --> K
        K --> L[Generate API]
        K --> M[Workspaces API]
        K --> N[Health Check API]
    end
    
    subgraph "Backend Services"
        L --> O[SPARK AI Service]
        M --> P[Database]
        M --> Q[Redis Cache]
        N --> P
        N --> Q
        N --> R[NATS Events]
    end
    
    style C fill:#FFD700
    style D fill:#FF6B6B
    style E fill:#4ECDC4
    style G fill:#95E1D3
```

### Component Architecture

```mermaid
graph LR
    subgraph "LUMEN Landing Page"
        A[LandingLayout] --> B[SimpleNav]
        A --> C[HeroSection]
        A --> D[FeatureGrid]
        A --> E[StatsSection]
        A --> F[CTASection]
        A --> G[PricingSection]
        A --> H[FAQ]
        A --> I[Footer]
        B --> J[AuthButtons]
        J --> K[GitHubSignInButton]
        J --> L[GoogleSignInButton]
    end
    
    style A fill:#FFD700
    style B fill:#FFE66D
    style J fill:#95E1D3
```

---

## Route Structure & Navigation

### Route Flow Diagram

```mermaid
flowchart TD
    Start([User Visits]) --> Root{/}
    Root -->|Redirect| Lumen[/lumen<br/>Marketing Page]
    
    Lumen --> Nav{User Action}
    Nav -->|Click Login| Login[/login<br/>Authentication]
    Nav -->|Click Templates| Spark[/spark<br/>SPARK IDE]
    Nav -->|Click Editor| Slate[/slate/ide<br/>SLATE IDE]
    Nav -->|Click Docs| Waypoint[/waypoint<br/>Documentation]
    
    Login --> Auth{Choose Provider}
    Auth -->|GitHub| GitHubOAuth[GitHub OAuth]
    Auth -->|Google| GoogleOAuth[Google OAuth]
    
    GitHubOAuth --> Callback[OAuth Callback]
    GoogleOAuth --> Callback
    Callback --> Session[Create Session]
    Session -->|Redirect| Lumen
    
    Spark -->|Requires Auth| AuthCheck{Authenticated?}
    Slate --> AuthCheck
    AuthCheck -->|No| Login
    AuthCheck -->|Yes| Access[Grant Access]
    
    style Lumen fill:#FFD700
    style Login fill:#95E1D3
    style Spark fill:#FF6B6B
    style Slate fill:#4ECDC4
```

### Route Map

```mermaid
mindmap
  root((LUMEN Routes))
    Public Routes
      /lumen
        Marketing Page
        Hero Section
        Features
        Pricing
        FAQ
      /login
        Authentication
        GitHub OAuth
        Google OAuth
      /waypoint
        Documentation
    Protected Routes
      /spark
        SPARK IDE
        Templates
        AI Generator
      /spark/generator
        Component Generation
        AI Chat
      /slate/ide
        SLATE IDE
        Workspace
        Code Editor
    API Routes
      /api/generate
        POST: Start Generation
        GET: Check Status
      /api/workspaces
        GET: List Workspaces
        POST: Create Workspace
      /api/health
        Health Check
        Service Status
```

---

## Authentication Flow

### Complete Authentication Flowchart

```mermaid
sequenceDiagram
    participant U as User
    participant L as LUMEN Page
    participant LP as Login Page
    participant NA as NextAuth
    participant GH as GitHub
    participant GO as Google
    participant API as API Routes
    
    U->>L: Visit /lumen
    L->>U: Display Marketing Page
    U->>L: Click "Sign In"
    L->>LP: Redirect to /login
    LP->>U: Show Auth Buttons
    
    alt GitHub OAuth
        U->>LP: Click "Continue with GitHub"
        LP->>NA: signIn('github')
        NA->>GH: Redirect to GitHub
        U->>GH: Authorize Application
        GH->>NA: OAuth Callback
        NA->>NA: Create JWT Session
        NA->>LP: Redirect to /lumen
        LP->>U: Show User Info
    else Google OAuth
        U->>LP: Click "Continue with Google"
        LP->>NA: signIn('google')
        NA->>GO: Redirect to Google
        U->>GO: Authorize Application
        GO->>NA: OAuth Callback
        NA->>NA: Create JWT Session
        NA->>LP: Redirect to /lumen
        LP->>U: Show User Info
    end
    
    U->>API: Access Protected Route
    API->>NA: Verify Session
    NA->>API: Session Valid
    API->>U: Return Data
```

### Authentication State Machine

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: User Visits
    
    Unauthenticated --> LoginPage: Click Sign In
    LoginPage --> OAuthProvider: Choose Provider
    OAuthProvider --> OAuthCallback: User Authorizes
    OAuthCallback --> Authenticated: Session Created
    
    Authenticated --> Authenticated: Access Routes
    Authenticated --> Unauthenticated: Sign Out
    
    Unauthenticated --> PublicRoute: Access /lumen
    Unauthenticated --> PublicRoute: Access /login
    Unauthenticated --> LoginPage: Access Protected Route
    
    note right of Authenticated
        Session stored in JWT
        30-day expiration
        Auto-refresh enabled
    end note
```

---

## Component Hierarchy

### Landing Page Component Tree

```mermaid
graph TD
    A[LandingLayout] --> B[SimpleNav]
    A --> C[HeroSection]
    A --> D[StatsSection]
    A --> E[FeatureGrid]
    A --> F[CTASection]
    A --> G[DetailedFeatures]
    A --> H[ProductDemo]
    A --> I[BenefitsSection]
    A --> J[UseCasesSection]
    A --> K[SocialProof]
    A --> L[IntegrationsShowcase]
    A --> M[ComparisonTable]
    A --> N[PricingSection]
    A --> O[FAQ]
    A --> P[Footer]
    A --> Q[StickyCTA]
    
    B --> R[AuthButtons]
    R --> S[GitHubSignInButton]
    R --> T[GoogleSignInButton]
    R --> U[UserInfo]
    
    style A fill:#FFD700
    style B fill:#FFE66D
    style R fill:#95E1D3
```

### Navigation Component Structure

```mermaid
graph LR
    A[SimpleNav] --> B[Logo Link]
    A --> C[Navigation Buttons]
    A --> D[AuthButtons]
    
    B --> E[/lumen]
    C --> F[Docs → /waypoint]
    C --> G[Templates → /spark]
    C --> H[Open Editor → /slate/ide]
    
    D --> I{Session Status}
    I -->|Loading| J[Loading Spinner]
    I -->|Authenticated| K[User Avatar + Name]
    I -->|Unauthenticated| L[Sign In Buttons]
    
    K --> M[Sign Out Button]
    L --> N[GitHub Button]
    L --> O[Google Button]
    
    style A fill:#FFE66D
    style D fill:#95E1D3
```

---

## Data Flow Diagrams

### User Data Flow

```mermaid
flowchart LR
    subgraph "User Input"
        A[User Actions]
    end
    
    subgraph "Frontend"
        B[React Components]
        C[Next.js Router]
        D[NextAuth Session]
    end
    
    subgraph "API Layer"
        E[API Routes]
        F[Validation]
        G[Error Handling]
    end
    
    subgraph "Backend"
        H[Database]
        I[Redis Cache]
        J[External APIs]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    G --> I
    G --> J
    
    H --> G
    I --> G
    J --> G
    G --> E
    E --> D
    D --> C
    C --> B
    B --> A
    
    style A fill:#FFD700
    style D fill:#95E1D3
    style E fill:#4ECDC4
```

### API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Middleware
    participant A as API Route
    participant V as Validator
    participant S as Service
    participant D as Database
    
    C->>M: HTTP Request
    M->>M: Rate Limiting
    M->>M: Security Headers
    M->>A: Forward Request
    
    A->>V: Validate Input
    alt Validation Success
        V->>A: Validated Data
        A->>S: Process Request
        S->>D: Query Database
        D->>S: Return Data
        S->>A: Processed Result
        A->>M: Success Response
        M->>C: HTTP 200
    else Validation Error
        V->>A: Validation Error
        A->>M: Error Response
        M->>C: HTTP 400
    else Service Error
        S->>A: Service Error
        A->>M: Error Response
        M->>C: HTTP 500
    end
```

---

## User Journey Maps

### New User Journey

```mermaid
journey
    title New User Journey
    section Discovery
      Visit lumenforge.io: 5: User
      View Hero Section: 5: User
      Read Features: 4: User
      Check Pricing: 4: User
    section Engagement
      Click "Try AI Generator": 5: User
      Redirect to /spark: 5: System
      Prompted to Sign In: 3: System
    section Authentication
      Click "Sign In": 4: User
      Choose GitHub/Google: 5: User
      Complete OAuth: 5: User
      Redirect to /lumen: 5: System
    section Usage
      Access SPARK: 5: User
      Generate Component: 5: User
      Access SLATE: 5: User
      Create Workspace: 5: User
```

### Returning User Journey

```mermaid
journey
    title Returning User Journey
    section Return
      Visit lumenforge.io: 5: User
      Auto-login with Session: 5: System
      View Personalized Content: 5: User
    section Direct Access
      Navigate to /spark: 5: User
      Access Templates: 5: User
      Navigate to /slate/ide: 5: User
      Open Workspace: 5: User
    section Productivity
      Generate Components: 5: User
      Edit Code: 5: User
      Deploy Project: 5: User
```

---

## Mind Map

### Complete LUMEN System Mind Map

```mermaid
mindmap
  root((LUMEN System))
    Frontend
      Next.js App Router
        Route Structure
          /lumen
          /login
          /spark
          /slate/ide
        Components
          LandingLayout
          SimpleNav
          HeroSection
          FeatureGrid
          PricingSection
      React Components
        Client Components
        Server Components
        Shared Components
    Authentication
      NextAuth.js
        Providers
          GitHub OAuth
          Google OAuth
        Session Management
          JWT Strategy
          30-day Expiration
        Callbacks
          signIn
          jwt
          session
      Components
        AuthButtons
        GitHubSignInButton
        GoogleSignInButton
    API Layer
      Routes
        /api/generate
        /api/workspaces
        /api/health
      Features
        Validation
        Error Handling
        Rate Limiting
        Security Headers
    Error Handling
      Global Error Boundary
        404 Page
        Error Recovery
        User Feedback
    Environment
      Configuration
        Environment Variables
        Validation
        Production Checks
    Deployment
      Kubernetes
        Deployments
        Services
        Ingress
      Docker
        Container Images
        Health Checks
```

### Feature Mind Map

```mermaid
mindmap
  root((LUMEN Features))
    Marketing
      Hero Section
        Headline
        CTA Buttons
        Visual Assets
      Features Grid
        Key Features
        Benefits
        Use Cases
      Pricing
        Plans
        Comparison
        FAQ
    Navigation
      SimpleNav
        Logo
        Links
        Auth Buttons
      User Info
        Avatar
        Name
        Sign Out
    Integration
      SPARK
        Templates
        AI Generator
        Component Library
      SLATE
        IDE
        Workspace
        Code Editor
    Authentication
      OAuth Providers
        GitHub
        Google
      Session Management
        JWT
        Auto-refresh
        Secure Storage
```

---

## Technical Stack

### Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend"
        A[Next.js 14] --> B[React 18]
        B --> C[TypeScript]
        B --> D[CSS Variables]
        B --> E[Framer Motion]
    end
    
    subgraph "Authentication"
        F[NextAuth.js] --> G[OAuth 2.0]
        G --> H[GitHub Provider]
        G --> I[Google Provider]
        F --> J[JWT Sessions]
    end
    
    subgraph "API"
        K[Next.js API Routes] --> L[Zod Validation]
        K --> M[Error Handling]
        K --> N[Rate Limiting]
    end
    
    subgraph "Backend Services"
        O[PostgreSQL] --> P[Prisma ORM]
        Q[Redis] --> R[Caching]
        S[NATS] --> T[Event Publishing]
    end
    
    subgraph "Infrastructure"
        U[Kubernetes] --> V[Docker]
        U --> W[Ingress]
        U --> X[Health Checks]
    end
    
    style A fill:#FFD700
    style F fill:#95E1D3
    style K fill:#4ECDC4
```

### Dependency Graph

```mermaid
graph LR
    A[LUMEN App] --> B[Next.js]
    A --> C[NextAuth]
    A --> D[React]
    A --> E[TypeScript]
    
    B --> F[React Router]
    B --> G[API Routes]
    
    C --> H[OAuth Providers]
    C --> I[JWT]
    
    D --> J[React Hooks]
    D --> K[React Context]
    
    E --> L[Type Definitions]
    
    style A fill:#FFD700
    style B fill:#FFE66D
    style C fill:#95E1D3
```

---

## Deployment Architecture

### Kubernetes Deployment Diagram

```mermaid
graph TB
    subgraph "Ingress Layer"
        A[NGINX Ingress] --> B[SSL/TLS]
        A --> C[Domain Routing]
    end
    
    subgraph "Application Layer"
        C --> D[LUMEN Deployment]
        D --> E[Pod 1]
        D --> F[Pod 2]
        E --> G[Container:3000]
        F --> H[Container:3000]
    end
    
    subgraph "Service Layer"
        G --> I[LUMEN Service]
        H --> I
        I --> J[Load Balancer]
    end
    
    subgraph "Storage Layer"
        K[PostgreSQL] --> L[Persistent Volume]
        M[Redis] --> N[Persistent Volume]
    end
    
    subgraph "Monitoring"
        O[Prometheus] --> P[Grafana]
        Q[Health Checks] --> D
    end
    
    style D fill:#FFD700
    style I fill:#4ECDC4
    style K fill:#95E1D3
```

### Deployment Flow

```mermaid
flowchart TD
    A[Developer] --> B[Git Push]
    B --> C[GitHub Actions]
    C --> D{Build & Test}
    D -->|Pass| E[Build Docker Image]
    D -->|Fail| F[Notify Developer]
    E --> G[Push to Registry]
    G --> H[Update Kubernetes]
    H --> I[Rolling Update]
    I --> J[Health Check]
    J -->|Healthy| K[Deployment Complete]
    J -->|Unhealthy| L[Rollback]
    
    style C fill:#FFD700
    style E fill:#4ECDC4
    style K fill:#95E1D3
```

---

## System Metrics & Monitoring

### Health Check Flow

```mermaid
flowchart LR
    A[Kubernetes Probe] --> B[/api/health]
    B --> C{Check Services}
    C --> D[Database]
    C --> E[Redis]
    C --> F[NATS]
    
    D --> G{All Healthy?}
    E --> G
    F --> G
    
    G -->|Yes| H[HTTP 200]
    G -->|No| I[HTTP 503]
    
    H --> J[Pod Ready]
    I --> K[Pod Not Ready]
    
    style B fill:#FFD700
    style H fill:#95E1D3
    style I fill:#FF6B6B
```

### Error Handling Flow

```mermaid
flowchart TD
    A[User Action] --> B{Error Occurs?}
    B -->|No| C[Success]
    B -->|Yes| D{Error Type}
    
    D -->|Component Error| E[Error Boundary]
    D -->|Route Error| F[404 Page]
    D -->|API Error| G[API Error Handler]
    D -->|Auth Error| H[Login Redirect]
    
    E --> I[Error UI]
    F --> J[Not Found UI]
    G --> K[Error Response]
    H --> L[Login Page]
    
    I --> M[User Feedback]
    J --> M
    K --> M
    L --> M
    
    style E fill:#FFD700
    style F fill:#FFE66D
    style G fill:#4ECDC4
```

---

## Security Architecture

### Security Layers

```mermaid
graph TB
    subgraph "Network Layer"
        A[HTTPS/TLS] --> B[Cloudflare]
        B --> C[DDoS Protection]
    end
    
    subgraph "Application Layer"
        C --> D[Rate Limiting]
        D --> E[Security Headers]
        E --> F[CORS Policy]
    end
    
    subgraph "Authentication Layer"
        F --> G[OAuth 2.0]
        G --> H[JWT Validation]
        H --> I[Session Management]
    end
    
    subgraph "Data Layer"
        I --> J[Input Validation]
        J --> K[SQL Injection Prevention]
        K --> L[XSS Protection]
    end
    
    style A fill:#FFD700
    style G fill:#95E1D3
    style J fill:#4ECDC4
```

---

## Performance Optimization

### Performance Flow

```mermaid
graph LR
    A[User Request] --> B[CDN Cache]
    B --> C{Cache Hit?}
    C -->|Yes| D[Return Cached]
    C -->|No| E[Next.js Server]
    E --> F[React SSR]
    F --> G[Static Generation]
    G --> H[API Route]
    H --> I[Database Query]
    I --> J[Redis Cache]
    J --> K{Cache Hit?}
    K -->|Yes| L[Return Cached]
    K -->|No| M[Query Database]
    M --> N[Cache Result]
    N --> O[Return Data]
    
    style B fill:#FFD700
    style J fill:#95E1D3
    style M fill:#4ECDC4
```

---

## Conclusion

This comprehensive visual report documents the complete LUMEN system architecture, including:

- ✅ **7 Route Diagrams** - Complete navigation structure
- ✅ **5 Authentication Flows** - OAuth and session management
- ✅ **3 Component Hierarchies** - Frontend structure
- ✅ **4 Data Flow Diagrams** - Request/response flows
- ✅ **2 User Journey Maps** - New and returning users
- ✅ **3 Mind Maps** - System and feature overview
- ✅ **3 Deployment Diagrams** - Kubernetes and CI/CD
- ✅ **2 Security Diagrams** - Security layers and error handling
- ✅ **1 Performance Diagram** - Optimization strategies

**Total Visual Elements:** 30+ diagrams and flowcharts

---

**Report Generated:** December 2024  
**Status:** ✅ Complete Visual Documentation  
**Next Action:** Use this report for onboarding, documentation, and system understanding

