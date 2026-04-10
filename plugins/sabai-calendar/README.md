# Sabai Calendar

**Calendar assistant with Google Calendar integration for event management, meeting scheduling, and time optimization.**

| Field | Value |
|-------|-------|
| Type | MCP Server + Skills + Commands |
| Version | 1.3.0 |
| Status | Active |
| Command | `/today`, `/event`, `/schedule`, `/briefing` |
| Repo | `plugins/sabai-calendar` |

---

## Overview

A calendar management assistant plugin with a custom MCP server for Google Calendar integration. Supports natural language event creation, daily/weekly schedule viewing, recurring events, availability checking, timezone handling, and video conferencing integration (Google Meet).

## Key Features

- Natural language event creation
- Daily and weekly schedule views
- Meeting scheduling with availability checking
- Timezone support for global teams
- Google Meet integration
- Focus time blocking
- Calendar health analysis and recommendations

## Setup (Required)

This plugin requires Google OAuth credentials. One-time setup:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Name it something like "Calendar Plugin"

### Step 2: Enable Google Calendar API

1. Go to **APIs & Services > Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select **External** (or Internal for Google Workspace)
3. Fill in:
   - App name: "Calendar Plugin"
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
   plugins/sabai-calendar/mcp/config/credentials.json
   ```

### Step 6: Authorize

```bash
cd plugins/sabai-calendar/mcp
npm install
npm run auth
```

A browser window will open. Sign in with your Google account and authorize.

## Use Cases

- "What's on my calendar today?"
- "Schedule a team meeting tomorrow at 2pm for 1 hour"
- "Block 2 hours of focus time tomorrow morning"
- "Check my availability this week"
- "Create an event: Lunch with John on Friday at noon"

## MCP Tools

| Tool | Description |
|------|-------------|
| `calendar_list_events` | List events for a date range |
| `calendar_today` | Get today's events |
| `calendar_week` | Get this week's events |
| `calendar_get_event` | Get event details |
| `calendar_create_event` | Create a new event |
| `calendar_update_event` | Update an existing event |
| `calendar_delete_event` | Delete an event |
| `calendar_free_busy` | Check free/busy times |
| `calendar_list_calendars` | List all calendars |
| `calendar_quick_add` | Create event from natural language |

## Commands

- `/today` - Show today's schedule
- `/week [start]` - Show weekly overview
- `/briefing [date]` - Get comprehensive daily briefing
- `/availability [range] [attendees]` - Check free time
- `/event [title] [time] [duration]` - Create a calendar event
- `/schedule [desc] [duration] [attendees]` - Schedule a meeting
- `/focus [duration] [when]` - Block protected focus time
- `/health [period]` - Calendar health check

## Troubleshooting

### "Token expired" error
Run `npm run auth` again to re-authenticate.

### "Credentials not found" error
Ensure `credentials.json` is in `mcp/config/`.

### "Access blocked" error
Add your email as a test user in OAuth consent screen.

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-calendar)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-calendar/CHANGELOG.md)
