# SPARK MVP 1 Quick Start

Get SPARK MVP 1 running in 5 minutes.

## Prerequisites

- Node.js 18+
- npm 9+
- API key from [Anthropic](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/api-keys)

## Setup (5 Minutes)

### 1. Install Dependencies

```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create `.env.local` in project root:

```env
ANTHROPIC_API_KEY=your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start Server

```bash
npm run dev
```

### 4. Open SPARK

Navigate to: http://localhost:3000/spark

## First Generation

1. Type in chat: "Create a simple PlayerController script with WASD movement"
2. Click "Generate"
3. Wait 2-10 seconds
4. Code appears in preview panel
5. Click "Export as ZIP"
6. Import ZIP into Unity

## Troubleshooting

**"next: command not found"**
→ Run: `npm install --legacy-peer-deps`

**"Generation failed"**
→ Check API key in `.env.local`

**"Export failed"**
→ Generate code first, then export

## Next Steps

- Read [USER_GUIDE_MVP1.md](USER_GUIDE_MVP1.md) for detailed usage
- Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference

---

**That's it!** You're ready to generate Unity scripts.

