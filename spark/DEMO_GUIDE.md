# SPARK MVP 1 - Demo Guide

**Quick Start Guide for Demonstrating SPARK**

---

## 🚀 Quick Demo Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd /Users/hiroyasu/Documents/GitHub/LUMINES
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required: At least one AI provider API key
ANTHROPIC_API_KEY=your_anthropic_key_here
# OR
OPENAI_API_KEY=your_openai_key_here

# Optional: Database (for logging)
DATABASE_URL=postgresql://user:password@localhost:5432/spark

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379
```

**For a quick demo, you only need ONE AI provider key:**
- `ANTHROPIC_API_KEY` (recommended for best results)
- OR `OPENAI_API_KEY`

### Step 3: Start the Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

### Step 4: Navigate to SPARK

Open your browser and go to:
**http://localhost:3000/spark**

---

## 🎯 Demo Flow

### Basic Demo (2-3 minutes)

1. **Open SPARK Interface**
   - Navigate to `/spark`
   - You'll see a clean two-panel interface

2. **Select AI Provider**
   - Choose either "Claude" or "OpenAI" from the provider dropdown
   - Select a model (e.g., "claude-3-opus" or "gpt-4")

3. **Generate a Unity Script**
   - Type a prompt in the chat input, for example:
     ```
     Create a Unity script for a player controller that moves with WASD keys and jumps with spacebar
     ```
   - Click "Send" or press Enter
   - Wait for the AI to generate the code (10-30 seconds)

4. **Preview the Code**
   - The generated code appears in the preview panel on the right
   - Syntax highlighting is automatic
   - You can scroll through the code

5. **Export the Script**
   - Click the "Export" button
   - A ZIP file downloads containing:
     - The C# script file
     - Unity `.meta` file
     - Ready to import into Unity

---

## 🎬 Demo Scripts (Ready-to-Use Prompts)

### Script 1: Player Controller (Simple)
```
Create a Unity C# script for a 3D player controller that:
- Moves with WASD keys
- Jumps with spacebar
- Has a speed of 5 units per second
- Has a jump force of 10
```

### Script 2: Enemy AI (Medium)
```
Create a Unity C# script for an enemy AI that:
- Patrols between two waypoints
- Chases the player when they get within 10 units
- Attacks the player when within 2 units
- Has a health system with 100 HP
```

### Script 3: Collectible Item (Simple)
```
Create a Unity C# script for a collectible item that:
- Rotates slowly
- Plays a sound when collected
- Adds points to a score
- Destroys itself when collected
```

### Script 4: Health System (Advanced)
```
Create a Unity C# script for a health system that:
- Has max health and current health
- Takes damage from enemies
- Regenerates health over time
- Shows a health bar UI
- Triggers death when health reaches 0
```

---

## 🎨 Demo Features to Highlight

### 1. **Multi-Provider Support**
- Show switching between Claude and OpenAI
- Different models available

### 2. **Real-Time Code Preview**
- Syntax highlighting
- Clean, readable code
- Proper Unity structure

### 3. **Unity-Compatible Export**
- ZIP file with proper structure
- `.meta` files included
- Ready to drag-and-drop into Unity

### 4. **Error Handling**
- Show what happens with invalid prompts
- Graceful error messages

### 5. **Code Quality**
- Proper `using` statements
- Unity naming conventions
- XML documentation comments

---

## 🐛 Troubleshooting

### Issue: "API key not found"
**Solution:** Make sure `.env.local` exists and has at least one API key:
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Issue: "Connection error"
**Solution:** Check your internet connection and API key validity

### Issue: "Port 3000 already in use"
**Solution:** Use a different port:
```bash
npm run dev -- -p 3001
```

### Issue: "Module not found"
**Solution:** Reinstall dependencies:
```bash
npm install
```

---

## 📊 What to Show in Demo

### ✅ Strengths to Highlight
1. **Fast Generation** - Code ready in 10-30 seconds
2. **Unity-Ready** - Proper structure, imports, naming
3. **Multiple Providers** - Choice of AI models
4. **Clean Export** - ZIP file ready for Unity
5. **Error Handling** - Graceful failures

### ⚠️ Known Limitations (Be Honest)
1. **AI Hallucinations** - ~5% of generations may need fixes
2. **Complex Systems** - Best for single-script components
3. **Unity Editor Required** - Can't test in browser
4. **No Preview** - Can't run Unity code in browser (MVP 1)

---

## 🎯 Demo Checklist

Before the demo:
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env.local`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser open to `http://localhost:3000/spark`
- [ ] At least one demo prompt ready

During the demo:
- [ ] Show provider/model selection
- [ ] Generate at least 2-3 scripts
- [ ] Show code preview
- [ ] Export at least one script
- [ ] Show the ZIP file contents

After the demo:
- [ ] Answer questions about:
  - Supported Unity versions
  - Future features (MVP 2+)
  - API costs
  - Deployment options

---

## 🚀 Production Demo (If Deployed)

If SPARK is deployed to production:

1. **Navigate to production URL**
2. **Same demo flow applies**
3. **No local setup needed**
4. **Works from any browser**

---

## 📝 Quick Reference

### Start SPARK
```bash
npm run dev
# Open http://localhost:3000/spark
```

### Test Export
```bash
# Generate a script, then click Export
# Check Downloads folder for ZIP file
```

### Check Health
```bash
# Visit http://localhost:3000/api/spark/health
# Should return: {"status":"healthy"}
```

---

**Ready to demo!** 🎉

For more details, see:
- `spark/QUICK_START_MVP1.md` - Detailed setup
- `spark/USER_GUIDE_MVP1.md` - User guide
- `spark/ENV_SETUP.md` - Environment setup

