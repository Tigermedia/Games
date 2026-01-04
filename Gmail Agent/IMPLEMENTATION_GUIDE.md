# Gmail Agent - Implementation Guide

Step-by-step instructions to build and deploy the Gmail Agent from scratch.

---

## Prerequisites

Before starting, ensure you have:
- [ ] Gmail account
- [ ] Google account (can be same as Gmail)
- [ ] n8n instance access (cloud or self-hosted)
- [ ] Credit card for AI API (OpenAI or Anthropic)
- [ ] ~2-3 hours for complete setup

---

## Phase 1: API Setup (30-45 minutes)

### Step 1: Google Cloud Console

**Time**: 15 minutes

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `Gmail Agent`
3. Enable APIs:
   - Gmail API
   - Google Sheets API
4. Create OAuth2 credentials:
   - Configure consent screen (External, Testing mode)
   - Add your email as test user
   - Create Web application OAuth client
   - Add n8n callback URL: `https://YOUR-N8N/rest/oauth2-credential/callback`
   - Download credentials JSON
   - Save Client ID and Client Secret

**Detailed Instructions**: See [API_CONFIGURATION.md](API_CONFIGURATION.md)

### Step 2: AI API Setup

**Time**: 10 minutes

Choose **ONE**:

**Option A: OpenAI ($15-45/month)**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account and add payment method
3. Generate API key: `sk-proj-...`
4. Set usage limit: $50/month

**Option B: Anthropic ($7.50-22.50/month) - Recommended**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create account and purchase credits ($50 min)
3. Generate API key: `sk-ant-api03-...`
4. Set usage alert: $25

**Detailed Instructions**: See [API_CONFIGURATION.md](API_CONFIGURATION.md)

### Step 3: n8n Credentials

**Time**: 10 minutes

1. In n8n, add credentials:
   - Gmail OAuth2 API (use Google Cloud credentials)
   - Google Sheets OAuth2 API (same credentials)
   - OpenAI API OR Anthropic API (use API key)
2. Test each credential:
   - Gmail: Try getting messages
   - Sheets: Try reading a test sheet
   - AI: Try simple chat prompt

---

## Phase 2: Google Sheets Setup (20-30 minutes)

### Step 1: Create Sheet

**Time**: 5 minutes

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create new sheet: `Gmail Agent Database`
3. Create 3 tabs: `Rules`, `Activity Log`, `Statistics`
4. Get Sheet ID from URL:
   - URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Copy the `{SHEET_ID}` part

### Step 2: Setup Rules Tab

**Time**: 10 minutes

1. Add column headers (Row 1):
   ```
   Rule ID | Type | Pattern | Action Type | Action Details | Active | Priority | Created | Last Used | Use Count | Notes
   ```

2. Add data validation:
   - Column B (Type): Dropdown with: sender, domain, subject_contains, content_ai, complex
   - Column D (Action Type): Dropdown with: label, archive, delete, forward, mark_read, star
   - Column F (Active): Checkbox
   - Column G (Priority): Number 1-20

3. Add formulas:
   - Column A (Rule ID): `=IF(ROW()=1,"Rule ID",ROW()-1)`
   - Column H (Created): Auto-date formula

4. Add 3-5 sample rules (see template below)

5. Format headers:
   - Background: Dark gray
   - Text: White, bold
   - Freeze row 1

**Sample Rules**:
```
1 | sender | newsletters@site.com | label_archive | label:Newsletters | TRUE | 5 | 2025-01-13 | | 0 | Auto-archive newsletters
2 | domain | @marketing.com | archive | - | TRUE | 3 | 2025-01-13 | | 0 | Marketing spam
3 | subject_contains | invoice | label | label:Invoices | TRUE | 10 | 2025-01-13 | | 0 | Invoice emails
```

### Step 3: Setup Activity Log Tab

**Time**: 5 minutes

1. Add column headers:
   ```
   Timestamp | Email ID | From | Subject | Rule ID | Action Taken | New Rule | Success | Error
   ```

2. Create filter views:
   - "Today": Filter where Timestamp >= TODAY()
   - "Errors": Filter where Success = FALSE
   - "New Rules": Filter where New Rule != blank

3. Format headers (same as Rules tab)

### Step 4: Setup Statistics Tab (Optional)

**Time**: 5 minutes

1. Add metrics:
   - Total Emails Processed: `=COUNTA('Activity Log'!A:A)-1`
   - Emails Today: `=COUNTIF('Activity Log'!A:A,">="&TODAY())`
   - Active Rules: `=COUNTIF(Rules!F:F,TRUE)`
   - Success Rate: `=COUNTIF('Activity Log'!H:H,TRUE)/(COUNTA('Activity Log'!H:H)-1)`

2. Optional: Add charts for visual dashboard

**Complete Schema**: See [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md)

### Step 5: Share Sheet

**Time**: 2 minutes

1. Click "Share" button
2. Add your Gmail account (Editor permission)
3. Copy Sheet URL for later use

---

## Phase 3: Gmail Setup (5 minutes)

### Step 1: Create Label

