# SPARK MVP 1 - Quick Start Guide

## ✅ Setup Complete!

Your Claude API key has been configured. SPARK is ready to use!

---

## Start SPARK

```bash
cd spark
npm run dev
```

Then open: **http://localhost:3000/spark**

---

## Test the Full Workflow

### Test 1: Simple Script
**Prompt:** "Create a Unity PlayerController script"

**Expected Result:**
- Code appears in preview panel within 5 seconds
- Script includes MonoBehaviour base class
- Has basic movement logic

### Test 2: Complex Script
**Prompt:** "Create a Unity health system with damage, healing, and death events"

**Expected Result:**
- More complex code with events
- Proper Unity API usage
- Multiple methods

### Test 3: Export & Import
1. Generate any script
2. Click "Export as ZIP"
3. Extract the ZIP file
4. Open Unity Editor
5. Drag the `Assets` folder into your Unity project
6. Verify: Script compiles without errors

---

## Example Prompts to Try

**Beginner Scripts:**
- "Create a simple coin collector script"
- "Create a camera follow script"
- "Create a door that opens when the player gets near"

**Intermediate Scripts:**
- "Create an enemy AI that patrols and chases the player"
- "Create a weapon system with reload and ammo"
- "Create a jump pad that launches the player upward"

**Advanced Scripts:**
- "Create an inventory system with item management"
- "Create a save/load system using PlayerPrefs"
- "Create a dialogue system with conversation trees"

---

## Troubleshooting

### If generation fails:
1. Check your API key in `.env.local`
2. Verify you have internet connection
3. Check the browser console for errors
4. Restart the dev server

### If export fails:
1. Make sure code was generated first
2. Check browser console for errors
3. Try regenerating the script

### If Unity import fails:
1. Check that ZIP extracted correctly
2. Verify `Assets/Scripts/` folder structure
3. Look for .meta files alongside .cs files
4. Check Unity console for specific errors

---

## File Structure in Exported ZIP

```
YourScript.zip
└── Assets/
    ├── Assets.meta
    └── Scripts/
        ├── Scripts.meta
        ├── YourScript.cs
        └── YourScript.cs.meta
```

---

## What to Test For

### ✅ Generation Quality
- [ ] Code compiles in Unity
- [ ] Uses proper Unity APIs
- [ ] Follows C# conventions
- [ ] Includes necessary using statements
- [ ] Has clear, logical structure

### ✅ Performance
- [ ] Generation completes in <5 seconds
- [ ] UI remains responsive
- [ ] No errors in console

### ✅ Export Quality
- [ ] ZIP downloads successfully
- [ ] Contains correct folder structure
- [ ] .meta files present
- [ ] Imports into Unity without errors

---

## Success Criteria

**MVP 1 is successful if:**
1. ✅ You can describe a Unity script in natural language
2. ✅ SPARK generates valid C# code
3. ✅ The code exports as a Unity-ready ZIP
4. ✅ The code compiles in Unity Editor
5. ✅ The whole process takes <2 minutes

---

## Next Steps After Testing

**If it works well:**
- Test with 10+ different prompts
- Try edge cases (complex requests, unclear prompts)
- Gather feedback from other Unity developers
- Move to Week 2 enhancements

**If you find issues:**
- Document specific problems
- Note which prompts fail
- Check error messages
- We'll iterate and improve

---

## Commands Reference

```bash
# Start development server
cd spark
npm run dev

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Install dependencies (if needed)
npm install
```

---

## Environment Variables

Your `.env.local` file contains:
```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Keep this file secure!** Never commit it to git (already in .gitignore).

---

## Ready to Build Your Portfolio!

SPARK is now ready to help you:
- ✅ Generate Unity scripts in seconds
- ✅ Learn Unity C# patterns
- ✅ Build your game development portfolio
- ✅ Ship projects faster

**Start the dev server and try your first prompt!**

```bash
cd spark && npm run dev
```
