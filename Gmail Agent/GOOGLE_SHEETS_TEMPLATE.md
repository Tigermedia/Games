# Google Sheets Database Template

This document provides the complete schema for the Gmail Agent's Google Sheets database.

---

## Quick Setup

1. Create new Google Sheet
2. Name it: `Gmail Agent Database`
3. Create 3 tabs: `Rules`, `Activity Log`, `Statistics`
4. Copy column headers from below
5. Set up data validation and formulas
6. Add 3-5 sample rules
7. Share with your Gmail account
8. Copy Sheet ID from URL

**Sheet URL Format**: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

---

## Tab 1: Rules

### Column Headers (Row 1)

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Rule ID | Type | Pattern | Action Type | Action Details | Active | Priority | Created | Last Used | Use Count | Notes |

### Column Specifications

#### A: Rule ID
- **Type**: Number
- **Formula**: `=IF(ROW()=1,"Rule ID",ROW()-1)`
- **Purpose**: Auto-increment unique identifier
- **Format**: Number, no decimals

#### B: Type
- **Type**: Dropdown
- **Values**:
  - `sender`
  - `domain`
  - `subject_contains`
  - `subject_regex`
  - `content_ai`
  - `complex`
- **Data Validation**: List from range
- **Purpose**: Pattern matching method

#### C: Pattern
- **Type**: Text
- **Examples**:
  - For sender: `newsletters@site.com`
  - For domain: `@marketing.com`
  - For subject_contains: `invoice`
  - For content_ai: `meeting invitations`
  - For complex: `sender:boss@work.com AND subject:urgent`
- **Purpose**: The matching criteria

#### D: Action Type
- **Type**: Dropdown
- **Values**:
  - `label`
  - `archive`
  - `delete`
  - `forward`
  - `mark_read`
  - `mark_unread`
  - `star`
  - `label_archive` (combination)
  - `label_forward` (combination)
  - `label_mark_read` (combination)
- **Data Validation**: List from range
- **Purpose**: What action to perform

#### E: Action Details
- **Type**: Text
- **Format**: `key:value` or `key:value;key:value` for combinations
- **Examples**:
  - `label:Newsletters`
  - `forward:accounting@mycompany.com`
  - `label:Invoices;forward:accounting@mycompany.com`
- **Purpose**: Parameters for the action

#### F: Active
- **Type**: Checkbox
- **Default**: TRUE
- **Purpose**: Enable/disable rule without deleting

#### G: Priority
- **Type**: Number (1-20)
- **Default**: 10
- **Range**: 1 (lowest) to 20 (highest)
- **Purpose**: Rule execution order (higher first)

#### H: Created
- **Type**: Date
- **Formula**: `=IF(ROW()=1,"Created",IF(ISBLANK(B:B),"",TODAY()))`
- **Format**: YYYY-MM-DD
- **Purpose**: When rule was created

#### I: Last Used
- **Type**: Date
- **Format**: YYYY-MM-DD
- **Purpose**: Most recent match (updated by workflow)

#### J: Use Count
- **Type**: Number
- **Default**: 0
- **Purpose**: Times rule was triggered (updated by workflow)

#### K: Notes
- **Type**: Text
- **Purpose**: Human-readable description

### Data Validation Setup

1. **Column B (Type)**:
   - Data → Data validation
   - Criteria: List of items
   - Values: `sender,domain,subject_contains,subject_regex,content_ai,complex`
   - Show dropdown: Yes

2. **Column D (Action Type)**:
   - Data → Data validation
   - Criteria: List of items
   - Values: `label,archive,delete,forward,mark_read,mark_unread,star,label_archive,label_forward,label_mark_read`
   - Show dropdown: Yes

3. **Column F (Active)**:
   - Format → Number → More formats → Custom number format
   - Enter: `"TRUE";"FALSE"`

4. **Column G (Priority)**:
   - Data → Data validation
   - Criteria: Number between 1 and 20
   - Show validation help text: "1=lowest, 20=highest"

### Sample Data (Rows 2-6)

```
| 1 | sender | newsletters@site.com | label_archive | label:Newsletters | TRUE | 5 | 2025-01-13 | 2025-01-13 | 15 | Auto-archive newsletters |
| 2 | subject_contains | invoice | label_forward | label:Invoices;forward:accounting@me.com | TRUE | 10 | 2025-01-10 | 2025-01-13 | 8 | Forward invoices to accounting |
| 3 | domain | @marketing.com | archive | - | TRUE | 3 | 2025-01-11 | 2025-01-13 | 22 | Marketing spam |
| 4 | content_ai | meeting invitation | label | label:Meetings | TRUE | 7 | 2025-01-12 | 2025-01-13 | 3 | Calendar-related emails |
| 5 | complex | sender:boss@work.com AND subject:urgent | label_mark_unread | label:Priority | TRUE | 15 | 2025-01-09 | 2025-01-13 | 5 | Urgent from boss |
```

