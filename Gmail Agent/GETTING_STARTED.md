# Getting Started with Gmail Agent

## 🚀 Quick Start (30 minutes)

Your Gmail Agent is ready to deploy! Follow these steps:

---

## Step 1: Setup Google Sheet (10 min)

1. **Create Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com/)
   - Create new sheet: "Gmail Agent Database"
   - Create 3 tabs: `Rules`, `Activity Log`, `Statistics`

2. **Import Templates**:
   - Go to `Rules` tab
   - File → Import → Upload `templates/rules-template.csv`
   - Customize the 5 sample rules with your emails

3. **Get Sheet ID**:
   - Copy from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Save this ID for next step

📄 **Detailed instructions**: See [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md)

---

## Step 2: Setup APIs (15 min)

1. **Google Cloud**:
   - Enable Gmail API
   - Enable Google Sheets API
   - Create OAuth2 credentials

2. **AI Provider** (choose one):
   - **OpenAI**: Get API key (~$15-45/month)
   - **Anthropic**: Get API key (~$7.50-22.50/month) ← Cheaper

3. **n8n Credentials**:
   - Add Gmail OAuth2
   - Add Google Sheets OAuth2
   - Add OpenAI or Anthropic API key

📄 **Detailed instructions**: See [API_CONFIGURATION.md](API_CONFIGURATION.md)

---

## Step 3: Import Workflow (5 min)

1. **In n8n**:
   - Go to Workflows → "+ Add workflow"
   - Click "⋮" → "Import from File"
   - Select `workflows/gmail-agent-workflow.json`

2. **Replace Placeholders**:
   - `YOUR_GOOGLE_SHEET_ID` → Your Sheet ID from Step 1
   - `YOUR_EMAIL@example.com` → Your email address (2 places)
   - Assign credentials to all nodes (7 total)

3. **Create Gmail Label**:
   - In Gmail: Settings → Labels → Create "Processed-by-Agent"

📄 **Detailed instructions**: See [workflows/SETUP.md](workflows/SETUP.md)

---

## Step 4: Test & Activate (5 min)

1. **Test Manually**:
   - Click "Test workflow" in n8n
   - Check execution log for errors
   - Send test email and run again

2. **Activate**:
   - Toggle "Active" switch
   - Workflow runs daily at 8am
   - Monitor first run closely

---

## 📁 Project Structure

```
Gmail Agent/
├── workflows/
│   ├── gmail-agent-workflow.json  ← Import this to n8n
│   └── SETUP.md                   ← Setup instructions
├── templates/
│   ├── rules-template.csv         ← Import to Google Sheets
│   ├── activity-log-template.csv  ← Header template
│   └── README.md                  ← Template guide
├── README.md                       ← Project overview
├── GETTING_STARTED.md             ← This file (quick start)
├── PLAN.md                         ← Complete specifications
├── IMPLEMENTATION_GUIDE.md        ← Detailed setup guide
├── API_CONFIGURATION.md           ← API setup details
├── GOOGLE_SHEETS_TEMPLATE.md      ← Database schema
├── WORKFLOW_STRUCTURE.md          ← Workflow reference
├── TODOS.md                        ← Progress tracking
└── claude.md                       ← AI context
```

---

## ✅ What's Working Now (v1.0)

- ✅ Daily email scanning (8am)
- ✅ AI-powered email analysis (GPT-4 or Claude)
- ✅ Rule matching (sender, domain, subject, AI content)
- ✅ Basic actions (label, archive)
- ✅ Interactive feedback (decision emails with buttons)
- ✅ Wait for user response (webhook)
- ✅ Daily summary report

---

## 🚧 Coming Soon (v2.0)

- ⏳ AI pattern extraction (auto-create rules from feedback)
- ⏳ Activity logging to Google Sheets
- ⏳ Rule statistics tracking
- ⏳ Additional actions (delete, forward, mark read, star)
- ⏳ Confirmation emails after rule creation

---

## 💰 Cost Estimate

**Monthly costs**:
- n8n Cloud: $20 (or $0 if self-hosted)
- Gmail/Sheets API: Free
- AI API: $7.50-45 (depends on provider & volume)

**Total**: $27.50-65/month (or $7.50-45 if self-hosted)

---

## 🆘 Need Help?

### Documentation
- 📖 [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Complete setup walkthrough
- 📖 [API_CONFIGURATION.md](API_CONFIGURATION.md) - API setup details
- 📖 [workflows/SETUP.md](workflows/SETUP.md) - Workflow configuration
- 📖 [PLAN.md](PLAN.md) - Full technical specifications

### Troubleshooting
- Check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) "Troubleshooting" section
- Review n8n execution logs for specific errors
- Verify all credentials are configured correctly

### Common Issues
1. **"insufficient_permissions"** → Re-authenticate Gmail OAuth2
2. **"Sheet not found"** → Check Sheet ID and tab names
3. **"No emails processed"** → Verify emails exist without "Processed-by-Agent" label
4. **Webhook not working** → Check n8n has public URL

---

## 🎯 Success Checklist

After setup, verify:
- [ ] Workflow imports successfully
- [ ] All credentials assigned
- [ ] Google Sheet ID replaced
- [ ] Email address replaced (2 places)
- [ ] Gmail label "Processed-by-Agent" created
- [ ] Sample rules imported and customized
- [ ] Manual test successful
- [ ] Workflow activated
- [ ] First scheduled run completed

---

## 📊 Next Steps

After successful deployment:

1. **Week 1**: Monitor daily, respond to decision emails promptly
2. **Week 2**: Review what's working, add more rules
3. **Week 3**: Fine-tune confidence threshold and priorities
4. **Month 1**: Implement v2 features (see PLAN.md)

---

## 🎉 You're Ready!

Your intelligent Gmail assistant is configured. It will:
1. Scan your inbox every morning at 8am
2. Automatically handle emails matching your rules
3. Ask for your input when uncertain
4. Learn from your decisions
5. Send you a daily summary

**Time saved**: ~10-30 minutes per day 🚀

---

**Version**: 1.0
**Last Updated**: 2025-01-13
**Status**: Ready to Deploy
