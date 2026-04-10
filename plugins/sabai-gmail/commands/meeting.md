---
name: meeting
description: Schedule a meeting via email with calendar integration
---

# /meeting Command

Schedule a meeting via email with calendar integration.

## Usage

```
/meeting [attendees] [topic]
```

## Parameters

- `attendees` - Email addresses or names (comma-separated)
- `topic` - Meeting topic or agenda

## Behavior

When this command is invoked:

1. If attendees and topic provided, gather additional details
2. If partial info, ask for missing details:
   - Who should attend?
   - What is the meeting about?
   - How long should it be?
   - When would you like to meet?

3. Collect meeting details:
   - Attendees (required)
   - Subject/Topic (required)
   - Duration (default: 30 min)
   - Proposed times (2-3 options)
   - Location/Link (optional)
   - Agenda (optional)

4. Draft meeting request email using meeting-request template

5. If Google Calendar MCP available:
   - Check calendar for conflicts
   - Suggest available times
   - Offer to create calendar event directly

6. If Gmail MCP available:
   - Send meeting request
   - Or save as draft

## Examples

```
/meeting team@company.com Q1 Planning
/meeting john@example.com, sarah@example.com Project Kickoff
/meeting
```

## Quick Flags

- `--duration [30m|1h|2h]` - Meeting length
- `--times [date1,date2]` - Propose specific times
- `--link` - Include video call link
- `--agenda` - Prompt for agenda items

## Meeting Request Format

```
Subject: Meeting Request - [Topic]

Hi [Names],

I'd like to schedule a meeting to discuss [topic].

**Proposed Times:**
- [Option 1]
- [Option 2]
- [Option 3]

**Duration:** [X minutes]

**Agenda:**
1. [Item 1]
2. [Item 2]

Please let me know which time works best, or suggest an alternative.

[Meeting link if applicable]

Best,
[Your Name]
```

## Calendar Integration

If Google Calendar MCP is available:
1. Check your availability
2. Check attendees' availability (if visible)
3. Suggest optimal times
4. Create calendar event directly
5. Send invites automatically

## Output

Provide:
1. Complete meeting request email
2. Proposed times formatted clearly
3. Option to adjust before sending
4. Calendar event creation (if available)
