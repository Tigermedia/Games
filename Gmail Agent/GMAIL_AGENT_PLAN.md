# Gmail Agent with Self-Learning Rules - Implementation Plan

## Overview
Build an intelligent Gmail agent using n8n that automatically processes emails daily at 8am based on configurable rules, with the ability to learn from user feedback when uncertain.

---

## Architecture Overview

### Core Components
1. **Scheduled Email Scanner** - Daily 8am trigger
2. **Rule Management System** - Database for storing and updating rules
3. **AI Decision Engine** - Analyzes emails and applies rules
4. **Feedback Loop** - Handles uncertain cases and learns from responses
5. **Email Action Executor** - Performs actions (archive, label, forward, etc.)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCHEDULED TRIGGER                        │
│              (Schedule Trigger - Daily 8am)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              GMAIL EMAIL FETCHER                            │
│         (Gmail Node - Get Many Messages)                   │
│         Filter: Unread emails since last run                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              RULE LOADER                                     │
│         (Postgres/MySQL - Load Active Rules)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              AI DECISION ENGINE                              │
│         (AI Agent Node with Gmail Tools)                     │
│         - Analyzes email content                            │
│         - Matches against rules                             │
│         - Determines action or uncertainty                  │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│  ACTION KNOWN     │   │  ACTION UNCERTAIN     │
│  (Confidence >80%)│   │  (Confidence <80%)    │
└────────┬─────────┘   └──────────┬───────────┘
         │                        │
         ▼                        ▼
┌──────────────────┐   ┌──────────────────────┐
│  EXECUTE ACTION  │   │  SEND NOTIFICATION    │
│  - Archive       │   │  (Slack/Telegram/     │
│  - Label         │   │   Email)              │
│  - Forward       │   │  Wait for user reply  │
│  - Delete        │   │                       │
│  - Reply         │   └──────────┬───────────┘
└──────────────────┘             │
                                  ▼
                     ┌──────────────────────┐
                     │  USER FEEDBACK       │
                     │  (Webhook/Form)      │
                     └──────────┬───────────┘
                                 │
                                 ▼
                     ┌──────────────────────┐
                     │  UPDATE RULES        │
                     │  (Save to Database)  │
                     └──────────────────────┘
```

---

## Detailed Component Specifications

### 1. Scheduled Email Scanner

**Node**: `Schedule Trigger`
- **Configuration**:
  - Trigger Type: Cron Expression
  - Schedule: `0 8 * * *` (8:00 AM daily)
  - Timezone: Your local timezone

**Purpose**: Triggers the workflow every day at 8am

---

### 2. Gmail Email Fetcher

**Node**: `Gmail` (Get Many operation)
- **Configuration**:
  - Resource: Message
  - Operation: Get Many
  - Filters:
    - `q`: `is:unread newer_than:1d` (unread emails from last 24 hours)
    - `readStatus`: `unread`
  - Return All: `true`

**Purpose**: Fetches all unread emails from the inbox

**Alternative**: Use `Gmail Trigger` with polling, but Schedule Trigger gives more control over timing

---

### 3. Rule Management System

**Storage Options**:

#### Option A: PostgreSQL/MySQL Database (Recommended)
**Node**: `Postgres` or `MySQL`
- **Table Schema**: `email_rules`
  ```sql
  CREATE TABLE email_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(255),
    conditions JSONB,  -- {sender, subject_keywords, body_keywords, etc.}
    action VARCHAR(50),  -- archive, label, forward, delete, reply, etc.
    action_params JSONB,  -- {label_id, forward_to, reply_template, etc.}
    priority INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    confidence_threshold DECIMAL(3,2) DEFAULT 0.80
  );
  
  CREATE TABLE rule_feedback (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255),
    email_subject TEXT,
    email_sender VARCHAR(255),
    original_action VARCHAR(50),
    user_action VARCHAR(50),
    user_feedback TEXT,
    created_at TIMESTAMP
  );
  
  CREATE TABLE processed_emails (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) UNIQUE,
    action_taken VARCHAR(50),
    rule_applied_id INTEGER,
    processed_at TIMESTAMP
  );
  ```

#### Option B: Google Sheets (Simpler, no database setup)
**Node**: `Google Sheets`
- Sheet 1: `Rules` - Columns: Rule Name, Conditions (JSON), Action, Priority, Active
- Sheet 2: `Feedback` - Columns: Email ID, Original Action, User Action, Feedback
- Sheet 3: `Processed` - Columns: Email ID, Action, Date

**Purpose**: Stores rules and tracks feedback for learning

---

### 4. AI Decision Engine

**Node**: `AI Agent` (LangChain)
- **Model**: OpenAI GPT-4 or Claude (via Anthropic node)
- **Tools Available**:
  - `Gmail Tool` - Search email history, check labels
  - `Postgres Tool` - Query rules database
  - Custom tools for rule matching

**Prompt Structure**:
```
You are an intelligent email assistant. Your task is to analyze emails and determine the appropriate action based on stored rules.

