# Gmail Agent - Complete Implementation Plan

## Table of Contents
1. [System Overview](#system-overview)
2. [Workflow Architecture](#workflow-architecture)
3. [Node-by-Node Specifications](#node-by-node-specifications)
4. [Google Sheets Database Schema](#google-sheets-database-schema)
5. [AI Prompts & Logic](#ai-prompts--logic)
6. [Email Templates](#email-templates)
7. [Error Handling](#error-handling)
8. [Testing Procedures](#testing-procedures)
9. [Deployment Checklist](#deployment-checklist)

---

## System Overview

### Core Concept
A single n8n workflow that scans Gmail daily, processes emails using AI + rule-based logic, and learns from user feedback when uncertain.

### Key Design Decisions
1. **Single Workflow**: All logic in one workflow (not multiple workflows)
2. **Google Sheets**: Rule storage (easy to edit, no database setup)
3. **Wait Node**: Interactive feedback via webhook URLs
4. **AI-Powered**: GPT-4 or Claude for intelligent analysis
5. **Email Notifications**: User feedback via email (not Slack/Discord)

### Data Flow
```
Rules (Google Sheets) ──────┐
                             ↓
Gmail Inbox ──> AI Analysis ──> Match Found? ──> Execute Action ──> Log
                             ↓
                        No Match Found
                             ↓
                    Send Decision Email
                             ↓
                    Wait for Response
                             ↓
                    Execute + Create Rule ──> Log
```

---

## Workflow Architecture

### Single Workflow Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Gmail Agent - Main Workflow                                  │
└─────────────────────────────────────────────────────────────┘

[1] Schedule Trigger (Cron: 0 8 * * *)
      ↓
[2] Google Sheets: Read Rules (Sheet: "Rules", Active = TRUE)
      ↓
[3] Gmail: Get Many Messages
      - Filter: No label "Processed-by-Agent"
      - Max: 100 emails
      - Format: Full (need body for AI)
      ↓
[4] Loop Over Items
      ↓
[5] AI Agent: Email Analysis & Rule Matching
      - Input: Email data + Rules
      - Output: {ruleId, action, confidence, reasoning}
      ↓
[6] Code: Calculate Confidence Branch
      - If confidence >= 80: Branch A
      - If confidence < 80: Branch B
      ↓
[7] Switch Node: Route to Branch A or B

┌─────────────────────────────────────┐
│ BRANCH A: Known Pattern (Confidence ≥80%) │
└─────────────────────────────────────┘

[8a] Code: Parse Action Details
[9a] Switch: Route by Action Type
      ├─ Label
      ├─ Archive
      ├─ Delete
      ├─ Forward
      ├─ Mark Read/Unread
      ├─ Star
      └─ Combinations

[10a] Gmail: Execute Action(s)
[11a] Google Sheets: Log Activity (Sheet: "Activity Log")
[12a] Google Sheets: Update Rule Stats (Sheet: "Rules", increment Use Count)
[13a] Gmail: Add Label "Processed-by-Agent"

┌─────────────────────────────────────┐
│ BRANCH B: Unknown Pattern (Confidence <80%) │
└─────────────────────────────────────┘

[8b] Code: Generate Decision Email HTML
      - Create action button URLs with $execution.resumeUrl
      - Format: {emailId, buttons[], emailData}

[9b] Gmail: Send Decision Email
      - To: Your email
      - Subject: "🤖 Gmail Agent needs help: Email from {sender}"
      - Body: HTML with buttons

[10b] Wait Node: On Webhook Call
      - Timeout: 7 days
      - Resume URL embedded in buttons

[11b] Code: Parse Webhook Response
      - Extract: action, emailId, customAction (if any)

[12b] Switch: Route by Chosen Action
      (Same action routes as Branch A)

[13b] Gmail: Execute Chosen Action
[14b] AI Agent: Extract Pattern
      - Input: Email data + User's action choice
      - Output: {type, pattern, actionType, actionDetails, priority, description}

[15b] Google Sheets: Create New Rule (Sheet: "Rules")
      - Append row with extracted pattern

[16b] Gmail: Send Confirmation Email
      - To: Your email
      - Subject: "✅ New rule created"
      - Body: Rule details + Google Sheets link

[17b] Google Sheets: Log Activity (Sheet: "Activity Log")
      - Note: "New Rule Created - Rule ID: X"

[18b] Gmail: Add Label "Processed-by-Agent"

┌─────────────────────────────────────┐
│ FINAL STEPS (Both Branches Merge)   │
└─────────────────────────────────────┘

[19] Merge: Combine Branch A & B outputs
[20] Code: Generate Summary Statistics
      - Emails processed
      - New rules created
      - Action breakdown

[21] Gmail: Send Daily Summary Email
      - To: Your email
      - Subject: "📊 Gmail Agent Daily Report"
      - Body: Statistics + link to Activity Log
```

---

## Node-by-Node Specifications

### [1] Schedule Trigger
**Type**: `nodes-base.scheduleTrigger`
**Configuration**:
```json
{
  "rule": "cron",
  "cronExpression": "0 8 * * *",
  "timezone": "America/New_York"
}
```
**Notes**: Adjust timezone and cron expression as needed.

---

### [2] Google Sheets: Read Rules
**Type**: `nodes-base.googleSheets`
**Operation**: `Get Many`
**Configuration**:
```json
{
  "documentId": "{YOUR_SHEET_ID}",
  "sheetName": "Rules",
  "range": "A:K",
  "filter": {
    "property": "Active",
    "operator": "equals",
    "value": true
  },
  "sortProperty": "Priority",
  "sortDirection": "DESC"
}
```
**Output**: Array of rule objects

---

### [3] Gmail: Get Many Messages
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `getMany`
**Configuration**:
```json
{
  "labelIds": [],
  "negateLabels": ["Processed-by-Agent"],
  "includeSpamTrash": false,
  "format": "full",
  "maxResults": 100
}
```
**Output**: Array of email objects with full content

---

### [4] Loop Over Items
**Type**: `nodes-base.splitInBatches`
**Configuration**:
```json
{
  "batchSize": 1,
  "options": {
    "reset": false
  }
}
```
**Purpose**: Process one email at a time

---

### [5] AI Agent: Email Analysis & Rule Matching
**Type**: `nodes-langchain.agent`
**Model**: OpenAI Chat Model (GPT-4) OR Claude Chat Model (Claude 3.5 Sonnet)
**System Prompt**:
```
You are an email classification agent. Your task is to analyze an email and determine if it matches any of the provided rules.

INPUT:
- Email data: from, subject, body snippet
- Rules array: pattern types, patterns, actions

OUTPUT (JSON):
{
  "ruleId": number or null,
  "action": "label" | "archive" | "delete" | "forward" | "mark_read" | "star" | "combination",
  "actionDetails": string (e.g., "label:Newsletters" or "forward:user@email.com"),
  "confidence": number (0-100),
  "reasoning": string
}

CONFIDENCE SCORING:
- 95-100: Exact match (e.g., exact sender in rule)
- 80-94: Strong match (e.g., domain match, clear keyword match)
- 60-79: Moderate match (e.g., partial keyword, AI content interpretation)
- 0-59: Weak or no match

INSTRUCTIONS:
1. Check rules in priority order (highest first)
2. For "sender" type: Check if email from matches pattern
3. For "domain" type: Check if email domain matches
4. For "subject_contains" type: Check if subject contains keywords
5. For "content_ai" type: Use semantic understanding of email body
6. For "complex" type: Evaluate multiple conditions (AND/OR logic)
7. Return confidence based on match quality
8. If no rule matches well (confidence < 60), return null for ruleId

IMPORTANT:
- Be conservative with confidence scores
- If uncertain, return lower confidence to trigger human review
- Better to ask human than make wrong decision
```

**Input Variables**:
```json
{
  "emailFrom": "{{ $json.from }}",
  "emailSubject": "{{ $json.subject }}",
  "emailBody": "{{ $json.snippet }}",
  "rules": "{{ $node['Google Sheets: Read Rules'].json }}"
}
```

**Tools**: None (pure analysis)

**Output**: JSON object with decision

---

### [6] Code: Calculate Confidence Branch
**Type**: `nodes-base.code`
**Code**:
```javascript
// Parse AI Agent response
const aiResponse = $input.first().json;
const confidence = aiResponse.confidence || 0;
const threshold = 80;

// Add email data
const emailData = $node["Gmail: Get Many Messages"].json;

return {
  ...aiResponse,
  ...emailData,
  shouldExecute: confidence >= threshold,
  shouldAskHuman: confidence < threshold,
  branch: confidence >= threshold ? 'execute' : 'ask'
};
```

---

### [7] Switch Node: Route to Branch
**Type**: `nodes-base.switch`
**Mode**: Rules
**Rules**:
- **Output 0 (Branch A)**: `{{ $json.branch }}` equals `execute`
- **Output 1 (Branch B)**: `{{ $json.branch }}` equals `ask`

---

## BRANCH A Nodes

### [8a] Code: Parse Action Details
**Type**: `nodes-base.code`
**Code**:
```javascript
const action = $json.action;
const actionDetails = $json.actionDetails || '';

// Parse actionDetails string
// Format: "label:LabelName" or "forward:email@example.com" or "label:LabelA;forward:email@example.com"
const actions = actionDetails.split(';').map(detail => {
  const [type, value] = detail.split(':');
  return { type: type.trim(), value: value.trim() };
});

return {
  ...$json,
  parsedActions: actions,
  primaryAction: action
};
```

---

### [9a] Switch: Route by Action Type
**Type**: `nodes-base.switch`
**Mode**: Rules
**Routes** (based on `$json.primaryAction`):
- Output 0: `label`
- Output 1: `archive`
- Output 2: `delete`
- Output 3: `forward`
- Output 4: `mark_read`
- Output 5: `star`
- Output 6: `label_archive` (combination)
- Output 7: `label_forward` (combination)

---

### [10a] Gmail: Execute Action(s)
Multiple Gmail nodes, one per action type.

#### Example: Label Action
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `addLabel`
**Configuration**:
```json
{
  "messageId": "{{ $json.id }}",
  "labelIds": ["{{ $json.parsedActions[0].value }}"]
}
```

#### Example: Archive Action
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `addLabel`
**Configuration**:
```json
{
  "messageId": "{{ $json.id }}",
  "labelIds": ["ARCHIVED"]
}
```

#### Example: Delete Action
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `delete`
**Configuration**:
```json
{
  "messageId": "{{ $json.id }}"
}
```

---

### [11a] Google Sheets: Log Activity
**Type**: `nodes-base.googleSheets`
**Operation**: `append`
**Configuration**:
```json
{
  "documentId": "{YOUR_SHEET_ID}",
  "sheetName": "Activity Log",
  "values": [
    "{{ $now.format('YYYY-MM-DD HH:mm:ss') }}",
    "{{ $json.id }}",
    "{{ $json.from }}",
    "{{ $json.subject }}",
    "{{ $json.ruleId }}",
    "{{ $json.action }}",
    "",
    "TRUE",
    ""
  ]
}
```

---

### [12a] Google Sheets: Update Rule Stats
**Type**: `nodes-base.googleSheets`
**Operation**: `update`
**Configuration**:
```json
{
  "documentId": "{YOUR_SHEET_ID}",
  "sheetName": "Rules",
  "range": "Rule ID={{ $json.ruleId }}",
  "updates": {
    "Last Used": "{{ $now.format('YYYY-MM-DD') }}",
    "Use Count": "={{ $json.useCount + 1 }}"
  }
}
```
**Note**: Requires reading current Use Count first or using formula in sheet.

---

### [13a] Gmail: Add Label "Processed"
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `addLabel`
**Configuration**:
```json
{
  "messageId": "{{ $json.id }}",
  "labelIds": ["Processed-by-Agent"]
}
```
**Note**: Create this label in Gmail first.

---

## BRANCH B Nodes

### [8b] Code: Generate Decision Email HTML
**Type**: `nodes-base.code`
**Code**:
```javascript
const email = $json;
const resumeUrl = $execution.resumeUrl;

// Define available actions
const actions = [
  { label: 'Archive it', action: 'archive', emoji: '📦' },
  { label: 'Label: Important', action: 'label_important', emoji: '⭐' },
  { label: 'Label: Newsletter', action: 'label_newsletter', emoji: '📰' },
  { label: 'Label: Spam & Delete', action: 'label_spam_delete', emoji: '🗑️' },
  { label: 'Forward to...', action: 'forward', emoji: '➡️', requiresInput: true },
  { label: 'Mark as Read', action: 'mark_read', emoji: '✅' },
  { label: 'Ignore (no action)', action: 'ignore', emoji: '⏭️' }
];

// Generate button HTML
const buttonHtml = actions.map(a => {
  const url = `${resumeUrl}?action=${a.action}&emailId=${email.id}`;
  return `<a href="${url}" style="display:inline-block;padding:10px 20px;margin:5px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">${a.emoji} ${a.label}</a>`;
}).join('\n');

const html = `
<html>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2>🤖 Gmail Agent Needs Your Help</h2>
  <p>I'm not sure how to handle this email:</p>

  <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
    <strong>From:</strong> ${email.from}<br>
    <strong>Subject:</strong> ${email.subject}<br>
    <strong>Preview:</strong> ${email.snippet}
  </div>

  <p><strong>What should I do with emails like this?</strong></p>

  <div style="margin:20px 0;">
    ${buttonHtml}
  </div>

  <p style="color:#666;font-size:12px;margin-top:30px;">
    Your choice will create a rule for similar emails in the future.<br>
    You can always edit rules in your <a href="YOUR_GOOGLE_SHEET_URL">Google Sheet</a>.
  </p>
</body>
</html>
`;

return {
  emailId: email.id,
  emailData: email,
  html: html,
  subject: `🤖 Gmail Agent needs help: Email from ${email.from}`
};
```

---

### [9b] Gmail: Send Decision Email
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `send`
**Configuration**:
```json
{
  "to": "YOUR_EMAIL@example.com",
  "subject": "{{ $json.subject }}",
  "message": "{{ $json.html }}",
  "messageType": "html"
}
```

---

### [10b] Wait Node: On Webhook Call
**Type**: `nodes-base.wait`
**Mode**: `webhook`
**Configuration**:
```json
{
  "resume": "webhook",
  "limit": 604800000,
  "limitUnit": "ms",
  "options": {
    "authentication": "none"
  }
}
```
**Timeout**: 7 days (604800000 ms)
**Output**: Webhook data (query parameters)

---

### [11b] Code: Parse Webhook Response
**Type**: `nodes-base.code`
**Code**:
```javascript
const query = $input.first().json.query || {};
const action = query.action;
const emailId = query.emailId;
const customInput = query.customInput || '';

// Get original email data from earlier node
const emailData = $node["Gmail: Get Many Messages"].json.find(e => e.id === emailId);

return {
  action: action,
  emailId: emailId,
  emailData: emailData,
  customInput: customInput,
  userDecision: true
};
```

---

### [12b-13b] Switch & Execute (Same as Branch A)
Reuse the same Switch and Gmail action nodes from Branch A.

---

### [14b] AI Agent: Extract Pattern
**Type**: `nodes-langchain.agent`
**System Prompt**:
```
You are a pattern recognition expert. Your task is to analyze an email and extract a generalized rule based on the user's decision.

INPUT:
- Email data: from, subject, body
- User's chosen action: the action they selected

OUTPUT (JSON):
{
  "type": "sender" | "domain" | "subject_contains" | "content_ai" | "complex",
  "pattern": string (the matching pattern),
  "actionType": string (the action to perform),
  "actionDetails": string (parameters for the action),
  "priority": number (1-20, higher = more important),
  "description": string (human-readable rule description)
}

PATTERN EXTRACTION RULES:

1. **Sender Type**:
   - Use when user wants to handle ALL emails from this specific sender
   - Pattern: exact email address (e.g., "newsletters@site.com")
   - Priority: 10

2. **Domain Type**:
   - Use when user wants to handle ALL emails from this domain
   - Pattern: domain only (e.g., "@marketing.com")
   - Priority: 8

3. **Subject Contains Type**:
   - Use when subject line has clear keywords
   - Pattern: keyword(s) (e.g., "invoice", "newsletter")
   - Priority: 7

4. **Content AI Type**:
   - Use when decision is based on email content/context
   - Pattern: semantic description (e.g., "meeting invitations", "receipts")
   - Priority: 6

5. **Complex Type**:
   - Use when multiple conditions needed
   - Pattern: compound rule (e.g., "sender:X AND subject:Y")
   - Priority: based on specificity

PRIORITY SCORING:
- 15-20: Critical (boss, important clients)
- 10-14: High priority (invoices, specific senders)
- 5-9: Medium priority (newsletters, domain-based)
- 1-4: Low priority (general filters)

DESCRIPTION FORMAT:
- Clear, concise, human-readable
- Examples:
  - "Archive all newsletters from site.com"
  - "Label invoices from accounting department"
  - "Forward urgent emails from boss to phone"

IMPORTANT:
- Extract the MOST SPECIFIC pattern that would apply to similar emails
- Ask yourself: "What makes this email unique?"
- Prefer specific patterns (sender) over broad ones (content_ai)
- If ambiguous, default to sender-based rules
```

**Input Variables**:
```json
{
  "emailFrom": "{{ $json.emailData.from }}",
  "emailSubject": "{{ $json.emailData.subject }}",
  "emailBody": "{{ $json.emailData.snippet }}",
  "userAction": "{{ $json.action }}"
}
```

**Output**: JSON object with rule definition

---

### [15b] Google Sheets: Create New Rule
**Type**: `nodes-base.googleSheets`
**Operation**: `append`
**Configuration**:
```json
{
  "documentId": "{YOUR_SHEET_ID}",
  "sheetName": "Rules",
  "values": [
    "=ROW()-1",
    "{{ $json.type }}",
    "{{ $json.pattern }}",
    "{{ $json.actionType }}",
    "{{ $json.actionDetails }}",
    "TRUE",
    "{{ $json.priority }}",
    "{{ $now.format('YYYY-MM-DD') }}",
    "",
    "0",
    "{{ $json.description }}"
  ]
}
```
**Note**: Rule ID uses formula `=ROW()-1` for auto-increment.

---

### [16b] Gmail: Send Confirmation Email
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `send`
**Code Node** to generate HTML:
```javascript
const rule = $json;
const sheetUrl = "YOUR_GOOGLE_SHEET_URL";

const html = `
<html>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2>✅ New Rule Created</h2>
  <p>I've learned how to handle similar emails:</p>

  <div style="background-color:#e8f5e9;padding:15px;border-radius:5px;margin:20px 0;">
    <strong>Rule:</strong> ${rule.description}<br>
    <strong>Pattern Type:</strong> ${rule.type}<br>
    <strong>Pattern:</strong> ${rule.pattern}<br>
    <strong>Action:</strong> ${rule.actionType}
  </div>

  <p>This rule will be applied to similar emails going forward.</p>
  <p>You can edit or delete this rule anytime in your <a href="${sheetUrl}">Google Sheet</a>.</p>
</body>
</html>
`;

return {
  html: html,
  subject: "✅ Gmail Agent: New rule created"
};
```

---

### [17b-18b] Log Activity & Mark Processed
Same as Branch A nodes [11a] and [13a].

---

## FINAL STEPS

### [19] Merge
**Type**: `nodes-base.merge`
**Mode**: `append`
**Purpose**: Combine outputs from Branch A and Branch B

---

### [20] Code: Generate Summary Statistics
**Type**: `nodes-base.code`
**Code**:
```javascript
const allItems = $input.all();

const stats = {
  totalProcessed: allItems.length,
  newRulesCreated: allItems.filter(i => i.json.userDecision).length,
  actions: {}
};

allItems.forEach(item => {
  const action = item.json.action || 'unknown';
  stats.actions[action] = (stats.actions[action] || 0) + 1;
});

return {
  stats: stats,
  timestamp: new Date().toISOString()
};
```

---

### [21] Gmail: Send Daily Summary
**Type**: `nodes-base.gmail`
**Resource**: `message`
**Operation**: `send`
**Code Node** to generate HTML:
```javascript
const stats = $json.stats;
const sheetUrl = "YOUR_GOOGLE_SHEET_URL";
const date = new Date().toLocaleDateString();

const actionsList = Object.entries(stats.actions)
  .map(([action, count]) => `<li>${action}: ${count}</li>`)
  .join('');

const html = `
<html>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2>📊 Gmail Agent Daily Report</h2>
  <p><strong>Date:</strong> ${date}</p>

  <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
    <h3>Summary</h3>
    <ul>
      <li><strong>Emails Processed:</strong> ${stats.totalProcessed}</li>
      <li><strong>New Rules Created:</strong> ${stats.newRulesCreated}</li>
    </ul>

    <h3>Actions Breakdown</h3>
    <ul>
      ${actionsList}
    </ul>
  </div>

  <p>View full activity log in your <a href="${sheetUrl}">Google Sheet</a>.</p>
</body>
</html>
`;

return {
  html: html,
  subject: `📊 Gmail Agent Daily Report - ${date}`
};
```

---

## Google Sheets Database Schema

### Sheet 1: Rules

| Column | Type | Formula/Default | Description |
|--------|------|-----------------|-------------|
| **Rule ID** | Number | `=ROW()-1` | Auto-increment unique ID |
| **Type** | Dropdown | Manual | Pattern type: sender, domain, subject_contains, content_ai, complex |
| **Pattern** | Text | Manual | Matching criteria (email, domain, keywords, etc.) |
| **Action Type** | Dropdown | Manual | What to do: label, archive, delete, forward, mark_read, star, combinations |
| **Action Details** | Text | Manual | Parameters (e.g., "label:Newsletters" or "forward:user@email.com") |
| **Active** | Checkbox | TRUE | Whether rule is enabled |
| **Priority** | Number | Manual | 1-20 (higher = execute first) |
| **Created** | Date | `=TODAY()` | When rule was created |
| **Last Used** | Date | Manual/Auto | Most recent match |
| **Use Count** | Number | 0 | Times rule was triggered |
| **Notes** | Text | Manual | Human-readable description |

**Data Validation**:
- Type: sender, domain, subject_contains, subject_regex, content_ai, complex
- Action Type: label, archive, delete, forward, mark_read, mark_unread, star, label_archive, label_forward
- Priority: 1-20
- Active: TRUE/FALSE

**Sample Data**:
```
| Rule ID | Type              | Pattern                  | Action Type    | Action Details              | Active | Priority | Created    | Last Used  | Use Count | Notes                        |
|---------|-------------------|--------------------------|----------------|----------------------------|--------|----------|------------|------------|-----------|------------------------------|
| 1       | sender            | newsletters@site.com     | label_archive  | label:Newsletters          | TRUE   | 5        | 2025-01-13 | 2025-01-13 | 15        | Auto-archive newsletters     |
| 2       | subject_contains  | invoice                  | label_forward  | label:Invoices;forward:acc@me.com | TRUE | 10 | 2025-01-10 | 2025-01-13 | 8 | Forward invoices to accounting |
| 3       | domain            | @marketing.com           | archive        | -                          | TRUE   | 3        | 2025-01-11 | 2025-01-13 | 22        | Marketing spam               |
| 4       | content_ai        | meeting invitation       | label          | label:Meetings             | TRUE   | 7        | 2025-01-12 | 2025-01-13 | 3         | Calendar-related emails      |
| 5       | complex           | boss@work.com AND urgent | label_mark_unread | label:Priority          | TRUE   | 15       | 2025-01-09 | 2025-01-13 | 5         | Urgent from boss             |
```

---

### Sheet 2: Activity Log

| Column | Type | Description |
|--------|------|-------------|
| **Timestamp** | DateTime | When email was processed |
| **Email ID** | Text | Gmail message ID |
| **From** | Text | Sender email address |
| **Subject** | Text | Email subject line |
| **Rule ID** | Number | Which rule matched (blank if new) |
| **Action Taken** | Text | What action was performed |
| **New Rule** | Number | If new rule created, its ID |
| **Success** | Boolean | TRUE/FALSE |
| **Error** | Text | Error message if failed |

**Sample Data**:
```
| Timestamp           | Email ID  | From                  | Subject        | Rule ID | Action Taken    | New Rule | Success | Error |
|---------------------|-----------|----------------------|----------------|---------|-----------------|----------|---------|-------|
| 2025-01-13 08:05:23 | msg_123   | news@site.com        | Daily News     | 1       | Labeled+Archived| -        | TRUE    | -     |
| 2025-01-13 08:06:45 | msg_124   | unknown@new.com      | Hey there      | -       | Asked Human     | 6        | TRUE    | -     |
| 2025-01-13 08:10:12 | msg_124   | unknown@new.com      | Hey there      | 6       | Archived        | -        | TRUE    | -     |
```

**Filter Views**:
- Today: `Timestamp >= TODAY()`
- This Week: `Timestamp >= TODAY()-7`
- Errors Only: `Success = FALSE`
- New Rules: `New Rule != blank`

---

### Sheet 3: Statistics (Optional Dashboard)

**Metrics** (using formulas):
- Total Emails Processed: `=COUNTA('Activity Log'!A:A)-1`
- Rules Created This Week: `=COUNTIFS('Activity Log'!G:G,"<>",'Activity Log'!A:A,">="&TODAY()-7)`
- Most Used Rule: `=INDEX('Rules'!K:K,MATCH(MAX('Rules'!J:J),'Rules'!J:J,0))`
- Success Rate: `=COUNTIF('Activity Log'!H:H,"TRUE")/COUNTA('Activity Log'!H:H)`

**Charts**:
1. Pie Chart: Action Type Breakdown (from Activity Log)
2. Line Chart: Emails Processed Over Time
3. Bar Chart: Top 10 Most Used Rules

---

## AI Prompts & Logic

### AI Decision Engine (Node 5)
See "Node-by-Node Specifications" section above for full prompt.

**Key Logic**:
1. Load all active rules sorted by priority (highest first)
2. For each rule, evaluate if email matches pattern
3. Calculate confidence score (0-100)
4. Return first rule that matches with confidence ≥60
5. If no rule matches, return confidence 0

**Confidence Calculation**:
- **Exact match** (sender email = pattern): 95-100
- **Domain match** (sender domain = pattern): 85-95
- **Strong keyword match** (subject contains ALL keywords): 80-90
- **Partial keyword match** (subject contains SOME keywords): 60-79
- **Semantic match** (AI understands content meaning): 60-80
- **Weak/no match**: 0-59

---

### AI Pattern Extraction (Node 14b)
See "Node-by-Node Specifications" section above for full prompt.

**Key Logic**:
1. Analyze email (from, subject, body)
2. Analyze user's chosen action
3. Determine pattern type (most specific first):
   - If action is sender-specific → "sender" type
   - If action is domain-wide → "domain" type
   - If subject has clear keywords → "subject_contains" type
   - If based on content meaning → "content_ai" type
   - If multiple conditions → "complex" type
4. Extract pattern value
5. Calculate priority (based on specificity and urgency)
6. Generate human-readable description

**Priority Guidelines**:
- Critical (15-20): Boss, VIPs, urgent matters
- High (10-14): Invoices, specific important senders
- Medium (5-9): Newsletters, general categories
- Low (1-4): Broad filters, content-based

---

## Email Templates

### Decision Request Email (Node 8b)
See "Node-by-Node Specifications" section for HTML template.

**Button Actions**:
1. **Archive** → `action=archive`
2. **Label: Important** → `action=label_important`
3. **Label: Newsletter** → `action=label_newsletter`
4. **Label: Spam & Delete** → `action=label_spam_delete`
5. **Forward to...** → `action=forward` (requires input field)
6. **Mark as Read** → `action=mark_read`
7. **Ignore** → `action=ignore`

**Webhook URL Format**:
```
{$execution.resumeUrl}?action={action}&emailId={emailId}
```

**Optional**: Add custom action text field for advanced users.

---

### Rule Confirmation Email (Node 16b)
See "Node-by-Node Specifications" section for HTML template.

**Contents**:
- Rule description (human-readable)
- Pattern type and value
- Action type
- Link to Google Sheet for editing

---

### Daily Summary Email (Node 21)
See "Node-by-Node Specifications" section for HTML template.

**Contents**:
- Date
- Total emails processed
- New rules created
- Action breakdown (with counts)
- Link to Activity Log

---

## Error Handling

### Node-Level Error Handling

**Critical Nodes** (must not fail):
- Schedule Trigger
- Gmail: Get Many Messages
- Google Sheets: Read Rules

**Error Handling Strategy**:
1. Enable "Continue on Fail" for non-critical nodes
2. Add Error Trigger workflow (separate workflow that catches errors)
3. Log errors to Activity Log
4. Send notification email on critical failures

### Error Trigger Workflow (Separate)

```
[Error Trigger]
      ↓
[Gmail: Send Error Notification]
      - To: Your email
      - Subject: "🚨 Gmail Agent Error"
      - Body: Error details, execution ID, node name
```

### Retry Logic

**For Gmail Operations**:
- Retry count: 3
- Backoff: Exponential (1s, 2s, 4s)
- Configuration in node settings

**For Google Sheets**:
- Retry count: 2
- Backoff: Linear (2s, 4s)

### Timeout Handling

**Wait Node Timeout** (7 days):
- If user doesn't respond, workflow completes without action
- Email remains in inbox (not marked "Processed")
- Can be picked up in next daily run

---

## Testing Procedures

### Phase 1: Unit Testing (Individual Nodes)

1. **Test Schedule Trigger**:
   - Manually execute workflow
   - Verify it runs at scheduled time

2. **Test Google Sheets: Read Rules**:
   - Execute node in isolation
   - Verify rules are loaded correctly
   - Check sorting by priority

3. **Test Gmail: Get Messages**:
   - Execute node
   - Verify emails are fetched
   - Check filter (no "Processed" label)

4. **Test AI Agent**:
   - Create test emails with known patterns
   - Execute AI node
   - Verify confidence scores and rule matching

### Phase 2: Integration Testing (Branches)

1. **Test Branch A (Known Pattern)**:
   - Create test email matching existing rule
   - Run workflow
   - Verify:
     - Action executed correctly
     - Activity logged
     - Rule stats updated
     - Email marked "Processed"

2. **Test Branch B (Unknown Pattern)**:
   - Create test email NOT matching any rule
   - Run workflow
   - Verify:
     - Decision email sent
     - Wait node activated
     - Click action button
     - Action executed
     - New rule created
     - Confirmation email sent

### Phase 3: End-to-End Testing

1. **Test Full Daily Run**:
   - Prepare inbox with mix of emails (known + unknown)
   - Run workflow
   - Verify all emails processed correctly
   - Check daily summary email

2. **Test Multiple Unknowns**:
   - Send 3-5 unknown emails
   - Verify all generate decision emails
   - Respond to each
   - Verify all rules created

### Phase 4: Edge Cases

1. **No new emails**: Workflow completes gracefully
2. **All emails already processed**: No actions taken
3. **Gmail API rate limit**: Retry logic works
4. **Malformed email**: Doesn't crash workflow
5. **Very long email body**: AI handles truncation
6. **Multiple rules match**: Highest priority wins
7. **Rule pattern error**: Logs error, continues

### Testing Checklist

- [ ] Schedule trigger fires at 8am
- [ ] Rules load from Google Sheets
- [ ] Emails fetch from Gmail (max 100)
- [ ] AI analysis returns valid JSON
- [ ] Confidence threshold (80) routes correctly
- [ ] Branch A: Known pattern actions execute
- [ ] Branch A: Activity logged to sheet
- [ ] Branch A: Rule stats updated
- [ ] Branch A: Email marked "Processed"
- [ ] Branch B: Decision email sent
- [ ] Branch B: Wait node generates webhook URL
- [ ] Branch B: Button click resumes workflow
- [ ] Branch B: Action executed correctly
- [ ] Branch B: AI extracts pattern
- [ ] Branch B: New rule created in sheet
- [ ] Branch B: Confirmation email sent
- [ ] Daily summary email sent
- [ ] Error handling works (simulate failures)
- [ ] No emails processed twice
- [ ] Google Sheets formulas work correctly

---

## Deployment Checklist

### Prerequisites

- [ ] n8n instance (cloud or self-hosted) running
- [ ] Gmail account with API access
- [ ] Google account with Sheets API access
- [ ] OpenAI API key OR Anthropic API key
- [ ] Google Sheet created with 3 tabs: Rules, Activity Log, Statistics

### Configuration Steps

1. **Google Sheet Setup**:
   - [ ] Create sheet with 3 tabs
   - [ ] Add column headers
   - [ ] Set up data validation for dropdowns
   - [ ] Add formulas (Rule ID auto-increment, etc.)
   - [ ] Create sample rules (3-5 for testing)
   - [ ] Get Sheet ID from URL

2. **Gmail Setup**:
   - [ ] Enable Gmail API in Google Cloud Console
   - [ ] Create OAuth2 credentials
   - [ ] Add credentials to n8n
   - [ ] Test connection
   - [ ] Create "Processed-by-Agent" label in Gmail

3. **Google Sheets API Setup**:
   - [ ] Enable Google Sheets API
   - [ ] Use same OAuth2 credentials
   - [ ] Add to n8n
   - [ ] Test read/write access

4. **AI API Setup**:
   - [ ] Get OpenAI OR Anthropic API key
   - [ ] Add to n8n credentials
   - [ ] Test with simple prompt

5. **n8n Workflow**:
   - [ ] Import workflow JSON (or build from spec)
   - [ ] Configure all nodes with credentials
   - [ ] Replace placeholders:
     - Google Sheet ID
     - Your email address
     - Google Sheet URL (for links in emails)
   - [ ] Test each node individually
   - [ ] Test full workflow with test email

6. **Schedule Configuration**:
   - [ ] Set schedule trigger to 8am (or preferred time)
   - [ ] Configure timezone
   - [ ] Activate workflow

7. **Testing**:
   - [ ] Send test emails (known patterns)
   - [ ] Send test emails (unknown patterns)
   - [ ] Verify decision emails arrive
   - [ ] Click action buttons
   - [ ] Verify rules created
   - [ ] Check Google Sheets logging
   - [ ] Verify daily summary email

8. **Go Live**:
   - [ ] Activate workflow
   - [ ] Monitor first few runs
   - [ ] Adjust confidence threshold if needed
   - [ ] Add more rules as patterns emerge
   - [ ] Set up error notifications

### Post-Deployment

- [ ] Monitor daily for first week
- [ ] Review Activity Log daily
- [ ] Adjust rules based on patterns
- [ ] Fine-tune confidence threshold
- [ ] Optimize AI prompts if needed
- [ ] Add additional actions if desired

### Maintenance

- **Daily**: Check Activity Log for errors
- **Weekly**: Review new rules created
- **Monthly**: Analyze statistics, optimize rules
- **Quarterly**: Review and archive old logs

---

## Cost & Performance Optimization

### Reduce AI Costs

1. **Use Claude instead of GPT-4** (50-70% cheaper)
2. **Reduce email body length** in AI prompts (send only snippet, not full body)
3. **Cache rules** in workflow variables (don't pass full array every time)
4. **Skip AI for very simple rules** (exact sender match can be done with Code node)

### Improve Performance

1. **Batch processing**: Process emails in groups of 10-20
2. **Limit email fetch**: Start with max 50 emails/day, increase gradually
3. **Parallel processing**: Use n8n's split batches for concurrent email processing
4. **Index Google Sheets**: Add filter views for faster lookups
5. **Migrate to PostgreSQL** if rules exceed 100 (better performance than Sheets)

### Monitoring

- Track execution time in n8n
- Monitor AI API costs in provider dashboard
- Review Google Sheets API quota usage
- Set up alerts for workflow failures

---

## Future Enhancements

### Phase 2 Features (After MVP)
1. **Weekly optimization report**: AI suggests rule improvements
2. **Rule conflict detection**: Warn when multiple rules match same pattern
3. **Bulk rule import/export**: JSON or CSV format
4. **Mobile app**: Dedicated app for decision-making (instead of email)
5. **Slack/Discord integration**: Notifications via chat instead of email
6. **Email snooze**: Postpone emails to specific date/time
7. **Smart scheduling**: AI suggests best time to resurface emails
8. **Sentiment analysis**: Priority based on email tone
9. **Attachment handling**: Rules based on file types
10. **Multi-account support**: Manage multiple Gmail accounts

### Advanced Features (Future)
1. **Natural language rule creation**: "Archive all newsletters" → auto-creates rule
2. **Predictive confidence**: Improve over time based on feedback
3. **Rule templates**: Pre-built rules for common scenarios
4. **A/B testing**: Test rule variations
5. **Analytics dashboard**: Visual insights into email patterns
6. **Integration marketplace**: Connect to other tools (Notion, Todoist, etc.)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-13
**Status**: Ready for Implementation
