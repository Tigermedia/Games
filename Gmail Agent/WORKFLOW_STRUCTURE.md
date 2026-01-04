# Gmail Agent - Workflow Structure Reference

This document provides a quick reference to the workflow structure. For complete node-by-node specifications, see [PLAN.md](PLAN.md).

---

## Workflow Overview

**Single unified workflow** that triggers on new email arrival and automatically labels every email.

**Version**: 2.0 (Real-time processing)

---

## Visual Flow Diagram

```
START: Gmail Trigger (New Email Arrives)
  ↓
SETUP: Fetch Rules from Google Sheets
  ↓
PREPARE: Extract Email Data for AI
  ↓
AI ANALYSIS: Analyze & Assign Label + Confidence
  ↓
DECISION: Confidence >= 80%?
  ↓
  ├─ YES (High Confidence) ──────────────────────┐
  │   ↓                                           │
  │   Apply AI-Assigned Label                     │
  │   ↓                                           │
  │   Mark as "✅ Processed"                      │
  │   ↓                                           │
  │   Log to Activity Sheet                       │
  │   ↓                                           │
  │   END                                         │
  │                                               │
  └─ NO (Low Confidence) ────────────────────────┐
      ↓                                           │
      Apply "📥 To Review" Label                  │
      ↓                                           │
      Apply Best-Guess Label                      │
      ↓                                           │
      Send Decision Email with Buttons            │
      ↓                                           │
      Wait for User Response (7 days max)         │
      ↓                                           │
      Remove Best-Guess Label (if different)      │
      ↓                                           │
      Apply User's Chosen Label                   │
      ↓                                           │
      Remove "📥 To Review" Label                 │
      ↓                                           │
      Mark as "✅ Processed"                      │
      ↓                                           │
      AI Extract Pattern → Create New Rule        │
      ↓                                           │
      Log to Activity Sheet                       │
      ↓                                           │
      Send Confirmation Email                     │
      ↓                                           │
      END                                         │
```

---

## Node Count & Types

### Total Nodes: ~25-30

**By Type**:
- Schedule Trigger: 1
- Google Sheets: 4 (Read Rules, Log Activity, Update Stats, Create Rule)
- Gmail: 10+ (Get Messages, various actions, Send emails, Add labels)
- AI Agent: 2 (Analyze, Extract Pattern)
- Code: 4-5 (Calculations, HTML generation, parsing)
- Switch/If: 2-3 (Routing logic)
- Wait: 1 (Webhook for user feedback)
- Merge: 1
- Loop: 1 (Split In Batches)

---

## Critical Paths

### Path 1: Known Email (Fast)
**Time**: ~2-5 seconds per email
```
Gmail Get → AI Analysis → Execute Action → Log → Done
```

### Path 2: Unknown Email (Slow - Waits for Human)
**Time**: Minutes to days (user-dependent)
```
Gmail Get → AI Analysis → Send Email → Wait → Execute → Create Rule → Done
```

---

## Data Flow

### Input Data Sources
1. **Google Sheets (Rules tab)**: Active rules, priorities, patterns
2. **Gmail**: Unprocessed emails (no "Processed-by-Agent" label)
3. **AI Model**: Intelligence for analysis and pattern extraction
4. **User**: Decisions via webhook buttons

### Output Data Destinations
1. **Google Sheets (Activity Log)**: All processing events
2. **Google Sheets (Rules tab)**: New rules, updated statistics
3. **Gmail**: Labels, archives, forwards, etc.
4. **User Email**: Decision requests, confirmations, summaries

---

## Key Node Groups

### GROUP 1: Initialization (Nodes 1-3)
**Purpose**: Start workflow and load data
- Schedule Trigger
- Fetch Rules
- Get Emails

### GROUP 2: AI Decision Engine (Nodes 4-7)
**Purpose**: Analyze and route emails
- Loop Over Emails
- AI Agent (Analysis)
- Confidence Calculation
- Switch (Router)

### GROUP 3: Branch A - Known Patterns (Nodes 8a-13a)
**Purpose**: Execute known actions
- Parse Action
- Route by Action Type
- Execute Gmail Action
- Log Activity
- Update Rule Stats
- Mark Processed

### GROUP 4: Branch B - Learning System (Nodes 8b-18b)
**Purpose**: Handle unknowns and learn
- Generate Decision Email
- Send Email
- Wait for Response
- Parse Response
- Execute Action
- AI Extract Pattern
- Create Rule
- Send Confirmation
- Log Activity
- Mark Processed

### GROUP 5: Finalization (Nodes 19-21)
**Purpose**: Summarize and report
- Merge Branches
- Generate Summary
- Send Daily Report

---

## Node Execution Order

### Sequential Nodes (Must Run In Order)
1. Schedule Trigger
2. Fetch Rules
3. Get Emails
4. Loop Start
5. AI Analysis
6. (Branch execution)
7. Merge
8. Summary
9. Daily Report

### Parallel Nodes (Can Run Simultaneously)
- Multiple emails in Wait state (Branch B)
- Multiple Gmail action nodes (different emails)
- Logging operations (non-blocking)

---

## Branching Logic

### Decision Point: Confidence Threshold

**Branch A Criteria**:
- `confidence >= 80`
- Rule match found
- Action defined

**Branch B Criteria**:
- `confidence < 80`
- No clear rule match
- Requires human input

### Re-convergence Point
- Merge node after both branches complete
- All emails (known + unknown) flow to summary

---

## Error Handling Paths

### Node-Level Error Handling
**Critical Nodes** (must not fail):
- Schedule Trigger
- Fetch Rules
- Get Emails