### Conditional Formatting (Optional)

1. **Priority Highlighting**:
   - Select column G
   - Format → Conditional formatting
   - Format cells if: Custom formula is `=$G2>=15`
   - Background color: Red (high priority)
   - Add another rule: `=$G2>=10` → Orange
   - Add another rule: `=$G2>=5` → Yellow

2. **Inactive Rules**:
   - Select row
   - Format → Conditional formatting
   - Format cells if: Custom formula is `=$F2=FALSE`
   - Text color: Gray

3. **Recently Used**:
   - Select column I
   - Format → Conditional formatting
   - Format cells if: Custom formula is `=$I2=TODAY()`
   - Background color: Light green

---

## Tab 2: Activity Log

### Column Headers (Row 1)

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Email ID | From | Subject | Rule ID | Action Taken | New Rule | Success | Error |

### Column Specifications

#### A: Timestamp
- **Type**: DateTime
- **Format**: YYYY-MM-DD HH:MM:SS
- **Purpose**: When email was processed

#### B: Email ID
- **Type**: Text
- **Purpose**: Gmail message ID (for reference)

#### C: From
- **Type**: Text
- **Purpose**: Sender email address

#### D: Subject
- **Type**: Text
- **Purpose**: Email subject line

#### E: Rule ID
- **Type**: Number
- **Purpose**: Which rule matched (blank if new/unknown)

#### F: Action Taken
- **Type**: Text
- **Purpose**: What action was performed

#### G: New Rule
- **Type**: Number
- **Purpose**: If new rule created, its ID (blank otherwise)

#### H: Success
- **Type**: Boolean
- **Purpose**: TRUE if successful, FALSE if error

#### I: Error
- **Type**: Text
- **Purpose**: Error message if failed (blank if success)

### Filter Views

Create these filter views:

1. **Today**:
   - Filter: Timestamp >= TODAY()
   - Sort: Timestamp DESC

2. **This Week**:
   - Filter: Timestamp >= TODAY()-7
   - Sort: Timestamp DESC

3. **Errors Only**:
   - Filter: Success = FALSE
   - Sort: Timestamp DESC

4. **New Rules Created**:
   - Filter: New Rule != blank
   - Sort: Timestamp DESC

### Sample Data (Rows 2-4)

```
| 2025-01-13 08:05:23 | msg_123abc | news@site.com | Daily Newsletter | 1 | Labeled+Archived | | TRUE | |
| 2025-01-13 08:06:45 | msg_124def | unknown@new.com | Check this out | | Asked Human | 6 | TRUE | |
| 2025-01-13 08:10:12 | msg_124def | unknown@new.com | Check this out | 6 | Archived | | TRUE | |
```

---

## Tab 3: Statistics

### Summary Metrics (Section A)

#### Row 1-10: Key Metrics

| A | B |
|---|---|
| **Metric** | **Value** |
| Total Emails Processed | `=COUNTA('Activity Log'!A:A)-1` |
| Emails Today | `=COUNTIF('Activity Log'!A:A,">="&TODAY())` |
| Emails This Week | `=COUNTIF('Activity Log'!A:A,">="&TODAY()-7)` |
| Rules Created Total | `=COUNTA(Rules!A:A)-1` |
| Active Rules | `=COUNTIF(Rules!F:F,TRUE)` |
| Rules Created This Week | `=COUNTIFS('Activity Log'!G:G,"<>",'Activity Log'!A:A,">="&TODAY()-7)` |
| Success Rate | `=COUNTIF('Activity Log'!H:H,TRUE)/(COUNTA('Activity Log'!H:H)-1)` |
| Error Rate | `=COUNTIF('Activity Log'!H:H,FALSE)/(COUNTA('Activity Log'!H:H)-1)` |
| Most Used Rule | `=INDEX(Rules!K:K,MATCH(MAX(Rules!J:J),Rules!J:J,0))` |
| Avg Emails/Day (Last 7 Days) | `=COUNTIF('Activity Log'!A:A,">="&TODAY()-7)/7` |

### Top Rules (Section C)

#### Row 1: Headers
| C | D | E | F |
|---|---|---|---|
| **Rule** | **Use Count** | **Last Used** | **Notes** |

#### Rows 2-11: Top 10 Rules Formula
```
=QUERY(Rules!A:K,"SELECT K, J, I, K WHERE J > 0 ORDER BY J DESC LIMIT 10",1)
```

### Charts

#### Chart 1: Action Type Distribution (Pie Chart)
- **Data Range**: Activity Log Column F
- **Chart Type**: Pie chart
- **Title**: "Actions Performed"
- **Legend**: Right side

#### Chart 2: Emails Processed Over Time (Line Chart)
- **Data Range**: Activity Log Column A (aggregated by date)
- **Chart Type**: Line chart
- **Title**: "Emails Processed Per Day"
- **X-axis**: Date
- **Y-axis**: Count

