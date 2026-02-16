# Sabai Recall

Meeting bot automation with [Recall.ai](https://recall.ai). Create bots to join and record meetings on Zoom, Google Meet, Microsoft Teams, and other platforms. Access recordings, transcripts, and participant data - with embedded video playback directly in Claude.

## Features

- **Create Meeting Bots**: Send a bot to any meeting URL to record
- **Schedule Bots**: Schedule bots to join meetings in advance
- **Embedded Video Player**: Watch recordings directly in Claude
- **Get Recordings**: Access video, audio, and mixed recordings
- **Transcription**: Get timestamped transcripts from meetings
- **Participant Tracking**: See who joined and when
- **Bot Management**: List, delete, and control bots

## Installation

### Prerequisites

1. Sign up for a [Recall.ai account](https://recall.ai)
2. Get your API key from the Recall dashboard
3. Note your region (us-west-2, us-east-1, eu-central-1, or ap-northeast-1)

### Claude for Work

1. Install the plugin from the Sabai marketplace
2. Configure environment variables:
   - `RECALL_API_KEY`: Your Recall.ai API key
   - `RECALL_REGION`: Your Recall region (default: us-west-2)

### Manual Installation

```bash
cd plugins/sabai-recall/mcp
npm install
npm run build
```

Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "sabai-recall": {
      "command": "bash",
      "args": ["/path/to/sabai-recall/mcp/startup.sh"],
      "env": {
        "RECALL_API_KEY": "your-api-key",
        "RECALL_REGION": "us-west-2"
      }
    }
  }
}
```

## Commands

| Command | Description |
|---------|-------------|
| `/join <meeting_url>` | Send a bot to join and record a meeting |
| `/recording <bot_id or meeting_url>` | Watch the recording in an embedded video player |
| `/transcript <bot_id>` | Get the transcript from a recorded meeting |

## Usage

### Quick Join (Command)

```
/join https://zoom.us/j/123456789
```

### Watch Recording (Command)

```
/recording ABC123
```

Or use the meeting URL directly:

```
/recording https://zoom.us/j/123456789
```

This will display the meeting recording in an embedded video player directly in Claude.

### Get Transcript (Command)

```
/transcript ABC123
```

### Record a Meeting

```
Send a bot to record my Zoom meeting: https://zoom.us/j/123456789
```

### Schedule a Bot

```
Schedule a recording bot for tomorrow's standup at 9am:
https://meet.google.com/abc-defg-hij
```

### Get Recording Status

```
What's the status of bot ABC123?
```

### Get Transcript

```
Get the transcript from bot ABC123
```

### List Recent Bots

```
Show me all my recent recording bots
```

## Available Tools

| Tool | Description |
|------|-------------|
| `recall_create_bot` | Create a bot to join and record a meeting |
| `recall_watch_recording` | Watch recording in embedded video player (MCP App) |
| `recall_find_bot_by_meeting` | Find a bot by meeting URL |
| `recall_get_bot` | Get bot status, details, and recording URLs |
| `recall_list_bots` | List all bots with optional status filtering |
| `recall_delete_bot` | Remove/cancel a bot |
| `recall_get_recording` | Get recording download URLs |
| `recall_get_transcript` | Get the meeting transcript |
| `recall_get_participants` | Get participant list |
| `recall_leave_meeting` | Make the bot leave immediately |

## Supported Platforms

- Zoom
- Google Meet
- Microsoft Teams
- Webex
- And more...

## API Reference

This plugin uses the [Recall.ai API](https://docs.recall.ai/reference/authentication). See their documentation for detailed information about rate limits, response formats, and advanced features.

## License

MIT