**Recoverable Nodes** (can continue on fail):
- Individual Gmail actions
- Logging operations
- Email sending

### Error Flow
```
Node Error → "Continue on Fail" → Log Error → Continue
         OR
         → Error Trigger Workflow → Send Alert → Stop
```

---

## Webhook Integration

### Wait Node Configuration
- **Mode**: On Webhook Call
- **Timeout**: 7 days (604800000 ms)
- **Authentication**: None (uses unique URL)
- **URL Format**: `https://n8n-instance/webhook/[unique-id]`

### Button URL Structure
```
$execution.resumeUrl?action=archive&emailId=msg_123
                    ↑         ↑             ↑
                    |         |             |
                 base URL  parameter    value
```

---

## Performance Characteristics

### Execution Time
- **No emails**: ~5 seconds (quick check)
- **10 known emails**: ~30-60 seconds
- **10 unknown emails**: Variable (waiting for user)
- **100 known emails**: ~5-10 minutes

### Resource Usage
- **n8n executions**: 1 per day (scheduled)
- **Gmail API calls**: ~3-5 per email
- **Google Sheets API calls**: ~2-4 per email
- **AI API calls**: 1-2 per email

### Scalability Limits
- **Max emails per run**: 100 (Gmail API limit)
- **Max concurrent waits**: Unlimited (theoretically)
- **Google Sheets rows**: ~10,000 before slowdown
- **AI API rate limits**: Varies by provider/tier

---

## State Management

### Workflow State
- **Stateless between runs**: Each daily run is independent
- **State preserved in Wait nodes**: Resume data maintained
- **Persistent state**: Google Sheets (rules, logs)

### Data Persistence
- **Rules**: Google Sheets (permanent, manually editable)
- **Activity Log**: Google Sheets (permanent, archivable)
- **Execution data**: n8n database (temporary, ~7 days)
- **Gmail labels**: Gmail (permanent)

---

## Debugging Guide

### View Execution Data
1. Open workflow in n8n
2. Click "Executions" tab
3. Select execution to debug
4. View each node's input/output

### Common Debug Points
- **After AI Analysis**: Check confidence scores
- **Before Switch**: Verify routing logic
- **After Gmail Actions**: Confirm action executed
- **Before Wait Node**: Verify email sent
- **After Wait Node**: Check webhook data received

### Debug Mode
To test without processing real emails:
1. Replace "Gmail: Get Messages" with "Manual Input"
2. Add sample email JSON
3. Execute workflow manually
4. Verify each node

---

## Optimization Tips

### Speed Improvements
1. **Reduce AI prompt length**: Shorter = faster + cheaper
2. **Batch operations**: Process multiple emails at once
3. **Cache rules**: Load once, use many times
4. **Skip AI for exact matches**: Use Code node for simple patterns

### Cost Reductions
1. **Use Claude instead of GPT-4**: 50-70% cheaper
2. **Truncate email body**: Send snippet only
3. **Skip AI for known patterns**: Direct rule matching
4. **Batch API calls**: Reduce request count

### Reliability Improvements
1. **Add retry logic**: Gmail operations
2. **Enable "Continue on Fail"**: Non-critical nodes
3. **Add error notifications**: Alert on failures
4. **Implement fallbacks**: Default actions if AI fails

---

## Workflow Variables

### Available Throughout Workflow

**From Schedule Trigger**:
- `$now` - Current timestamp
- `$execution.id` - Unique execution ID

**From Fetch Rules**:
- `$node["Google Sheets: Read Rules"].json` - Array of rules

**From Get Emails**:
- `$json.id` - Email ID
- `$json.from` - Sender
- `$json.subject` - Subject line
- `$json.snippet` - Email preview
- `$json.body` - Full body (if available)

**From Wait Node**:
- `$execution.resumeUrl` - Webhook URL for buttons
- `$json.query` - Query parameters from webhook

---

## Integration Points

### External Service Touchpoints

**Gmail API**:
- Read messages
- Add/remove labels
- Archive/delete
- Forward
- Send (decision emails, confirmations, summaries)

**Google Sheets API**:
- Read rules (start of workflow)
- Write activity log (after each email)
- Update rule stats (after known email)
- Create new rules (after user decision)

**AI API (OpenAI/Anthropic)**:
- Email analysis (for each email)
- Pattern extraction (for new rules)

---

## Quick Reference

### Node Types Used
```
nodes-base.scheduleTrigger
nodes-base.googleSheets
nodes-base.gmail
nodes-langchain.agent
nodes-base.code
nodes-base.switch
nodes-base.if
nodes-base.wait
nodes-base.merge
nodes-base.splitInBatches
```

### Essential Expressions
```javascript
// Access rules
$node["Google Sheets: Read Rules"].json

// Current email in loop
$json

// Webhook resume URL
$execution.resumeUrl

// Current timestamp
$now.format('YYYY-MM-DD HH:mm:ss')
```

---

## Related Documentation

- **Complete Node Specifications**: See [PLAN.md](PLAN.md) section "Node-by-Node Specifications"
- **AI Prompts**: See [PLAN.md](PLAN.md) section "AI Prompts & Logic"
- **Email Templates**: See [PLAN.md](PLAN.md) section "Email Templates"
- **Error Handling**: See [PLAN.md](PLAN.md) section "Error Handling"
- **Testing**: See [PLAN.md](PLAN.md) section "Testing Procedures"

---

**Last Updated**: 2025-01-13
**For**: Gmail Agent v0.1.0
