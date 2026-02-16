---
name: join
description: Send a Recall bot to join and record a meeting
arguments:
  - name: meeting_url
    description: The meeting URL (Zoom, Google Meet, Teams, etc.)
    required: true
---

# Join Meeting Command

Send a Recall.ai bot to join and record a meeting.

## Instructions

1. Use the `recall_create_bot` tool to create a bot with the provided meeting URL
2. Use a friendly bot name like "Recall Bot" or "Meeting Recorder"
3. Enable transcription by default
4. Report the bot ID and status to the user
5. Let them know they can check status later with the bot ID

## Example Usage

User: `/join https://zoom.us/j/123456789`

Response: Create a bot to join the Zoom meeting and confirm it's joining.

## Parameters

- **meeting_url**: `$ARGUMENTS` - The full meeting URL provided by the user
