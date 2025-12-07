# SPARK MVP 1

AI-powered Unity C# script generator. Natural language prompts → working Unity code.

## Features

- Natural language → Unity C# generation
- Real-time code preview with Monaco Editor
- Export as Unity-ready ZIP files
- Claude AI integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with your API key:
```
ANTHROPIC_API_KEY=your_key_here
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000/spark](http://localhost:3000/spark)

## MVP 1 Scope

- Unity C# script generation only
- Basic validation
- Text-based preview
- ZIP export

## Timeline

Week 1: Foundation + UI
Week 2: AI integration
Week 3: Export system
Week 4: Testing + polish

## Success Criteria

- User can generate Unity script from prompt
- Generated code compiles in Unity
- Export creates valid Unity project structure
- <5 second generation time
- 90%+ success rate
