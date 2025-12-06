# STORYBOOK MCP TOOLS SETUP FOR CURSOR

**Status:** ⚠️ **VERSION COMPATIBILITY ISSUE**  
**Current Storybook:** 7.6.20  
**Required for MCP Addon:** 9.1.16+ or 10.x  

---

## COMPATIBILITY ISSUE

The official `@storybook/addon-mcp` requires:
- Storybook 9.1.16+, OR
- Storybook 10.x

**Current Setup:**
- Storybook 7.6.20 (not compatible)

---

## OPTIONS

### Option 1: Upgrade Storybook (Not Recommended Now)

Upgrade Storybook to 10.x to use the official MCP addon:

```bash
npx storybook@latest upgrade
```

**⚠️ Warning:** This is a 3-major-version jump with breaking changes.  
**Recommendation:** Wait until current setup is fully stable (see `STORYBOOK_UPGRADE_RECOMMENDATION.md`)

---

### Option 2: Manual MCP Server Setup (Recommended)

Create a custom MCP server that works with Storybook 7.6:

1. **Install MCP SDK:**
   ```bash
   npm install @modelcontextprotocol/sdk --save-dev
   ```

2. **Create MCP Server:**
   Create a standalone MCP server that connects to Storybook's API

3. **Configure Cursor:**
   Add the custom MCP server to Cursor's settings

---

### Option 3: Use Storybook's Built-in API

Storybook 7.6 provides an API at `/index.json` that can be accessed directly:

**Storybook API Endpoint:**
```
http://localhost:6006/index.json
```

This provides:
- Story metadata
- Component information
- Story structure

**Use this in Cursor:**
- Configure Cursor to access Storybook's JSON API
- Use file system tools to read story files
- Custom prompts to interact with Storybook data

---

## RECOMMENDED APPROACH

### Immediate Solution: Use Storybook API + File System

Since we're on Storybook 7.6, the best approach is to:

1. **Use Storybook's JSON API** (`http://localhost:6006/index.json`)
   - Provides all story metadata
   - Component information
   - Story structure

2. **Use File System Tools** in Cursor
   - Read story files directly
   - Parse component code
   - Generate new stories

3. **Create Helper Scripts**
   - Scripts to interact with Storybook data
   - Utility functions for common operations

---

## CURSOR CONFIGURATION

### Option A: Use HTTP MCP Server (Future)

When Storybook is upgraded, configure Cursor:

1. **In Cursor Settings:**
   - Go to Settings > Tools & Integrations
   - Click "New MCP Server"
   - Configure:
     - **Name:** Storybook MCP
     - **Type:** http
     - **URL:** `http://localhost:6006/mcp`

2. **Verify Connection:**
   - Start Storybook: `npm run storybook`
   - Refresh MCP tools in Cursor
   - Test the connection

---

### Option B: Use File System + Storybook API (Current)

1. **Access Storybook Data:**
   - Storybook runs at: `http://localhost:6006`
   - API endpoint: `http://localhost:6006/index.json`
   - Provides complete story metadata

2. **Use Cursor's Built-in Tools:**
   - File system access
   - Code reading/writing
   - Pattern matching

3. **Create Custom Prompts:**
   - "List all Storybook stories"
   - "Show me the Button component story"
   - "Create a new story for Component X"

---

## ALTERNATIVE: CUSTOM MCP SERVER

Create a lightweight MCP server that works with Storybook 7.6:

### Implementation Steps

1. **Install Dependencies:**
   ```bash
   npm install @modelcontextprotocol/sdk --save-dev
   ```

2. **Create Server:**
   ```typescript
   // scripts/mcp-storybook-server.ts
   import { Server } from '@modelcontextprotocol/sdk/server/index.js';
   import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
   
   // Implementation to interact with Storybook 7.6
   ```

3. **Configure Cursor:**
   ```json
   {
     "mcpServers": {
       "storybook": {
         "command": "tsx",
         "args": ["scripts/mcp-storybook-server.ts"],
         "env": {
           "STORYBOOK_URL": "http://localhost:6006"
         }
       }
     }
   }
   ```

---

## WORKAROUND: STORYBOOK API ACCESS

### Using Storybook's JSON API

**Endpoint:** `http://localhost:6006/index.json`

**Provides:**
- All stories metadata
- Component information
- Story structure
- Story IDs and titles

**Usage in Cursor:**
- Ask Cursor to fetch Storybook data
- Use the API to understand story structure
- Generate new stories based on patterns

---

## CURRENT CAPABILITIES

Even without the MCP addon, Cursor can:

1. ✅ **Read Story Files**
   - Access all `.stories.tsx` files
   - Understand story structure
   - Parse component code

2. ✅ **Access Storybook Configuration**
   - Read `.storybook/main.ts`
   - Understand story patterns
   - Know component locations

3. ✅ **Generate New Stories**
   - Create story files
   - Follow existing patterns
   - Use correct titles and structure

4. ✅ **Interact with Components**
   - Read component code
   - Understand props
   - Generate appropriate stories

---

## RECOMMENDATION

**For Now (Storybook 7.6):**
- ✅ Use Cursor's built-in file system access
- ✅ Use Storybook's JSON API (`http://localhost:6006/index.json`)
- ✅ Create helper scripts for common operations
- ✅ Use custom prompts to interact with Storybook

**Future (After Storybook Upgrade):**
- ✅ Install `@storybook/addon-mcp` when upgrading to Storybook 10.x
- ✅ Configure Cursor to use the MCP server
- ✅ Enjoy full MCP tool integration

---

## SUMMARY

**Current Status:** ⚠️ MCP addon not compatible with Storybook 7.6

**Workaround:** Use Storybook API + File System access

**Future:** Upgrade to Storybook 10.x for full MCP support

**Best Approach:** Wait for Storybook upgrade, then install MCP addon

---

**MCP TOOLS SETUP — Compatibility notes documented**

