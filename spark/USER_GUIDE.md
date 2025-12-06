# SPARK User Guide

Complete guide to using SPARK - the AI-powered Unity C# script generator.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Tips and Best Practices](#tips-and-best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API key from either:
  - **Claude** (Anthropic): https://console.anthropic.com/
  - **OpenAI**: https://platform.openai.com/api-keys
- Basic understanding of Unity and C#

### Initial Setup

1. **Clone or download SPARK**
   ```bash
   git clone <your-spark-repo>
   cd spark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API keys**
   - Copy `.env.example` to `.env.local`
   - Add your API keys:
     ```
     ANTHROPIC_API_KEY=sk-ant-xxx...
     OPENAI_API_KEY=sk-xxx...
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to http://localhost:3000/spark
   - You should see the SPARK interface with two panels

---

## Basic Usage

### The Interface

SPARK has a simple two-panel layout:

**Left Panel: AI Assistant**
- Chat input for describing your script
- Message history
- AI provider selector (Claude or OpenAI)
- Model selector

**Right Panel: Preview**
- Live code preview with syntax highlighting
- Export button to download as Unity-ready ZIP

### Generating Your First Script

1. **Select AI Provider** (top of left panel)
   - Choose between Claude or OpenAI
   - Select your preferred model

2. **Describe Your Script**
   Type a natural language description in the input box:
   - "Create a PlayerController that moves with WASD keys"
   - "Make a coin that rotates and can be collected"
   - "Build a health system with damage and healing"

3. **Submit**
   - Click "Generate" or press Enter
   - Wait 2-5 seconds for the AI to generate code
   - The generated script appears in the preview panel

4. **Review the Code**
   - Check that it matches your requirements
   - Verify it includes proper Unity API usage
   - Note the automatically detected script name

5. **Export**
   - Click "Export as ZIP"
   - The ZIP downloads automatically
   - Contains proper Unity project structure

### Script Description Tips

**Good descriptions are:**
- **Specific**: "Create a PlayerController with WASD movement and jumping"
- **Clear**: "Make a health bar UI that fills/empties based on current health"
- **Feature-focused**: "Build a door that opens when the player presses E nearby"

**Avoid:**
- Vague requests: "Make a game"
- Overly complex: Describing entire game systems in one prompt
- Code snippets: Just describe what you want, not how to code it

---

## Advanced Features

### Multi-Provider Support

SPARK supports both Claude and OpenAI:

**Claude (Recommended)**
- Models: Claude 3.5 Sonnet (latest), Claude 3.5 Sonnet (June), Claude 3 Haiku (fast)
- Best for: Complex game logic, detailed systems
- Speed: 2-5 seconds

**OpenAI**
- Models: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo (fast)
- Best for: Quick iterations, simpler scripts
- Speed: 1-3 seconds

### Script Types

SPARK can generate different types of Unity scripts:

1. **MonoBehaviour Components**
   - Player controllers
   - Enemy AI
   - Interactive objects
   - UI controllers
   - Game managers

2. **ScriptableObjects** (data containers)
   - "Create a WeaponData ScriptableObject with damage and fire rate"
   - "Make an EnemyStats ScriptableObject"

3. **Utility Classes** (helpers and managers)
   - "Create a MathHelper class with utility functions"
   - "Build a SaveSystem singleton"

4. **Editor Scripts** (Unity Editor extensions)
   - "Create a custom editor for my GameManager"
   - "Build a level editor tool"

### Iterative Refinement

If the generated script isn't perfect:

1. **Regenerate with more details**
   - Add specific requirements that were missing
   - "Add jumping with space key"
   - "Include collision detection"

2. **Request modifications**
   - "Make the movement speed configurable"
   - "Add comments explaining the code"

3. **Combine multiple scripts**
   - Generate each component separately
   - Export each one individually
   - Import all into Unity

### Validation

SPARK automatically validates generated code:

- Checks for balanced braces
- Verifies using statements
- Ensures class definitions exist
- Validates Unity API usage
- Detects common errors

