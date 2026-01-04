# Gmail Agent - Label Structure

**Version**: 2.0
**Style**: Emoji prefixes with nested hierarchy

---

## Label Hierarchy

### System Labels (Required)

| Label | Purpose |
|-------|---------|
| `✅ Processed` | Marks emails handled by the agent |
| `📥 To Review` | AI uncertain - needs manual review |

---

### Primary Categories

```
📥 To Review          ← AI confidence < 80%

💼 Work
  ├── 💼 Work/Clients
  ├── 💼 Work/Team
  ├── 💼 Work/Projects
  └── 💼 Work/Invoices

👤 Personal
  ├── 👤 Personal/Family
  ├── 👤 Personal/Friends
  └── 👤 Personal/Health

📰 Newsletters
  ├── 📰 Newsletters/Tech
  ├── 📰 Newsletters/Business
  └── 📰 Newsletters/Other

🔔 Notifications
  ├── 🔔 Notifications/Social
  ├── 🔔 Notifications/Security
  ├── 🔔 Notifications/Apps
  └── 🔔 Notifications/Banking

🛒 Shopping
  ├── 🛒 Shopping/Orders
  ├── 🛒 Shopping/Shipping
  └── 🛒 Shopping/Returns

💰 Finance
  ├── 💰 Finance/Invoices
  ├── 💰 Finance/Receipts
  ├── 💰 Finance/Banking
  └── 💰 Finance/Payments

📅 Calendar
  ├── 📅 Calendar/Meetings
  └── 📅 Calendar/Events

⬇️ Low Priority
  ├── ⬇️ Low Priority/Promotions
  └── ⬇️ Low Priority/Bulk
```

---

## Label Details

### 📥 To Review
- **When applied**: AI confidence < 80%
- **Action**: Also sends decision email to user
- **User action**: Click email button OR manually review

### 💼 Work
- **Patterns**: Company domains, business keywords, invoices
- **Sub-labels**:
  - **Clients**: External business contacts
  - **Team**: Internal colleagues, managers
  - **Projects**: Project-specific emails
  - **Invoices**: Bills, quotes, purchase orders

### 👤 Personal
- **Patterns**: Known personal contacts, personal services
- **Sub-labels**:
  - **Family**: Family members (by contact)
  - **Friends**: Personal contacts
  - **Health**: Medical, fitness, healthcare

### 📰 Newsletters
- **Patterns**: "unsubscribe", newsletter domains, mailing lists
- **Sub-labels**:
  - **Tech**: Technology news, dev newsletters
  - **Business**: Business/finance newsletters
  - **Other**: Misc subscriptions

### 🔔 Notifications
- **Patterns**: "notification", "alert", no-reply addresses
- **Sub-labels**:
  - **Social**: Facebook, LinkedIn, Twitter, Instagram
  - **Security**: Login alerts, password changes, 2FA
  - **Apps**: SaaS notifications, app updates
  - **Banking**: Bank alerts, transaction notices

### 🛒 Shopping
- **Patterns**: Order confirmations, shipping updates, retailers
- **Sub-labels**:
  - **Orders**: Order confirmations, receipts
  - **Shipping**: Tracking, delivery updates
  - **Returns**: Return confirmations, refunds

### 💰 Finance
- **Patterns**: Invoice, payment, receipt, banking domains
- **Sub-labels**:
  - **Invoices**: Bills to pay
  - **Receipts**: Payment confirmations
  - **Banking**: Bank statements, alerts
  - **Payments**: PayPal, Stripe, payment processors

### 📅 Calendar
- **Patterns**: .ics attachments, "invite", calendar domains
- **Sub-labels**:
  - **Meetings**: Meeting invites, Zoom/Teams/Meet
  - **Events**: Event invitations, RSVPs

### ⬇️ Low Priority
- **Patterns**: Promotional content, bulk marketing
- **Sub-labels**:
  - **Promotions**: Sales, discounts, marketing
  - **Bulk**: Mass emails, less important