#### Chart 3: Top 10 Most Used Rules (Bar Chart)
- **Data Range**: Statistics Section C (Top Rules)
- **Chart Type**: Horizontal bar chart
- **Title**: "Most Frequently Used Rules"
- **X-axis**: Use Count
- **Y-axis**: Rule Name

---

## Sheet Formatting

### General Settings

1. **Freeze Rows**:
   - All tabs: Freeze row 1 (headers)

2. **Column Widths**:
   - Rules tab:
     - A: 80px, B: 150px, C: 200px, D: 150px, E: 200px
     - F: 70px, G: 80px, H: 100px, I: 100px, J: 90px, K: 250px
   - Activity Log:
     - A: 150px, B: 150px, C: 200px, D: 250px, E: 80px
     - F: 150px, G: 90px, H: 80px, I: 200px

3. **Header Row Formatting**:
   - Background: Dark gray (#434343)
   - Text: White, Bold
   - Alignment: Center

4. **Text Wrapping**:
   - Rules tab column K (Notes): Wrap
   - Activity Log columns D, F, I: Wrap

---

## Permissions & Sharing

### Setup Sharing

1. Click "Share" button
2. Add your Gmail account (the one running the agent)
3. Permission: **Editor**
4. Uncheck "Notify people"
5. Click "Done"

### For n8n OAuth

If using OAuth for Google Sheets:
1. Share sheet with OAuth account email
2. Permission: **Editor**
3. This allows n8n to read/write

---

## Import/Export

### Export Template (For Backup)

1. File → Download → Comma-separated values (.csv)
2. Download each tab separately
3. Store in secure location (not Git)

### Import Existing Rules

1. Prepare CSV with same columns
2. File → Import → Upload
3. Select "Replace data at selected cell"
4. Choose destination: Rules tab, cell A2

---

## Maintenance

### Weekly Tasks

- [ ] Review new rules created
- [ ] Delete or deactivate unused rules
- [ ] Check for duplicate rules
- [ ] Review error rate in Statistics

### Monthly Tasks

- [ ] Archive old Activity Log data (keep last 3 months)
- [ ] Export backup of Rules tab
- [ ] Review rule priorities
- [ ] Optimize slow or complex rules

### Data Retention

**Activity Log** gets large over time:
- Option 1: Keep last 90 days, archive rest
- Option 2: Create monthly backup sheets
- Option 3: Migrate to PostgreSQL when >10K rows

---

## Troubleshooting

### Issue: Rules Not Loading

**Symptoms**: n8n says "no rules found"
**Solutions**:
1. Check "Active" column is TRUE
2. Verify sheet is shared with n8n account
3. Check sheet name is exactly "Rules"
4. Verify OAuth credentials in n8n

### Issue: Activity Log Not Updating

**Symptoms**: No new entries in Activity Log
**Solutions**:
1. Check sheet is shared with Editor permission
2. Verify n8n workflow is running
3. Check for errors in n8n execution log
4. Verify sheet name is exactly "Activity Log"

### Issue: Formulas Not Working

**Symptoms**: #REF!, #NAME?, or #VALUE! errors
**Solutions**:
1. Check formula references correct sheet names
2. Verify data ranges are correct
3. Check for empty rows breaking formulas
4. Re-enter formulas manually if needed

---

## Advanced Features

### Multiple Accounts

To manage multiple Gmail accounts:
1. Create separate sheets for each account
2. Or add "Account" column to Rules and Activity Log
3. Filter by account in n8n workflow

### Rule Testing

Add "Test Mode" column:
- Rules with Test Mode = TRUE log but don't execute
- Useful for testing new rules without affecting emails

### Rule Versioning

Add "Version" and "Updated" columns:
- Track when rules change
- Keep history of rule modifications

---

## Quick Reference

### Rule Type Examples

```
sender          → newsletters@site.com
domain          → @marketing.com
subject_contains → invoice, receipt, payment
subject_regex   → ^RE:.*urgent.*$
content_ai      → meeting invitation, calendar event
complex         → sender:X AND subject:Y
```

### Action Details Format

```
label → label:LabelName
forward → forward:email@example.com
combo → label:Label1;forward:email@example.com
```

### Formulas Quick Copy

**Rule ID**: `=IF(ROW()=1,"Rule ID",ROW()-1)`
**Created Date**: `=IF(ROW()=1,"Created",IF(ISBLANK(B:B),"",TODAY()))`
**Total Processed**: `=COUNTA('Activity Log'!A:A)-1`
**Success Rate**: `=COUNTIF('Activity Log'!H:H,TRUE)/(COUNTA('Activity Log'!H:H)-1)`

---

**Last Updated**: 2025-01-13
**Template Version**: 1.0
