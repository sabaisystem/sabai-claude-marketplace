# Sabai Calendar

**Calendar assistant with Google Calendar integration for event management, meeting scheduling, and time optimization.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands |
| Version | 1.3.0 |
| Status | Active |
| Command | `/today`, `/event`, `/schedule`, `/briefing` |
| Repo | `plugins/sabai-calendar` |

---

## Overview

A calendar management assistant plugin that integrates Google Calendar with Claude. Supports natural language event creation, daily/weekly schedule viewing, recurring events, availability checking, timezone handling, and video conferencing integration (Google Meet/Zoom). Includes smart time blocking features like focus time protection and calendar health analysis.

## Key Features

- Natural language event creation
- Daily and weekly schedule views
- Meeting scheduling with availability checking
- Timezone support for global teams
- Video conferencing integration (Google Meet/Zoom)
- Focus time blocking
- Calendar health analysis and recommendations
- Smart slot preference ranking for optimal meeting suggestions

## Use Cases

- "What's on my calendar today?"
- "Schedule a team meeting tomorrow at 2pm for 1 hour"
- "Block 2 hours of focus time tomorrow morning"
- "Check my availability this week"
- "Give me my morning briefing"
- "Find the best time for a meeting this week"

## Commands

- `/today` - Show today's schedule
- `/week [start]` - Show weekly overview
- `/briefing [date]` - Get comprehensive daily briefing
- `/availability [range] [attendees]` - Check free time
- `/event [title] [time] [duration]` - Create a calendar event
- `/schedule [desc] [duration] [attendees]` - Schedule a meeting
- `/focus [duration] [when]` - Block protected focus time
- `/health [period]` - Calendar health check and recommendations

## Configuration

### MCP Server Setup

```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@anthropic/google-calendar-mcp@latest"]
    }
  }
}
```

## Authentication

OAuth via Google. Browser opens for sign-in on first use.

## Permissions

Required Claude Code permissions:
- Google Calendar MCP tools for calendar operations

## Dependencies

- **Required**: Google Calendar MCP server (`@anthropic/google-calendar-mcp`)
- **Optional**: Google Meet or Zoom for video conferencing

## Limitations

- Requires Google account with Calendar access
- OAuth consent required on first use

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-calendar)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-calendar/CHANGELOG.md)