1. Open Gmail
2. Click Settings (gear) → "See all settings"
3. Go to "Labels" tab
4. Scroll to "Labels" section
5. Click "Create new label"
6. Name: `Processed-by-Agent`
7. Click "Create"

**Important**: This label marks emails as processed to avoid duplicates.

---

## Phase 4: Workflow Build (60-90 minutes)

This is the most complex phase. You have two options:

### Option A: Build From Scratch (90 min)

Follow the detailed node-by-node specifications in [PLAN.md](PLAN.md).

**Recommended Approach**:
1. Build in stages, test each stage
2. Start with Nodes 1-3 (basic structure)
3. Add Branch A first (simpler)
4. Add Branch B (with Wait node)
5. Add finalization nodes

### Option B: Import Workflow JSON (30 min)

1. Download workflow JSON from project repository
2. In n8n, click "Import from File"
3. Select downloaded JSON
4. Configure credentials in each node
5. Replace placeholders:
   - YOUR_SHEET_ID → Your Google Sheet ID
   - YOUR_EMAIL → Your email address
   - YOUR_SHEET_URL → Your Google Sheet URL
6. Test workflow

**Workflow JSON**: (To be created in future phase)

### Critical Nodes Checklist

Build these nodes in order:

- [ ] Schedule Trigger (cron: `0 8 * * *`)
- [ ] Google Sheets: Read Rules
- [ ] Gmail: Get Many Messages (no "Processed-by-Agent" label)
- [ ] Split In Batches (loop over emails)
- [ ] AI Agent: Analyze Email
- [ ] Code: Calculate confidence
- [ ] Switch: Route by confidence
- [ ] **Branch A**: Execute action nodes
- [ ] **Branch B**: Wait node with webhook
- [ ] Google Sheets: Log Activity
- [ ] Google Sheets: Create Rule (Branch B only)
- [ ] Gmail: Add "Processed" label
- [ ] Merge: Combine branches
- [ ] Code: Generate summary
- [ ] Gmail: Send daily summary

**Detailed Specs**: See [PLAN.md](PLAN.md) "Node-by-Node Specifications"

---

## Phase 5: Testing (30-45 minutes)

### Test 1: Basic Execution (5 min)

1. Manually trigger workflow
2. Verify it runs without errors
3. Check execution log for each node
4. Expected: Completes successfully

### Test 2: Known Pattern (10 min)

1. Send test email matching a rule (e.g., from newsletters@site.com)
2. Manually trigger workflow
3. Verify:
   - AI correctly matched rule
   - Action executed (email labeled/archived)
   - Activity Log updated
   - Email marked "Processed"

### Test 3: Unknown Pattern (15 min)

1. Send test email NOT matching any rule
2. Manually trigger workflow
3. Verify:
   - Decision email sent to you
   - Email contains action buttons
   - Click a button
   - Workflow resumes
   - Action executed
   - New rule created in Google Sheets
   - Confirmation email sent

### Test 4: Edge Cases (10 min)

Test these scenarios:
- [ ] No new emails (workflow completes gracefully)
- [ ] Email already processed (skipped)
- [ ] Multiple unknowns in same run
- [ ] Very long email body

**Detailed Test Cases**: See [PLAN.md](PLAN.md) "Testing Procedures"

---

## Phase 6: Deployment (15 minutes)

### Step 1: Final Configuration

1. Verify schedule is correct:
   - Default: `0 8 * * *` (8am daily)
   - Adjust for your timezone if needed
2. Double-check all credentials
3. Verify Google Sheet permissions
4. Test error handling:
   - Add "Continue on Fail" to non-critical nodes
   - Set up error notification workflow (optional)

### Step 2: Activate Workflow

1. In n8n, click "Active" toggle
2. Verify status shows "Active"
3. Note next scheduled execution time

### Step 3: Monitor First Run

1. Wait for first scheduled execution (or trigger manually)
2. Review execution log immediately after
3. Check Activity Log in Google Sheets
4. Verify daily summary email received
5. Look for any errors or warnings

### Step 4: First Week Monitoring

Daily checklist:
- [ ] Check daily summary email
- [ ] Review Activity Log for errors
- [ ] Respond to decision emails promptly
- [ ] Verify new rules are sensible
- [ ] Adjust confidence threshold if needed

---

## Troubleshooting Common Issues

### Issue 1: Workflow Not Running

**Symptoms**: No execution at scheduled time

**Solutions**:
1. Check workflow is "Active"
2. Verify schedule trigger cron expression
3. Check n8n server is running
4. Review n8n execution log for errors

### Issue 2: Gmail Authentication Failed

**Symptoms**: "insufficient_permissions" or "invalid_grant" errors

**Solutions**:
1. Re-authenticate Gmail credential in n8n
2. Check OAuth scopes include: gmail.modify, gmail.send, gmail.labels
3. Verify app is in "Testing" mode with you as test user
4. Try revoking and re-granting access

### Issue 3: AI Analysis Failing

**Symptoms**: "API key invalid" or "rate limit exceeded"

