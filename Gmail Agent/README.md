# Gmail Agent with Self-Learning Rules

## 📋 Overview

An intelligent Gmail automation agent using **n8n** that processes your inbox daily with AI-powered decision-making and self-learning capabilities.

**Key Features:**
- ✅ Scans inbox daily at 8am (configurable)
- ✅ Processes 50-200 emails automatically
- ✅ Uses AI (GPT-4/Claude) to analyze and classify
- ✅ Executes ANY action you define (label, archive, forward, delete, etc.)
- ✅ **Learns from your feedback** when uncertain
- ✅ Stores rules in Google Sheets for easy editing

## 📁 Project Documentation

This project has comprehensive documentation to ensure context is preserved across sessions:

### For AI Assistants (Claude)
- **[claude.md](claude.md)** - Complete project context, architecture, technical details, and guidelines
- **[PLAN.md](PLAN.md)** - Detailed implementation specifications
- **[WORKFLOW_STRUCTURE.md](WORKFLOW_STRUCTURE.md)** - Node-by-node breakdown

### For Humans
- **[README.md](README.md)** - This file (project overview)
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Step-by-step setup instructions
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - Fast setup guide
- **[TODOS.md](TODOS.md)** - Implementation progress tracking

### Reference Documentation
- **[GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md)** - Database schema and setup
- **[API_CONFIGURATION.md](API_CONFIGURATION.md)** - Service setup guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[GMAIL_AGENT_PLAN.md](GMAIL_AGENT_PLAN.md)** - Original comprehensive plan (historical reference)

## 🎯 Key Features

### Core Functionality
- **Scheduled Scanning**: Daily email processing at 8am (configurable)
- **Rule-Based Processing**: Apply actions based on sender, subject, content
- **AI-Powered Decisions**: Intelligent email analysis using GPT-4/Claude
- **Self-Learning**: Updates rules from user feedback

### Supported Actions
- Archive emails
- Apply Gmail labels
- Forward to other addresses
- Delete emails
- Send automated replies
- Star important emails
- Skip (no action)

### Learning System
- Detects uncertain cases (low confidence)
- Sends notifications for user review
- Learns from user responses
- Creates/updates rules automatically

## 🏗️ Architecture

**Single Unified Workflow** - Real-time processing triggered on new email arrival:

```
[New Email Arrives] → Triggers Immediately
        ↓
[Fetch Rules from Google Sheets]
        ↓
[AI: Analyze Email & Assign Label]
        ↓
    [Confidence Check]
        ↓
        ├─ [High Confidence ≥80%]
        │   ├─ Apply Label (💼 Work, 📰 Newsletters, etc.)
        │   ├─ Mark as "✅ Processed"
        │   └─ Log to Activity Sheet
        │
        └─ [Low Confidence <80%]
            ├─ Apply "📥 To Review" + Best Guess Label
            ├─ Send Decision Email with Label Buttons
            ├─ Wait for Your Click (7 days max)
            ├─ Apply Your Chosen Label
            ├─ AI Creates New Rule
            └─ Confirm & Mark "✅ Processed"
```

**Key Features:**
- ✅ Real-time processing (no waiting for scheduled runs)
- ✅ Every email gets labeled (no email left behind)
- ✅ Emoji labels with nested hierarchy
- ✅ Self-learning from your decisions

## 🚀 Quick Start

1. **Read**: `QUICK_START_GUIDE.md` for setup instructions
2. **Plan**: Review `GMAIL_AGENT_PLAN.md` for architecture details
3. **Implement**: Follow the step-by-step guide
4. **Test**: Send test emails and verify processing
5. **Iterate**: Add more rules and refine

## 📊 Components

### Required n8n Nodes
- **Schedule Trigger** - Daily 8am execution
- **Gmail** - Get messages, add/remove labels, archive, delete, forward, send
- **Google Sheets** - Rule storage and activity logging
- **AI Agent** - Email analysis and pattern extraction (LangChain)
- **Wait Node** - Interactive feedback collection via webhooks
- **Switch/If Nodes** - Decision routing
- **Code Nodes** - Custom logic and calculations

