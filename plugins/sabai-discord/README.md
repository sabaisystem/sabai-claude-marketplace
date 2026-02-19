# Sabai Discord

**Discord assistant for server management, messaging, channel organization, and community engagement.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/discord-send`, `/discord-read`, `/discord-dm` |
| Repo | `plugins/sabai-discord` |

---

## Overview

A Discord assistant plugin for server management, messaging, channel organization, and community engagement. Supports sending, reading, editing, and deleting messages, emoji reactions, direct messaging, server administration (user lookup, channel management, role creation), and webhook setup.

## Key Features

- Send and read messages in any channel
- Direct messaging to users
- Emoji reactions
- Channel creation and management
- Role creation and assignment
- Webhook integration
- Server information lookup

## Use Cases

- "Send a message to the general channel"
- "Read the last 10 messages from announcements"
- "Create a new channel called project-updates"
- "Assign the moderator role to @sarah"

## Commands

- `/discord-send [channel] [message]` - Send a message to a channel
- `/discord-read [channel]` - Read recent messages from a channel
- `/discord-dm [user] [message]` - Send a direct message
- `/discord-react [message-id] [emoji]` - React to a message
- `/discord-server` - Get server information
- `/discord-channels` - List all channels
- `/discord-channel-create [name]` - Create a new channel
- `/discord-role-create [name]` - Create a new role
- `/discord-role-assign [user] [role]` - Assign a role to a user

## Configuration

### Environment Variables

- `DISCORD_TOKEN` - Your Discord bot token

### MCP Server Setup

```json
{
  "mcpServers": {
    "discord-mcp": {
      "command": "npx",
      "args": ["-y", "discord-mcp@latest"],
      "env": {
        "DISCORD_TOKEN": "${DISCORD_TOKEN}"
      }
    }
  }
}
```

## Authentication

Discord Bot Token required. Create a bot at [Discord Developer Portal](https://discord.com/developers/applications).

## Permissions

Bot permissions required:
- Send Messages
- Read Message History
- Manage Messages
- Add Reactions
- Manage Channels
- Manage Roles
- Manage Webhooks

## Dependencies

- **Required**: Discord MCP server, Discord Bot Token

## Limitations

- Bot must be invited to server with proper permissions
- Some actions require administrator privileges

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-discord)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-discord/CHANGELOG.md)
