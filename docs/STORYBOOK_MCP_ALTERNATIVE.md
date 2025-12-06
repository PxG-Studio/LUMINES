# STORYBOOK MCP ALTERNATIVE — USING STORYBOOK API

**Status:** ✅ **WORKAROUND AVAILABLE**  
**For Storybook:** 7.6.20  
**Purpose:** Interact with Storybook from Cursor without MCP addon

---

## QUICK START

### 1. Start Storybook

```bash
npm run storybook
```

Storybook API will be available at: `http://localhost:6006/index.json`

### 2. Use Storybook API Helper

```bash
# List all stories
tsx scripts/storybook-api-helper.ts list-stories

# Get story details
tsx scripts/storybook-api-helper.ts get-story "Button"

# Get component code
tsx scripts/storybook-api-helper.ts get-component "Button"
```

### 3. In Cursor

**Ask Cursor to:**
- "List all Storybook stories"
- "Show me the Button story"
- "Create a new story for MyComponent"
- "What components have stories?"

**Cursor can:**
- ✅ Read all story files directly
- ✅ Access Storybook API via helper script
- ✅ Understand story structure
- ✅ Generate new stories following patterns

---

## STORYBOOK API ENDPOINTS

### Index JSON
**URL:** `http://localhost:6006/index.json`

**Returns:**
```json
{
  "v": 4,
  "entries": {
    "lumenforge-io-design-system-components-atoms-button--default": {
      "id": "lumenforge-io-design-system-components-atoms-button--default",
      "name": "Default",
      "title": "Lumenforge.io Design System/Components/Atoms/Button",
      "importPath": "../src/stories/Components/Atoms/Button.stories.tsx"
    }
  }
}
```

### Individual Story
**URL:** `http://localhost:6006/iframe.html?id=<story-id>`

---

## CURSOR WORKFLOW

### Example Prompts

1. **List Stories:**
   ```
   Run: tsx scripts/storybook-api-helper.ts list-stories
   ```

2. **Get Story Details:**
   ```
   Run: tsx scripts/storybook-api-helper.ts get-story "Button"
   ```

3. **Create New Story:**
   ```
   Create a new story for MyComponent following the pattern in Button.stories.tsx
   ```

4. **Find Components:**
   ```
   List all components that have stories in Storybook
   ```

---

## FUTURE: FULL MCP SUPPORT

When you upgrade to Storybook 10.x:

1. Install MCP addon:
   ```bash
   npx storybook add @storybook/addon-mcp
   ```

2. Configure Cursor:
   - Settings > Tools & Integrations
   - Add MCP Server: `http://localhost:6006/mcp`

3. Enjoy full MCP tool integration!

---

**ALTERNATIVE SOLUTION — Working with Storybook 7.6**

