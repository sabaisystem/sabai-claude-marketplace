---
name: transcript
description: Get the transcript from a recorded meeting
arguments:
  - name: bot_id
    description: The bot ID from a previous recording
    required: true
---

# Get Transcript Command

Get the transcript from a Recall.ai bot recording.

## Instructions

1. Use the `recall_get_transcript` tool with the provided bot ID
2. Use "text" format by default for readability
3. If the transcript isn't available yet, explain the status
4. Display the transcript content to the user

## Example Usage

User: `/transcript ABC123`

Response: Retrieve and display the meeting transcript.

## Parameters

- **bot_id**: `$ARGUMENTS` - The bot ID from a previous recording session
