# Sabai DocuSign

**DocuSign e-signature assistant for agreement management, status tracking, and contract summaries with multi-account support.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.0.0 |
| Status | Beta |
| Commands | `/docusign-status`, `/docusign-summary` |
| Repo | `plugins/sabai-docusign` |

---

## Overview

Manage your DocuSign agreements directly from Claude. Check signing statuses, get plain-language contract summaries for pre-meeting prep, and switch between multiple DocuSign accounts without re-authenticating. Uses JWT Grant authentication for secure, automated token management.

## Key Features

- Multi-account support — connect multiple DocuSign accounts and switch instantly
- Agreement status dashboard — see all pending, completed, and declined envelopes
- Plain-language summaries — get quick contract briefs without reading the full document
- JWT Grant authentication — secure, no-browser token refresh after one-time setup

## Use Cases

- "Check my DocuSign agreements"
- "What contracts are pending signatures?"
- "Summarize the Acme Corp NDA before my meeting"
- "Switch to my personal DocuSign account"

## Commands

- `/docusign-status [filter]` — Check agreement statuses. Filter by `pending`, `completed`, or search by name.
- `/docusign-summary <name or ID>` — Plain-language agreement summary for pre-meeting prep.

## MCP Tools

- `docusign_list_accounts` — List configured account profiles
- `docusign_switch_account` — Switch active account
- `docusign_add_account` — Add a new account profile
- `docusign_remove_account` — Remove a saved profile
- `docusign_get_user_info` — Get authenticated user info
- `docusign_list_envelopes` — List envelopes with filters (status, date, search)
- `docusign_get_envelope` — Get full envelope details
- `docusign_get_documents` — List documents in an envelope
- `docusign_get_recipients` — Get recipient signing status

---

## Setup Guide

This plugin uses **JWT Grant authentication** instead of the CoWork connector. This lets you connect multiple DocuSign accounts from a single Claude workspace.

### Prerequisites

