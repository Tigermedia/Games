# API Configuration Guide

Complete setup instructions for all external services required by the Gmail Agent.

---

## Table of Contents
1. [Google Cloud Setup](#google-cloud-setup)
2. [Gmail API](#gmail-api)
3. [Google Sheets API](#google-sheets-api)
4. [AI API (OpenAI or Anthropic)](#ai-api)
5. [n8n Credentials](#n8n-credentials)
6. [Testing Connections](#testing-connections)

---

## Google Cloud Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `Gmail Agent`
4. Click "Create"
5. Wait for project creation (30-60 seconds)
6. **Note your Project ID** (e.g., `gmail-agent-123456`)

### Step 2: Enable Billing (Required)

1. In Google Cloud Console, go to "Billing"
2. Link billing account (or create new)
3. **Note**: Gmail and Sheets APIs are free within quotas
4. No charges expected for this project

---

## Gmail API

### Step 1: Enable Gmail API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click "Gmail API"
4. Click "Enable"
5. Wait 30 seconds for activation

### Step 2: Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `Gmail Agent`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add these scopes:
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.labels`
   - Test users: Add your Gmail address
   - Click "Save and Continue"
4. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: `Gmail Agent n8n`
   - Authorized redirect URIs:
     - Add your n8n OAuth callback URL
     - Format: `https://YOUR-N8N-INSTANCE/rest/oauth2-credential/callback`
     - Example: `https://app.n8n.cloud/rest/oauth2-credential/callback`
5. Click "Create"
6. **Download JSON** → Save as `gmail-oauth-credentials.json`
7. **Important**: Keep Client ID and Client Secret safe

**Credentials Format**:
```json
{
  "client_id": "123456789-abcdefg.apps.googleusercontent.com",
  "client_secret": "GOCSPX-abcd1234efgh5678",
  "redirect_uris": ["https://your-n8n/rest/oauth2-credential/callback"]
}
```

### Step 3: Set Up Test Users (During Development)

1. Go to "APIs & Services" → "OAuth consent screen"
2. Under "Test users", click "Add Users"
3. Add your Gmail address
4. Click "Save"

**Note**: While app is in "Testing" mode, only test users can authenticate.

### Step 4: Request Verification (Production)

**Skip this for now** - Only needed when going public.

For personal use, keep app in "Testing" mode.

---

## Google Sheets API

### Step 1: Enable Google Sheets API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click "Google Sheets API"
4. Click "Enable"

### Step 2: Use Same OAuth2 Credentials

**Good news**: Same credentials work for both Gmail and Sheets!

1. No additional credentials needed
2. Just add Sheets scope if not already present:
   - `https://www.googleapis.com/auth/spreadsheets`

### Step 3: Configure Scopes

If you need to add scopes:
1. Go to "APIs & Services" → "OAuth consent screen"
2. Click "Edit App"
3. In "Scopes" section, add:
   - `.../auth/spreadsheets` (Read/write sheets)
4. Click "Save and Continue"

---

## AI API

Choose **ONE** of these options:

### Option A: OpenAI (GPT-4)

**Cost**: ~$15-45/month for 50-200 emails/day

#### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Verify email address

#### Step 2: Add Payment Method

1. Go to "Billing" → "Payment methods"
2. Add credit card
3. Set up usage limits:
   - Soft limit: $50/month
   - Hard limit: $100/month (safety)

#### Step 3: Generate API Key

1. Go to "API keys"
2. Click "Create new secret key"
3. Name: `Gmail Agent`
4. Copy key: `sk-proj-abcd1234efgh5678...`
5. **Important**: Save immediately (can't view again)

#### Step 4: Test API Key

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Expected Response**: JSON with `choices` array.

---

### Option B: Anthropic (Claude) - Recommended for Cost

**Cost**: ~$7.50-22.50/month for 50-200 emails/day (50-70% cheaper)

#### Step 1: Create Anthropic Account

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up with email
3. Verify email

#### Step 2: Add Credits

1. Go to "Billing"
2. Add payment method
3. Purchase credits: $50 minimum
4. Set up usage notifications: Alert at $25 spent

#### Step 3: Generate API Key

1. Go to "API Keys"
2. Click "Create Key"
3. Name: `Gmail Agent`
4. Copy key: `sk-ant-api03-abcd1234...`
5. **Important**: Save immediately

#### Step 4: Test API Key

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Expected Response**: JSON with `content` array.

---

## n8n Credentials

### Prerequisites

- n8n instance running (cloud or self-hosted)
- All API credentials from above

### Step 1: Add Gmail OAuth2 Credential

1. In n8n, go to "Credentials" → "New"
2. Search "Gmail OAuth2 API"
3. Enter:
   - **Credential Name**: `Gmail - Main Account`
   - **Client ID**: (from Google Cloud)
   - **Client Secret**: (from Google Cloud)
   - **Scope**: Leave default or add custom scopes
4. Click "Connect my account"
5. Sign in with your Gmail account
6. Grant permissions
7. Verify "Connected" status
8. Click "Save"

### Step 2: Add Google Sheets OAuth2 Credential

**Option A: Reuse Gmail Credential**
- If you added Sheets scope to Gmail OAuth, just select same credential in Sheets nodes

**Option B: Create Separate Credential**
1. In n8n, go to "Credentials" → "New"
2. Search "Google Sheets OAuth2 API"
3. Enter same Client ID and Client Secret
4. Click "Connect my account"
5. Grant permissions
6. Click "Save"

### Step 3: Add AI API Credential

#### For OpenAI:

1. In n8n, go to "Credentials" → "New"
2. Search "OpenAI API"
3. Enter:
   - **Credential Name**: `OpenAI - GPT-4`
   - **API Key**: `sk-proj-...`
4. Click "Save"

#### For Anthropic:

1. In n8n, go to "Credentials" → "New"
2. Search "Anthropic API"
3. Enter:
   - **Credential Name**: `Anthropic - Claude`
   - **API Key**: `sk-ant-api03-...`
4. Click "Save"

---

## Testing Connections

### Test Gmail Connection

1. Create new n8n workflow
2. Add "Gmail" node
3. Select credential
4. Operation: "Get Many"
5. Max Results: 5
6. Click "Execute Node"
7. **Expected**: List of 5 recent emails
8. **If error**: Check OAuth scopes and re-authenticate

### Test Google Sheets Connection

1. Create test Google Sheet
2. In n8n, add "Google Sheets" node
3. Select credential
4. Operation: "Read"
5. Sheet ID: (from test sheet URL)
6. Range: "A1:A10"
7. Click "Execute Node"
8. **Expected**: Data from sheet
9. **If error**: Check sharing permissions and scopes

### Test AI API Connection

#### For OpenAI:

1. In n8n, add "OpenAI Chat Model" node (in LangChain section)
2. Select credential
3. Model: "gpt-4"
4. Add "AI Agent" node
5. Connect Chat Model
6. Test prompt: "Say hello"
7. Click "Execute Node"
8. **Expected**: "Hello!" response
9. **If error**: Check API key and billing

#### For Anthropic:

1. In n8n, add "Claude Chat Model" node (in LangChain section)
2. Select credential
3. Model: "claude-3-5-sonnet-20241022"
4. Add "AI Agent" node
5. Connect Chat Model
6. Test prompt: "Say hello"
7. Click "Execute Node"
8. **Expected**: "Hello!" response
9. **If error**: Check API key and credits

---

## Security Best Practices

### API Keys

- ✅ **DO**: Store in n8n credential manager
- ✅ **DO**: Use environment variables for self-hosted
- ✅ **DO**: Rotate keys every 90 days
- ✅ **DO**: Set up usage alerts
- ❌ **DON'T**: Commit to Git
- ❌ **DON'T**: Share in screenshots
- ❌ **DON'T**: Hardcode in workflows

### OAuth2

- ✅ **DO**: Use OAuth2 over API keys when possible
- ✅ **DO**: Review granted scopes periodically
- ✅ **DO**: Revoke access for unused apps
- ❌ **DON'T**: Share OAuth tokens
- ❌ **DON'T**: Use personal account for production

### Google Cloud

- ✅ **DO**: Keep app in "Testing" mode for personal use
- ✅ **DO**: Limit test users to yourself
- ✅ **DO**: Enable 2FA on Google account
- ❌ **DON'T**: Publish app unless necessary

---

## Troubleshooting

### Gmail API Errors

**Error**: `insufficient_permissions`
- **Solution**: Add missing scope, re-authenticate

**Error**: `invalid_grant`
- **Solution**: Re-authenticate, token may be expired

**Error**: `Daily limit exceeded`
- **Solution**: Request quota increase in Google Cloud Console

### Google Sheets Errors

**Error**: `Unable to parse range`
- **Solution**: Check sheet name and range format (e.g., "Sheet1!A1:Z100")

**Error**: `The caller does not have permission`
- **Solution**: Share sheet with OAuth account email

### OpenAI Errors

**Error**: `invalid_api_key`
- **Solution**: Check API key, may be revoked

**Error**: `insufficient_quota`
- **Solution**: Add payment method or increase billing limit

**Error**: `rate_limit_exceeded`
- **Solution**: Slow down requests, upgrade plan

### Anthropic Errors

**Error**: `invalid_x-api-key`
- **Solution**: Check API key format (must start with `sk-ant-api03-`)

**Error**: `credit_balance_too_low`
- **Solution**: Add more credits

---

## API Quotas & Limits

### Gmail API
- **Read quota**: 1 billion queries/day (more than enough)
- **Send quota**: 100 emails/day (for new accounts), 2000/day (for established)
- **Rate limit**: 250 queries per user per second

**If you need more**: Request quota increase in Google Cloud Console

### Google Sheets API
- **Read/write quota**: 300 requests/minute per project
- **This project needs**: ~100-200 requests/day
- **Conclusion**: Well within limits

### OpenAI API
- **GPT-4**: Rate limit varies by tier
- **Tier 1** (new): 500 RPM, 10,000 TPM
- **This project needs**: ~50-200 requests/day
- **Conclusion**: Sufficient for personal use

### Anthropic API
- **Claude 3.5 Sonnet**: Rate limit varies by tier
- **Tier 1** (new): 50 requests/minute
- **This project needs**: ~50-200 requests/day
- **Conclusion**: Sufficient

---

## Cost Monitoring

### Google Cloud

1. Go to "Billing" → "Reports"
2. Filter by service: Gmail API, Sheets API
3. Expected cost: **$0** (within free tier)

### OpenAI

1. Go to "Usage" in OpenAI dashboard
2. View daily costs
3. Expected: $0.50-$1.50/day for 50-200 emails
4. Set up email alerts at $25 spent

### Anthropic

1. Go to "Billing" → "Usage" in Anthropic console
2. View credit usage
3. Expected: $0.25-$0.75/day for 50-200 emails
4. Set up alerts at 50% credit used

---

## Quick Reference

### Gmail OAuth2 Scopes
```
https://www.googleapis.com/auth/gmail.modify
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/gmail.labels
```

### Google Sheets OAuth2 Scopes
```
https://www.googleapis.com/auth/spreadsheets
```

### n8n OAuth Callback URL Format
```
https://YOUR-N8N-INSTANCE/rest/oauth2-credential/callback
```

### API Endpoint URLs
- **Gmail API**: `https://gmail.googleapis.com/gmail/v1/`
- **Google Sheets API**: `https://sheets.googleapis.com/v4/`
- **OpenAI API**: `https://api.openai.com/v1/`
- **Anthropic API**: `https://api.anthropic.com/v1/`

---

**Last Updated**: 2025-01-13
**Status**: Ready for setup
