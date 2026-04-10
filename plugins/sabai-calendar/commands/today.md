---
name: today
description: Show today's calendar events and schedule summary
---

# /today - Today's Schedule

Show today's calendar events and schedule summary.

## Usage

```
/today
```

## What It Does

1. Fetches all events for today from Google Calendar
2. Sorts by start time
3. Calculates total meeting time
4. Identifies focus time gaps
5. Highlights important meetings

## Output Format

```markdown
# Today - [Day, Month Date]

## Schedule Overview
- **Meetings:** X events (Y hours)
- **Focus Time:** Z hours available
- **First Meeting:** HH:MM AM
- **Last Meeting:** HH:MM PM

## Events

| Time | Event | Duration | Location |
|------|-------|----------|----------|
| 9:00 AM | Team Standup | 15 min | Google Meet |
| 10:00 AM | Project Review | 1 hr | Room 301 |
| 2:00 PM | Client Call | 30 min | Zoom |

## Focus Blocks Available
- 11:00 AM - 12:00 PM (1 hour)
- 3:00 PM - 5:00 PM (2 hours)

## Reminders
- Prepare slides for Project Review
- Review notes before Client Call
```

## Google Calendar API

Use these calls:
- `list_events` with `timeMin` and `timeMax` for today
- Include `singleEvents=true` to expand recurring events

## Tips

- Run at the start of each day
- Highlight meetings that need preparation
- Show timezone clearly
- Flag back-to-back meetings
