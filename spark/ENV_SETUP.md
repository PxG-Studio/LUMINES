# SPARK MVP 1 Environment Setup

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# REQUIRED: At least one AI provider API key
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# OR
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# REQUIRED: Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# REQUIRED: Node Environment
NODE_ENV=development
```

## Getting API Keys

### Anthropic Claude
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy and paste into `.env.local`

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new secret key
4. Copy and paste into `.env.local`

## Optional Variables

```env
# Database (for saving generation history)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Monitoring
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Rate Limiting
REDIS_URL=redis://localhost:6379
```

## Quick Start

1. Copy environment variables to `.env.local`:
   ```bash
   # Create .env.local in project root
   touch .env.local
   ```

2. Add your API keys to `.env.local`

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open SPARK:
   ```
   http://localhost:3000/spark
   ```

