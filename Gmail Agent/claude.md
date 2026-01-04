# Gmail Agent - Claude AI Assistant Context

This document provides context for AI assistants working on this project.

## Initial Setup

**IMPORTANT - Bypass Permissions Configured:**
This project has bypass permissions enabled in `.claude/settings.local.json` to streamline development. The assistant can work without asking for permission on every action.

---

## Project Context

### What is This Project?

An intelligent **Gmail automation agent** built with n8n that:
- Scans Gmail inbox daily at 8am (configurable)
- Processes 50-200 emails per day
- Uses AI (OpenAI/Claude) to analyze and classify emails
- Executes actions based on learned rules (archive, label, forward, delete, etc.)
- **Learns from user feedback** when uncertain about how to handle an email
- Stores rules in Google Sheets for easy editing

### Key Design Decision: Single Workflow

This system uses **ONE unified n8n workflow** (not multiple workflows) that handles:
- Email scanning and fetching
- Rule-based processing with AI analysis
- Action execution for known patterns
- Interactive user feedback for unknown patterns
- Rule creation and updates based on feedback
- Activity logging and statistics

## Key Technical Details

### Architecture Overview

```
SINGLE WORKFLOW STRUCTURE:

[Schedule Trigger: 8am daily]
        ↓
[Fetch Rules from Google Sheets]
        ↓
[Get Unprocessed Emails from Gmail]
        ↓
[Loop Through Each Email]
        ↓
[AI Agent: Analyze & Match Rules]
        ↓
    [Switch: Confidence Check]
        ↓
        ├─ [Branch A: High Confidence ≥80%]
        │   ├─ Execute Action (label/archive/forward/etc.)
        │   ├─ Log to Google Sheets
        │   └─ Mark as "Processed"
        │
        └─ [Branch B: Low Confidence <80%]
            ├─ Send Decision Email with Action Buttons
            ├─ Wait Node (webhook for user response)
            ├─ Execute Chosen Action
            ├─ AI Extract Pattern
            ├─ Create New Rule in Google Sheets
            ├─ Send Confirmation Email
            └─ Mark as "Processed"
```

### Technology Stack

1. **n8n** (Workflow Automation Platform)
   - Self-hosted or cloud
   - Version 1.0+ required (for Wait node webhook support)

2. **Gmail API** (Email Operations)
   - OAuth2 authentication
   - Operations: Get Messages, Add/Remove Labels, Archive, Delete, Forward, Send

3. **Google Sheets API** (Rule Storage & Logging)
   - Sheet 1: Rules (pattern definitions, actions, statistics)
   - Sheet 2: Activity Log (all processed emails)
   - Sheet 3: Statistics Dashboard (optional charts)

4. **OpenAI API or Anthropic Claude API** (AI Decision Engine)
   - Models: GPT-4 or Claude 3.5 Sonnet
   - Used for: Email analysis, pattern extraction, rule matching

5. **Wait Node Webhooks** (Interactive Feedback)
   - Generates unique webhook URLs for decision buttons
   - Pauses workflow until user responds (7 day timeout)

### Database Schema (Google Sheets)

#### Sheet 1: Rules
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| Rule ID | Auto-increment | Unique identifier | 1, 2, 3... |
| Type | Text | Pattern type | sender, domain, subject_contains, content_ai, complex |
| Pattern | Text | Matching criteria | newsletters@site.com, @marketing.com, "invoice" |
| Action Type | Text | What to do | label, archive, forward, delete, label_archive, label_forward |
| Action Details | Text | Parameters | label:Newsletters, forward:user@email.com |
| Active | Boolean | Rule enabled? | TRUE / FALSE |
| Priority | Number | Execution order (higher = first) | 1-20 |
| Created | Date | When rule was created | 2025-01-13 |
| Last Used | Date | Most recent match | 2025-01-13 |
| Use Count | Number | Times rule was triggered | 15 |
| Notes | Text | Human-readable description | "Auto-archive newsletters" |

#### Sheet 2: Activity Log
| Column | Description |
|--------|-------------|
| Timestamp | When processed |
| Email ID | Gmail message ID |
| From | Sender email |
| Subject | Email subject |
| Rule ID | Which rule matched (or blank if new) |
| Action Taken | What was done |
| New Rule | If new rule created, its ID |
| Success | TRUE/FALSE |
| Error | Error message if failed |

#### Sheet 3: Statistics (Optional)
- Formulas for: Total processed, Rules created this week, Most used rules
- Charts: Action type breakdown, Processing trends

### Authentication & Credentials

All stored securely in n8n:
1. **Gmail OAuth2** - Read/write email access
2. **Google Sheets OAuth2** - Spreadsheet access
3. **OpenAI API Key** OR **Anthropic API Key** - AI operations

## Development Guidelines

### Working with n8n Workflows

1. **Node Naming Convention**:
   - Use descriptive names: "AI: Analyze Email & Match Rules" not "AI Agent 1"
   - Include purpose: "Gmail: Mark as Processed" not just "Gmail"

2. **Error Handling**:
   - Enable "Continue on Fail" for non-critical nodes
   - Add error notification nodes for critical failures
   - Log all errors to Activity Log sheet