---

## Gmail Setup Instructions

### Create Labels in Gmail

1. Open Gmail → Settings (gear icon) → See all settings
2. Go to "Labels" tab
3. Click "Create new label" for each:

**Create in this order** (parents first):

```
1. ✅ Processed
2. 📥 To Review
3. 💼 Work
4. 💼 Work/Clients        (nest under "💼 Work")
5. 💼 Work/Team           (nest under "💼 Work")
6. �� Work/Projects       (nest under "💼 Work")
7. 💼 Work/Invoices       (nest under "💼 Work")
8. 👤 Personal
9. 👤 Personal/Family     (nest under "👤 Personal")
10. 👤 Personal/Friends   (nest under "👤 Personal")
11. 👤 Personal/Health    (nest under "👤 Personal")
... (continue for all labels)
```

### Quick Copy-Paste List

```
✅ Processed
📥 To Review
💼 Work
👤 Personal
📰 Newsletters
🔔 Notifications
🛒 Shopping
💰 Finance
📅 Calendar
⬇️ Low Priority
```

**Sub-labels** (create after parents):
```
💼 Work/Clients
💼 Work/Team
💼 Work/Projects
💼 Work/Invoices
👤 Personal/Family
👤 Personal/Friends
👤 Personal/Health
📰 Newsletters/Tech
📰 Newsletters/Business
📰 Newsletters/Other
🔔 Notifications/Social
🔔 Notifications/Security
🔔 Notifications/Apps
🔔 Notifications/Banking
🛒 Shopping/Orders
🛒 Shopping/Shipping
🛒 Shopping/Returns
💰 Finance/Invoices
💰 Finance/Receipts
💰 Finance/Banking
💰 Finance/Payments
📅 Calendar/Meetings
📅 Calendar/Events
⬇️ Low Priority/Promotions
⬇️ Low Priority/Bulk
```

---

## Label ID Mapping

After creating labels in Gmail, you'll need their IDs for the n8n workflow.

**How to get Label IDs**:
1. In n8n, add a Gmail node
2. Set operation to "Get Many Labels"
3. Execute and copy the label IDs

**Example mapping** (yours will differ):
```json
{
  "✅ Processed": "Label_1234567890",
  "📥 To Review": "Label_0987654321",
  "💼 Work": "Label_1111111111",
  "💼 Work/Clients": "Label_2222222222",
  ...
}
```

---

## AI Label Assignment Rules

The AI will use these guidelines:

### High Confidence Patterns (≥90%)

| Pattern | Label |
|---------|-------|
| From: `*@company.com` (your company) | 💼 Work/Team |
| Subject contains "invoice" + attachment | 💰 Finance/Invoices |
| From: `*@amazon.com` + "shipped" | 🛒 Shopping/Shipping |
| Contains "unsubscribe" link | 📰 Newsletters |
| From: `noreply@*` | 🔔 Notifications |
| .ics attachment | 📅 Calendar |

### Medium Confidence Patterns (80-89%)

| Pattern | Label |
|---------|-------|
| Business tone + unknown sender | 💼 Work |
| Personal tone + unknown sender | 👤 Personal |
| Marketing content | ⬇️ Low Priority/Promotions |

### Low Confidence (<80%)

| Behavior |
|----------|
| Apply "📥 To Review" label |
| Apply best-guess primary label |
| Send decision email to user |

---

## Customization

### Adding New Labels

1. Create label in Gmail
2. Get label ID from Gmail API
3. Add to Google Sheets "Rules" tab
4. AI will learn to use it

### Removing Labels

1. Update rules in Google Sheets to use different label
2. Optionally delete from Gmail

### Renaming Labels

1. Rename in Gmail (keeps same ID)
2. Update display names in documentation

---

**Created**: 2025-01-XX
**For**: Gmail Agent v2.0
