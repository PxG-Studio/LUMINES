# SPARK MVP 1 Troubleshooting Guide

## Common Issues and Solutions

### Generation Issues

#### "Generation failed" Error

**Symptoms:**
- Error message appears in chat
- No code generated
- Red error message in UI

**Possible Causes:**
1. API key not configured
2. API key invalid or expired
3. Network connection issue
4. API rate limit exceeded
5. Invalid prompt format

**Solutions:**

1. **Check API Key Configuration**
   ```bash
   # Verify .env.local exists and has API key
   cat .env.local | grep API_KEY
   ```

2. **Verify API Key is Valid**
   - Anthropic: https://console.anthropic.com/settings/keys
   - OpenAI: https://platform.openai.com/api-keys
   - Check key has credits/quota remaining

3. **Test Network Connection**
   ```bash
   # Test Anthropic API
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: YOUR_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model":"claude-3-5-sonnet-20240620","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
   ```

4. **Check Rate Limits**
   - Wait 1-2 minutes between requests
   - Check API provider dashboard for rate limit status
   - Consider switching providers if one is rate-limited

5. **Simplify Prompt**
   - Try shorter, more specific prompts
   - Avoid special characters
   - Use clear, simple language

#### "Validation failed" Error

**Symptoms:**
- Code generated but marked as invalid
- Error mentions syntax issues

**Possible Causes:**
1. Generated code has syntax errors
2. Missing Unity-specific requirements
3. Validator too strict

**Solutions:**

1. **Try Generating Again**
   - Sometimes AI generates invalid code
   - Try rephrasing the prompt
   - Be more specific about requirements

2. **Check Generated Code**
   - Review code in preview panel
   - Look for obvious syntax errors
   - Manually fix if needed

3. **Adjust Prompt**
   - Be more explicit: "Create a MonoBehaviour script"
   - Mention Unity requirements: "Include using UnityEngine"
   - Specify class structure: "Inherit from MonoBehaviour"

### Export Issues

#### "Export failed" Error

**Symptoms:**
- Export button doesn't work
- Error message appears
- ZIP doesn't download

**Possible Causes:**
1. No code generated yet
2. Browser download blocked
3. Network issue
4. Server error

**Solutions:**

1. **Generate Code First**
   - Ensure code is generated and visible
   - Check preview panel has code
   - Verify scriptName is set

2. **Check Browser Settings**
   - Allow downloads in browser
   - Check browser console for errors
   - Try different browser

3. **Check Server Logs**
   ```bash
   # Check Next.js logs
   npm run dev
   # Look for export route errors
   ```

4. **Verify Export Route**
   - Check `/api/export` endpoint exists
   - Verify route is accessible
   - Test with curl:
     ```bash
     curl -X POST http://localhost:3000/api/export \
       -H "Content-Type: application/json" \
       -d '{"code":"using UnityEngine;","scriptName":"Test"}'
     ```

#### ZIP File Issues

**Symptoms:**
- ZIP downloads but is corrupted
- ZIP doesn't extract properly
- Unity doesn't recognize files

**Possible Causes:**
1. ZIP file corrupted during download
2. Wrong file structure
3. Missing .meta files

**Solutions:**

1. **Re-download ZIP**
   - Try exporting again
   - Check file size (should be > 0 bytes)
   - Verify ZIP opens in file manager

2. **Check ZIP Structure**
   - Extract ZIP manually
   - Verify structure: `Assets/Scripts/`
   - Check .meta files exist

3. **Manual Import**
   - Extract ZIP
   - Copy Assets folder manually
   - Paste into Unity project

### Unity Import Issues

#### Scripts Don't Appear in Unity

**Symptoms:**
- Imported ZIP but no scripts visible
- Unity doesn't show files
- Project window empty

**Possible Causes:**
1. Wrong import location
2. Unity version incompatibility
3. File permissions

**Solutions:**

1. **Check Import Location**
   - Import to Unity project root
   - Not to Assets folder directly
   - Unity should auto-detect Assets folder

2. **Verify Unity Version**
   - Requires Unity 2020.3 or newer
   - Check Unity version: Help → About Unity
   - Update if needed

3. **Check File Permissions**
   - Ensure files are readable
   - Check folder permissions
   - Try manual file copy

#### Scripts Don't Compile

**Symptoms:**
- Scripts appear but have errors
- Unity Console shows compilation errors
- Scripts can't be attached

**Possible Causes:**
1. Generated code has errors
2. Missing Unity references
3. Namespace issues

**Solutions:**

1. **Check Unity Console**
   - Review specific error messages
   - Fix obvious syntax errors
   - Check for missing using statements

2. **Verify Unity Setup**
   - Ensure Unity is properly installed
   - Check .NET version compatibility
   - Verify Unity API is available

3. **Regenerate Code**
   - Try generating again with clearer prompt
   - Specify Unity version if needed
   - Request simpler code structure

### Application Issues

#### App Won't Start

**Symptoms:**
- `npm run dev` fails
- Port already in use
- Build errors

**Solutions:**

1. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill process
   kill -9 <PID>
   # Or use different port
   PORT=3001 npm run dev
   ```

2. **Build Errors**
   ```bash
   # Clear cache
   rm -rf .next
   # Rebuild
   npm run build
   ```

3. **Dependency Issues**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

#### TypeScript Errors

**Symptoms:**
- Type errors in IDE
- Build fails with type errors
- Missing type definitions

**Solutions:**

1. **Install Type Definitions**
   ```bash
   npm install --save-dev @types/react @types/react-dom @types/node --legacy-peer-deps
   ```

2. **Check tsconfig.json**
   - Verify paths are correct
   - Check include/exclude patterns
   - Ensure types are included

3. **Restart TypeScript Server**
   - In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
   - Reload IDE
   - Clear TypeScript cache

### Performance Issues

#### Slow Generation

**Symptoms:**
- Generation takes > 10 seconds
- Timeout errors
- Slow API responses

**Solutions:**

1. **Switch AI Provider**
   - Try Claude Haiku (faster)
   - Try GPT-3.5 Turbo (faster)
   - Avoid GPT-4 for speed

2. **Simplify Prompts**
   - Shorter prompts = faster generation
   - Less complex requests
   - Single script only

3. **Check Network**
   - Test internet speed
   - Check API provider status
   - Try different network

#### High Memory Usage

**Symptoms:**
- App becomes slow
- Browser crashes
- Memory warnings

**Solutions:**

1. **Clear Browser Cache**
   - Clear browser data
   - Restart browser
   - Use incognito mode

2. **Limit Concurrent Requests**
   - Don't generate multiple scripts at once
   - Wait for one to complete
   - Close unused tabs

3. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C)
   # Restart
   npm run dev
   ```

## Getting More Help

### Debug Mode

Enable debug logging:

```env
# In .env.local
NODE_ENV=development
DEBUG=*
```

### Check Logs

1. **Browser Console**
   - Open DevTools (F12)
   - Check Console tab
   - Look for errors

2. **Server Logs**
   - Check terminal running `npm run dev`
   - Look for error messages
   - Check request logs

3. **Network Tab**
   - Open DevTools → Network
   - Check API requests
   - Verify responses

### Report Issues

When reporting issues, include:
1. Error message (exact text)
2. Steps to reproduce
3. Browser and version
4. Node.js version
5. Environment variables (without keys)
6. Console logs

---

**Last Updated:** December 2024

