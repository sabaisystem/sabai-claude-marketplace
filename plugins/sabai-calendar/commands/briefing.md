# /briefing - Daily Calendar Briefing

Get a comprehensive briefing of your day.

## Usage

```
/briefing [date]
```

- `date`: Optional, defaults to today

## Examples

```
/briefing
/briefing tomorrow
/briefing Monday
```

## What It Does

1. Fetches all events for the specified day
2. Analyzes meeting load and patterns
3. Identifies key meetings and prep needed
4. Suggests focus time opportunities
5. Provides context for important meetings

## Output Format

```markdown
# Daily Briefing - [Day, Month Date]

Good morning! Here's your day at a glance.

## Summary
- **Meetings:** 5 events (4.5 hours)
- **Focus Time:** 3.5 hours available
- **First Event:** 9:00 AM - Team Standup
- **Last Event:** 4:30 PM - 1:1 with Manager

## Priority Items
These meetings need your attention:

### Client Presentation - 10:00 AM
- **Duration:** 1 hour
- **Location:** Zoom
- **Attendees:** Client team, Sales, You
- **Prep:** Review Q4 deck, test screen share

### Board Update - 2:00 PM
- **Duration:** 30 min
- **Location:** Google Meet
- **Prep:** Prepare 3 key metrics

## Full Schedule

| Time | Event | Duration | Type |
|------|-------|----------|------|
| 9:00 AM | Team Standup | 15 min | Internal |
| 10:00 AM | Client Presentation | 1 hr | External |
| 12:00 PM | Lunch | 1 hr | Personal |
| 2:00 PM | Board Update | 30 min | Internal |
| 3:00 PM | Sprint Review | 1 hr | Internal |
| 4:30 PM | 1:1 with Manager | 30 min | Internal |

## Focus Time Available
- 11:00 AM - 12:00 PM (1 hour)
- 3:30 PM - 4:30 PM (1 hour)

## Tomorrow Preview
- 9:00 AM - Planning Meeting
- 2:00 PM - Vendor Call

Have a productive day!
```

## Options

- `--minimal`: Short summary only
- `--prep`: Focus on preparation items
- `--week`: Include full week preview

## Tips

- Run first thing in the morning
- Use to identify meetings needing preparation
- Plan focus time around your meetings
- Review tomorrow's briefing before end of day
