# SPARK Demo - Quick Start ✅

**Your server is running!** 🎉

## ✅ Current Status

- ✅ Next.js server started on **http://localhost:3000**
- ⚠️ Minor warnings (non-blocking):
  - `turbopack` config warning (can be ignored)
  - `swc dependencies` warning (can be ignored)

**These warnings don't prevent SPARK from working!**

---

## 🚀 Demo SPARK Now

### Step 1: Open SPARK in Browser

Open your browser and go to:
**http://localhost:3000/spark**

You should see:
- Left panel: Chat interface
- Right panel: Code preview area

### Step 2: Set Up API Key (If Not Done)

If you haven't added your API key yet:

1. **Stop the server** (Ctrl+C in terminal)

2. **Create/Edit `.env.local`** in the project root:
   ```bash
   cd /Users/hiroyasu/Documents/GitHub/LUMINES
   nano .env.local
   ```

3. **Add your API key:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   # OR
   OPENAI_API_KEY=sk-your-key-here
   
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Save and restart:**
   ```bash
   npm run dev
   ```

### Step 3: Try Your First Generation

1. **Select AI Provider** (top of chat panel)
   - Choose "Claude" or "OpenAI"
   - Select a model

2. **Type a prompt**, for example:
   ```
   Create a Unity player controller that moves with WASD keys and jumps with spacebar
   ```

3. **Click "Send"** or press Enter

4. **Wait 10-30 seconds** for code generation

5. **View the code** in the preview panel (right side)

6. **Click "Export"** to download as Unity-ready ZIP

---

## 🎯 Quick Demo Prompts

### Simple (30 seconds)
```
Create a Unity script for a coin that rotates and can be collected
```

### Medium (1 minute)
```
Create a Unity enemy AI that patrols between two waypoints and chases the player
```

### Advanced (2 minutes)
```
Create a Unity health system with damage, healing, regeneration, and death events
```

---

## ✅ Verify It's Working

### Check 1: Health Endpoint
```bash
curl http://localhost:3000/api/spark/health
```

Should return: `{"status":"healthy"}`

### Check 2: SPARK Page Loads
- Open: http://localhost:3000/spark
- Should see two-panel interface
- No errors in browser console

### Check 3: API Key Works
- Try generating a script
- If you see "API key not found" error, add your key to `.env.local`

---

## 🐛 Troubleshooting

### Issue: "API key not found"
**Solution:** 
1. Check `.env.local` exists in project root
2. Verify API key is correct
3. Restart server: `npm run dev`

### Issue: "Generation failed"
**Solution:**
1. Check internet connection
2. Verify API key is valid
3. Check browser console for errors

### Issue: Page won't load
**Solution:**
1. Check server is running (should see "Ready" message)
2. Try: http://localhost:3000
3. Check for port conflicts

---

## 🎬 Demo Checklist

Before demo:
- [ ] Server running (`npm run dev`)
- [ ] Browser open to http://localhost:3000/spark
- [ ] API key in `.env.local`
- [ ] At least one demo prompt ready

During demo:
- [ ] Show provider/model selection
- [ ] Generate 2-3 scripts
- [ ] Show code preview
- [ ] Export at least one script
- [ ] Show ZIP file contents

---

## 📝 Notes

- **Warnings are OK**: The `turbopack` and `swc` warnings don't affect functionality
- **First generation may be slow**: 10-30 seconds is normal
- **Export creates ZIP**: Ready to import into Unity
- **No Unity needed**: You can demo without Unity installed

---

**You're ready to demo!** 🚀

Open http://localhost:3000/spark and start generating!