Available Actions:
- archive: Move email to archive
- label: Apply Gmail label (specify label_id)
- forward: Forward to email address
- delete: Delete email permanently
- reply: Send automated reply
- star: Mark as important
- skip: No action needed

Rules Database:
{{ $json.rules }}

Email to Process:
Subject: {{ $json.subject }}
From: {{ $json.from }}
Body: {{ $json.body }}
Labels: {{ $json.labels }}

Instructions:
1. Analyze the email content
2. Match against stored rules (check conditions like sender, keywords, etc.)
3. Determine the best action
4. Return confidence score (0-1)
5. If confidence < 0.80, mark as "uncertain" and request user feedback

Output Format (JSON):
{
  "action": "archive|label|forward|delete|reply|star|skip|uncertain",
  "action_params": {},
  "confidence": 0.95,
  "rule_matched": "rule_name",
  "reasoning": "Brief explanation"
}
```

**Output Parser**: Use `Structured Output Parser` to ensure consistent JSON format

---

### 5. Action Executor

**Node**: `Gmail` (Multiple operations based on action type)

**Action Mapping**:
- `archive`: Gmail → Message → Mark as Read + Remove from Inbox
- `label`: Gmail → Message → Add Label
- `forward`: Gmail → Message → Forward
- `delete`: Gmail → Message → Delete
- `reply`: Gmail → Message → Reply
- `star`: Gmail → Message → Star

**Node**: `IF` (Conditional routing)
- Route based on action type from AI Agent

---

### 6. Feedback Loop System

#### A. Notification System (When Uncertain)

**Option 1: Slack Notification**
**Node**: `Slack`
- Channel: `#gmail-agent-alerts`
- Message Format:
  ```
  🤔 Gmail Agent needs your help!
  
  Email: {{ $json.subject }}
  From: {{ $json.from }}
  Snippet: {{ $json.snippet }}
  
  Suggested Action: {{ $json.suggested_action }}
  Confidence: {{ $json.confidence }}
  
  Reply with:
  - "archive" to archive
  - "label [label_name]" to label
  - "forward [email]" to forward
  - "delete" to delete
  - "reply [message]" to reply
  - "skip" to skip
  ```

**Option 2: Telegram Notification**
**Node**: `Telegram`
- Similar format to Slack

**Option 3: Email Notification**
**Node**: `Gmail` (Send)
- Send to your personal email with action buttons/links

#### B. Feedback Receiver

**Node**: `Webhook` or `Slack Trigger` or `Telegram Trigger`
- Receives user response
- Parses action from message
- Updates rules database

**Workflow**: `Feedback Handler`
- Trigger: Webhook/Slack/Telegram message
- Extract: Email ID, User Action
- Update: Rules database with new pattern
- Log: Feedback entry for learning

---

### 7. Rule Learning System

**Node**: `Code` (JavaScript) or `Function`
- **Logic**:
  1. Extract email features (sender domain, subject keywords, body patterns)
  2. Store user's action as new rule or update existing rule
  3. Calculate similarity to existing rules
  4. Merge or create new rule entry

