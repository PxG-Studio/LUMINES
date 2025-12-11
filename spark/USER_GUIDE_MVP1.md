# SPARK MVP 1 User Guide

## What is SPARK MVP 1?

SPARK MVP 1 is a simple, web-based tool that generates Unity C# scripts from natural language prompts. Type what you want, get working code, export it to Unity.

## Quick Start

### 1. Setup

1. **Get an API Key**
   - Choose one: [Anthropic Claude](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/api-keys)
   - Copy your API key

2. **Configure Environment**
   - Create `.env.local` in the project root
   - Add your API key:
     ```env
     ANTHROPIC_API_KEY=your-key-here
     # OR
     OPENAI_API_KEY=your-key-here
     
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

3. **Start the App**
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```

4. **Open SPARK**
   - Navigate to: http://localhost:3000/spark

## How to Use

### Step 1: Type Your Prompt

In the left panel, describe the Unity script you want:

**Good Examples:**
- "Create a PlayerController script with WASD movement and spacebar jumping"
- "Generate a Health system with takeDamage and heal methods"
- "Make a Coin pickup script that adds to score when collected"

**Tips:**
- Be specific about what you want
- Mention Unity-specific features (MonoBehaviour, Update, etc.)
- Include method names if you have preferences

### Step 2: Generate Code

1. Click "Generate" or press Enter
2. Wait 2-10 seconds (depending on AI provider)
3. Code appears in the right panel

### Step 3: Review Code

- Check the generated C# code in the preview panel
- Verify it looks correct
- Make note of the script name (used for export)

### Step 4: Export to Unity

1. Click "Export as ZIP" button
2. ZIP file downloads automatically
3. Extract the ZIP file
4. Copy the `Assets` folder to your Unity project
5. Open Unity - scripts should appear in Assets/Scripts/

## Importing to Unity

### Method 1: Direct Import

1. Download the ZIP from SPARK
2. Extract the ZIP file
3. Copy the `Assets` folder into your Unity project root
4. Unity will automatically import the scripts

### Method 2: Manual Import

1. Download the ZIP from SPARK
2. Extract the ZIP file
3. Open Unity Editor
4. In Unity, right-click in Project window → Import Package → Custom Package
5. Select the ZIP file
6. Click Import

### Verification

After importing:
1. Check Unity Console for any errors
2. Scripts should appear in Assets/Scripts/
3. You can attach scripts to GameObjects
4. Scripts should compile without errors

## Troubleshooting

### "Generation failed" Error

**Possible causes:**
- API key not configured
- API key invalid or expired
- Network connection issue
- API rate limit exceeded

**Solutions:**
- Check `.env.local` has correct API key
- Verify API key is active in provider dashboard
- Check internet connection
- Wait a few minutes and try again

### "Export failed" Error

**Possible causes:**
- No code generated yet
- Browser download blocked
- Network issue

**Solutions:**
- Generate code first
- Check browser download settings
- Try again

### Code Doesn't Compile in Unity

**Possible causes:**
- Generated code has syntax errors
- Missing Unity references
- Unity version incompatibility

**Solutions:**
- Try generating again with a clearer prompt
- Check Unity Console for specific errors
- Ensure Unity 2020.3+ is installed
- Manually fix any obvious errors

### ZIP Import Fails in Unity

**Possible causes:**
- ZIP file corrupted
- Wrong Unity version
- File permissions

**Solutions:**
- Re-download the ZIP
- Ensure Unity 2020.3 or newer
- Check file permissions
- Try manual file copy instead

## Best Practices

### Writing Good Prompts

✅ **DO:**
- Be specific: "PlayerController with WASD movement"
- Mention Unity features: "MonoBehaviour script"
- Include method names: "with Jump() and Move() methods"

❌ **DON'T:**
- Be too vague: "make a script"
- Forget Unity context: "create a class" (not Unity-specific)
- Ask for multiple unrelated scripts in one prompt

### Code Quality

- Generated code follows Unity conventions
- Includes proper using statements
- Uses MonoBehaviour when appropriate
- Has meaningful variable names

### Export Tips

- Export immediately after generation
- Keep ZIP files organized
- Test imports in a new Unity project first
- Backup your Unity project before importing

## Limitations (MVP 1)

**What MVP 1 CAN do:**
- Generate single Unity C# scripts
- Export as ZIP for Unity import
- Support Claude and OpenAI
- Basic code validation

**What MVP 1 CANNOT do:**
- Generate multiple scripts at once
- Preview code execution
- Multi-file projects
- Other game engines (Godot, etc.)
- Real-time collaboration
- Code editing after generation

## Getting Help

### Common Issues

1. **API Key Problems**
   - Verify key is correct
   - Check key has credits/quota
   - Ensure key is not expired

2. **Generation Timeout**
   - Try a shorter prompt
   - Switch AI providers
   - Check network connection

3. **Unity Import Issues**
   - Verify Unity version (2020.3+)
   - Check ZIP file integrity
   - Review Unity Console for errors

### Support

- Check error messages in the UI
- Review browser console for details
- Verify environment variables are set
- Test with a simple prompt first

## Next Steps

After MVP 1, future versions will include:
- Multiple script generation
- Code preview and execution
- Support for more game engines
- Project management
- Real-time collaboration

---

**Version:** 1.0.0  
**Last Updated:** December 2024

