# 🚀 Storybook Startup Guide

## Quick Start

```bash
npm run storybook
```

## Port Management

### If Port 6006 is Busy

**Option 1: Kill existing process (Recommended)**
```powershell
# Find process using port 6006
netstat -ano | findstr :6006

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

**Option 2: Use different port**
- Storybook will prompt: "Would you like to run Storybook on port 6007 instead?"
- Select **Yes** to use port 6007
- Or specify port manually: `npx storybook dev -p 6007`

### Quick Port Cleanup Script

```powershell
# Kill all Storybook processes
Get-Process node | Where-Object {$_.CommandLine -like "*storybook*"} | Stop-Process -Force

# Or kill specific port
$port = 6006
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process) { Stop-Process -Id $process -Force }
```

## Troubleshooting

### Cache Issues
If you encounter module resolution or HMR issues:

```powershell
# Clear Storybook cache
.\scripts\clear-storybook-cache.ps1

# Or manually:
Remove-Item -Recurse -Force node_modules\.cache\storybook
Remove-Item -Recurse -Force node_modules\.vite
```

### Common Issues

1. **Port Already in Use**
   - Kill existing process (see above)
   - Or use different port

2. **Module Resolution Errors**
   - Clear cache (see above)
   - Restart Storybook

3. **HMR Not Working**
   - Clear Vite cache
   - Check `.storybook/main.ts` HMR configuration

4. **Content-Visibility Warnings**
   - These are suppressed in `.storybook/preview.ts`
   - If still appearing, check browser console filters

## Verification Checklist

After starting Storybook:

- [ ] Storybook starts without errors
- [ ] Browser opens to http://localhost:6006 (or 6007)
- [ ] No console errors in browser
- [ ] Components render correctly
- [ ] HMR works (edit a file, see changes)
- [ ] All stories load

## Configuration Files

- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.ts` - Preview configuration & warning suppression
- `package.json` - Dependencies and scripts

## Scripts

- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build static Storybook
- `npm run storybook:sync-wissil` - Sync WISSIL stories
- `.\scripts\clear-storybook-cache.ps1` - Clear caches

---

**All fixes have been applied. Storybook should start cleanly!** ✨