**Solutions**:
1. Verify API key in n8n credentials
2. Check billing/credits in AI provider dashboard
3. Reduce email processing volume temporarily
4. Switch to cheaper model (gpt-3.5-turbo or claude-3-haiku)

### Issue 4: Wait Node Not Resuming

**Symptoms**: Click button, nothing happens

**Solutions**:
1. Check webhook URL in email is correct
2. Verify Wait node timeout hasn't expired (7 days)
3. Check n8n execution log for webhook errors
4. Test webhook URL manually (paste in browser)

### Issue 5: Rules Not Applying

**Symptoms**: Emails not matching known rules

**Solutions**:
1. Verify rule is Active = TRUE
2. Check rule priority (higher priority first)
3. Verify pattern syntax is correct
4. Check AI confidence threshold (may be too high)
5. Review Activity Log for actual confidence scores

### Issue 6: Google Sheets Not Updating

**Symptoms**: Activity Log or Rules not updating

**Solutions**:
1. Verify sheet is shared with n8n account (Editor permission)
2. Check sheet names are exact: "Rules", "Activity Log"
3. Verify Google Sheets credential in n8n
4. Check for Google Sheets API quota exceeded

**More Troubleshooting**: See [PLAN.md](PLAN.md) "Troubleshooting" section

---

## Optimization After Setup

### Week 1: Fine-Tuning

1. **Adjust confidence threshold**:
   - Too many unknowns → Lower threshold (70-75)
   - Too many wrong matches → Raise threshold (85-90)

2. **Review rule accuracy**:
   - Check Use Count in Rules tab
   - Identify unused rules (delete or refine)
   - Look for patterns in unknowns (create rules)

3. **Optimize costs**:
   - Monitor AI API usage
   - If high, truncate email body length in prompt
   - Consider switching to cheaper AI model

### Week 2-4: Refinement

1. **Add more rules**:
   - Based on frequent unknowns
   - Manually add common patterns

2. **Create rule templates**:
   - Document common rule patterns
   - Speed up future rule creation

3. **Improve AI prompts**:
   - Refine system prompts for better accuracy
   - Add examples to prompts

---

## Maintenance Schedule

### Daily (First Week)
- Review daily summary email
- Check Activity Log for errors
- Respond to decision emails within 24h

### Weekly
- Review new rules created
- Delete or deactivate unused rules
- Check cost reports (Gmail free, AI usage)
- Verify success rate >95%

### Monthly
- Export Rules tab as backup
- Archive old Activity Log data (optional)
- Review statistics and trends
- Optimize slow or expensive operations

---

## Success Criteria

After 1 week, you should see:
- ✅ Workflow runs daily without errors
- ✅ >90% of emails processed automatically
- ✅ <10% require human decision
- ✅ <5% errors or failures
- ✅ New rules being created and applied
- ✅ AI costs within budget (<$50/month)

After 1 month:
- ✅ >95% of emails processed automatically
- ✅ <5% require human decision
- ✅ 20+ rules created
- ✅ System is self-sustaining

---

## Next Steps

After successful implementation:

1. **Explore advanced features**:
   - Weekly optimization reports
   - Rule conflict detection
   - Slack/Discord integration
   - Email snooze functionality

2. **Scale up**:
   - Increase email volume
   - Add more Gmail accounts
   - Migrate to PostgreSQL (if >10K records)

3. **Share your experience**:
   - Document lessons learned
   - Create custom templates
   - Contribute improvements

---

## Quick Reference

### Essential URLs
- **n8n Instance**: [Add your URL]
- **Google Sheet**: [Add your URL]
- **Google Cloud Console**: https://console.cloud.google.com/
- **OpenAI Dashboard**: https://platform.openai.com/
- **Anthropic Dashboard**: https://console.anthropic.com/

### Key Credentials
- Gmail OAuth2: [Stored in n8n]
- Google Sheets OAuth2: [Stored in n8n]
- AI API Key: [Stored in n8n]

### Important IDs
- Google Sheet ID: [From sheet URL]
- Gmail Label ID: `Processed-by-Agent`
- n8n Workflow ID: [After creation]

---

## Help & Support

### Documentation
- [README.md](README.md) - Project overview
- [PLAN.md](PLAN.md) - Complete specifications
- [TODOS.md](TODOS.md) - Implementation checklist
- [API_CONFIGURATION.md](API_CONFIGURATION.md) - API setup details
- [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md) - Database schema
- [WORKFLOW_STRUCTURE.md](WORKFLOW_STRUCTURE.md) - Workflow reference

### External Resources
- [n8n Documentation](https://docs.n8n.io/)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Anthropic Docs](https://docs.anthropic.com/)

---

**Implementation Status**: Not Started
**Estimated Total Time**: 2-3 hours
**Last Updated**: 2025-01-13

---

## Ready to Start?

1. ✅ Check prerequisites
2. 📋 Follow Phase 1-6 in order
3. ✔️ Use checklists to track progress
4. 🧪 Test thoroughly before going live
5. 📊 Monitor closely in first week

Good luck! You're building an intelligent email assistant that will save hours every week.
