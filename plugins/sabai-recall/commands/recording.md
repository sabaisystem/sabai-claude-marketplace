---
name: recording
description: Watch a meeting recording in an embedded video player
arguments:
  - name: identifier
    description: Either a bot ID or a meeting URL
    required: true
---

# Watch Recording Command

Watch a meeting recording directly in Claude with an embedded video player.

## Instructions

1. Determine if the argument is a meeting URL (contains http/https) or a bot ID
2. If it's a meeting URL, use `recall_watch_recording` with the `meeting_url` parameter
3. If it's a bot ID, use `recall_watch_recording` with the `bot_id` parameter
4. The video will be displayed in an embedded player within Claude
5. If the recording isn't available yet, explain the status to the user

## Example Usage

With a bot ID:
```
/recording ABC123
```

With a meeting URL:
```
/recording https://zoom.us/j/123456789
```

Response: Display the meeting recording in the embedded video player.

## Parameters

- **identifier**: `$ARGUMENTS` - Either a bot ID or a meeting URL from a previous recording session
