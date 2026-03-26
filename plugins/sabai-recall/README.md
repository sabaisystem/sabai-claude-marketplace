# Sabai Recall

**Meeting bot automation with Recall.ai for recording, transcription, and embedded video playback.**

| Field | Value |
|-------|-------|
| Type | MCP App + Commands |
| Version | 1.4.0 |
| Status | Active |
| Command | `/join`, `/recording`, `/transcript` |
| Repo | `plugins/sabai-recall` |

---

## Overview

Meeting bot automation with Recall.ai. Create bots to join and record meetings on Zoom, Google Meet, Microsoft Teams, and other platforms. Access recordings, transcripts, and participant data - with embedded video playback directly in Claude.

## Key Features

- Create bots to join and record any meeting
- Calendar integration for auto-joining meetings
- Schedule bots for future meetings
- Embedded video player in Claude
- Access video, audio, and mixed recordings
- Timestamped transcripts
- Participant tracking

## Use Cases

- "Join my current meeting"
- "Send a bot to record my Zoom meeting"
- "Show me the recording from my last standup"
- "Get the transcript from my interview"

## Commands

- `/join` - Join current or next calendar meeting
- `/join <meeting_url>` - Send bot to specific meeting
- `/recording <bot_id>` - Watch recording in embedded player
- `/transcript <bot_id>` - Get meeting transcript

## MCP Tools

- `recall_create_bot` - Create bot to join/record meeting
- `recall_watch_recording` - Watch in embedded video player
- `recall_get_bot` - Get bot status and recording URLs
- `recall_get_transcript` - Get meeting transcript
- `recall_list_bots` - List all bots
- `recall_get_participants` - Get participant list
- `recall_list_calendar_events` - List upcoming events
- `recall_schedule_bot_for_event` - Schedule bot for event

## Configuration

### Environment Variables

- `RECALL_API_KEY` - Your Recall.ai API key
- `RECALL_REGION` - Your region (default: us-west-2)

### MCP Server Setup

```json
{
  "mcpServers": {
    "sabai-recall": {
      "command": "bash",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/startup.sh"],
      "env": {
        "RECALL_API_KEY": "${RECALL_API_KEY}",
        "RECALL_REGION": "${RECALL_REGION:-us-west-2}"
      }
    }
  }
}
```

## Authentication

Recall.ai API key required. Sign up at [recall.ai](https://recall.ai).

## Dependencies

- **Required**: Recall.ai account and API key

## Limitations

- Recall.ai subscription required
- Bot must be admitted to meetings by host
- Some platforms may have recording restrictions

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-recall)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-recall/CHANGELOG.md)
