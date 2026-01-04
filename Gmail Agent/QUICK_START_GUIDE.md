# Gmail Agent - Quick Start Guide

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] n8n instance (cloud or self-hosted)
- [ ] Gmail account with API access enabled
- [ ] Database (PostgreSQL/MySQL) or Google Sheets
- [ ] AI API key (OpenAI or Anthropic Claude)
- [ ] Notification channel (Slack/Telegram) for feedback

---

## Step-by-Step Setup (30 minutes)

### Step 1: Configure Gmail Credentials (5 min)

1. In n8n, go to **Credentials** → **Add Credential**
2. Select **Gmail OAuth2 API**
3. Follow OAuth flow to authorize Gmail access
4. Required scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/gmail.send` (if replying)

### Step 2: Set Up Database (10 min)

**Option A: PostgreSQL (Recommended)**

```sql
-- Run in your PostgreSQL database
CREATE TABLE email_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(255) NOT NULL,
    conditions JSONB NOT NULL,
    action VARCHAR(50) NOT NULL,
    action_params JSONB DEFAULT '{}',
    priority INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    confidence_threshold DECIMAL(3,2) DEFAULT 0.80,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rule_feedback (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255),
    email_subject TEXT,
    email_sender VARCHAR(255),
    original_action VARCHAR(50),
    user_action VARCHAR(50),
    user_feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE processed_emails (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) UNIQUE,
    action_taken VARCHAR(50),
    rule_applied_id INTEGER,
    processed_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample rules
INSERT INTO email_rules (rule_name, conditions, action, priority) VALUES
('Archive Newsletters', '{"sender_domain": ["newsletter.com"], "subject_keywords": ["newsletter"]}', 'archive', 3),
('Label Invoices', '{"subject_keywords": ["invoice", "receipt"]}', 'label', 8),
('Star from Boss', '{"sender_email": "boss@company.com"}', 'star', 10);
```

**Option B: Google Sheets (Simpler)**

1. Create Google Sheet with 3 tabs:
   - **Rules**: Columns: Rule Name | Conditions (JSON) | Action | Priority | Active
   - **Feedback**: Columns: Email ID | Subject | Sender | Original Action | User Action | Feedback
   - **Processed**: Columns: Email ID | Action | Date

2. Share sheet with n8n service account or use OAuth2

### Step 3: Configure AI API (5 min)

1. Get API key from OpenAI or Anthropic
2. In n8n, add credential:
   - **OpenAI API** or **Anthropic API**
3. Enter API key

### Step 4: Set Up Notification Channel (5 min)

**Slack Setup:**
1. Create Slack app at api.slack.com
2. Get Bot Token
3. Add to n8n Slack credential
4. Create channel: `#gmail-agent-alerts`

**Telegram Setup:**
1. Message @BotFather on Telegram
2. Create bot, get token
3. Add to n8n Telegram credential
4. Get your Chat ID

### Step 5: Create Main Workflow (5 min)

**Basic Workflow Structure:**

```
1. Schedule Trigger
   - Cron: 0 8 * * *
   - Timezone: Your timezone

2. Gmail (Get Many)
   - Resource: Message
   - Operation: Get Many
   - Filters: is:unread newer_than:1d

3. Split In Batches
   - Batch Size: 10

4. Postgres (Load Rules)
   - Operation: Execute Query
   - Query: SELECT * FROM email_rules WHERE is_active = true ORDER BY priority DESC

5. AI Agent
   - Model: GPT-4 or Claude
   - Prompt: [See main plan]
   - Tools: Gmail Tool, Postgres Tool

6. IF Node
   - Condition: {{ $json.confidence }} > 0.80

7. Gmail (Execute Action)
   - Based on action type

8. Postgres (Log Processed)
   - Insert into processed_emails
```

---

## Quick Test

1. **Send test email** to your Gmail
2. **Manually trigger** workflow (don't wait for 8am)
3. **Check**:
   - Email processed?
   - Action executed?
   - Database logged?

---

## Common Configurations

### Schedule Variations

- **Every weekday at 8am**: `0 8 * * 1-5`
- **Every 2 hours**: `0 */2 * * *`
- **Twice daily (8am & 6pm)**: `0 8,18 * * *`

### Gmail Filters

- **Only important**: `is:unread is:important`
- **Exclude newsletters**: `is:unread -label:newsletters`
- **Specific sender**: `is:unread from:sender@example.com`

### Confidence Thresholds

- **Conservative (fewer mistakes)**: 0.90
- **Balanced**: 0.80 (recommended)
- **Aggressive (more automation)**: 0.70

---

## Sample Rules

### Rule 1: Archive Newsletters
```json
{
  "rule_name": "Archive Newsletters",
  "conditions": {
    "sender_domain": ["newsletter.com", "marketing.com"],
    "subject_keywords": ["newsletter", "update", "digest"]
  },
  "action": "archive",
  "priority": 3
}
```

### Rule 2: Label Invoices
```json
{
  "rule_name": "Label Invoices",
  "conditions": {
    "subject_keywords": ["invoice", "receipt", "payment"]
  },
  "action": "label",
  "action_params": {
    "label_id": "Label_123456"
  },
  "priority": 8
}
```

### Rule 3: Forward Urgent
```json
{
  "rule_name": "Forward Urgent Emails",
  "conditions": {
    "subject_keywords": ["urgent", "asap", "important"],
    "sender_email": ["boss@company.com"]
  },
  "action": "forward",
  "action_params": {
    "forward_to": "personal@email.com"
  },
  "priority": 10
}
```

---

## Troubleshooting

### Issue: Workflow not triggering
**Solution**: Check timezone in Schedule Trigger

### Issue: No emails found
**Solution**: Verify Gmail filter syntax, check for unread emails

### Issue: AI Agent errors
**Solution**: Check API key, verify model availability, check prompt format

### Issue: Actions not executing
**Solution**: Verify Gmail permissions, check action parameters

---

## Next Steps

1. ✅ Complete basic setup
2. ✅ Test with sample emails
3. ✅ Add more rules
4. ✅ Set up feedback system
5. ✅ Monitor and refine

For detailed implementation, see `GMAIL_AGENT_PLAN.md`



