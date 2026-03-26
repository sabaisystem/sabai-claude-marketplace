---
name: join
description: Send a Recall bot to join and record a meeting
arguments:
  - name: meeting_url
    description: The meeting URL (optional - if not provided, joins current/next calendar meeting)
    required: false
---

# Join Meeting Command

Send a Recall.ai bot to join and record a meeting.

## Instructions

### If a meeting URL is provided:
1. Use the `recall_create_bot` tool to create a bot with the provided meeting URL
2. Use a friendly bot name like "Recall Bot" or "Meeting Recorder"
3. Enable transcription by default
4. Report the bot ID and status to the user

### If NO meeting URL is provided:
1. Use the `recall_get_current_meeting` tool to find the current or next meeting from the user's connected calendar
2. If a meeting is found with a video link:
   - Tell the user which meeting was found (title, time)
   - Use `recall_create_bot` with that meeting URL
3. If no meeting is found, inform the user and suggest they:
   - Provide a meeting URL directly
   - Or connect their calendar in Recall.ai

## Example Usage

With a URL:
```
/join https://zoom.us/j/123456789
```

Without a URL (joins current/next calendar meeting):
```
/join
```

## Calendar Integration

When no URL is provided, the command uses Recall's Calendar V2 integration to:
- Find meetings happening RIGHT NOW
- Or find the NEXT upcoming meeting with a video link
- Automatically extract the meeting URL from the calendar event

The user must have their calendar connected in Recall.ai for this to work.

## Parameters

- **meeting_url**: `$ARGUMENTS` - Optional. The full meeting URL. If not provided, the current or next calendar meeting will be used.
