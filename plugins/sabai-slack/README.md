# Sabai Slack

**Full-featured Slack integration for messaging, channel management, and powerful search.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/slack send`, `/slack read`, `/slack-search` |
| Repo | `plugins/sabai-slack` |

---

## Overview

A comprehensive Slack integration plugin enabling seamless communication through messaging, channel management, and advanced search. Supports sending messages to channels and DMs, thread replies, conversation history reading with markdown, channel listing (public, private, DMs, group DMs), and message search by keyword, channel, user, or date.

## Key Features

- Send messages to channels and DMs
- Reply to threads
- Read conversation history with markdown support
- List all channels (public, private, DMs, group DMs)
- Search messages by keyword, channel, user, or date
- View channel details and member counts

## Use Cases

- "Send a message to #general saying good morning"
- "Read the last messages from #engineering"
- "Search for messages about the project deadline"
- "List all my Slack channels"

## Commands

- `/slack send #channel message` - Send a message to a channel
- `/slack read #channel` - Read recent messages from a channel
- `/slack channels` - List available channels
- `/slack reply` - Reply to a thread
- `/slack-search query` - Search messages with filters

## Configuration

### Environment Variables

- `SLACK_TOKEN` - Your Slack User OAuth Token (starts with `xoxp-`)

### MCP Server Setup

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "slack-mcp-server@latest", "--transport", "stdio"],
      "env": {
        "SLACK_MCP_XOXP_TOKEN": "${SLACK_TOKEN}",
        "SLACK_MCP_ADD_MESSAGE_TOOL": "true"
      }
    }
  }
}
```

## Authentication

Slack User OAuth Token required. Create a Slack App at [api.slack.com/apps](https://api.slack.com/apps) with these User Token Scopes:
- `channels:history`, `channels:read`
- `groups:history`, `groups:read`
- `im:history`, `im:read`
- `mpim:history`, `mpim:read`
- `chat:write`, `search:read`, `users:read`

## Dependencies

- **Required**: Slack MCP server, Slack OAuth Token

## Limitations

- Bot must be invited to private channels to access them
- Rate limits apply per Slack API guidelines

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-slack)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-slack/CHANGELOG.md)