### External Services
- **Gmail API** (OAuth2) - Email operations
- **Google Sheets API** (OAuth2) - Rule database
- **OpenAI API** (GPT-4) OR **Anthropic API** (Claude 3.5 Sonnet) - AI analysis
- **n8n** (Cloud $20/month or self-hosted free)

## 💡 Use Cases

- **Email Organization**: Automatically archive newsletters, label invoices
- **Priority Management**: Star important emails, forward urgent messages
- **Spam Handling**: Delete spam, filter unwanted senders
- **Task Automation**: Extract tasks, create calendar events
- **Team Coordination**: Forward team emails, notify on specific topics

## 🔧 Configuration

### Schedule
- Default: Daily at 8am (`0 8 * * *`)
- Customizable via Cron expression

### Confidence Threshold
- Default: 0.80 (80% confidence)
- Adjustable per rule

### Processing Batch Size
- Default: 10 emails per batch
- Configurable for rate limiting

## 📈 Learning Process

1. **Email arrives** → AI analyzes
2. **Confidence check**:
   - High (>80%): Execute action automatically
   - Low (<80%): Send notification
3. **User responds** → Action taken
4. **Pattern extraction** → New rule created
5. **Next time** → Rule applied automatically

## 🛡️ Security

- OAuth2 authentication for Gmail
- Encrypted database connections
- Secure credential storage in n8n
- No email content logging (privacy)

## 💰 Cost Estimation

### With OpenAI (GPT-4)
- **n8n**: $20/month (cloud) or $0 (self-hosted)
- **Gmail/Sheets API**: Free
- **OpenAI API**: $15-45/month (50-200 emails/day)
- **Total**: $35-65/month (cloud) or $15-45/month (self-hosted)

### With Claude (More Economical)
- **n8n**: $20/month (cloud) or $0 (self-hosted)
- **Gmail/Sheets API**: Free
- **Anthropic API**: $7.50-22.50/month (50-200 emails/day)
- **Total**: $27.50-42.50/month (cloud) or $7.50-22.50/month (self-hosted)

## 📝 Example Rules

```json
{
  "rule_name": "Archive Newsletters",
  "conditions": {
    "sender_domain": ["newsletter.com"],
    "subject_keywords": ["newsletter"]
  },
  "action": "archive"
}
```

```json
{
  "rule_name": "Label Invoices",
  "conditions": {
    "subject_keywords": ["invoice", "receipt"]
  },
  "action": "label",
  "action_params": {
    "label_id": "Label_123456"
  }
}
```

## 🔄 Workflow Structure

This project uses **ONE single workflow** that contains all functionality:
- Email scanning and fetching
- Rule matching with AI
- Action execution
- Interactive feedback (via Wait node webhooks)
- Rule creation and updates
- Activity logging

See [WORKFLOW_STRUCTURE.md](WORKFLOW_STRUCTURE.md) for detailed node-by-node breakdown.

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Gmail API Guide](https://developers.google.com/gmail/api)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com/)

## 🐛 Troubleshooting

See `QUICK_START_GUIDE.md` for common issues and solutions.

## 📅 Implementation Timeline

See [TODOS.md](TODOS.md) for detailed progress tracking.

- **Phase 1**: Setup & Configuration (APIs, credentials, Google Sheets)
- **Phase 2**: Core Workflow Build (email processing, AI decision engine)
- **Phase 3**: AI Integration (pattern extraction, rule creation)
- **Phase 4**: Learning System (feedback loop, rule updates)
- **Phase 5**: Testing & Refinement (edge cases, error handling, optimization)

## 🤝 Contributing

This is a personal automation project. Feel free to adapt and modify for your needs.

## 📄 License

Personal use - Adapt as needed for your requirements.

---

**Ready to start?** → Open `QUICK_START_GUIDE.md`

**Need details?** → Read `GMAIL_AGENT_PLAN.md`



