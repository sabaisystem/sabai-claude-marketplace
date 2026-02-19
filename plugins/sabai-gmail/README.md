# Sabai Gmail

**Gmail assistant for email composition, inbox management, templates, and follow-up tracking.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands |
| Version | 1.4.0 |
| Status | Active |
| Command | `/email`, `/reply`, `/inbox`, `/template`, `/followup` |
| Repo | `plugins/sabai-gmail` |

---

## Overview

A Gmail assistant plugin for email composition, inbox management, templates, and follow-up tracking. Features AI-powered smart draft generation, contextual reply assistance, built-in email templates, email triage and prioritization, thread summarization, and multi-language support.

## Key Features

- **Smart Draft Generation** - AI-powered contextual email replies that analyze thread history
- **Automatic Tone Matching** - Detects and matches the sender's communication style
- **Question/Request Detection** - Identifies and addresses all points in received emails
- Contextual reply assistance based on email threads
- 8 built-in email templates (intro, follow-up, thank-you, meeting-request, update, decline, referral, feedback)
- Inbox triage and prioritization
- Thread summarization
- Action item extraction
- Multi-language support

## Use Cases

- "Draft an email to john@example.com about the project update"
- "Reply to this email with a professional tone accepting their proposal"
- "Summarize the marketing campaign email thread"
- "Use the meeting-request template"

## Commands

- `/email [recipient] [subject]` - Compose a new email
- `/reply [context]` - Draft a reply to an email
- `/followup [email-ref]` - Create a follow-up email
- `/inbox [filter]` - View and triage inbox
- `/search [query]` - Search emails with advanced filters
- `/template [name]` - Use an email template
- `/summarize [thread]` - Summarize an email thread

## Configuration

### MCP Server Setup

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@anthropic/gmail-mcp@latest"]
    }
  }
}
```

## Authentication

OAuth via Google. Browser opens for sign-in on first use.

## Permissions

Required Claude Code permissions:
- Gmail MCP tools for email operations

## Dependencies

- **Required**: Gmail MCP server (`@anthropic/gmail-mcp`)
- **Optional**: Google Calendar MCP (for meeting scheduling)

## Limitations

- Requires Google account with Gmail
- OAuth consent required on first use

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-gmail)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-gmail/CHANGELOG.md)
