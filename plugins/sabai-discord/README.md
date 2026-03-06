# Sabai Discord

**Discord assistant for server management, messaging, channel organization, and community engagement.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.5.0 |
| Status | Active |
| Command | `/discord-send`, `/discord-read`, `/discord-dm` |
| Repo | `plugins/sabai-discord` |

---

## Overview

A Discord assistant plugin for server management, messaging, channel organization, and community engagement. Supports sending, reading, editing, and deleting messages, emoji reactions, direct messaging, server administration (user lookup, channel management), and category management.

## Key Features

- Send and read messages in any channel
- Direct messaging to users
- Emoji reactions
- Channel and category management
- Server information lookup
- Edit and delete messages

## Use Cases

- "Send a message to the general channel"
- "Read the last 10 messages from announcements"
- "Create a new channel called project-updates"
- "DM @sarah about the meeting"

## Commands

- `/discord-send [channel] [message]` - Send a message to a channel
- `/discord-read [channel]` - Read recent messages from a channel
- `/discord-dm [user] [message]` - Send a direct message
- `/discord-react [message-id] [emoji]` - React to a message
- `/discord-server` - Get server information
- `/discord-channels` - List all channels
- `/discord-channel-create [name]` - Create a new channel
- `/discord-user [username]` - Look up a user

## Configuration

### Environment Variables

- `DISCORD_TOKEN` - Your Discord bot token

### Token Setup

**Option A: Environment variable**
```bash
export DISCORD_TOKEN=your-bot-token-here
```

**Option B: Config file** (recommended for Cowork)
Create `mcp/config/.env`:
```
DISCORD_TOKEN=your-bot-token-here
```

## Authentication

Discord Bot Token required. See the [Bot Setup Guide](#bot-setup-guide) below.

## Permissions

Bot permissions required:
- Send Messages
- Read Message History
- Manage Messages
- Add Reactions
- Manage Channels

## Dependencies

- **Required**: Discord Bot Token

## Limitations

- Bot must be invited to server with proper permissions
- Some actions require administrator privileges
- Bot token must be created manually via Discord Developer Portal (no OAuth shortcut)

---

## Bot Setup Guide

Setting up a Discord bot requires creating an application on Discord's Developer Portal, generating a token, and inviting the bot to your server. This process takes approximately 15-30 minutes.

### Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Name it (e.g., "My Claude Bot")
4. Accept the Terms of Service and click **"Create"**

### Step 2: Enable Privileged Gateway Intents

1. In the left sidebar, click **"Bot"**
2. Scroll to **"Privileged Gateway Intents"**
3. Enable all three:
   - **Presence Intent** - See online/offline status
   - **Server Members Intent** - List and look up members
   - **Message Content Intent** - Read message text
4. Click **"Save Changes"**

### Step 3: Copy the Bot Token

1. Still on the **"Bot"** page, find the **"Token"** section
2. Click **"Reset Token"** (or "Copy" if first time)
3. Copy the token immediately - Discord only shows it once
4. **Never share this token** - it gives full bot access

### Step 4: Generate Invite URL

1. In the left sidebar, click **"OAuth2"**
2. Under **"OAuth2 URL Generator"**:
   - **Scopes**: Check `bot`
   - **Bot Permissions**: Check: View Channels, Manage Channels, Manage Roles, Manage Webhooks, Send Messages, Send Messages in Threads, Create Public Threads, Create Private Threads, Manage Messages, Manage Threads, Embed Links, Attach Files, Read Message History, Add Reactions, Use External Emojis
3. Copy the generated URL at the bottom

### Step 5: Invite the Bot

1. Paste the invite URL in a browser
2. Select your Discord server
3. Click **"Authorize"** and complete the CAPTCHA

### Step 6: Configure the Plugin

Paste your bot token using one of the methods in [Configuration](#configuration) above, then restart the plugin.

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-discord)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-discord/CHANGELOG.md)