- A [DocuSign developer account](https://developers.docusign.com/) (free) or a production DocuSign account
- Node.js 18+

### Step 1: Create an Integration Key

1. Sign in to the **DocuSign Developer Console**:
   - Demo: https://admindemo.docusign.com/
   - Production: https://admin.docusign.com/
2. Navigate to **Settings** > **Apps and Keys**
3. Click **Add App and Integration Key**
4. Give it a name (e.g., `Claude DocuSign Plugin`)
5. Copy the **Integration Key** (this is a GUID like `a1b2c3d4-e5f6-...`) — you'll need it later

### Step 2: Generate an RSA Keypair

On the same page (Apps and Keys > your app):

1. Scroll down to **RSA Keypairs**
2. Click **Add RSA Keypair**
3. DocuSign will show you the **public key** and **private key**
4. **Copy the private key** immediately — DocuSign only shows it once
5. Save the private key to a file on your machine:
   ```bash
   mkdir -p ~/.docusign
   # Paste the private key into this file
   nano ~/.docusign/private.pem
   ```
   The file should look like:
   ```
   -----BEGIN RSA PRIVATE KEY-----
   MIIEowIBAAKCAQEA...
   ...many lines of base64...
   -----END RSA PRIVATE KEY-----
   ```

### Step 3: Find Your User ID and Account ID

Still on the **Apps and Keys** page:

1. **User ID**: Shown at the top of the page under **My Account Information** > **API Account ID**. It's a GUID like `12345678-abcd-...`
2. **Account ID**: Also shown under **My Account Information** > **Account ID**. This may be a GUID or a short numeric ID depending on your account type.

> **Tip**: In the demo environment, the Account ID is typically the API Account ID (GUID). In production, it may differ.

### Step 4: Add a Redirect URI

On the same page, under your Integration Key:

1. Scroll to **Additional settings** > **Redirect URIs**
2. Click **Add URI**
3. Enter: `https://localhost/callback`
4. Click **Save**

This URI is only used for the one-time consent step — the plugin doesn't run a web server.

### Step 5: Grant Consent (one-time)

Open this URL in your browser (replace `YOUR_INTEGRATION_KEY` with the actual value):

**Demo environment:**
```
https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=YOUR_INTEGRATION_KEY&redirect_uri=https://localhost/callback
```

**Production environment:**
```
https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=YOUR_INTEGRATION_KEY&redirect_uri=https://localhost/callback
```

What happens:
1. DocuSign asks you to sign in (if not already)
2. You see a consent screen — click **Allow Access**
3. The browser redirects to `https://localhost/callback?code=...` — this will show an error page (that's expected)
4. Consent is now granted. You never need to do this again for this Integration Key.

> **For organization admins**: If you're an admin, you can grant consent on behalf of all users in your organization by adding `&admin_consent_scope=impersonation` to the URL.

### Step 6: Configure the Plugin

You have two options:

#### Option A: Environment Variables (single account)

Set these in your shell or in `mcp/config/.env`:

```bash
export DOCUSIGN_INTEGRATION_KEY="a1b2c3d4-e5f6-..."
export DOCUSIGN_USER_ID="12345678-abcd-..."
export DOCUSIGN_ACCOUNT_ID="87654321-wxyz-..."
export DOCUSIGN_PRIVATE_KEY_PATH="$HOME/.docusign/private.pem"
export DOCUSIGN_ENVIRONMENT="demo"   # or "production"
```

#### Option B: Add Account via Claude (multi-account)

Ask Claude to add an account using the MCP tool:

> "Add my DocuSign account named 'acme-corp' with integration key a1b2c3d4..., user ID 12345678..., account ID 87654321..., private key at ~/.docusign/acme-private.pem, environment demo"

Claude will call `docusign_add_account` and save the profile. You can add as many accounts as you need and switch between them:

> "Switch to my personal DocuSign account"

### Step 7: Verify the Connection

Ask Claude:

> "Get my DocuSign user info"

If setup is correct, Claude will return your name, email, and account details. If you see a "consent_required" error, revisit Step 5.

---

## How It Works

### Authentication Flow

```
You (one-time setup)          Plugin (automatic)
─────────────────────         ──────────────────
1. Create Integration Key
2. Generate RSA keypair
3. Grant consent in browser
                              4. Build JWT with private key
                              5. Exchange JWT → access token (1 hour)
                              6. Use token for API calls
                              7. Auto-refresh when expired
                              (steps 4-7 repeat forever, no user action needed)
```

### Multi-Account Architecture

Each DocuSign account is stored as a separate profile:

```
mcp/config/accounts/
  acme-corp.json       → Integration Key + User ID for Acme Corp
  personal.json        → Integration Key + User ID for personal account
  client-xyz.json      → Integration Key + User ID for Client XYZ
```

Switching accounts clears the token cache and loads new credentials. All subsequent API calls use the new account.

---

## Permissions

Required Claude Code permissions:
- `Bash(command:node)` — Running the MCP server
- Network access to `account-d.docusign.com` and `demo.docusign.net` (demo) or `account.docusign.com` and `na1.docusign.net` (production)

## Dependencies

- **Required**: Node.js 18+
- **Required**: DocuSign account with Integration Key and RSA keypair
- **No external MCP servers**: Uses DocuSign REST API directly via JWT Grant

## Limitations

- Read-only: cannot create or send envelopes (planned for future)
- Cannot download document PDFs (planned for future)
- JWT tokens expire every hour (auto-refreshed transparently)
- One-time browser consent required per Integration Key
- Production accounts may require admin approval for the Integration Key

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "consent_required" error | Visit the consent URL from Step 5 in your browser |
| "RSA private key not found" | Check the `privateKeyPath` points to a valid `.pem` file |
| "DocuSign auth failed: 400" | Verify your Integration Key and User ID are correct |
| No envelopes returned | Try widening the date range — default is last 30 days |
| Wrong account data | Use `docusign_list_accounts` to check which account is active |

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-docusign)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-docusign/CHANGELOG.md)
- [DocuSign Developer Portal](https://developers.docusign.com/)
- [JWT Grant Authentication](https://developers.docusign.com/platform/auth/jwt/)