**Example Learning Logic**:
```javascript
// Extract patterns from email
const emailPattern = {
  sender_domain: extractDomain(email.from),
  subject_keywords: extractKeywords(email.subject),
  body_keywords: extractKeywords(email.body),
  has_attachment: email.attachments.length > 0
};

// User action
const userAction = {
  action: "archive",
  label_id: null
};

// Create or update rule
await updateRule(emailPattern, userAction);
```

---

## Workflow Structure

### Main Workflow: `Gmail Daily Scanner`

```
1. Schedule Trigger (8am daily)
   ↓
2. Gmail - Get Many (unread emails)
   ↓
3. Split In Batches (process 10 at a time)
   ↓
4. Postgres - Load Active Rules
   ↓
5. AI Agent - Analyze Email & Match Rules
   ↓
6. IF Node - Check Confidence
   ├─ High Confidence (>0.80) → Execute Action
   └─ Low Confidence (<0.80) → Send Notification
   ↓
7. Gmail - Execute Action (archive/label/etc.)
   ↓
8. Postgres - Log Processed Email
```

### Secondary Workflow: `Feedback Handler`

```
1. Slack/Telegram Trigger (user reply)
   ↓
2. Extract Email ID & Action
   ↓
3. Postgres - Load Email Details
   ↓
4. Code Node - Extract Patterns
   ↓
5. Postgres - Create/Update Rule
   ↓
6. Postgres - Log Feedback
   ↓
7. Slack/Telegram - Confirm Rule Updated
```

### Tertiary Workflow: `Rule Management UI` (Optional)

```
1. Webhook Trigger (manual rule updates)
   ↓
2. Postgres - CRUD Operations on Rules
   ↓
3. Return Updated Rules List
```

---

## Implementation Steps

### Phase 1: Foundation Setup (Week 1)

1. **Set up n8n instance**
   - Deploy n8n (cloud or self-hosted)
   - Configure credentials for Gmail (OAuth2)

2. **Set up database**
   - Create PostgreSQL/MySQL database
   - Create tables: `email_rules`, `rule_feedback`, `processed_emails`
   - Configure Postgres/MySQL node credentials

3. **Create initial rules**
   - Manually insert 5-10 basic rules
   - Examples:
     - Sender contains "@newsletter.com" → Label "Newsletters"
     - Subject contains "Invoice" → Label "Invoices"
     - From "boss@company.com" → Star

### Phase 2: Core Workflow (Week 1-2)

4. **Build Main Scanner Workflow**
   - Schedule Trigger (8am)
   - Gmail Get Many
   - Postgres Load Rules
   - AI Agent with structured output
   - Action executor (Gmail operations)
   - Processed email logger

5. **Test with sample emails**
   - Send test emails
   - Verify actions execute correctly
   - Check database logging

### Phase 3: Feedback System (Week 2)

6. **Build Notification System**
   - Slack/Telegram integration
   - Format notification messages
   - Include email preview and suggested action

7. **Build Feedback Handler**
   - Webhook/Slack Trigger
   - Parse user responses
   - Extract email patterns
   - Update rules database

8. **Test feedback loop**
   - Trigger uncertain case
   - Send notification
   - Reply with action
   - Verify rule creation

### Phase 4: Learning Enhancement (Week 3)

9. **Enhance AI Agent**
   - Add email history context
   - Improve pattern matching
   - Better confidence scoring

10. **Rule refinement**
    - Merge similar rules
    - Remove conflicting rules
    - Optimize rule priority

### Phase 5: Polish & Optimization (Week 3-4)

11. **Error handling**
    - Handle API rate limits
    - Retry failed actions
    - Log errors

12. **Monitoring**
    - Dashboard for rule statistics
    - Email processing metrics
    - Feedback analysis

---

## Required n8n Nodes

