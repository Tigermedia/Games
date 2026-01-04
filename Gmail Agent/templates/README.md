# Gmail Agent Templates

This directory contains template files to help you set up your Gmail Agent quickly.

## Files

### 1. rules-template.csv
Sample rules to import into your Google Sheet "Rules" tab.

**Includes 5 example rules**:
1. Archive newsletters from specific sender
2. Archive all marketing emails by domain
3. Label invoices
4. Label meeting invitations (AI-based)
5. Label boss emails as priority

### 2. activity-log-template.csv
Empty template for "Activity Log" tab (just headers).

---

## How to Use

### Option A: Copy Data Manually
1. Open `rules-template.csv` in Excel or text editor
2. Copy the data (excluding header row if your sheet already has headers)
3. Paste into your Google Sheet "Rules" tab starting at row 2

### Option B: Import CSV
1. In Google Sheets, go to File → Import
2. Upload `rules-template.csv`
3. Choose "Replace data at selected cell"
4. Select cell A1 in "Rules" tab
5. Click "Import data"

---

## Customize Rules

After importing, customize the sample rules:

### Change Email Addresses:
- Replace `newsletters@site.com` with actual newsletter sender
- Replace `@marketing.com` with actual marketing domain
- Replace `boss@company.com` with your boss's email

### Adjust Priorities:
- 15-20: Critical (boss, VIPs)
- 10-14: High (invoices, important)
- 5-9: Medium (newsletters, categories)
- 1-4: Low (general filters)

### Add Your Own Rules:
Follow the format:
```
Rule ID: Auto-increments (use formula =ROW()-1)
Type: sender | domain | subject_contains | content_ai | complex
Pattern: Email address, domain, keywords, or description
Action Type: label | archive | delete | forward | mark_read | star
Action Details: label:LabelName or forward:email@example.com
Active: TRUE | FALSE
Priority: 1-20 (higher = more important)
```

---

## Quick Start

1. **Import templates** to Google Sheets
2. **Customize** sample rules with your data
3. **Import workflow** to n8n (see /workflows/SETUP.md)
4. **Test** with real emails
5. **Refine** rules based on results

---

**Tip**: Start with 3-5 simple rules and add more as you learn what works!
