# Gmail Agent - Learning Workflow Design

## Enhanced Workflow Architecture

```
                                    ┌─────────────────────┐
                                    │   Google Sheets     │
                                    │   (Rules Storage)   │
                                    └──────────┬──────────┘
                                               │
┌──────────────┐    ┌──────────────┐    ┌──────▼──────┐    ┌─────────────┐
│ Gmail Trigger│───►│ Extract Data │───►│ Check Rules │───►│ Rule Match? │
└──────────────┘    └──────────────┘    └─────────────┘    └──────┬──────┘
                                                                   │
                           ┌───────────────────────────────────────┼───────────────────┐
                           │ YES                                   │                   │ NO
                           ▼                                       │                   ▼
                    ┌─────────────┐                                │           ┌─────────────┐
                    │ Apply Rule  │                                │           │ AI Classify │
                    │ Label       │                                │           └──────┬──────┘
                    └──────┬──────┘                                │                  │
                           │                                       │           ┌──────▼──────┐
                           │                                       │           │ Confidence? │
                           │                                       │           └──────┬──────┘
                           │                                       │                  │
                           │                           ┌───────────┴───────────┐      │
                           │                           │ HIGH (≥80%)           │ LOW (<80%)
                           │                           ▼                       ▼
                           │                    ┌─────────────┐         ┌─────────────────┐
                           │                    │ Apply Label │         │ Send Decision   │
                           │                    │ + Processed │         │ Email           │
                           │                    └──────┬──────┘         └────────┬────────┘
                           │                           │                         │
                           │                           │                  ┌──────▼──────┐
                           │                           │                  │ Wait for    │
                           │                           │                  │ Response    │
                           │                           │                  └──────┬──────┘
                           │                           │                         │
                           │                           │           ┌─────────────┴─────────────┐
                           │                           │           │                           │
                           │                           │    ┌──────▼──────┐            ┌───────▼───────┐
                           │                           │    │ Button Click│            │ Email Reply   │
                           │                           │    │ (Webhook)   │            │ (Text Rule)   │
                           │                           │    └──────┬──────┘            └───────┬───────┘
                           │                           │           │                           │
                           │                           │    ┌──────▼──────┐            ┌───────▼───────┐
                           │                           │    │ Apply       │            │ AI Extract    │
                           │                           │    │ Selected    │            │ Rule from     │
                           │                           │    │ Label       │            │ Text          │
                           │                           │    └──────┬──────┘            └───────┬───────┘
                           │                           │           │                           │
                           │                           │           └───────────┬───────────────┘
                           │                           │                       │
                           │                           │                ┌──────▼──────┐
                           │                           │                │ Save Rule   │
                           │                           │                │ to Sheets   │
                           │                           │                └──────┬──────┘
                           │                           │                       │
                           └───────────────────────────┴───────────────────────┘
                                                       │
                                                ┌──────▼──────┐
                                                │ Mark as     │
                                                │ ✅ Processed │
                                                └─────────────┘
```

## Google Sheets Structure

### Sheet 1: Rules
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| Rule ID | Auto | Unique ID | 1, 2, 3... |
| Type | Text | sender, domain, subject, content | sender |
| Pattern | Text | Match pattern | newsletter@example.com |
| Label | Text | Label to apply | 📰 Newsletters/Tech |
| Action | Text | label, archive, delete, forward | label |
| Priority | Number | Higher = checked first | 10 |
| Active | Boolean | Is rule active? | TRUE |
| Created | Date | When created | 2024-01-04 |
| Last Used | Date | Last match | 2024-01-04 |
| Use Count | Number | Times matched | 15 |
| Source | Text | How rule was created | user_reply, button, manual |
| Original Text | Text | User's original instruction | "All emails from this sender go to newsletters" |

### Sheet 2: Activity Log
| Column | Description |
|--------|-------------|
| Timestamp | When processed |
| Email ID | Gmail message ID |
| From | Sender |
| Subject | Subject line |
| Rule ID | Which rule matched (or "AI" or "Manual") |
| Label Applied | What label was applied |
| Confidence | AI confidence (if used) |
| Action | What happened |

## Decision Email Format

```
Subject: 📬 Gmail Agent: How should I classify this email?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 NEW EMAIL NEEDS YOUR INPUT

From: {sender}
Subject: {subject}
Date: {date}

Preview:
{snippet}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️ QUICK LABELS (click one):

[💼 Work] [👤 Personal] [📰 Newsletter] [🔔 Notification]
[🛒 Shopping] [💰 Finance] [📅 Calendar] [⬇️ Low Priority]
[🗑️ Delete] [📦 Archive] [⏭️ Skip]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 OR REPLY WITH A RULE:

Reply to this email with instructions like:
• "Label as Newsletter"
• "All emails from this sender → Work/Clients"
• "Emails with 'invoice' in subject → Finance/Invoices"
• "Delete all emails from this domain"
• "Archive newsletters from this sender"

Your reply will teach me for future similar emails!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AI Suggestion: {ai_label} ({confidence}% confident)
Reason: {reason}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## User Reply Processing

When user replies with text, AI extracts:

```json
{
  "type": "sender|domain|subject|content",
  "pattern": "the pattern to match",
  "label": "📰 Newsletters/Tech",
  "action": "label|archive|delete|forward",
  "applyToThis": true,
  "description": "Human readable rule description"
}
```

### Example User Replies → Rules

| User Reply | Extracted Rule |
|------------|----------------|
| "Newsletter" | type: sender, pattern: {from}, label: 📰 Newsletters |
| "All from this sender → Work" | type: sender, pattern: {from}, label: 💼 Work |
| "Emails with 'receipt' → Finance" | type: subject, pattern: receipt, label: 💰 Finance |
| "Delete all from @spam.com" | type: domain, pattern: @spam.com, action: delete |
| "Archive" | type: sender, pattern: {from}, action: archive |

## Implementation Nodes

### New Nodes to Add:

1. **Fetch Rules** (Google Sheets)
   - Get all active rules sorted by priority

2. **Check Rules** (Code)
   - Match email against rules
   - Return matched rule or null

3. **Apply Rule Label** (Gmail)
   - Apply label from matched rule

4. **Send Decision Email** (Gmail)
   - HTML email with webhook buttons
   - Instructions for text reply

5. **Wait for Response** (Wait)
   - Webhook URL for button clicks
   - Also monitors for email replies

6. **Check for Reply** (Gmail Trigger - separate workflow)
   - Triggers on replies to decision emails
   - Extracts user's text instruction

7. **AI Extract Rule** (OpenAI)
   - Parse user's text reply
   - Extract structured rule

8. **Save Rule** (Google Sheets)
   - Append new rule to Rules sheet

9. **Log Activity** (Google Sheets)
   - Log every processed email

## Webhook Button URLs

Each button in the decision email links to:
```
https://n8n.tigermedia.co.il/webhook/{workflow-id}?
  action=label&
  label=📰 Newsletters&
  emailId={id}&
  createRule=true
```

## Timeout Handling

- Wait node timeout: 7 days
- If no response: Apply 📥 To Review label
- Send reminder after 24 hours (optional)
