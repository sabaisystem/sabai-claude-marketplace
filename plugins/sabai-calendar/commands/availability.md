# /availability - Check Availability

Check your availability or find common free time with others.

## Usage

```
/availability [date_range] [attendees]
```

## Examples

```
/availability this week
/availability tomorrow alice@example.com
/availability next 3 days alice@example.com, bob@example.com
```

## What It Does

1. Queries free/busy information
2. Shows available time slots
3. For multiple people, finds overlapping availability
4. Respects working hours

## Single Person Availability

```markdown
## Your Availability

**Period:** This Week (Jan 15-19)

### Monday, Jan 15
| Available | Duration |
|-----------|----------|
| 8:00 AM - 9:00 AM | 1 hour |
| 11:00 AM - 12:00 PM | 1 hour |
| 3:00 PM - 5:00 PM | 2 hours |

### Tuesday, Jan 16
| Available | Duration |
|-----------|----------|
| 9:00 AM - 11:00 AM | 2 hours |
| 1:00 PM - 2:00 PM | 1 hour |
| 4:00 PM - 5:00 PM | 1 hour |

[... continue for each day ...]

**Total Free Time:** 18 hours this week
**Best Day for Focus:** Wednesday (6 free hours)
```

## Multi-Person Availability

```markdown
## Shared Availability

**Checking:** You, alice@example.com, bob@example.com
**Period:** Tomorrow (Jan 15)

### All Available
| Time | Duration |
|------|----------|
| 10:00 AM - 11:00 AM | 1 hour |
| 2:00 PM - 3:00 PM | 1 hour |

### Partial Availability
| Time | Who's Free |
|------|------------|
| 9:00 AM - 10:00 AM | You, Alice |
| 3:00 PM - 4:00 PM | You, Bob |

Want to schedule a meeting in one of these slots?
```

## Options

- `--working-hours [start]-[end]`: Custom working hours
- `--include-weekends`: Include Saturday/Sunday
- `--duration [time]`: Filter slots by minimum duration

## Tips

- Use before proposing meeting times
- Share availability link with external contacts
- Check team availability before scheduling group meetings
- Identify patterns in your availability
