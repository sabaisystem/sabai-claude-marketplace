---
name: event
description: Quickly create a new calendar event
---

# /event - Create Calendar Event

Quickly create a new calendar event.

## Usage

```
/event [title] [date/time] [duration]
```

## Examples

```
/event Team lunch tomorrow 12pm 1h
/event Dentist appointment Friday 2pm 30m
/event Project deadline Jan 20 all-day
/event Weekly standup every Monday 9am 15m
```

## What It Does

1. Parses natural language date/time
2. Asks for any missing details
3. Creates event in Google Calendar
4. Confirms creation with event link

## Event Creation Flow

```markdown
## Creating Event

**Parsed Details:**
- Title: Team Lunch
- Date: Tomorrow (Jan 15, 2024)
- Time: 12:00 PM - 1:00 PM
- Duration: 1 hour

**Additional Options:**
- Location: [none]
- Description: [none]
- Attendees: [none]
- Reminder: 10 minutes before

Create this event? (yes/no/edit)
```

## After Confirmation

```markdown
## Event Created

**Team Lunch**
- When: Monday, Jan 15, 12:00 PM - 1:00 PM
- Where: Not specified
- Calendar: Primary

[View in Google Calendar](link)
```

## Natural Language Support

Understands:
- "tomorrow", "next Tuesday", "Jan 20"
- "9am", "2:30pm", "14:00"
- "1h", "30m", "2 hours"
- "all-day", "full day"
- "every Monday", "weekly", "daily"

## Options

- `--location [place]`: Add location
- `--attendees [emails]`: Add attendees
- `--description [text]`: Add description
- `--remind [minutes]`: Set reminder
- `--recurring [pattern]`: Make recurring

## Tips

- Use natural language for quick event creation
- Add location for in-person meetings
- Set reminders for important events
- Use recurring for regular events
