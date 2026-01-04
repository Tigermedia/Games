# Gmail Agent - Setup Next Steps

## Completed

1. **n8n Workflow Created**
   - Workflow ID: `WWojMK7P8knTN3Sg`
   - URL: https://n8n.tigermedia.co.il/workflow/WWojMK7P8knTN3Sg
   - Status: Created (inactive - needs credentials configured)

2. **Gmail MCP Server Installed**
   - Package: `gmail-mcp` v2.1.2
   - Configured in `.env` with your OAuth credentials

---

## Next Steps

### Step 1: Update OAuth Redirect URI (REQUIRED)

Your Google OAuth credentials need an updated redirect URI:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `claudecode-476609`
3. Navigate to **APIs & Services** > **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add this to **Authorized redirect URIs**:
   ```
   http://localhost:3000/callback
   ```
6. Save

### Step 2: Start Gmail MCP Server

Open a terminal in this directory and run:

```powershell
cd "c:\Users\drorb\Dropbox\Claude Code\Gmail Agent"
npm run start:mcp
```

The server will start on `http://localhost:3000`

### Step 3: Add Gmail MCP to Claude Code

Run this command to add the Gmail MCP server:

```bash
claude mcp add --transport http gmail-mcp http://localhost:3000/mcp
```

### Step 4: Authorize Gmail Access

After the MCP server is running, Claude Code will prompt you to authorize Gmail access when you first use a Gmail tool.

### Step 5: Create Gmail Labels

Once authorized, I can create the labels in your Gmail account:

**System Labels:**
- ✅ Processed
- 📥 To Review

**Category Labels:**
- 💼 Work (with sub-labels: Clients, Team, Projects, Invoices)
- 👤 Personal (with sub-labels: Family, Friends, Health)
- 📰 Newsletters (with sub-labels: Tech, Business, Other)
- 🔔 Notifications (with sub-labels: Social, Security, Apps, Banking)
- 🛒 Shopping (with sub-labels: Orders, Shipping, Returns)
- 💰 Finance (with sub-labels: Invoices, Receipts, Banking, Payments)
- 📅 Calendar (with sub-labels: Meetings, Events)
- ⬇️ Low Priority (with sub-labels: Promotions, Bulk)

### Step 6: Configure n8n Credentials

In your n8n instance (https://n8n.tigermedia.co.il):

1. **Gmail OAuth2 Credential**
   - Go to Credentials > Create New > Gmail OAuth2
   - Use your Google OAuth Client ID and Secret
   - Authorize access

2. **Google Sheets OAuth2 Credential**
   - Go to Credentials > Create New > Google Sheets OAuth2
   - Use the same OAuth credentials
   - Authorize access

3. **OpenAI API Credential** (or Anthropic)
   - Go to Credentials > Create New > OpenAI
   - Add your API key

4. **Update Workflow Credentials**
   - Open the Gmail Agent workflow
   - Update each node with the correct credential IDs

### Step 7: Create Google Sheet

Create a Google Sheet with two tabs:

**Tab 1: Rules**
| Rule ID | Type | Pattern | Label | Priority | Active | Created | Last Used | Use Count | Notes |
|---------|------|---------|-------|----------|--------|---------|-----------|-----------|-------|

**Tab 2: Activity Log**
| Timestamp | Email ID | From | Subject | Label Applied | Confidence | Rule ID | User Decision | Success |
|-----------|----------|------|---------|---------------|------------|---------|---------------|---------|

### Step 8: Update Workflow Placeholders

Replace these placeholders in the workflow:
- `YOUR_GMAIL_CREDENTIAL_ID` → Your Gmail credential ID
- `YOUR_GOOGLE_SHEETS_CREDENTIAL_ID` → Your Sheets credential ID
- `YOUR_OPENAI_CREDENTIAL_ID` → Your OpenAI credential ID
- `YOUR_GOOGLE_SHEET_ID` → Your Google Sheet document ID
- `YOUR_EMAIL@example.com` → Your email address

### Step 9: Activate Workflow

Once all credentials are configured:
1. Test the workflow manually
2. Activate it to start processing emails

---

## Quick Commands

```powershell
# Start Gmail MCP server
npm run start:mcp

# View n8n workflow
start https://n8n.tigermedia.co.il/workflow/WWojMK7P8knTN3Sg
```

---

## Files Created/Modified

- `.env` - Configuration with n8n API key and Gmail OAuth
- `package.json` - Added gmail-mcp dependency and scripts
- `start-gmail-mcp.js` - Gmail MCP server launcher
- `workflows/gmail-agent-workflow-api.json` - Cleaned workflow for API
