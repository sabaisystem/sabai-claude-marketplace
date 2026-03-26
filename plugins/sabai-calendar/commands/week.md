# /week - Weekly Schedule Overview

Show the week's calendar at a glance.

## Usage

```
/week [start_date]
```

- `start_date`: Optional, defaults to current week (Monday-Friday)

## What It Does

1. Fetches all events for the week
2. Groups by day
3. Calculates daily meeting load
4. Identifies busiest and lightest days
5. Suggests optimal focus days

## Output Format

```markdown
# Week of [Date Range]

## Weekly Overview
- **Total Meetings:** X events
- **Total Meeting Time:** Y hours
- **Busiest Day:** Tuesday (8 meetings)
- **Best Focus Day:** Wednesday

## Daily Breakdown

### Monday, [Date]
| Time | Event | Duration |
|------|-------|----------|
| 9:00 AM | Sprint Planning | 1 hr |
| 2:00 PM | Design Review | 1 hr |
**Meetings:** 2 | **Free Time:** 6 hrs

### Tuesday, [Date]
| Time | Event | Duration |
|------|-------|----------|
| 9:00 AM | Standup | 15 min |
| 10:00 AM | Client Call | 1 hr |
| 11:00 AM | Team Sync | 30 min |
| 2:00 PM | Interview | 1 hr |
| 3:30 PM | 1:1 | 30 min |
**Meetings:** 5 | **Free Time:** 3 hrs

[... continue for each day ...]

## Key Events This Week
- Wednesday 2:00 PM: Board Presentation
- Friday: Project Deadline

## Recommendations
- Block focus time on Wednesday morning
- Reschedule non-essential meetings from Tuesday
```

## Tips

- Use to plan the week ahead on Monday
- Identify days for deep work vs. meeting days
- Spot overloaded days early
- Share with team for coordination
