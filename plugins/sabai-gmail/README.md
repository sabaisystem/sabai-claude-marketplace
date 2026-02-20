# Sabai Gmail

**Gmail assistant for email composition, inbox management, templates, and follow-up tracking.**

| Field | Value |
|-------|-------|
| Type | MCP Server + Skills + Commands |
| Version | 1.1.0 |
| Status | Active |
| Command | `/email`, `/reply`, `/inbox`, `/search` |
| Repo | `plugins/sabai-gmail` |

---

## Overview

A Gmail assistant plugin with a custom MCP server for full email operations. Features smart drafts with tone adjustment, contextual reply assistance, built-in email templates, email triage and prioritization, thread summarization, and multi-language support.

## Key Features

- Smart email drafts with appropriate tone
- Contextual reply assistance based on email threads
- 8 built-in email templates (intro, follow-up, thank-you, meeting-request, update, decline, referral, feedback)
- Inbox triage and prioritization
- Thread summarization
- Action item extraction
- Multi-language support

## Setup (Required)

This plugin requires Google OAuth credentials. One-time setup:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Name it something like "Gmail Plugin"

### Step 2: Enable Gmail API

1. Go to **APIs & Services > Library**
2. Search for "Gmail API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select **External** (or Internal for Google Workspace)
3. Fill in:
   - App name: "Gmail Plugin"
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. Skip scopes (click **Save and Continue**)
6. Add your email as a test user
7. Click **Save and Continue**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Desktop app**
4. Click **Create**
5. Click **Download JSON**

### Step 5: Install Credentials

1. Rename the downloaded file to `credentials.json`
2. Place it in:
   ```
   plugins/sabai-gmail/mcp/config/credentials.json
   ```

### Step 6: Authorize

```bash
cd plugins/sabai-gmail/mcp
npm install
npm run auth
```

A browser window will open. Sign in with your Google account and authorize.

## Use Cases

- "Draft an email to john@example.com about the project update"
- "Reply to this email with a professional tone"
- "Show my unread emails"
- "Search for emails from jane with attachments"
- "Archive this email"

## MCP Tools

| Tool | Description |
|------|-------------|
| `gmail_search` | Search emails with Gmail query syntax |
| `gmail_get_message` | Get full email content |
| `gmail_list_inbox` | List recent inbox emails |
| `gmail_send_email` | Send an email |
| `gmail_create_draft` | Create a draft |
| `gmail_reply` | Reply to an email thread |
| `gmail_list_labels` | List all labels |
| `gmail_add_labels` | Add labels to a message |
| `gmail_remove_labels` | Remove labels from a message |
| `gmail_archive` | Archive a message |
| `gmail_trash` | Move to trash |
| `gmail_mark_read` | Mark as read |
| `gmail_mark_unread` | Mark as unread |
| `gmail_star` | Star a message |
| `gmail_unstar` | Remove star |

## Commands

- `/email [recipient] [subject]` - Compose a new email
- `/reply [context]` - Draft a reply
- `/followup [email-ref]` - Create a follow-up
- `/inbox [filter]` - View and triage inbox
- `/search [query]` - Search emails
- `/template [name]` - Use an email template
- `/summarize [thread]` - Summarize a thread
- `/labels` - Manage labels
- `/meeting [context]` - Schedule via email

## Troubleshooting

### "Token expired" error
Run `npm run auth` again to re-authenticate.

### "Credentials not found" error
Ensure `credentials.json` is in `mcp/config/`.

### "Access blocked" error
Add your email as a test user in OAuth consent screen.

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-gmail)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-gmail/CHANGELOG.md)
