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

Setting up the Discord bot for Claude Cowork. This guide walks you through creating a Discord bot, adding it to your server, and connecting it to the Sabai Discord plugin.

### Part 1: Create a Discord Bot

#### Step 1: Open the Developer Portal

Go to [discord.com/developers/applications](https://discord.com/developers/applications) and click **"New Application"**.

![New Application](docs/bot-setup/01-new-application.png)

#### Step 2: Name Your Bot

Enter a name for your bot, check the Terms of Service checkbox, and click **"Create"**.

![Create App Dialog](docs/bot-setup/02-create-app-dialog.png)

#### Step 3: Navigate to Bot Settings

In the left sidebar, click **"Bot"**.

![Navigate to Bot](docs/bot-setup/03-general-info.png)

#### Step 4: Enable Privileged Gateway Intents

Scroll down to **"Privileged Gateway Intents"** and enable all three:
1. **Presence Intent**
2. **Server Members Intent**
3. **Message Content Intent**

Also check **Administrator** under Bot Permissions.

![Enable Intents](docs/bot-setup/06-enable-intents-admin.png)

Click **"Save Changes"**.

![Save Changes](docs/bot-setup/07-save-changes.png)

#### Step 5: Get the Install URL

Navigate to **"Installation"** in the left sidebar. Copy the **Discord Provided Link** under Install Link.

![Installation Page](docs/bot-setup/09-installation-page.png)

### Part 2: Create a Discord Server & Add the Bot

#### Step 6: Create a New Discord Server

Open Discord and create a new server (click the **"+"** icon on the left sidebar).

![Create Server](docs/bot-setup/10-create-server.png)

#### Step 7: Invite the Bot to Your Server

Open a browser and paste the install URL you copied in Step 5.

![Paste Invite URL](docs/bot-setup/11-paste-invite-url.png)

Click **"Add to Server"**, then select your server from the dropdown.

![Select Server](docs/bot-setup/13-select-server.png)

Click **"Authorize"**.

![Authorize](docs/bot-setup/14-authorize.png)

You should see a success message.

![Success](docs/bot-setup/15-success.png)

### Part 3: Install the Plugin in Claude Cowork

#### Step 8: Add the Marketplace

In Claude Cowork, click the **"+"** icon, then **"+ Add plugin"**.

![Add Plugin](docs/bot-setup/16-cowork-add-plugin.png)

Click **"Add marketplace from GitHub"** and enter: `Ruckth/sabai-claude-marketplace`, then click **"Sync"**.

![Add Marketplace](docs/bot-setup/17-add-marketplace.png)

#### Step 9: Install the Discord Plugin

Find **"Sabai discord"** in the plugin list and click **"Install"**.

![Browse Plugins](docs/bot-setup/18-browse-plugins.png)

#### Step 10: Open Connectors

After installing, click **"Connectors"** in the left sidebar under the Sabai discord plugin.

![Plugin Connectors](docs/bot-setup/19-plugin-connectors.png)

### Part 4: Configure the Bot Token

#### Step 11: Get Your Bot Token

Go back to the [Discord Developer Portal](https://discord.com/developers/applications), navigate to **"Bot"** in the left sidebar.

![Bot Token Page](docs/bot-setup/20-bot-token-page.png)

Click **"Reset Token"** and confirm.

![Reset Token](docs/bot-setup/21-reset-token-confirm.png)

Copy the generated token immediately — it will only be shown once.

![Copy Token](docs/bot-setup/22-copy-token.png)

#### Step 12: Configure the Token in Cowork

Back in Claude Cowork, go to **Connectors** and click **"Edit"**.

![Connector Settings](docs/bot-setup/23-connector-settings.png)

Click **"Show in Folder"** to open the plugin directory.

![Show in Folder](docs/bot-setup/24-show-in-folder.png)

Open `plugin.json` with a text editor (e.g., TextEdit).

![Open with TextEdit](docs/bot-setup/25-open-with-textedit.png)

Paste your bot token as the value for `DISCORD_TOKEN`.

![Paste Token](docs/bot-setup/26-paste-token.png)

#### Step 13: Reload Cowork

Press **Cmd + R** (Mac) or **Ctrl + R** (Windows) to reload. Verify the token appears in the Connector settings.

![Token Configured](docs/bot-setup/28-token-configured.png)

### Part 5: Authorize the Bot for Your Server

#### Step 14: Copy Your Server ID and Client ID

In Discord, right-click your server name and select **"Copy Server ID"**.

> **Note:** You need to enable Developer Mode first: User Settings > Advanced > Developer Mode

![Copy Server ID](docs/bot-setup/29-copy-server-id.png)

Go to the Developer Portal > **"OAuth2"** and copy the **Client ID**.

![OAuth2 Client ID](docs/bot-setup/30-oauth2-client-id.png)

#### Step 15: Generate an Authorization Link

In Claude Cowork, send a message like:

> "Provide clickable link to set up Discord bot for Guild Id: YOUR_SERVER_ID, Client Id: YOUR_CLIENT_ID"

Claude will generate a properly configured authorization link.

![Claude Auth Link](docs/bot-setup/31-claude-auth-link.png)

#### Step 16: Authorize the Bot

Click the generated link, select your server, and click **"Continue"** then **"Authorize"**.

![Authorize Bot](docs/bot-setup/32-authorize-bot.png)

You should see a success confirmation.

![Auth Success](docs/bot-setup/33-auth-success.png)

The bot should now appear in your server's member list.

![Bot in Server](docs/bot-setup/34-bot-in-server.png)

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-discord)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-discord/CHANGELOG.md)
