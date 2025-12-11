# SPARK MVP 1 Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- An API key from either:
  - [Anthropic Claude](https://console.anthropic.com/) (recommended)
  - [OpenAI](https://platform.openai.com/api-keys)

## Installation Steps

### 1. Install Dependencies

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
npm install --legacy-peer-deps
```

**Note:** We use `--legacy-peer-deps` to handle dependency conflicts. This is safe and recommended.

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the following variables:

```env
# REQUIRED: At least one AI provider API key
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
# OR
OPENAI_API_KEY=sk-your-key-here

# REQUIRED: Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# REQUIRED: Node Environment
NODE_ENV=development
```

### 3. Verify Installation

```bash
# Check if Next.js is available
npx next --version

# Run type checking
npm run typecheck
```

### 4. Start Development Server

```bash
npm run dev
```

The app should start on http://localhost:3000

### 5. Access SPARK

Navigate to: http://localhost:3000/spark

## Troubleshooting

### "next: command not found"

**Solution:**
```bash
npm install --legacy-peer-deps
```

### "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### TypeScript errors

**Solution:**
```bash
# Install TypeScript types
npm install --save-dev @types/react @types/react-dom @types/node --legacy-peer-deps
```

### API Key not working

**Check:**
1. API key is correct (no extra spaces)
2. API key has credits/quota
3. API key is not expired
4. Environment variable name is correct

### Build fails

**Solution:**
```bash
# Try building with verbose output
npm run build -- --debug

# Check for specific errors
npm run typecheck
```

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Next Steps

After setup:
1. Read [USER_GUIDE_MVP1.md](USER_GUIDE_MVP1.md) for usage instructions
2. Read [ENV_SETUP.md](ENV_SETUP.md) for environment configuration details
3. Test with a simple prompt: "Create a simple PlayerController script"

