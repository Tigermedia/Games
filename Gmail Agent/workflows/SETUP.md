# Gmail Agent Workflow - Setup Instructions

## Quick Start

1. **Import workflow** into n8n
2. **Replace placeholders** with your credentials
3. **Create Gmail label** "Processed-by-Agent"
4. **Test** with a sample email
5. **Activate** workflow

---

## Step 1: Import Workflow

### In n8n:
1. Go to Workflows
2. Click "+ Add workflow"
3. Click "⋮" menu → "Import from File"
4. Select `gmail-agent-workflow.json`
5. Workflow imports with 21 nodes

---

## Step 2: Replace Placeholders

You MUST replace these placeholders in the workflow:

### A. Google Sheet ID
Find and replace: `YOUR_GOOGLE_SHEET_ID`
- **Where**: "Fetch Rules from Google Sheets" node
- **Get it from**: Your Google Sheet URL
- **Format**: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### B. Email Address
Find and replace: `YOUR_EMAIL@example.com`
- **Where**:
  - "Branch B: Send Decision Email" node
  - "Send Daily Summary" node
- **Use**: Your actual email address

### C. Credentials
Assign credentials to these nodes:

1. **Gmail OAuth2** (needed in 6 nodes):
   - Get Unprocessed Emails
   - Gmail: Add Label
   - Gmail: Archive
   - Branch A: Mark Processed
   - Branch B: Send Decision Email
   - Branch B: Mark Processed
   - Send Daily Summary

2. **Google Sheets OAuth2** (needed in 1 node):
   - Fetch Rules from Google Sheets

3. **OpenAI API** or **Anthropic API** (needed in 1 node):
   - AI: Analyze Email & Match Rules

---

## Step 3: Configure AI Model

### If using OpenAI:
1. Open "AI: Analyze Email & Match Rules" node
2. Select credential: Your OpenAI API credential
3. Model: `gpt-4` or `gpt-4-turbo`
4. Save

### If using Anthropic (Claude):
1. Open "AI: Analyze Email & Match Rules" node
2. Change model type to Claude
3. Select credential: Your Anthropic API credential
4. Model: `claude-3-5-sonnet-20241022`
5. Save

---

## Step 4: Create Gmail Label

### In Gmail:
1. Go to Settings → Labels
2. Click "Create new label"
3. Name: `Processed-by-Agent`
4. Click "Create"

**Important**: This label prevents processing emails twice.

---

## Step 5: Test Workflow

### Manual Test:
1. In n8n, click "Test workflow"
2. Click "Execute Workflow"
3. Check execution log for errors
4. Verify:
   - Rules loaded from Google Sheets
   - Emails fetched from Gmail
   - No errors in AI analysis

### Test with Sample Email:
1. Send yourself a test email
2. Ensure it matches a rule in your Google Sheet
3. Run workflow manually
4. Check if:
   - Email was processed
   - Action was executed
   - Email got "Processed-by-Agent" label

---

## Step 6: Activate Workflow

1. Toggle "Active" switch in n8n
2. Verify schedule: Runs daily at 8am
3. Check timezone is correct
4. Wait for first scheduled run, or trigger manually

---

## Workflow Structure

```
21 Nodes Total:

1. Schedule Trigger (8am daily)
2. Fetch Rules from Google Sheets
3. Get Unprocessed Emails
4. Loop Over Emails
5. Prepare AI Input (Code node)
6. AI: Analyze Email & Match Rules
7. Calculate Confidence Branch (Code node)
8. Route by Confidence (Switch node)

Branch A (High Confidence):
9. Branch A: Parse Action (Code node)
10. Gmail: Add Label
11. Gmail: Archive
12. Branch A: Mark Processed

Branch B (Low Confidence):
13. Branch B: Generate Decision Email (Code node)
14. Branch B: Send Decision Email
15. Branch B: Wait for Response (Wait node)
16. Branch B: Parse Response (Code node)
17. Branch B: Mark Processed

Finalization:
18. Merge Branches
19. Generate Summary (Code node)
20. Send Daily Summary
```

---

## Current Limitations

This v1 workflow includes:
- ✅ Basic email processing
- ✅ AI-powered analysis
- ✅ Two action types (label, archive)
- ✅ Interactive feedback (Wait node)
- ✅ Daily summary email

**Not yet implemented** (coming in v2):
- ❌ AI pattern extraction (Branch B creates rules manually for now)
- ❌ Activity logging to Google Sheets
- ❌ Rule statistics updates
- ❌ Additional actions (delete, forward, mark read)
- ❌ Rule creation from user feedback

---

## Customization

### Change Schedule:
1. Open "Schedule Trigger" node
2. Edit cron expression:
   - `0 8 * * *` = 8am daily
   - `0 */2 * * *` = Every 2 hours
   - `0 9 * * 1-5` = 9am weekdays only
3. Save

### Change Confidence Threshold:
1. Open "Calculate Confidence Branch" node
2. Find line: `const threshold = 80;`
3. Change to desired value (70-90 recommended)
4. Save

### Add More Actions:
1. Duplicate "Gmail: Add Label" node
2. Change operation (e.g., delete, forward)
3. Connect to "Branch A: Parse Action" node
4. Update Switch node routing

---

## Troubleshooting

### Error: "insufficient_permissions"
**Solution**: Re-authenticate Gmail OAuth2 credential in n8n

### Error: "Sheet not found"
**Solution**: Verify Sheet ID and sheet name "Rules" exists

### Error: "AI model not found"
**Solution**: Check API credential and model name

### Workflow runs but no emails processed
**Solution**:
- Check if any emails exist without "Processed-by-Agent" label
- Verify Gmail filter in "Get Unprocessed Emails" node
- Check execution log for actual email count

### Wait node webhook not working
**Solution**:
- Verify n8n instance has public URL
- Check webhook URL in decision email
- Test webhook manually by pasting URL in browser

---

## Next Steps

After successful testing:

1. **Add sample rules** to Google Sheet:
   ```
   Rule ID | Type | Pattern | Action Type | Action Details | Active | Priority
   1 | sender | newsletters@site.com | label_archive | label:Newsletters | TRUE | 5
   2 | domain | @marketing.com | archive | - | TRUE | 3
   ```

2. **Send test emails** that match your rules

3. **Monitor first few runs** closely

4. **Implement v2 features** (see PLAN.md for specs)

---

## Cost Estimate

Per daily run (assuming 50 emails):
- **Gmail API**: Free (within quota)
- **Google Sheets API**: Free
- **OpenAI (GPT-4)**: ~$0.50-1.50
- **Anthropic (Claude)**: ~$0.25-0.75

Monthly total: **$7.50-45** depending on AI provider and volume

---

## Files in This Directory

- `gmail-agent-workflow.json` - Main workflow (import this)
- `SETUP.md` - This file (setup instructions)
- `README.md` - Workflow documentation (coming soon)

---

**Version**: 1.0 (Basic implementation)
**Last Updated**: 2025-01-13
**Status**: Ready for testing