### Core Nodes:
1. `Schedule Trigger` - Daily trigger
2. `Gmail` - Email operations
3. `Postgres` or `MySQL` - Rule storage
4. `AI Agent` (LangChain) - Decision making
5. `IF` - Conditional routing
6. `Code` or `Function` - Pattern extraction
7. `Slack` or `Telegram` - Notifications
8. `Webhook` - Feedback receiver
9. `Structured Output Parser` - AI response formatting

### Optional Nodes:
- `Split In Batches` - Process emails in batches
- `Set` - Data transformation
- `Merge` - Combine data
- `HTTP Request` - External API calls
- `Google Sheets` - Alternative storage

---

## Rule Format Specification

### Rule Structure (JSON)
```json
{
  "id": 1,
  "rule_name": "Newsletter Auto-Archive",
  "conditions": {
    "sender_domain": ["newsletter.com", "marketing.com"],
    "subject_keywords": ["newsletter", "update"],
    "body_keywords": [],
    "has_attachment": false,
    "label_contains": []
  },
  "action": "archive",
  "action_params": {},
  "priority": 5,
  "is_active": true,
  "confidence_threshold": 0.80,
  "created_at": "2025-01-15T08:00:00Z",
  "updated_at": "2025-01-15T08:00:00Z"
}
```

### Action Types:
- `archive` - Move to archive
- `label` - Apply label (requires `label_id` in `action_params`)
- `forward` - Forward email (requires `forward_to` in `action_params`)
- `delete` - Delete permanently
- `reply` - Send reply (requires `reply_template` in `action_params`)
- `star` - Mark as important
- `skip` - No action

---

## AI Agent Configuration

### Model Selection:
- **Recommended**: OpenAI GPT-4 or Claude Sonnet 4
- **Alternative**: GPT-3.5-turbo (faster, cheaper, less accurate)

### System Prompt Template:
```
You are an intelligent email assistant that processes emails based on predefined rules.

Your task:
1. Analyze the email content (subject, sender, body)
2. Match against stored rules
3. Determine the best action
4. Return structured JSON response

Rules: {{ rules_json }}

Email: {{ email_data }}

Return JSON with: action, action_params, confidence, rule_matched, reasoning
```

### Tools Available to AI Agent:
- `Gmail Tool` - Search emails, check labels, get email details
- `Postgres Tool` - Query rules database
- Custom rule matching function

---

## Notification Channels

### Option 1: Slack (Recommended)
- **Setup**: Create Slack app, get bot token
- **Channel**: `#gmail-agent-alerts`
- **Format**: Rich message with email preview
- **Interaction**: Thread replies for feedback

### Option 2: Telegram
- **Setup**: Create bot via @BotFather
- **Chat**: Personal or group chat
- **Format**: Formatted text message
- **Interaction**: Reply with action command

### Option 3: Email
- **Setup**: Gmail send
- **Format**: HTML email with action links
- **Interaction**: Reply with action in subject/body

### Option 4: n8n Webhook + Custom UI
- **Setup**: Webhook endpoint
- **Format**: Custom dashboard
- **Interaction**: Click buttons/forms

---

## Learning Algorithm

### Pattern Extraction:
1. **Sender Analysis**:
   - Extract domain from sender email
   - Check if domain matches existing rules
   - Store domain patterns

2. **Content Analysis**:
   - Extract keywords from subject (remove stop words)
   - Extract keywords from body (first 500 chars)
   - Identify common phrases

3. **Metadata Analysis**:
   - Check for attachments
   - Check existing labels
   - Check email size

### Rule Creation:
```javascript
function createRuleFromFeedback(email, userAction) {
  const pattern = {
    sender_domain: extractDomain(email.from),
    subject_keywords: extractKeywords(email.subject, 3), // top 3 keywords
    body_keywords: extractKeywords(email.body, 5), // top 5 keywords
    has_attachment: email.attachments.length > 0
  };
  
  const rule = {
    rule_name: `Auto-${userAction.action} from ${pattern.sender_domain}`,
    conditions: pattern,
    action: userAction.action,
    action_params: userAction.params || {},
    priority: calculatePriority(pattern),
    confidence_threshold: 0.75 // Start conservative
  };
  
  return rule;
}
```

