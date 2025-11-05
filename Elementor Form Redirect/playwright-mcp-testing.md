# Playwright MCP Testing Guide

## Configuration Location
`C:\Users\drorb\AppData\Roaming\Claude\claude_desktop_config.json`

## Correct Playwright MCP Configuration

**RECOMMENDED (Official Microsoft Version):**
```json
"mcp-playwright": {
    "command": "npx",
    "args": [
        "-y",
        "@playwright/mcp"
    ]
}
```

**Alternative (ExecuteAutomation - may have version issues):**
```json
"mcp-playwright": {
    "command": "npx",
    "args": [
        "@executeautomation/playwright-mcp-server"
    ]
}
```

**Known Issue:** The ExecuteAutomation version may have Playwright browser version mismatches. The Microsoft version is more stable and recommended.

## Common Issues

### Issue 1: Wrong Package Name
- ❌ `@executeautomation/mcp-playwright` (doesn't exist)
- ✅ `@executeautomation/playwright-mcp-server` (correct)

### Issue 2: Wrong Command
- ❌ `uvx` (for Python packages)
- ✅ `npx` (for npm packages)

## Testing the MCP

### 1. Test if package exists and runs
```bash
npx @executeautomation/playwright-mcp-server --help
```

### 2. Verify configuration file
```bash
cat ~/AppData/Roaming/Claude/claude_desktop_config.json | grep -A 5 "mcp-playwright"
```

### 3. Check if MCP is loaded in Claude
After restarting Claude, check available tools - should see Playwright-related tools like:
- Browser automation tools
- Screenshot capabilities
- Page navigation tools
- Element interaction tools

## Available Playwright MCP Packages

1. **ExecuteAutomation** (Community)
   - Package: `@executeautomation/playwright-mcp-server`
   - Features: Browser automation, screenshots, test code generation, web scraping
   - GitHub: executeautomation/mcp-playwright

2. **Microsoft Official**
   - Package: `@playwright/mcp`
   - Features: Official support, accessibility snapshots, no screenshots needed
   - GitHub: microsoft/playwright-mcp

3. **AutomataLabs** (Community)
   - Package: `@automatalabs/mcp-server-playwright`
   - Features: Similar to ExecuteAutomation
   - GitHub: Automata-Labs-team/MCP-Server-Playwright

## Troubleshooting Steps

1. **MCP not showing after restart:**
   - Completely quit Claude (not just close window)
   - Restart Claude
   - Check for error logs in Claude settings

2. **Package not found:**
   - Test installation: `npx @executeautomation/playwright-mcp-server --help`
   - If fails, try alternative package: `@playwright/mcp`

3. **Configuration syntax error:**
   - Validate JSON: `python -m json.tool ~/AppData/Roaming/Claude/claude_desktop_config.json`
   - Check for missing commas, quotes, brackets

## After Configuration Changes

**Always:**
1. Save the config file
2. **Completely quit** Claude Code (Exit application)
3. Restart Claude Code
4. Verify tools are available

## Expected Tools After Setup

When Playwright MCP loads successfully, you should see tools for:
- `playwright_navigate` - Navigate to URLs
- `playwright_screenshot` - Take screenshots
- `playwright_click` - Click elements
- `playwright_fill` - Fill form fields
- `playwright_evaluate` - Execute JavaScript
- And more browser automation capabilities

## Notes

- Playwright MCP enables browser automation through Claude
- Useful for web scraping, testing, screenshots, and automation tasks
- Requires restart to load new MCP servers
- Each MCP server runs as a separate process