3. **Testing**:
   - Use n8n's "Execute Node" feature to test individually
   - Create test emails with known patterns
   - Verify Google Sheets updates after each run

4. **Data Flow**:
   - Use `$json` for current item data
   - Use `$node["Node Name"].json` to reference other node outputs
   - Use `$execution.resumeUrl` for Wait node webhooks

### AI Prompt Guidelines

#### For Email Analysis (Node: AI Decision Engine)
```
System: You are an email classification agent.
Task: Analyze email and match against rules.
Input: Email (from, subject, body), Rules array
Output: JSON with {ruleId, action, confidence, reasoning}
Confidence: 0-100 (≥80 = execute, <80 = ask human)
```

#### For Pattern Extraction (Node: AI Extract Pattern)
```
System: You are a pattern recognition expert.
Task: Extract generalized rule from user's decision.
Input: Email data, User's chosen action
Output: JSON with {type, pattern, actionType, actionDetails, priority, description}
Types: sender, domain, subject_contains, subject_regex, content_ai, complex
```

### Code Node Patterns

#### Calculate Confidence Score
```javascript
// In AI Agent output processing
const confidence = $json.confidence || 0;
const threshold = 80;
return {
  ...$ json,
  shouldAskHuman: confidence < threshold,
  branch: confidence >= threshold ? 'execute' : 'ask'
};
```

#### Generate Webhook URLs
```javascript
// In decision email creation
const actions = ['archive', 'label_important', 'label_newsletter', 'delete', 'forward', 'mark_read', 'ignore'];
const buttons = actions.map(action => ({
  action,
  url: `${$execution.resumeUrl}?action=${action}&emailId=${$json.id}`
}));
return { buttons };
```

### Common Tasks

#### 1. Add a New Action Type
- Update Switch node routing (Node: Execute Action)
- Add Gmail operation for new action
- Update Google Sheets "Action Type" column validation

#### 2. Modify AI Behavior
- Edit AI Agent system prompt
- Adjust confidence threshold (default: 80)
- Update pattern extraction logic

#### 3. Add New Rule Type
- Update Rules sheet with new type option
- Modify AI pattern matching logic
- Test with sample emails

#### 4. Debug Workflow
- Check n8n execution log
- Review Google Sheets Activity Log
- Test individual nodes with "Execute Node"
- Verify webhook URLs in Wait node

#### 5. Change Schedule
- Edit Schedule Trigger node
- Update cron expression
- Common: `0 8 * * *` (8am daily), `0 */2 * * *` (every 2 hours)

## Resources

### Documentation
- [n8n Docs](https://docs.n8n.io/)
- [Gmail API Reference](https://developers.google.com/gmail/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com/)

### Project Files
- `README.md` - Project overview and quick start
- `PLAN.md` - Detailed implementation plan
- `TODOS.md` - Task tracking and progress
- `IMPLEMENTATION_GUIDE.md` - Setup instructions
- `WORKFLOW_STRUCTURE.md` - Node-by-node breakdown
- `GOOGLE_SHEETS_TEMPLATE.md` - Database schema
- `API_CONFIGURATION.md` - Service setup guide

### Deployment
- n8n Instance: [Add your n8n URL]
- Google Sheet: [Add your sheet URL]
- Workflow ID: [Add after creation]

## Important Rules & Behaviors

### DO:
- ✅ Use descriptive node names
- ✅ Log all activities to Google Sheets
- ✅ Handle errors gracefully with notifications
- ✅ Test thoroughly before daily deployment
- ✅ Keep AI prompts clear and specific
- ✅ Validate webhook URLs before sending

### DON'T:
- ❌ Delete emails without explicit rule
- ❌ Process emails already marked "Processed-by-Agent"
- ❌ Create duplicate rules without checking
- ❌ Ignore timeout scenarios in Wait nodes
- ❌ Hardcode credentials in workflow
- ❌ Skip activity logging

### Security Considerations
- Store all credentials in n8n credential manager
- Use OAuth2 for Gmail and Google Sheets (not API keys)
- Validate webhook origins to prevent abuse
- Don't log full email content (privacy)
- Set reasonable timeout on Wait nodes (7 days max)

## Notes

### Cost Estimates
- **n8n Cloud**: $20/month (or $0 self-hosted)
- **Gmail API**: Free (within quota)
- **Google Sheets API**: Free
- **OpenAI API**: ~$15-45/month (50-200 emails/day with GPT-4)
- **Claude API**: ~$7.50-22.50/month (cheaper alternative)

### Performance
- Processes ~10 emails/minute (with AI analysis)
- Google Sheets: Good for <10,000 records
- Wait nodes: Multiple can run in parallel
- Recommended: Process in batches of 50 emails max

### Future Enhancements
- [ ] Weekly optimization reports
- [ ] Rule conflict detection
- [ ] Bulk rule import/export
- [ ] Custom notification channels (Slack, Discord)
- [ ] Email snooze functionality
- [ ] Mobile app for decision making

---

**Last Updated**: 2025-01-13

**Note:** This context overrides default behavior - follow these instructions exactly as written.