### Rule Merging:
- If similar rule exists (same action, similar conditions), update confidence threshold
- If conflicting rule exists, prioritize based on user feedback frequency

---

## Security Considerations

1. **Gmail API Scopes**:
   - Minimal required scopes
   - Read, Modify, Send (as needed)

2. **Database Security**:
   - Encrypted connections
   - Parameterized queries (prevent SQL injection)
   - Access control

3. **API Keys**:
   - Store in n8n credentials (encrypted)
   - Never expose in workflow code

4. **Email Privacy**:
   - Process emails server-side only
   - Don't log sensitive content
   - Secure feedback channels

---

## Monitoring & Maintenance

### Metrics to Track:
1. **Processing Stats**:
   - Emails processed per day
   - Actions taken (archive/label/etc.)
   - Confidence scores distribution

2. **Rule Performance**:
   - Rules matched most often
   - Rules with low confidence
   - Rules never matched

3. **Feedback Stats**:
   - Uncertain cases per day
   - Response time to feedback
   - New rules created from feedback

### Maintenance Tasks:
- Weekly: Review low-confidence rules
- Monthly: Clean up unused rules
- Quarterly: Analyze feedback patterns

---

## Cost Estimation

### n8n:
- Cloud: $20-50/month (depending on usage)
- Self-hosted: Free (server costs)

### Database:
- PostgreSQL: Free (self-hosted) or $5-25/month (managed)
- MySQL: Free (self-hosted) or $5-25/month (managed)

### AI API:
- OpenAI GPT-4: ~$0.03 per email (1000 emails/month = $30)
- GPT-3.5-turbo: ~$0.001 per email (1000 emails/month = $1)
- Claude: Similar to GPT-4

### Total Estimated Cost:
- **Minimal**: $25-50/month (self-hosted n8n + GPT-3.5)
- **Recommended**: $50-100/month (cloud n8n + GPT-4)

---

## Future Enhancements

1. **Advanced Learning**:
   - Vector embeddings for semantic matching
   - Machine learning model training
   - Context-aware rule suggestions

2. **Multi-Account Support**:
   - Process multiple Gmail accounts
   - Account-specific rules

3. **Advanced Actions**:
   - Create calendar events from emails
   - Add to task management (Todoist, Asana)
   - Extract and save attachments

4. **Dashboard**:
   - Web UI for rule management
   - Visual analytics
   - Rule testing interface

5. **Integration**:
   - CRM integration (update contacts)
   - Expense tracking (invoice emails)
   - Project management (task creation)

---

## Testing Checklist

- [ ] Schedule trigger fires at 8am
- [ ] Gmail fetches unread emails correctly
- [ ] Rules load from database
- [ ] AI Agent analyzes emails accurately
- [ ] High-confidence actions execute
- [ ] Low-confidence notifications send
- [ ] User feedback received correctly
- [ ] Rules update from feedback
- [ ] Processed emails logged
- [ ] Error handling works
- [ ] Rate limiting handled

---

## Troubleshooting Guide

### Common Issues:

1. **Emails not processing**:
   - Check Gmail API credentials
   - Verify schedule trigger timezone
   - Check email filters

2. **AI Agent errors**:
   - Verify API key
   - Check prompt format
   - Validate structured output parser

3. **Rules not matching**:
   - Review rule conditions
   - Check confidence thresholds
   - Test with sample emails

4. **Feedback not updating rules**:
   - Verify webhook/Slack trigger
   - Check database permissions
   - Review pattern extraction logic

---

## Conclusion

This plan provides a comprehensive blueprint for building a self-learning Gmail agent using n8n. The system will:

✅ Scan inbox daily at 8am
✅ Process emails based on rules
✅ Learn from user feedback
✅ Continuously improve accuracy

Start with Phase 1 and iterate based on your specific needs. The modular design allows for incremental development and easy customization.