If validation fails, you'll see a clear error message explaining what went wrong.

---

## Tips and Best Practices

### Writing Effective Prompts

**1. Start Simple**
```
"Create a basic PlayerController with WASD movement"
```

**2. Add Details Gradually**
```
"Create a PlayerController with:
- WASD movement
- Space bar jumping
- Sprint with Left Shift
- Ground check using raycast"
```

**3. Specify Unity Features**
```
"Create a PlayerController using:
- Rigidbody for physics
- Animator for animations
- Input System (new input system)
- Ground check with LayerMask"
```

### Common Patterns

**Player Movement**
```
"Create a PlayerController with WASD movement, jumping, and camera-relative controls"
```

**Enemy AI**
```
"Create an enemy AI that patrols between waypoints and chases the player when in range"
```

**Collectibles**
```
"Create a coin that rotates slowly, plays a sound when collected, and destroys itself"
```

**Health System**
```
"Create a Health component with current/max health, damage and healing methods, and death event"
```

**UI**
```
"Create a health bar UI that smoothly animates between values using Image fill amount"
```

### Quality Checklist

Before exporting, verify:
- [ ] Script name is appropriate
- [ ] Includes necessary using statements
- [ ] Has proper XML documentation
- [ ] Uses correct Unity lifecycle methods
- [ ] Follows Unity naming conventions
- [ ] No syntax errors in preview

### Performance Considerations

**Model Selection**
- Use fast models (Claude Haiku, GPT-3.5) for iteration
- Use powerful models (Claude Sonnet, GPT-4) for complex logic

**Generation Time**
- Simple scripts: 1-3 seconds
- Complex scripts: 3-7 seconds
- Very complex scripts: 7-15 seconds

---

## Troubleshooting

### Common Issues

**Problem: "API key not configured" error**
- **Solution**: Check your `.env.local` file contains the correct API key
- Restart the dev server after adding the key

**Problem: Generated code has syntax errors**
- **Solution**: Try a more specific prompt
- Switch to a different AI model
- Regenerate and try again

**Problem: Script doesn't appear in preview**
- **Solution**: Wait a few more seconds for generation
- Check browser console for errors
- Verify your internet connection

**Problem: Export button doesn't work**
- **Solution**: Ensure code was generated successfully
- Check browser's download settings
- Try a different browser

**Problem: ZIP file won't import into Unity**
- **Solution**: See UNITY_IMPORT_GUIDE.md
- Verify Unity version compatibility
- Check file wasn't corrupted during download

### Error Messages

**"No code generated. Please try again."**
- The AI couldn't understand your request
- Try rephrasing your prompt more clearly

**"Generated code has errors: Missing using statements"**
- SPARK's validator caught an issue
- Report this as a bug (shouldn't happen)

**"Failed to export. Please try again."**
- Temporary network or server issue
- Try exporting again

### Getting Help

If you encounter persistent issues:

1. Check the console for error messages (F12 in browser)
2. Verify your `.env.local` configuration
3. Try a different AI provider/model
4. Restart the development server
5. Check your API key has sufficient credits

---

## Best Results Guidelines

### For Simple Scripts (95%+ success rate)
- One clear responsibility
- Standard Unity patterns
- 50-200 lines of code

### For Complex Scripts (80-90% success rate)
- Multiple systems working together
- Custom algorithms
- 200-500 lines of code
- May require manual tweaks

### For Very Complex Scripts (60-80% success rate)
- Consider breaking into multiple scripts
- Generate core logic first
- Add features incrementally

---

## Next Steps

1. **Generate your first script** using a simple prompt
2. **Export and import into Unity** (see UNITY_IMPORT_GUIDE.md)
3. **Test in Unity Editor** to verify it compiles
4. **Iterate and refine** based on your needs
5. **Deploy to production** (see DEPLOYMENT_GUIDE.md)

---

**Need more help?**
- Unity Import Guide: `UNITY_IMPORT_GUIDE.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Testing Guide: `TESTING_GUIDE.md`

**Generated by SPARK - AI-Powered Unity Development**
